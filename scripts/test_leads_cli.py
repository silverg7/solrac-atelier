"""Testes da CLI de pedidos e presença do dossier de entrega."""

import csv
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / "scripts" / "leads.py"


class LeadsCliTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.data = self.root / "inquiries.jsonl"
        self.lead = {"ref": "SOL-TEST", "created_at": "2026-10-25T10:00:00Z",
                     "client_name": "Carlos Silva", "client_email": "carlos@example.pt",
                     "project_type": "stone", "location": "Porto",
                     "photos": [{"rel_path": "photos/SOL-TEST/a.jpg", "original_name": "obra.jpg"}]}
        self.data.write_text(json.dumps(self.lead) + "\n", encoding="utf-8")

    def tearDown(self):
        self.temp.cleanup()

    def run_cli(self, *args):
        return subprocess.run([sys.executable, str(CLI), "--file", str(self.data), *map(str, args)],
                              cwd=ROOT, capture_output=True, text=True)

    def test_list(self):
        result = self.run_cli("--list")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("SOL-TEST", result.stdout)
        self.assertIn("Carlos Silva", result.stdout)

    def test_export_csv_and_json(self):
        csv_path, json_path = self.root / "out.csv", self.root / "nested" / "out.json"
        result = self.run_cli("--export-csv", csv_path)
        self.assertEqual(result.returncode, 0, result.stderr)
        with csv_path.open(encoding="utf-8-sig", newline="") as source:
            self.assertEqual(next(csv.DictReader(source))["ref"], "SOL-TEST")
        result = self.run_cli("--export-json", json_path)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(json_path.read_text(encoding="utf-8"))[0]["ref"], "SOL-TEST")

    def test_show_photos_and_reject_unsafe_path(self):
        photo = self.root / "photos" / "SOL-TEST" / "a.jpg"
        photo.parent.mkdir(parents=True)
        photo.write_bytes(b"image")
        result = self.run_cli("--show-photos")
        self.assertIn(str(photo), result.stdout)
        unsafe = dict(self.lead, photos=[{"rel_path": "../../outside.jpg", "original_name": "fora.jpg"}])
        self.data.write_text(json.dumps(unsafe) + "\n", encoding="utf-8")
        result = self.run_cli("--show-photos")
        self.assertIn("caminho inválido", result.stdout)

    def test_action_required_and_pdf_exists(self):
        result = subprocess.run([sys.executable, str(CLI)], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)
        self.assertTrue((ROOT / "docs" / "DOSSIER_CLIENTE_CARLOS.pdf").is_file())

    def test_malformed_jsonl_fails_clearly(self):
        self.data.write_text("{invalid}\n", encoding="utf-8")
        result = self.run_cli("--list")
        self.assertEqual(result.returncode, 1)
        self.assertIn(":1: JSON inválido", result.stderr)


if __name__ == "__main__":
    unittest.main()
