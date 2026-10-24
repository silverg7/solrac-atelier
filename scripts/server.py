#!/usr/bin/env python3
"""SOL-05: Serviço de ingesta de leads e persistência transaccional.

Endpoint /api/inquiry para intake de dossiers técnicos de comissão.
Inclui:
- Servidor HTTP estático + API REST transaccional
- Validação anti-spam (honeypot website_trap + limiar temporal mínimo)
- Validação de campos técnicos
- Geração de referências únicas de dossier (SOL-YYYY-XXXX)
- Persistência estruturada em data/inquiries.jsonl com flush durável (fsync)
"""

import http.server
import json
import os
import re
import socketserver
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
DEFAULT_INQUIRIES_FILE = DATA_DIR / "inquiries.jsonl"

# Caracteres canónicos não ambíguos para referência de dossier (exclui 0/O, 1/I)
REF_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
REF_REGEX = re.compile(r"^SOL-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$")

# Limiares de protecção temporal
MIN_SUBMISSION_TIME_MS = 1500  # 1.5 segundos mínimos para preenchimento humano
MAX_SUBMISSION_TIME_MS = 86400000  # 24 horas máximo de validade do formulário em cache
MAX_FUTURE_SKEW_MS = 5000  # Tolerância de 5 segundos para dessincronia de relógio


def generate_dossier_ref(year: Optional[int] = None) -> str:
    """Gera uma referência canónica de dossier: SOL-YYYY-XXXX."""
    if year is None:
        year = datetime.now(timezone.utc).year
    # Usar os.urandom para entropia criptograficamente segura
    rand_bytes = os.urandom(4)
    code = "".join(REF_CHARS[b % len(REF_CHARS)] for b in rand_bytes)
    return f"SOL-{year}-{code}"


def get_existing_refs(file_path: Path) -> set:
    """Lê todas as referências já persistidas para garantir unicidade estrita."""
    refs = set()
    if not file_path.exists():
        return refs
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    if "ref" in data:
                        refs.add(data["ref"])
                except json.JSONDecodeError:
                    continue
    except OSError:
        pass
    return refs


def generate_unique_ref(file_path: Path, preferred_ref: Optional[str] = None) -> str:
    """Gera uma referência única garantida contra colisões no log transaccional."""
    existing = get_existing_refs(file_path)
    if preferred_ref and REF_REGEX.match(preferred_ref) and preferred_ref not in existing:
        return preferred_ref

    for _ in range(100):
        candidate = generate_dossier_ref()
        if candidate not in existing:
            return candidate

    # Fallback determinista com timestamp de nanossegundos em caso extremo
    ns_suffix = hex(time.time_ns())[-4:].upper()
    return f"SOL-{datetime.now(timezone.utc).year}-{ns_suffix}"


def validate_inquiry(payload: Dict[str, Any], now_ms: Optional[float] = None) -> Tuple[bool, str, str]:
    """Valida o payload de consulta técnica contra spam e campos obrigatórios.

    Retorna: (is_valid, error_code, error_message)
    """
    if now_ms is None:
        now_ms = time.time() * 1000

    # 1. Protecção Anti-Spam: Honeypot trap
    website_trap = str(payload.get("website_trap", "")).strip()
    if website_trap:
        return False, "SPAM_HONEYPOT_TRIGGERED", "Honeypot field detected non-empty submission."

    # 2. Protecção Anti-Spam: Validação Temporal
    form_loaded_at = payload.get("form_loaded_at")
    if form_loaded_at is None:
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Missing form initialization timestamp."

    try:
        form_loaded_ms = float(form_loaded_at)
        # Se timestamp em segundos em vez de ms, converter
        if form_loaded_ms < 10000000000:
            form_loaded_ms *= 1000
    except (ValueError, TypeError):
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Invalid form timestamp format."

    elapsed_ms = now_ms - form_loaded_ms
    if elapsed_ms < MIN_SUBMISSION_TIME_MS:
        return (
            False,
            "SPAM_TEMPORAL_THRESHOLD_VIOLATED",
            f"Submission completed in {elapsed_ms:.0f}ms (minimum required {MIN_SUBMISSION_TIME_MS}ms).",
        )

    if elapsed_ms < -MAX_FUTURE_SKEW_MS:
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Form timestamp is in the future."

    if elapsed_ms > MAX_SUBMISSION_TIME_MS:
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Form session expired (>24h). Please reload page."

    # 3. Validação de Campos Obrigatórios
    client_name = str(payload.get("client_name", "")).strip()
    if len(client_name) < 2:
        return False, "INVALID_FIELDS", "Field 'client_name' is required (minimum 2 characters)."

    client_email = str(payload.get("client_email", "")).strip()
    if not EMAIL_REGEX.match(client_email):
        return False, "INVALID_FIELDS", "Field 'client_email' must be a valid email address."

    location = str(payload.get("location", "")).strip()
    if len(location) < 2:
        return False, "INVALID_FIELDS", "Field 'location' is required (minimum 2 characters)."

    return True, "", ""


