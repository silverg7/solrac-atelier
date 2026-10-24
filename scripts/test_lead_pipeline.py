"""SOL-05: Verificação do serviço de ingesta de leads, pipeline transaccional e fallback resiliente."""

import json
import os
import shutil
import socketserver
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
    DEFAULT_INQUIRIES_FILE,
    InquiryRequestHandler,
    generate_dossier_ref,
    generate_unique_ref,
    persist_inquiry,
    validate_inquiry,
)

ROOT = Path(__file__).resolve().parents[1]


class HTMLFormInspector(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.forms = {}
        self.current_form = None
        self.inputs = []
        self.links = []
        self.buttons = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "form":
            form_id = attr_dict.get("id")
            self.current_form = form_id
            self.forms[form_id] = []
        elif tag == "input" and self.current_form:
            self.forms[self.current_form].append(attr_dict)
            self.inputs.append(attr_dict)
        elif tag == "input":
            self.inputs.append(attr_dict)
        elif tag == "a":
            self.links.append(attr_dict)
        elif tag == "button":
            self.buttons.append(attr_dict)

    def handle_endtag(self, tag):
        if tag == "form":
            self.current_form = None


class LeadPipelineServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp_dir = tempfile.mkdtemp(prefix="solrac_test_leads_")
        cls.test_inquiries_path = Path(cls.tmp_dir) / "inquiries.jsonl"

        class TestHandler(InquiryRequestHandler):
            inquiries_file = cls.test_inquiries_path

            def log_message(self, format, *args):
                pass

        cls.httpd = socketserver.TCPServer(("127.0.0.1", 0), TestHandler)
        cls.port = cls.httpd.server_address[1]
        cls.base_url = f"http://127.0.0.1:{cls.port}"

        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()
        time.sleep(0.1)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        shutil.rmtree(cls.tmp_dir, ignore_errors=True)

    def setUp(self):
        if self.test_inquiries_path.exists():
            self.test_inquiries_path.unlink()

    def _post_json(self, endpoint: str, payload: dict) -> tuple[int, dict]:
        url = f"{self.base_url}{endpoint}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req) as resp:
                return resp.status, json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            try:
                body = e.read().decode("utf-8")
                try:
                    data = json.loads(body)
                except Exception:
                    data = {"raw": body}
                return e.code, data
            finally:
                e.close()

    def test_valid_inquiry_persistence_and_response(self):
        now_ms = time.time() * 1000
        payload = {
            "client_name": "Sampaio & Associados Arquitectura",
            "client_role": "architect",
            "client_email": "sampaio@atelier-porto.pt",
            "client_phone": "+351 912 999 888",
            "project_type": "structural_wall",
            "location": "Foz do Douro, Porto",
            "project_notes": "Cyclopean retaining wall for private villa on cliffside, 85m extension.",
            "website_trap": "",
            "form_loaded_at": now_ms - 4500,  # 4.5s elapsed
            "source": "inpage_form",
        }

        status, body = self._post_json("/api/inquiry", payload)
        self.assertEqual(status, 201)
        self.assertTrue(body.get("ok"))
        self.assertTrue(body.get("ref", "").startswith("SOL-"))
        self.assertEqual(body.get("status"), "ASSIGNED TO TECHNICAL DIRECTOR")

        # Verificar persistência física durável em inquiries.jsonl
        self.assertTrue(self.test_inquiries_path.exists())
        lines = [line.strip() for line in self.test_inquiries_path.read_text(encoding="utf-8").splitlines() if line.strip()]
        self.assertEqual(len(lines), 1)

        record = json.loads(lines[0])
        self.assertEqual(record["ref"], body["ref"])
        self.assertEqual(record["client_name"], "Sampaio & Associados Arquitectura")
        self.assertEqual(record["client_email"], "sampaio@atelier-porto.pt")
        self.assertEqual(record["location"], "Foz do Douro, Porto")
        self.assertEqual(record["metadata"]["source"], "inpage_form")
        self.assertGreater(record["metadata"]["elapsed_ms"], 1500)

    def test_antispam_honeypot_rejection(self):
        now_ms = time.time() * 1000
        bot_payload = {
            "client_name": "Spam Bot Engine",
            "client_role": "developer",
            "client_email": "bot@spam-network.ru",
            "location": "Porto",
            "project_notes": "Buy crypto links",
            "website_trap": "https://spamlink.com",  # Honeypot preenchido
            "form_loaded_at": now_ms - 5000,
            "source": "modal_form",
        }

        status, body = self._post_json("/api/inquiry", bot_payload)
        self.assertEqual(status, 400)
        self.assertFalse(body.get("ok"))
        self.assertEqual(body.get("error"), "SPAM_HONEYPOT_TRIGGERED")

        # Zero registos no ficheiro de leads
        self.assertFalse(self.test_inquiries_path.exists())

    def test_antispam_temporal_threshold_rejection(self):
        now_ms = time.time() * 1000
        # Submissão ultra-rápida (300ms < 1500ms)
        fast_payload = {
            "client_name": "Inhuman Submitter",
            "client_email": "fast@script.com",
            "location": "Porto",
            "website_trap": "",
            "form_loaded_at": now_ms - 300,
            "source": "inpage_form",
        }

        status, body = self._post_json("/api/inquiry", fast_payload)
        self.assertEqual(status, 400)
        self.assertFalse(body.get("ok"))
        self.assertEqual(body.get("error"), "SPAM_TEMPORAL_THRESHOLD_VIOLATED")
        self.assertFalse(self.test_inquiries_path.exists())

    def test_antispam_future_timestamp_rejection(self):
        now_ms = time.time() * 1000
        future_payload = {
            "client_name": "Time Traveler",
            "client_email": "future@domain.com",
            "location": "Douro",
            "website_trap": "",
            "form_loaded_at": now_ms + 15000,  # 15 segundos no futuro
            "source": "modal_form",
        }

        status, body = self._post_json("/api/inquiry", future_payload)
        self.assertEqual(status, 400)
        self.assertEqual(body.get("error"), "SPAM_TEMPORAL_THRESHOLD_VIOLATED")

    def test_validation_missing_or_invalid_fields(self):
        now_ms = time.time() * 1000
        invalid_email_payload = {
            "client_name": "Carlos Silva",
            "client_email": "not-an-email",
            "location": "Porto",
            "website_trap": "",
            "form_loaded_at": now_ms - 3000,
        }
        status, body = self._post_json("/api/inquiry", invalid_email_payload)
        self.assertEqual(status, 400)
        self.assertEqual(body.get("error"), "INVALID_FIELDS")

        missing_name_payload = {
            "client_name": "",
            "client_email": "carlos@silva.pt",
            "location": "Porto",
            "website_trap": "",
            "form_loaded_at": now_ms - 3000,
        }
        status, body = self._post_json("/api/inquiry", missing_name_payload)
        self.assertEqual(status, 400)
        self.assertEqual(body.get("error"), "INVALID_FIELDS")

    def test_options_cors_preflight(self):
        req = urllib.request.Request(
            f"{self.base_url}/api/inquiry",
            headers={"Origin": "https://solrac-tectonics.com"},
            method="OPTIONS",
        )
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 204)
            self.assertEqual(resp.headers.get("Access-Control-Allow-Origin"), "*")
            self.assertIn("POST", resp.headers.get("Access-Control-Allow-Methods", ""))

    def test_get_api_health(self):
        req = urllib.request.Request(f"{self.base_url}/api/inquiry")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode("utf-8"))
            self.assertTrue(data.get("ok"))
            self.assertEqual(data.get("service"), "solrac-lead-ingestion")

    def test_unique_ref_generation_collision_free(self):
        refs = set()
        for _ in range(50):
            ref = generate_unique_ref(self.test_inquiries_path)
            self.assertTrue(ref.startswith("SOL-"))
            self.assertNotIn(ref, refs)
            refs.add(ref)


class FrontendLeadResilienceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html_text = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.js_text = (ROOT / "js/main.js").read_text(encoding="utf-8")
        cls.css_text = (ROOT / "css/style.css").read_text(encoding="utf-8")
        cls.inspector = HTMLFormInspector(cls.html_text)

    def test_honeypot_markup_in_both_forms(self):
        # Formulário in-page deve ter campo website_trap
        inpage_inputs = self.inspector.forms.get("concierge-form", [])
        inpage_trap = next((inp for inp in inpage_inputs if inp.get("name") == "website_trap"), None)
        self.assertIsNotNone(inpage_trap, "Honeypot website_trap ausente em #concierge-form")
        self.assertEqual(inpage_trap.get("tabindex"), "-1")
        self.assertEqual(inpage_trap.get("autocomplete"), "off")

        # Formulário modal deve ter campo website_trap
        modal_inputs = self.inspector.forms.get("concierge-modal-form", [])
        modal_trap = next((inp for inp in modal_inputs if inp.get("name") == "website_trap"), None)
        self.assertIsNotNone(modal_trap, "Honeypot website_trap ausente em #concierge-modal-form")
        self.assertEqual(modal_trap.get("tabindex"), "-1")
        self.assertEqual(modal_trap.get("autocomplete"), "off")

    def test_visual_trap_css_invisibility_guarantee(self):
        self.assertIn(".visual-trap", self.css_text)
        self.assertIn("left: -9999px", self.css_text)
        self.assertIn("opacity: 0", self.css_text)
        self.assertIn("pointer-events: none", self.css_text)

    def test_whatsapp_and_mailto_fallback_channels(self):
        # Ambos os cartões de feedback contêm o fallback directo WhatsApp
        whatsapp_links = [l for l in self.inspector.links if "wa.me/351912345678" in l.get("href", "")]
        self.assertGreaterEqual(len(whatsapp_links), 2, "Devem existir botões de fallback WhatsApp em inpage e modal.")

        link_ids = {l.get("id") for l in whatsapp_links}
        self.assertIn("inpage-whatsapp-fallback", link_ids)
        self.assertIn("modal-whatsapp-fallback", link_ids)

    def test_js_offline_resilience_and_vault_caching(self):
        # O cliente JS invoca /api/inquiry via fetch
        self.assertIn("fetch('/api/inquiry'", self.js_text)

        # Captura erros de rede/servidor offline e activa o fallback
        self.assertIn("try {", self.js_text)
        self.assertIn("catch (err)", self.js_text)
        self.assertIn("solrac_dossier_vault", self.js_text)
        self.assertIn("getWhatsAppUrl", self.js_text)
        self.assertIn("ENVIO MANUAL NECESSÁRIO", self.js_text)

    def test_data_directory_ready(self):
        data_dir = ROOT / "data"
        self.assertTrue(data_dir.is_dir(), "A pasta data/ deve existir para registo transaccional de leads.")


if __name__ == "__main__":
    unittest.main()
