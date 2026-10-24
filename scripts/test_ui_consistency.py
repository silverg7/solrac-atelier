"""SOL-BUG-02: paleta, idioma, estados e contrato visual do Concierge."""

import re
import subprocess
import unittest
from pathlib import Path

from scripts.test_concierge_flow import TagCollector

ROOT = Path(__file__).resolve().parents[1]


class UIConsistencyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html_text = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.css_text = (ROOT / "css/style.css").read_text(encoding="utf-8")
        cls.js_text = (ROOT / "js/main.js").read_text(encoding="utf-8")
        cls.parsed = TagCollector(cls.html_text)

    def test_monochrome_palette_and_hidden_contract(self):
        tokens = (ROOT / "css/variables.css").read_text()
        sources = tokens + self.css_text + self.js_text + self.html_text
        for color in re.findall(r"#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b", sources):
            if len(color) == 4:
                color = "#" + "".join(channel * 2 for channel in color[1:])
            rgb = [int(color[i:i + 2], 16) for i in (1, 3, 5)]
            self.assertEqual(len(set(rgb)), 1, f"Cor fora da escala de cinzentos: {color}")
        for rgb in re.findall(r"rgba?\((\d+),\s*(\d+),\s*(\d+)", sources):
            self.assertEqual(len(set(rgb)), 1, f"Cor fora da escala de cinzentos: {rgb}")
        for token, color in {"bg-primary": "#070707", "bg-surface": "#0d0d0d",
                             "text-primary": "#f5f5f5", "bg-surface-elevated": "#1f1f1f"}.items():
            self.assertIn(f"--{token}: {color};", tokens)
        self.assertRegex(self.css_text, r"\[hidden\]\s*\{[^}]*display:\s*none\s*!important")

    def test_pt_pt_and_feedback_action_parity(self):
        self.assertIn('<html lang="pt-PT">', self.html_text)
        for prefix, action in (("inpage", "reset"), ("modal", "close")):
            primary = next(attrs for _, attrs in self.parsed.tags
                           if attrs.get("id") == f"{prefix}-feedback-{action}")
            self.assertEqual(primary["class"], "btn-outline")
            for channel in ("mailto", "whatsapp"):
                secondary = next(attrs for _, attrs in self.parsed.tags
                                 if attrs.get("id") == f"{prefix}-{channel}-fallback")
                self.assertEqual(secondary["class"], "btn-outline")
        for tag, attrs in self.parsed.tags:
            if attrs.get("id", "").endswith(("feedback-reset", "feedback-close", "mailto-fallback", "whatsapp-fallback")):
                self.assertNotIn("btn-concierge", attrs.get("class", ""))
        for untranslated in ("Submit Another Commission", "Technical Priority Registered",
                             "Private Technical Consultation", "Leave empty"):
            self.assertNotIn(untranslated, self.html_text)

    def test_translation_keys_cover_both_forms_and_feedback(self):
        for form_id in ("concierge-form", "concierge-modal-form"):
            markup = re.search(rf'<form[^>]*id="{form_id}"[^>]*>(.*?)</form>', self.html_text, re.S)[1]
            tags = TagCollector(markup).tags
            for tag, attrs in tags:
                if tag in {"label", "option"}:
                    self.assertRegex(attrs.get("data-i18n", ""), r"^inquiry\.[a-z_.]+$")
                if "placeholder" in attrs:
                    self.assertEqual(attrs.get("data-i18n-placeholder"),
                                     f'inquiry.placeholder.{attrs["name"]}')
            self.assertIn('data-i18n="inquiry.submit"', markup)
        for attrs in self.parsed.links + self.parsed.buttons:
            if attrs.get("id", "").endswith(("mailto-fallback", "whatsapp-fallback", "feedback-reset", "feedback-close")):
                self.assertTrue(attrs.get("data-i18n", "").startswith("feedback."))

    def test_modal_scroll_contract_and_action_sizing(self):
        def rule(selector):
            return re.search(re.escape(selector) + r"\s*\{([^}]+)\}", self.css_text)[1]
        self.assertIn("overflow: hidden", rule(".concierge-modal"))
        self.assertIn("overflow-y: auto", rule(".concierge-modal-dialog"))
        self.assertNotIn("overflow-y: auto", rule(".concierge-modal-body"))
        self.assertIn("height: 100dvh", rule(".concierge-modal"))
        self.assertIn("min-height: 48px", rule(".feedback-actions > .btn-outline"))
        self.assertIn("white-space: normal", rule(".feedback-actions > .btn-outline"))

    def test_feedback_states_and_direct_channel_labels(self):
        # Execute the production renderer with a tiny DOM adapter; cover both form
        # variants, transport outcomes, escaping, and stable API enum values.
        renderer = self.js_text.split("  function showInquiryFeedback", 1)[1]
        renderer = "function showInquiryFeedback" + renderer.split("  // Concierge Modal Form Submission", 1)[0]
        harness = r"""
const assert = require('node:assert/strict');
const getWhatsAppUrl = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
for (const prefix of ['inpage', 'modal']) {
  for (const offline of [true, false]) {
    const elements = {};
    global.document = {getElementById: id => elements[id] ||= {dataset: {}}};
    const receipt = [{dataset: {}}, {dataset: {}}, {dataset: {}}];
    const title = {dataset: {}}, icon = {}, dialog = {scrollTop: 50};
    global.conciergeModal = {classList: {contains: () => true}, querySelector: () => dialog};
    const card = {hidden: true, scrollIntoView: () => {},
      querySelector: selector => selector === '.feedback-title' ? title : icon,
      querySelectorAll: () => receipt};
    const form = {hidden: false, elements: {namedItem: name => ({selectedOptions: [{
      textContent: name === 'project_type' ? 'Restauro de pedra' : 'Gabinete de arquitetura'
    }]})}};
    const payload = {client_name: '<teste> & nome', project_type: 'heritage_restoration',
      client_role: 'architect', client_email: 'teste@example.invalid', client_phone: '',
      location: 'Porto', project_notes: 'Descrição com & e ?'};
    showInquiryFeedback(prefix, form, card, payload, 'SOL-TEST', offline);
    assert.equal(form.hidden, true);
    assert.equal(card.hidden, false);
    assert.equal(title.dataset.i18n, `feedback.title.${offline ? 'offline' : 'received'}`);
    assert.equal(elements[`${prefix}-feedback-desc`].dataset.i18n, `feedback.description.${offline ? 'offline' : 'received'}`);
    assert.equal(title.textContent, offline ? 'Pedido por enviar' : 'Pedido recebido');
    assert.equal(icon.textContent, offline ? '!' : '✓');
    assert.equal(receipt[1].textContent, offline ? 'ENVIO MANUAL NECESSÁRIO' : 'PEDIDO RECEBIDO');
    assert.ok(elements[`${prefix}-feedback-desc`].textContent.includes('<teste> & nome'));
    for (const channel of ['mailto', 'whatsapp']) {
      const text = decodeURIComponent(elements[`${prefix}-${channel}-fallback`].href);
      assert.ok(text.includes('Restauro de pedra'));
      assert.ok(text.includes('Gabinete de arquitetura'));
      assert.ok(text.includes('Descrição com & e ?'));
      assert.ok(!text.includes('heritage_restoration'));
    }
    assert.equal(payload.project_type, 'heritage_restoration');
    if (prefix === 'modal') assert.equal(dialog.scrollTop, 0);
  }
}
"""
        result = subprocess.run(["node", "-e", renderer + harness], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
