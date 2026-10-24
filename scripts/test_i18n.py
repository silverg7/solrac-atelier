"""SOL-06: Verificação do motor trilingüe instantâneo PT / EN / ES (Zero-Dep & CLS=0)."""

import json
import re
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TagAndTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.ids = set()
        self.i18n_keys = set()
        self.i18n_placeholders = set()
        self.i18n_aria_labels = set()
        self.i18n_alts = set()
        self.stack = []
        self.text_nodes = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        self.tags.append((tag, attr_dict))
        self.stack.append((tag, attr_dict))
        if "id" in attr_dict:
            self.ids.add(attr_dict["id"])
        if "data-i18n" in attr_dict:
            self.i18n_keys.add(attr_dict["data-i18n"])
        if "data-i18n-placeholder" in attr_dict:
            self.i18n_placeholders.add(attr_dict["data-i18n-placeholder"])
        if "data-i18n-aria-label" in attr_dict:
            self.i18n_aria_labels.add(attr_dict["data-i18n-aria-label"])
        if "data-i18n-alt" in attr_dict:
            self.i18n_alts.add(attr_dict["data-i18n-alt"])

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

    def handle_data(self, data):
        text = data.strip()
        if not text:
            return
        # Ignore script, style, svg text
        if any(t in {"script", "style", "svg"} for t, _ in self.stack):
            return
        has_i18n = any("data-i18n" in attrs for _, attrs in self.stack)
        parent_tag, parent_attrs = self.stack[-1] if self.stack else ("", {})
        self.text_nodes.append({
            "text": text,
            "tag": parent_tag,
            "attrs": parent_attrs,
            "has_i18n": has_i18n
        })


