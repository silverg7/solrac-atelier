"""SOL-03: Verificação do fluxo de Concierge, formulário técnico e integridade responsiva."""

import re
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TagCollector(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.ids = set()
        self.links = []
        self.buttons = []
        self.forms = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        self.tags.append((tag, attr_dict))
        if "id" in attr_dict:
            self.ids.add(attr_dict["id"])
        if tag == "a" and "href" in attr_dict:
            self.links.append(attr_dict)
        if tag == "button":
            self.buttons.append(attr_dict)
        if tag == "form":
            self.forms.append(attr_dict)


class ConciergeFlowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html_text = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.css_text = (ROOT / "css/style.css").read_text(encoding="utf-8")
        cls.js_text = (ROOT / "js/main.js").read_text(encoding="utf-8")
        cls.parsed = TagCollector(cls.html_text)

    def test_js_syntax_clean(self):
        res = subprocess.run(["node", "--check", str(ROOT / "js/main.js")], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"JS syntax error: {res.stderr}")
        self.assertNotIn("alert(", self.js_text, "Avisos alert() intrusivos proibidos no fluxo Concierge.")

    def test_concierge_modal_markup_and_accessibility(self):
        self.assertIn("concierge-modal", self.parsed.ids)
        modal_tag = next((attrs for tag, attrs in self.parsed.tags if attrs.get("id") == "concierge-modal"), None)
        self.assertIsNotNone(modal_tag)
        self.assertEqual(modal_tag.get("role"), "dialog")
        self.assertEqual(modal_tag.get("aria-modal"), "true")
        self.assertTrue(modal_tag.get("aria-labelledby"))
        self.assertIn(modal_tag["aria-labelledby"], self.parsed.ids)

        # Close button exists
        close_btn = next((b for b in self.parsed.buttons if b.get("id") == "concierge-modal-close"), None)
        self.assertIsNotNone(close_btn)
        self.assertTrue(close_btn.get("aria-label"))

    def test_direct_contact_channels_without_external_dependencies(self):
        # Email links point to canonical Technical Direction address
        mailto_links = [l["href"] for l in self.parsed.links if l["href"].startswith("mailto:")]
        self.assertGreaterEqual(len(mailto_links), 2)
        for link in mailto_links:
            self.assertTrue(link.startswith("mailto:director@solrac-tectonics.com"))

        # Zero third-party form processors (e.g. formspree, google forms, external CDNs)
        external_actions = [f.get("action", "") for f in self.parsed.forms if f.get("action", "").startswith("http")]
        self.assertEqual(external_actions, [], "Proibidas dependências externas caídas no intake de leads.")

    def test_all_internal_anchors_settle_on_existing_ids(self):
        internal_links = [l["href"][1:] for l in self.parsed.links if l["href"].startswith("#") and len(l["href"]) > 1]
        self.assertGreater(len(internal_links), 0)
        for target_id in internal_links:
            with self.subTest(target_id=target_id):
                self.assertIn(target_id, self.parsed.ids, f"Dead internal link: #{target_id}")

    def test_mobile_navigation_markup_and_controls(self):
        toggle_btn = next((b for b in self.parsed.buttons if b.get("id") == "mobile-toggle"), None)
        self.assertIsNotNone(toggle_btn)
        self.assertIn("aria-controls", toggle_btn)
        self.assertIn("aria-expanded", toggle_btn)
        self.assertIn(toggle_btn["aria-controls"], self.parsed.ids)

    def test_responsive_mobile_concierge_css_rules(self):
        # Form padding and grid must adapt on screens <= 768px
        self.assertIn("@media (max-width: 768px)", self.css_text)
        self.assertIn(".concierge-form", self.css_text)
        self.assertIn("min-width: 0", self.css_text)
        self.assertIn("text-overflow: ellipsis", self.css_text)

    def test_lightbox_to_concierge_link(self):
        self.assertIn("lightbox-inquire-btn", self.parsed.ids)
        self.assertIn("openConciergeModal", self.js_text)
        self.assertIn("lightboxInquireBtn", self.js_text)


if __name__ == "__main__":
    unittest.main()