def persist_inquiry(record: Dict[str, Any], file_path: Path = DEFAULT_INQUIRIES_FILE) -> None:
    """Persiste um registo de consulta de forma atómica e durável (append + flush + fsync)."""
    file_path.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(record, ensure_ascii=False) + "\n"
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(serialized)
        f.flush()
        os.fsync(f.fileno())


class InquiryRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP que serve o atelier estático e expõe a API de ingesta de leads."""

    inquiries_file: Path = DEFAULT_INQUIRIES_FILE

    def __init__(self, *args, directory: Optional[str] = None, **kwargs):
        if directory is None:
            directory = str(ROOT_DIR)
        super().__init__(*args, directory=directory, **kwargs)

    def _send_cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With")

    def _send_json_response(self, status_code: int, data: Dict[str, Any]) -> None:
        payload_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload_bytes)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(payload_bytes)

    def do_OPTIONS(self) -> None:
        if self.path.rstrip("/") == "/api/inquiry":
            self.send_response(204)
            self._send_cors_headers()
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self) -> None:
        clean_path = self.path.split("?")[0].rstrip("/")
        if clean_path == "/api/inquiry" or clean_path == "/api/inquiry/health":
            self._send_json_response(
                200,
                {
                    "ok": True,
                    "service": "solrac-lead-ingestion",
                    "status": "operational",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            )
            return

        # Para qualquer outro caminho, servir ficheiros estáticos do portfolio
        super().do_GET()

    def do_POST(self) -> None:
        clean_path = self.path.split("?")[0].rstrip("/")
        if clean_path != "/api/inquiry":
            self._send_json_response(404, {"ok": False, "error": "NOT_FOUND"})
            return

        content_length_header = self.headers.get("Content-Length")
        if not content_length_header:
            self._send_json_response(400, {"ok": False, "error": "MISSING_CONTENT_LENGTH"})
            return

        try:
            content_length = int(content_length_header)
            raw_body = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(raw_body)
            if not isinstance(payload, dict):
                raise ValueError("Payload must be a JSON object")
        except (ValueError, json.JSONDecodeError) as e:
            self._send_json_response(
                400,
                {"ok": False, "error": "INVALID_JSON", "message": f"Malformed JSON payload: {str(e)}"},
            )
            return

        now_ms = time.time() * 1000
        is_valid, error_code, error_msg = validate_inquiry(payload, now_ms=now_ms)
        if not is_valid:
            self._send_json_response(
                400,
                {"ok": False, "error": error_code, "message": error_msg},
            )
            return

        # Determinar referência única
        client_ref = payload.get("dossier_ref")
        dossier_ref = generate_unique_ref(self.inquiries_file, preferred_ref=client_ref)

        created_at = datetime.now(timezone.utc).isoformat()
        client_ip = self.client_address[0] if hasattr(self, "client_address") and self.client_address else "127.0.0.1"
        user_agent = self.headers.get("User-Agent", "unknown")

        try:
            form_loaded_ms = float(payload.get("form_loaded_at", now_ms))
            elapsed_ms = int(now_ms - form_loaded_ms)
        except (ValueError, TypeError):
            elapsed_ms = -1

        record = {
            "ref": dossier_ref,
            "created_at": created_at,
            "client_name": str(payload.get("client_name", "")).strip(),
            "client_role": str(payload.get("client_role", "architect")).strip(),
            "client_email": str(payload.get("client_email", "")).strip(),
            "client_phone": str(payload.get("client_phone", "")).strip(),
            "project_type": str(payload.get("project_type", "General Commission")).strip(),
            "location": str(payload.get("location", "")).strip(),
            "project_notes": str(payload.get("project_notes", "")).strip(),
            "metadata": {
                "source": str(payload.get("source", "web_concierge")),
                "client_ip": client_ip,
                "user_agent": user_agent,
                "elapsed_ms": elapsed_ms,
            },
        }

        try:
            persist_inquiry(record, file_path=self.inquiries_file)
        except Exception as e:
            self._send_json_response(
                500,
                {"ok": False, "error": "PERSISTENCE_FAILURE", "message": f"Failed to persist dossier: {str(e)}"},
            )
            return

        self._send_json_response(
            201,
            {
                "ok": True,
                "ref": dossier_ref,
                "created_at": created_at,
                "status": "ASSIGNED TO TECHNICAL DIRECTOR",
                "message": "Dossier persisted successfully in local transaction log.",
            },
        )


def run_server(port: int = 8080, host: str = "0.0.0.0", inquiries_file: Optional[Path] = None) -> None:
    """Inicia o servidor HTTP em modo multi-thread ou simples."""
    if inquiries_file:
        InquiryRequestHandler.inquiries_file = inquiries_file

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((host, port), InquiryRequestHandler) as httpd:
        print(f"🏛️  SOLRAC Atelier Server online em http://{host}:{port}")
        print(f"📦 Registo de inquiries activo: {InquiryRequestHandler.inquiries_file}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nParagem ordenada do servidor.")


if __name__ == "__main__":
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    host_arg = sys.argv[2] if len(sys.argv) > 2 else "0.0.0.0"
    run_server(port=port_arg, host=host_arg)