class I18nEngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html_text = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.css_text = (ROOT / "css/style.css").read_text(encoding="utf-8")
        cls.i18n_js_text = (ROOT / "js/i18n.js").read_text(encoding="utf-8")
        cls.main_js_text = (ROOT / "js/main.js").read_text(encoding="utf-8")

        extractor = TagAndTextExtractor()
        extractor.feed(cls.html_text)
        cls.extracted = extractor

        # Extract TRANSLATIONS from js/i18n.js via Node
        node_cmd = ["node", "-e", "const i18n = require('./js/i18n.js'); console.log(JSON.stringify(i18n.TRANSLATIONS));"]
        res = subprocess.run(node_cmd, cwd=ROOT, capture_output=True, text=True, check=True)
        cls.translations = json.loads(res.stdout)

    def test_syntax_and_zero_external_dependencies(self):
        # Clean syntax in i18n.js
        res = subprocess.run(["node", "--check", str(ROOT / "js/i18n.js")], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"i18n.js syntax error: {res.stderr}")

        # Scripts loaded in index.html must only be local
        scripts = [attrs.get("src", "") for tag, attrs in self.extracted.tags if tag == "script" and "src" in attrs]
        self.assertEqual(scripts, ["js/i18n.js", "js/main.js"])

    def test_complete_1_to_1_key_parity(self):
        pt = self.translations["pt"]
        en = self.translations["en"]
        es = self.translations["es"]

        self.assertGreater(len(pt), 100, "Dicionário PT deve conter cobertura técnica abrangente")
        self.assertEqual(set(pt.keys()), set(en.keys()), "Desfasamento de chaves entre PT e EN")
        self.assertEqual(set(pt.keys()), set(es.keys()), "Desfasamento de chaves entre PT e ES")

        # Verify no empty or dummy translations (except explicitly empty initial placeholder)
        for lang_code, dict_ in [("pt", pt), ("en", en), ("es", es)]:
            for key, val in dict_.items():
                is_valid = isinstance(val, str) and (len(val.strip()) > 0 or key == "feedback.description.initial")
                self.assertTrue(is_valid, f"Tradução vazia em {lang_code}:{key}")
                self.assertIsNone(re.search(r"\bTODO\b", val), f"Placeholder TODO encontrado em {lang_code}:{key}")

    def test_architectural_technical_lexicon(self):
        pt_dump = json.dumps(self.translations["pt"], ensure_ascii=False)
        en_dump = json.dumps(self.translations["en"], ensure_ascii=False)
        es_dump = json.dumps(self.translations["es"], ensure_ascii=False)

        # Architectural terminology required by ticket
        self.assertIn("cantaria aparelhada", pt_dump, "Léxico PT deve incluir 'cantaria aparelhada'")
        self.assertIn("dressed stonework", en_dump, "Léxico EN deve incluir 'dressed stonework'")
        self.assertIn("cantería aparejada", es_dump, "Léxico ES deve incluir 'cantería aparejada'")

    def test_html_data_i18n_coverage(self):
        pt = self.translations["pt"]

        # All data-i18n keys must be in the dictionary
        self.assertGreater(len(self.extracted.i18n_keys), 40)
        for key in self.extracted.i18n_keys:
            with self.subTest(key=key):
                self.assertIn(key, pt, f"Chave data-i18n='{key}' no index.html ausente em js/i18n.js")

        for key in self.extracted.i18n_placeholders:
            with self.subTest(placeholder_key=key):
                self.assertIn(key, pt, f"Chave placeholder '{key}' no index.html ausente em js/i18n.js")

        for key in self.extracted.i18n_aria_labels:
            with self.subTest(aria_label_key=key):
                self.assertIn(key, pt, f"Chave aria-label '{key}' no index.html ausente em js/i18n.js")

        for key in self.extracted.i18n_alts:
            with self.subTest(alt_key=key):
                self.assertIn(key, pt, f"Chave alt '{key}' no index.html ausente em js/i18n.js")

    def test_no_orphan_visible_texts_in_html(self):
        # Known exempt invariant tokens (proper nouns, branding, numbers, mathematical coordinates, emojis, switcher labels)
        invariant_tokens = {
            "SOLRAC", "SOLRAC TECTONICS", "PT", "EN", "ES", "·",
            "📐", "⚒️", "[01]", "[02]", "[03]", "01", "02", "03", "04",
            "director@solrac-tectonics.com"
        }

        orphans = []
        for node in self.extracted.text_nodes:
            if node["has_i18n"]:
                continue
            text = node["text"]
            if text in invariant_tokens:
                continue
            # Pure numbers / coordinates / percentages
            if re.match(r"^[\d\s.,°'\"NW±\-+%:]+$", text):
                continue
            orphans.append(node)

        self.assertEqual(orphans, [], f"Textos órfãos visíveis sem data-i18n encontrados em index.html: {orphans}")

    def test_switchers_presence_and_structure(self):
        # Both switchers must exist
        self.assertIn("lang-switcher-desktop", self.extracted.ids)
        self.assertIn("lang-switcher-mobile", self.extracted.ids)

        for switcher_id in ("lang-switcher-desktop", "lang-switcher-mobile"):
            pattern = rf'<div[^>]*id="{switcher_id}"[^>]*>(.*?)</div>'
            match = re.search(pattern, self.html_text, re.S)
            self.assertIsNotNone(match, f"Switcher #{switcher_id} não encontrado")
            markup = match.group(1)

            # 3 buttons with exact data-lang
            langs = re.findall(r'data-lang="([a-z]{2})"', markup)
            self.assertEqual(langs, ["pt", "en", "es"], f"Ordem ou opções incorretas em #{switcher_id}")

            # Active button initial state
            self.assertIn('data-lang="pt" aria-pressed="true"', markup)
            self.assertIn('class="lang-btn active"', markup)
            self.assertIn('data-lang="en" aria-pressed="false"', markup)
            self.assertIn('data-lang="es" aria-pressed="false"', markup)

    def test_hot_switching_and_localstorage_persistence(self):
        harness = r"""
const assert = require('node:assert/strict');
const fs = require('node:fs');

const elements = [];
function createElement(tag, attrs = {}) {
  const el = {
    tagName: tag.toUpperCase(),
    attributes: {...attrs},
    classList: {
      _classes: new Set((attrs.class || '').split(' ').filter(Boolean)),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    getAttribute(name) { return this.attributes[name] || null; },
    setAttribute(name, val) { this.attributes[name] = String(val); },
    addEventListener(evt, fn) {
      this._listeners = this._listeners || {};
      (this._listeners[evt] = this._listeners[evt] || []).push(fn);
    },
    dispatchEvent(evt) {
      (this._listeners?.[evt.type] || []).forEach(fn => fn(evt));
    },
    textContent: '',
    innerHTML: ''
  };
  elements.push(el);
  return el;
}

const storage = {};
global.localStorage = {
  getItem: k => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); }
};
global.navigator = { languages: ['pt-PT', 'pt'] };

global.document = {
  documentElement: { lang: 'pt-PT' },
  readyState: 'complete',
  addEventListener: () => {},
  dispatchEvent: () => {},
  querySelectorAll(sel) {
    if (sel === '[data-i18n]') return elements.filter(e => e.getAttribute('data-i18n'));
    if (sel === '[data-i18n-placeholder]') return elements.filter(e => e.getAttribute('data-i18n-placeholder'));
    if (sel === '[data-i18n-aria-label]') return elements.filter(e => e.getAttribute('data-i18n-aria-label'));
    if (sel === '[data-i18n-alt]') return elements.filter(e => e.getAttribute('data-i18n-alt'));
    if (sel === '.lang-switcher') return elements.filter(e => e.classList.contains('lang-switcher'));
    if (sel === '.lang-btn') return elements.filter(e => e.classList.contains('lang-btn'));
    return [];
  }
};

const titleEl = createElement('h1', {'data-i18n': 'nav.works'});
const inputEl = createElement('input', {'data-i18n-placeholder': 'inquiry.placeholder.client_name'});
const switcher = createElement('div', {class: 'lang-switcher'});
const btnPt = createElement('button', {class: 'lang-btn active', 'data-lang': 'pt', 'aria-pressed': 'true'});
const btnEn = createElement('button', {class: 'lang-btn', 'data-lang': 'en', 'aria-pressed': 'false'});
const btnEs = createElement('button', {class: 'lang-btn', 'data-lang': 'es', 'aria-pressed': 'false'});
switcher.querySelectorAll = sel => sel === '.lang-btn' ? [btnPt, btnEn, btnEs] : [];

const I18N = require('./js/i18n.js');

// Test hot switching EN
const t0 = performance.now();
I18N.setLanguage('en');
const t1 = performance.now();
const elapsedMs = t1 - t0;
assert.ok(elapsedMs < 50, `Conmutación lenta: ${elapsedMs}ms >= 50ms`);

assert.equal(global.document.documentElement.lang, 'en');
assert.equal(titleEl.textContent, 'Selected works');
assert.equal(inputEl.getAttribute('placeholder'), 'e.g. Sampaio Architecture Practice');
assert.equal(btnEn.classList.contains('active'), true);
assert.equal(btnPt.classList.contains('active'), false);
assert.equal(btnEn.getAttribute('aria-pressed'), 'true');
assert.equal(btnPt.getAttribute('aria-pressed'), 'false');
assert.equal(global.localStorage.getItem('solrac_lang'), 'en');

// Test hot switching ES
I18N.setLanguage('es');
assert.equal(global.document.documentElement.lang, 'es');
assert.equal(titleEl.textContent, 'Obras seleccionadas');
assert.equal(btnEs.classList.contains('active'), true);
assert.equal(btnEn.classList.contains('active'), false);
assert.equal(global.localStorage.getItem('solrac_lang'), 'es');

// Test return to PT
I18N.setLanguage('pt');
assert.equal(global.document.documentElement.lang, 'pt-PT');
assert.equal(titleEl.textContent, 'Obras selecionadas');
assert.equal(btnPt.classList.contains('active'), true);
assert.equal(global.localStorage.getItem('solrac_lang'), 'pt');
"""
        res = subprocess.run(["node", "-e", harness], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"Harness failure: {res.stderr}")

    def test_cls0_layout_stability_css(self):
        # Verification of CLS=0 layout stability rules
        self.assertIn(".lang-switcher", self.css_text)
        self.assertIn(".lang-btn", self.css_text)
        self.assertIn(".lang-sep", self.css_text)
        self.assertIn("white-space: nowrap", self.css_text)
        self.assertIn(".hero-title", self.css_text)
        self.assertIn("min-height", self.css_text)


if __name__ == "__main__":
    unittest.main()
