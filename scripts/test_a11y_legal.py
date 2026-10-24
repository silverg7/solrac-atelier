"""SOL-08: Verificação mecânica de acessibilidade WCAG 2.1 AA (focus trap, ESC, skip-link),
rodapé legal português monocromático (RGPD + Livro de Reclamações) e persistência fail-closed de fotos.
"""

import base64
import hashlib
import http.client
import json
import re
import shutil
import struct
import subprocess
import tempfile
import threading
import time
import unittest
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

from scripts.server import (
    InquiryRequestHandler,
    MAX_NOTES_LENGTH,
    MAX_PHOTOS_COUNT,
    MAX_REQUEST_BODY_BYTES,
    MAX_SINGLE_PHOTO_BYTES,
    MAX_TOTAL_PHOTOS_BYTES,
    ThreadedInquiryServer,
)

ROOT = Path(__file__).resolve().parents[1]


def _make_jpeg_bytes(size: int = 2048) -> bytes:
    """Constrói um payload binário JPEG sintético válido com cabeçalho SOI/APP0 e fecho EOI."""
    header = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
    footer = b"\xff\xd9"
    pad_len = max(0, size - len(header) - len(footer))
    return header + (b"\x42" * pad_len) + footer


def _make_png_bytes(size: int = 1024) -> bytes:
    """Constrói um payload binário PNG com assinatura oficial de 8 bytes e chunk IHDR."""
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">I4sIIBBBBB", 13, b"IHDR", 1, 1, 8, 2, 0, 0, 0) + b"\x90\x77\x53\xde"
    iend = struct.pack(">I4sI", 0, b"IEND", 0xAE426082)
    pad_len = max(0, size - len(sig) - len(ihdr) - len(iend))
    return sig + ihdr + (b"\x00" * pad_len) + iend


def _make_webp_bytes(size: int = 1024) -> bytes:
    """Constrói um payload binário RIFF/WEBP com assinatura canónica."""
    payload_size = max(16, size - 8)
    body = b"WEBP" + b"VP8 " + struct.pack("<I", payload_size - 12) + (b"\x55" * (payload_size - 12))
    return b"RIFF" + struct.pack("<I", len(body)) + body


class OrderedElementCollector(HTMLParser):
    def __init__(self, html: str):
        super().__init__()
        self.elements = []
        self.ids = {}
        self.links = []
        self.svgs_inner_tags = []
        self._in_svg = 0
        self.feed(html)

    def handle_starttag(self, tag: str, attrs: list):
        attr_dict = dict(attrs)
        self.elements.append((tag, attr_dict))
        if "id" in attr_dict:
            self.ids[attr_dict["id"]] = (tag, attr_dict)
        if tag == "a":
            self.links.append(attr_dict)
        if tag == "svg":
            self._in_svg += 1
        elif self._in_svg > 0:
            self.svgs_inner_tags.append(tag.lower())

    def handle_endtag(self, tag: str):
        if tag == "svg" and self._in_svg > 0:
            self._in_svg -= 1


class ModalFocusTrapAndSkipLinkTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html_text = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.css_text = (ROOT / "css/style.css").read_text(encoding="utf-8")
        cls.js_text = (ROOT / "js/main.js").read_text(encoding="utf-8")
        cls.collector = OrderedElementCollector(cls.html_text)

    def test_skip_to_content_markup_and_keyboard_visibility_css(self):
        # O skip-link deve ser a primeira âncora interactiva no documento
        self.assertGreater(len(self.collector.links), 0)
        first_link = self.collector.links[0]
        self.assertEqual(first_link.get("id"), "skip-to-content")
        self.assertIn("skip-link", first_link.get("class", ""))
        self.assertEqual(first_link.get("href"), "#main-content")
        self.assertEqual(first_link.get("data-i18n"), "a11y.skip_to_content")

        # O alvo #main-content deve ser um <main tabindex="-1">
        self.assertIn("main-content", self.collector.ids)
        main_tag, main_attrs = self.collector.ids["main-content"]
        self.assertEqual(main_tag, "main")
        self.assertEqual(main_attrs.get("tabindex"), "-1")

        # CSS não pode usar display:none no .skip-link (impediria foco por teclado)
        skip_rule = re.search(r"\.skip-link\s*\{([^}]+)\}", self.css_text)
        self.assertIsNotNone(skip_rule, "Regra .skip-link ausente em css/style.css")
        self.assertNotIn("display: none", skip_rule.group(1))
        self.assertNotIn("visibility: hidden", skip_rule.group(1))
        self.assertRegex(self.css_text, r"\.skip-link:focus-visible\s*\{[^}]*opacity:\s*1")

    def test_both_modals_have_wcag_dialog_attributes(self):
        for modal_id, label_id in (
            ("lightbox-modal", "lightbox-title"),
            ("concierge-modal", "concierge-modal-title"),
        ):
            self.assertIn(modal_id, self.collector.ids)
            _, attrs = self.collector.ids[modal_id]
            self.assertEqual(attrs.get("role"), "dialog")
            self.assertEqual(attrs.get("aria-modal"), "true")
            self.assertEqual(attrs.get("aria-labelledby"), label_id)
            self.assertEqual(attrs.get("tabindex"), "-1")
            self.assertIn(label_id, self.collector.ids)

    def test_strict_focus_trap_and_esc_focus_restoration_cycle(self):
        """Executa mecanicamente o controlador de acessibilidade e modais de js/main.js em Node."""
        controller_slice = self.js_text.split("  const FOCUSABLE_SELECTOR =", 1)[1].split(
            "  let pageLoadTime =", 1
        )[0]
        controller_code = "const FOCUSABLE_SELECTOR =" + controller_slice

        harness = r"""
const assert = require('node:assert/strict');

class DOMNode {
  constructor(tag, id = '', attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.attributes = { ...attrs };
    if (id) this.attributes.id = id;
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.parentElement = null;
    this.isConnected = true;
    this.disabled = Boolean(attrs.disabled);
    this.hidden = Object.prototype.hasOwnProperty.call(attrs, 'hidden');
    this.value = attrs.value || '';
    this.textContent = '';
    this.innerHTML = '';
    this.scrollTop = 0;
    this.offsetWidth = 100;
    this.inert = false;
    this._events = {};
    const cls = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
    this.classList = {
      add: (c) => cls.add(c),
      remove: (c) => { cls.delete(c); },
      toggle: (c) => { if (cls.has(c)) { cls.delete(c); return false; } cls.add(c); return true; },
      contains: (c) => cls.has(c),
    };
  }
  append(...nodes) {
    for (const n of nodes) {
      n.parentElement = this;
      this.children.push(n);
    }
    return this;
  }
  getAttribute(k) {
    return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null;
  }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
    if (k === 'hidden') this.hidden = true;
  }
  removeAttribute(k) {
    delete this.attributes[k];
    if (k === 'hidden') this.hidden = false;
  }
  hasAttribute(k) {
    return k === 'hidden' ? this.hidden : Object.prototype.hasOwnProperty.call(this.attributes, k);
  }
  toggleAttribute(k, force) {
    if (force) this.setAttribute(k, '');
    else this.removeAttribute(k);
  }
  contains(target) {
    if (!target) return false;
    let cur = target;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parentElement;
    }
    return false;
  }
  closest() { return null; }
  focus() {
    document.activeElement = this;
    document.emit('focusin', { target: this });
  }
  scrollIntoView() { this._scrolled = true; }
  addEventListener(type, fn) {
    (this._events[type] ||= []).push(fn);
  }
  emit(type, evt = {}) {
    const e = {
      type,
      target: evt.target || this,
      key: evt.key || '',
      shiftKey: Boolean(evt.shiftKey),
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; },
      ...evt,
    };
    for (const fn of this._events[type] || []) fn(e);
    return e;
  }
  _walk(out = []) {
    for (const ch of this.children) {
      out.push(ch);
      ch._walk(out);
    }
    return out;
  }
  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }
  querySelectorAll(sel) {
    const all = this._walk();
    if (sel.startsWith('#')) {
      const id = sel.slice(1);
      return all.filter((n) => n.id === id);
    }
    if (sel.startsWith('.')) {
      const c = sel.slice(1);
      return all.filter((n) => n.classList.contains(c));
    }
    if (sel === '[data-technical]') {
      return all.filter((n) => Boolean(n.dataset.technical));
    }
    if (sel === '[data-concierge-open]') {
      return all.filter((n) => n.hasAttribute('data-concierge-open'));
    }
    // FOCUSABLE_SELECTOR matching
    return all.filter((n) => {
      if (n.tagName === 'A' && n.hasAttribute('href')) return true;
      if (n.tagName === 'BUTTON' && !n.disabled) return true;
      if (n.tagName === 'INPUT' && !n.disabled && n.getAttribute('type') !== 'hidden') return true;
      if (n.tagName === 'SELECT' && !n.disabled) return true;
      if (n.tagName === 'TEXTAREA' && !n.disabled) return true;
      if (n.hasAttribute('tabindex') && n.getAttribute('tabindex') !== '-1') return true;
      return false;
    });
  }
}

const document = new DOMNode('document');
document.documentElement = new DOMNode('html');
document.body = new DOMNode('body');
document.documentElement.append(document.body);
document.activeElement = document.body;

const {
  skipLink,
  header,
  mobileToggle,
  headerCta,
  mainContent,
  cardTrigger,
  footerLink,
  lightboxInquire,
  conciergeClose,
  modalName,
  modalType,
  modalJump,
} = (() => {
  const skipLinkNode = new DOMNode('a', 'skip-to-content', { href: '#main-content', class: 'skip-link' });
  const wrapperNode = new DOMNode('div', '', { class: 'site-wrapper' });
  const headerNode = new DOMNode('header', '', { class: 'header' });
  const mobileToggleNode = new DOMNode('button', 'mobile-toggle');
  const headerCtaNode = new DOMNode('a', 'header-concierge-btn', { href: '#inquiry', 'data-concierge-open': '' });
  headerNode.append(headerCtaNode, mobileToggleNode);

  const mainContentNode = new DOMNode('main', 'main-content', { tabindex: '-1' });
  const cardTriggerNode = new DOMNode('article', 'card-muro-curvo', { class: 'project-card', tabindex: '0' });
  cardTriggerNode.dataset.id = 'muro-curvo';
  const footerLinkNode = new DOMNode('a', 'livro-reclamacoes-link', { href: 'https://www.livroreclamacoes.pt' });
  mainContentNode.append(cardTriggerNode);
  wrapperNode.append(headerNode, mainContentNode, footerLinkNode);

  // Lightbox DOM tree
  const lbModal = new DOMNode('div', 'lightbox-modal', { class: 'lightbox-modal', tabindex: '-1' });
  const lbViewer = new DOMNode('div', '', { class: 'lightbox-image-viewer' });
  const lbPhotoTab = new DOMNode('button', 'lightbox-photo-tab');
  const lbTechnicalTab = new DOMNode('button', 'lightbox-technical-tab');
  const lbImage = new DOMNode('img', 'lightbox-image');
  const lbTechnicalSheet = new DOMNode('div', 'lightbox-technical', { hidden: '' });
  const lbTechnicalDetail = new DOMNode('select', 'technical-detail');
  const drawingMasonry = new DOMNode('g'); drawingMasonry.dataset.technical = 'masonry';
  const drawingStone = new DOMNode('g'); drawingStone.dataset.technical = 'stone';
  lbTechnicalSheet.append(lbTechnicalDetail, drawingMasonry, drawingStone);
  const lightboxPrev = new DOMNode('button', 'lightbox-prev');
  const lightboxPos = new DOMNode('output', 'lightbox-position');
  const lightboxNext = new DOMNode('button', 'lightbox-next');
  lbViewer.append(lbPhotoTab, lbTechnicalTab, lbImage, lbTechnicalSheet, lightboxPrev, lightboxPos, lightboxNext);
  const lbClose = new DOMNode('button', 'lightbox-close');
  const lbCategory = new DOMNode('span', 'lightbox-category');
  const lbTitle = new DOMNode('h2', 'lightbox-title');
  const lbDesc = new DOMNode('p', 'lightbox-desc');
  const lbSpecs = new DOMNode('div', 'lightbox-specs');
  const lbInquire = new DOMNode('button', 'lightbox-inquire-btn');
  lbModal.append(lbViewer, lbClose, lbCategory, lbTitle, lbDesc, lbSpecs, lbInquire);

  // Concierge Modal DOM tree
  const cmModal = new DOMNode('div', 'concierge-modal', { class: 'concierge-modal', tabindex: '-1', hidden: '' });
  const conciergeDialog = new DOMNode('div', '', { class: 'concierge-modal-dialog' });
  const cmClose = new DOMNode('button', 'concierge-modal-close');
  const directEmail = new DOMNode('a', 'direct-email', { href: 'mailto:director@solrac-tectonics.com' });
  const conciergeForm = new DOMNode('form', 'concierge-modal-form');
  const trapWrapper = new DOMNode('div', '', { class: 'visual-trap', 'aria-hidden': 'true' });
  const trapInput = new DOMNode('input', 'modal_website_trap', { tabindex: '-1' });
  trapWrapper.append(trapInput);
  const cmName = new DOMNode('input', 'modal_client_name');
  const cmType = new DOMNode('select', 'modal_project_type');
  const cmNotes = new DOMNode('textarea', 'modal_project_notes');
  const modalSubmit = new DOMNode('button', 'modal-submit');
  conciergeForm.append(trapWrapper, cmName, cmType, cmNotes, modalSubmit);
  const cmFeedbackCard = new DOMNode('div', 'modal-feedback-card', { hidden: '' });
  const cmFeedbackClose = new DOMNode('button', 'modal-feedback-close');
  cmFeedbackCard.append(cmFeedbackClose);
  const cmJump = new DOMNode('a', 'modal-jump-section', { href: '#inquiry' });
  conciergeDialog.append(cmClose, directEmail, conciergeForm, cmFeedbackCard, cmJump);
  cmModal.append(conciergeDialog);

  document.body.append(skipLinkNode, wrapperNode, lbModal, cmModal);

  const byId = {};
  for (const n of document.body._walk()) {
    if (n.id) byId[n.id] = n;
  }
  document.getElementById = (id) => byId[id] || null;
  document.querySelector = (sel) => {
    if (sel === '.site-wrapper') return wrapperNode;
    if (sel === '.lightbox-image-viewer') return lbViewer;
    return document.body.querySelector(sel);
  };
  document.querySelectorAll = (sel) => document.body.querySelectorAll(sel);

  return {
    skipLink: skipLinkNode,
    header: headerNode,
    mobileToggle: mobileToggleNode,
    headerCta: headerCtaNode,
    mainContent: mainContentNode,
    cardTrigger: cardTriggerNode,
    footerLink: footerLinkNode,
    lightboxInquire: lbInquire,
    conciergeClose: cmClose,
    modalName: cmName,
    modalType: cmType,
    modalJump: cmJump,
  };
})();

const PROJECTS_DATA = [
  { id: 'muro-curvo', category: 'muros', categoryLabel: 'Muro', title: 'Muro Curvo', image: 'a.webp', width: 100, height: 100, alt: 'alt', specs: { element: 'E' }, description: 'D' },
  { id: 'escada-detalhe', category: 'cantaria', categoryLabel: 'Cantaria', title: 'Escada', image: 'b.webp', width: 100, height: 100, alt: 'alt2', specs: { element: 'E2' }, description: 'D2' },
];
const getLocalizedProject = (p) => p;
let activeFilter = 'all';
let modalOpenTime = 0;
const photoIntakes = new Map();
""" + controller_code + r"""

// 1. Verificar skip-to-content acessível por teclado
headerCta.focus();
assert.equal(document.activeElement, headerCta);
const skipEvt = skipLink.emit('click');
assert.equal(skipEvt.defaultPrevented, true);
assert.equal(document.activeElement, mainContent);

// 2. Ciclo estrito de Focus Trap e restauro ESC em #lightbox-modal
cardTrigger.focus();
assert.equal(document.activeElement, cardTrigger);
openLightbox('muro-curvo', cardTrigger);

assert.equal(lightboxModal.classList.contains('active'), true);
assert.equal(siteWrapper.getAttribute('aria-hidden'), 'true');
assert.equal(siteWrapper.inert, true);
assert.equal(document.activeElement, lightboxClose);

let lbFocusables = modalA11y.getFocusableElements(lightboxModal).map((n) => n.id);
assert.deepEqual(lbFocusables, [
  'lightbox-photo-tab',
  'lightbox-technical-tab',
  'lightbox-prev',
  'lightbox-next',
  'lightbox-close',
  'lightbox-inquire-btn',
]);

// TAB no último elemento (#lightbox-inquire-btn) confina no primeiro (#lightbox-photo-tab)
lightboxInquire.focus();
let tabForward = document.emit('keydown', { key: 'Tab', shiftKey: false, target: lightboxInquire });
assert.equal(tabForward.defaultPrevented, true);
assert.equal(document.activeElement, photoTab);

// SHIFT+TAB no primeiro elemento (#lightbox-photo-tab) confina no último (#lightbox-inquire-btn)
let tabBackward = document.emit('keydown', { key: 'Tab', shiftKey: true, target: photoTab });
assert.equal(tabBackward.defaultPrevented, true);
assert.equal(document.activeElement, lightboxInquire);

// Vista técnica revela #technical-detail na árvore focável
technicalTab.emit('click');
lbFocusables = modalA11y.getFocusableElements(lightboxModal).map((n) => n.id);
assert.ok(lbFocusables.includes('technical-detail'));

// Tentativa de fuga de foco para o fundo é bloqueada pelo listener focusin
footerLink.focus();
assert.equal(document.activeElement, photoTab, 'Foco não pode escapar para o rodapé com Lightbox aberto');

// ESC fecha #lightbox-modal e restaura o foco exacto ao card activador
const escLb = document.emit('keydown', { key: 'Escape', target: photoTab });
assert.equal(escLb.defaultPrevented, true);
assert.equal(lightboxModal.classList.contains('active'), false);
assert.equal(siteWrapper.getAttribute('aria-hidden'), null);
assert.equal(siteWrapper.inert, false);
assert.equal(document.activeElement, cardTrigger);

// 3. Ciclo estrito de Focus Trap e restauro ESC em #concierge-modal
headerCta.focus();
headerCta.emit('click');

assert.equal(conciergeModal.classList.contains('active'), true);
assert.equal(siteWrapper.getAttribute('aria-hidden'), 'true');
assert.equal(document.activeElement, modalName);

const cmFocusables = modalA11y.getFocusableElements(conciergeModal).map((n) => n.id);
assert.ok(!cmFocusables.includes('modal_website_trap'), 'Honeypot nunca deve entrar no ciclo de foco');
assert.ok(!cmFocusables.includes('modal-feedback-close'), 'Controlos ocultos [hidden] excluídos do foco');
assert.equal(cmFocusables[0], 'concierge-modal-close');
assert.equal(cmFocusables[cmFocusables.length - 1], 'modal-jump-section');

// TAB no último (#modal-jump-section) volta ao primeiro (#concierge-modal-close)
modalJump.focus();
const cmTabFwd = document.emit('keydown', { key: 'Tab', shiftKey: false, target: modalJump });
assert.equal(cmTabFwd.defaultPrevented, true);
assert.equal(document.activeElement, conciergeClose);

// SHIFT+TAB no primeiro (#concierge-modal-close) salta ao último (#modal-jump-section)
const cmTabBwd = document.emit('keydown', { key: 'Tab', shiftKey: true, target: conciergeClose });
assert.equal(cmTabBwd.defaultPrevented, true);
assert.equal(document.activeElement, modalJump);

// Fuga forçada de foco redirecciona imediatamente para dentro do modal
cardTrigger.focus();
assert.equal(document.activeElement, conciergeClose);

// ESC fecha #concierge-modal e restaura o foco exacto ao botão #header-concierge-btn
const escCm = document.emit('keydown', { key: 'Escape', target: conciergeClose });
assert.equal(escCm.defaultPrevented, true);
assert.equal(conciergeModal.classList.contains('active'), false);
assert.equal(document.activeElement, headerCta);

// 4. Transição encadeada Card -> Lightbox -> Concierge -> ESC restaura ao Card original
cardTrigger.focus();
openLightbox('escada-detalhe', cardTrigger);
lightboxInquire.emit('click');
assert.equal(lightboxModal.classList.contains('active'), false);
assert.equal(conciergeModal.classList.contains('active'), true);
assert.equal(modalType.value, 'bespoke_stonework');
document.emit('keydown', { key: 'Escape', target: modalName });
assert.equal(conciergeModal.classList.contains('active'), false);
assert.equal(document.activeElement, cardTrigger);
"""
        res = subprocess.run(["node", "-e", harness], capture_output=True, text=True, timeout=15)
        self.assertEqual(res.returncode, 0, f"Focus trap harness failed:\n{res.stderr}")


class LegalPortugalAndMonochromeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html_text = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.css_text = (ROOT / "css/style.css").read_text(encoding="utf-8")
        cls.js_text = (ROOT / "js/main.js").read_text(encoding="utf-8")
        cls.i18n_text = (ROOT / "js/i18n.js").read_text(encoding="utf-8")
        cls.collector = OrderedElementCollector(cls.html_text)

    def test_livro_reclamacoes_official_link_and_attributes(self):
        self.assertIn("livro-reclamacoes-link", self.collector.ids)
        tag, attrs = self.collector.ids["livro-reclamacoes-link"]
        self.assertEqual(tag, "a")
        self.assertEqual(attrs.get("href"), "https://www.livroreclamacoes.pt")
        self.assertEqual(attrs.get("target"), "_blank")
        self.assertIn("noopener", attrs.get("rel", ""))
        self.assertIn("noreferrer", attrs.get("rel", ""))

    def test_legal_footer_monochromatic_mono_typography_and_rgpd_content(self):
        self.assertIn("footer-legal", self.collector.ids)
        legal_rule = re.search(r"\.footer-legal\s*\{([^}]+)\}", self.css_text)
        self.assertIsNotNone(legal_rule, "Bloco .footer-legal ausente em css/style.css")
        self.assertIn("var(--font-mono)", legal_rule.group(1))

        lre_rule = re.search(r"\.footer-lre-link\s*\{([^}]+)\}", self.css_text)
        self.assertIsNotNone(lre_rule)
        self.assertIn("var(--font-mono)", lre_rule.group(1))

        # Conteúdo normativo obrigatório: RGPD, Porto/Douro, Lei 144/2015, DL 156/2005
        self.assertIn("RGPD", self.html_text)
        self.assertIn("2016/679", self.html_text)
        self.assertIn("Grande Porto", self.html_text)
        self.assertIn("Vale do Douro", self.html_text)
        self.assertIn("156/2005", self.html_text)
        self.assertIn("144/2015", self.html_text)

    def test_zero_intrusive_cookie_banners_and_svg_tiny_compliance(self):
        combined = (self.html_text + "\n" + self.css_text + "\n" + self.js_text).lower()
        for forbidden in (
            "cookie-banner",
            "cookie-consent",
            "cookie-popup",
            "cookiebot",
            "onetrust",
            "googletagmanager",
        ):
            self.assertNotIn(forbidden, combined, f"Elemento intrusivo proibido detectado: {forbidden}")

        # Proibição estrita de filtros SVG (<filter>, <feGaussianBlur>, <feComposite>)
        for forbidden_svg in ("filter", "fegaussianblur", "fecomposite"):
            self.assertNotIn(forbidden_svg, self.collector.svgs_inner_tags)

    def test_makefile_check_gate_includes_sol08_suite(self):
        makefile_text = (ROOT / "Makefile").read_text(encoding="utf-8")
        self.assertIn("scripts/test_a11y_legal.py", makefile_text)


class PhotoPersistenceAndFailClosedQuotaTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp_dir = Path(tempfile.mkdtemp(prefix="solrac_sol08_test_"))
        cls.inquiries_path = cls.tmp_dir / "inquiries.jsonl"

        class QuietHandler(InquiryRequestHandler):
            inquiries_file = cls.inquiries_path

            def log_message(self, fmt, *args):
                pass

        cls.httpd = ThreadedInquiryServer(("127.0.0.1", 0), QuietHandler)
        cls.port = cls.httpd.server_address[1]
        cls.base_url = f"http://127.0.0.1:{cls.port}"
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        time.sleep(0.05)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        shutil.rmtree(cls.tmp_dir, ignore_errors=True)

    def setUp(self):
        if self.inquiries_path.exists():
            self.inquiries_path.unlink()
        photos_dir = self.tmp_dir / "photos"
        if photos_dir.exists():
            shutil.rmtree(photos_dir)

    def _base_payload(self, **overrides) -> dict:
        payload = {
            "client_name": "Atelier Siza & Associados",
            "client_role": "architect",
            "client_email": "direcao@atelier-porto.pt",
            "client_phone": "+351 913 000 111",
            "project_type": "structural_wall",
            "location": "Foz do Douro, Porto",
            "project_notes": "Muro de contenção em granito aparelhado com drenagem oculta.",
            "website_trap": "",
            "form_loaded_at": (time.time() * 1000) - 5000,
            "source": "inpage_form",
        }
        payload.update(overrides)
        return payload

    def _post(self, payload: dict) -> tuple[int, dict]:
        req = urllib.request.Request(
            f"{self.base_url}/api/inquiry",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status, json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as err:
            try:
                raw = err.read().decode("utf-8")
                return err.code, json.loads(raw)
            finally:
                err.close()

    def test_valid_photos_persisted_durably_and_indexed_in_jsonl(self):
        jpg_bytes = _make_jpeg_bytes(4096)
        png_bytes = _make_png_bytes(1024)
        webp_bytes = _make_webp_bytes(1536)

        payload = self._base_payload(
            dossier_ref="SOL-2026-F8K2",
            photos=[
                {
                    "name": "vista-geral.jpg",
                    "mime_type": "image/jpeg",
                    "data": "data:image/jpeg;base64," + base64.b64encode(jpg_bytes).decode("ascii"),
                },
                {
                    "name": "corte-cota.png",
                    "mime_type": "image/png",
                    "data": base64.b64encode(png_bytes).decode("ascii"),
                },
                {
                    "name": "../../pormenor-esquina.webp",
                    "mime_type": "image/webp",
                    "data": "data:image/webp;base64," + base64.b64encode(webp_bytes).decode("ascii"),
                },
            ],
        )

        status, body = self._post(payload)
        self.assertEqual(status, 201, body)
        self.assertTrue(body["ok"])
        self.assertEqual(body["ref"], "SOL-2026-F8K2")
        self.assertEqual(body["photos_saved"], 3)

        lines = [ln for ln in self.inquiries_path.read_text(encoding="utf-8").splitlines() if ln.strip()]
        self.assertEqual(len(lines), 1)
        record = json.loads(lines[0])
        self.assertEqual(len(record["photos"]), 3)
        self.assertEqual(record["metadata"]["photo_count"], 3)
        self.assertEqual(
            record["metadata"]["photo_bytes"],
            len(jpg_bytes) + len(png_bytes) + len(webp_bytes),
        )

        expected_binaries = [jpg_bytes, png_bytes, webp_bytes]
        for idx, meta in enumerate(record["photos"]):
            saved_file = self.tmp_dir / meta["rel_path"]
            self.assertTrue(saved_file.is_file(), f"Ficheiro de foto em falta: {saved_file}")
            self.assertTrue(saved_file.resolve().is_relative_to((self.tmp_dir / "photos").resolve()))
            disk_bytes = saved_file.read_bytes()
            self.assertEqual(disk_bytes, expected_binaries[idx])
            self.assertEqual(meta["sha256"], hashlib.sha256(disk_bytes).hexdigest())

        # Path traversal neutralizado no original_name
        self.assertEqual(record["photos"][2]["original_name"], "pormenor-esquina.webp")
        self.assertEqual(record["photos"][2]["filename"], "SOL-2026-F8K2-03.webp")

    def test_private_data_directory_blocked_from_public_http_get(self):
        status, _ = self._post(self._base_payload())
        self.assertEqual(status, 201)

        for private_path in ("/data/inquiries.jsonl", "/data", "/data/photos"):
            req = urllib.request.Request(f"{self.base_url}{private_path}", method="GET")
            with self.assertRaises(urllib.error.HTTPError) as ctx:
                urllib.request.urlopen(req, timeout=5)
            self.assertEqual(ctx.exception.code, 403)
            ctx.exception.close()

    def test_fail_closed_single_and_total_photo_size_quotas(self):
        # 1. Foto individual > MAX_SINGLE_PHOTO_BYTES (512 KiB)
        oversized_jpg = _make_jpeg_bytes(MAX_SINGLE_PHOTO_BYTES + 2048)
        status, body = self._post(
            self._base_payload(
                photos=[
                    {
                        "name": "enorme.jpg",
                        "mime_type": "image/jpeg",
                        "data": base64.b64encode(oversized_jpg).decode("ascii"),
                    }
                ]
            )
        )
        self.assertEqual(status, 413)
        self.assertEqual(body["error"], "PHOTO_SIZE_EXCEEDED")
        self.assertFalse(self.inquiries_path.exists())
        self.assertFalse((self.tmp_dir / "photos").exists())

        # 2. Quota total > MAX_TOTAL_PHOTOS_BYTES (4 x 450 KiB = 1800 KiB > 1600 KiB)
        chunk_jpg = _make_jpeg_bytes(450 * 1024)
        b64_chunk = base64.b64encode(chunk_jpg).decode("ascii")
        status, body = self._post(
            self._base_payload(
                photos=[{"mime_type": "image/jpeg", "data": b64_chunk} for _ in range(MAX_PHOTOS_COUNT)]
            )
        )
        self.assertEqual(status, 413)
        self.assertEqual(body["error"], "TOTAL_PHOTO_QUOTA_EXCEEDED")
        self.assertFalse(self.inquiries_path.exists())
        self.assertFalse((self.tmp_dir / "photos").exists())

    def test_fail_closed_http_body_quota_header_guard(self):
        conn = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        try:
            conn.putrequest("POST", "/api/inquiry")
            conn.putheader("Content-Type", "application/json")
            conn.putheader("Content-Length", str(MAX_REQUEST_BODY_BYTES + 4096))
            conn.endheaders()
            resp = conn.getresponse()
            body = json.loads(resp.read().decode("utf-8"))
            self.assertEqual(resp.status, 413)
            self.assertEqual(body["error"], "PAYLOAD_TOO_LARGE")
        finally:
            conn.close()
        self.assertFalse(self.inquiries_path.exists())

    def test_fail_closed_anomalous_photos_formats_and_signatures(self):
        small_jpg_b64 = base64.b64encode(_make_jpeg_bytes(512)).decode("ascii")

        # Excesso de número de fotos (5 > 4)
        status, body = self._post(
            self._base_payload(
                photos=[{"mime_type": "image/jpeg", "data": small_jpg_b64} for _ in range(MAX_PHOTOS_COUNT + 1)]
            )
        )
        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "PHOTO_COUNT_EXCEEDED")

        # Formato não permitido (SVG potencialmente activo)
        svg_b64 = base64.b64encode(b"<svg xmlns='http://www.w3.org/2000/svg'><script>1</script></svg>").decode("ascii")
        status, body = self._post(
            self._base_payload(photos=[{"mime_type": "image/svg+xml", "data": svg_b64}])
        )
        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "UNSUPPORTED_PHOTO_FORMAT")

        # Magic bytes falsificados (declara JPEG mas envia binário arbitrário)
        spoof_b64 = base64.b64encode(b"MZ\x90\x00not_a_jpeg_payload_at_all").decode("ascii")
        status, body = self._post(
            self._base_payload(photos=[{"mime_type": "image/jpeg", "data": spoof_b64}])
        )
        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "INVALID_PHOTO_SIGNATURE")

        # Base64 corrompido
        status, body = self._post(
            self._base_payload(photos=[{"mime_type": "image/jpeg", "data": "%%%invalid-base64%%%"}])
        )
        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "CORRUPT_PHOTO_DATA")

        # Tipo estrutural inválido para photos
        status, body = self._post(self._base_payload(photos={"not": "a_list"}))
        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "INVALID_PHOTOS_PAYLOAD")

        # Texto excessivo em project_notes
        status, body = self._post(self._base_payload(project_notes="X" * (MAX_NOTES_LENGTH + 100)))
        self.assertEqual(status, 413)
        self.assertEqual(body["error"], "FIELD_QUOTA_EXCEEDED")

        self.assertFalse(self.inquiries_path.exists())

    def test_concurrent_submissions_preserve_jsonl_transactional_integrity(self):
        valid_b64 = base64.b64encode(_make_jpeg_bytes(2048)).decode("ascii")
        bad_b64 = base64.b64encode(_make_jpeg_bytes(MAX_SINGLE_PHOTO_BYTES + 1024)).decode("ascii")
        outcomes = []
        lock = threading.Lock()

        def worker(idx: int):
            is_valid_case = idx % 2 == 0
            payload = self._base_payload(
                client_name=f"Cliente Concorrente {idx}",
                photos=[{"mime_type": "image/jpeg", "data": valid_b64 if is_valid_case else bad_b64}],
            )
            st, bd = self._post(payload)
            with lock:
                outcomes.append((is_valid_case, st, bd))

        threads = [threading.Thread(target=worker, args=(i,)) for i in range(8)]
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=10)

        self.assertEqual(len(outcomes), 8)
        for is_valid_case, st, _ in outcomes:
            self.assertEqual(st, 201 if is_valid_case else 413)

        raw_lines = [ln for ln in self.inquiries_path.read_text(encoding="utf-8").splitlines() if ln.strip()]
        self.assertEqual(len(raw_lines), 4)
        persisted_refs = set()
        for line in raw_lines:
            parsed = json.loads(line)
            persisted_refs.add(parsed["ref"])
            self.assertEqual(len(parsed["photos"]), 1)

        photo_dirs = {p.name for p in (self.tmp_dir / "photos").iterdir() if p.is_dir()}
        self.assertEqual(photo_dirs, persisted_refs, "Directórios órfãos detectados após rejeições concorrentes")


if __name__ == "__main__":
    unittest.main()
