#!/usr/bin/env python3
"""SOL-05 / SOL-08: Serviço de ingesta de leads, persistência transaccional e quota de fotos.

Endpoint /api/inquiry para intake de dossiers técnicos de comissão.
Inclui:
- Servidor HTTP estático + API REST transaccional (multi-thread com lock exclusivo)
- Limite fail-closed de tamanho de payload HTTP, texto e fotografias
- Validação anti-spam (honeypot website_trap + limiar temporal mínimo)
- Validação de campos técnicos e assinaturas binárias (magic bytes JPEG/PNG/WebP)
- Geração de referências únicas de dossier (SOL-YYYY-XXXX)
- Persistência atómica de fotografias em data/photos/<REF>/ e registo durável em data/inquiries.jsonl (fsync)
"""

import base64
import binascii
import fcntl
import hashlib
import http.server
import json
import os
import re
import shutil
import socketserver
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
DEFAULT_INQUIRIES_FILE = DATA_DIR / "inquiries.jsonl"

# Caracteres canónicos não ambíguos para referência de dossier (exclui 0/O, 1/I)
REF_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
REF_REGEX = re.compile(r"^SOL-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$")
SAFE_REF_DIR_REGEX = re.compile(r"^SOL-\d{4}-[A-Z0-9]{4}$")
DATA_URI_REGEX = re.compile(r"^data:([a-zA-Z0-9.+/-]+);base64,([A-Za-z0-9+/=\s]+)$", re.DOTALL)

# Limiares de protecção temporal
MIN_SUBMISSION_TIME_MS = 1500  # 1.5 segundos mínimos para preenchimento humano
MAX_SUBMISSION_TIME_MS = 86400000  # 24 horas máximo de validade do formulário em cache
MAX_FUTURE_SKEW_MS = 5000  # Tolerância de 5 segundos para dessincronia de relógio

# Quotas fail-closed de carga útil, texto e fotografias (SOL-08)
MAX_REQUEST_BODY_BYTES = 2_621_440  # 2.5 MiB limite estrito de corpo HTTP bruto
MAX_PHOTOS_COUNT = 4  # Máximo 4 fotografias por dossier
MAX_SINGLE_PHOTO_BYTES = 512 * 1024  # 512 KiB por fotografia comprimida descodificada
MAX_TOTAL_PHOTOS_BYTES = 1600 * 1024  # 1600 KiB quota agregada de fotografias por dossier
MAX_SHORT_FIELD_LENGTH = 320
MAX_NOTES_LENGTH = 8000

ALLOWED_PHOTO_MIMES: Dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


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
                    if isinstance(data, dict) and "ref" in data:
                        refs.add(data["ref"])
                except json.JSONDecodeError:
                    continue
    except OSError:
        pass
    return refs


def generate_unique_ref(file_path: Path, preferred_ref: Optional[str] = None) -> str:
    """Gera uma referência única garantida contra colisões no log transaccional."""
    existing = get_existing_refs(file_path)
    if (
        isinstance(preferred_ref, str)
        and REF_REGEX.match(preferred_ref)
        and preferred_ref not in existing
    ):
        return preferred_ref

    for _ in range(100):
        candidate = generate_dossier_ref()
        if candidate not in existing:
            return candidate

    # Fallback determinista com caracteres canónicos derivados de nanossegundos
    ns_val = time.time_ns()
    fallback_code = "".join(REF_CHARS[(ns_val >> (i * 5)) % len(REF_CHARS)] for i in range(4))
    return f"SOL-{datetime.now(timezone.utc).year}-{fallback_code}"


def _verify_photo_signature(mime_type: str, data: bytes) -> bool:
    """Valida a assinatura binária (magic bytes) contra o MIME declarado."""
    if mime_type == "image/jpeg":
        return len(data) >= 4 and data[:3] == b"\xff\xd8\xff"
    if mime_type == "image/png":
        return len(data) >= 16 and data[:8] == b"\x89PNG\r\n\x1a\n"
    if mime_type == "image/webp":
        return len(data) >= 16 and data[:4] == b"RIFF" and data[8:12] == b"WEBP"
    return False


def _sanitize_original_name(raw_name: Any, fallback: str) -> str:
    """Normaliza o nome original do ficheiro impedindo caracteres de controlo e path traversal."""
    if not isinstance(raw_name, str) or not raw_name.strip():
        return fallback
    cleaned = raw_name.replace("\\", "/").split("/")[-1].strip()
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", cleaned)
    cleaned = cleaned.lstrip(".")
    if not cleaned:
        return fallback
    return cleaned[:80]


def validate_and_decode_photos(
    photos_raw: Any,
) -> Tuple[bool, int, str, str, List[Dict[str, Any]]]:
    """Valida e descodifica a lista opcional de fotografias em modo estritamente fail-closed.

    Retorna: (is_valid, http_status, error_code, error_message, decoded_photos)
    """
    if photos_raw is None:
        return True, 200, "", "", []

    if not isinstance(photos_raw, list):
        return (
            False,
            400,
            "INVALID_PHOTOS_PAYLOAD",
            "Field 'photos' must be a JSON array.",
            [],
        )

    if len(photos_raw) > MAX_PHOTOS_COUNT:
        return (
            False,
            400,
            "PHOTO_COUNT_EXCEEDED",
            f"Maximum {MAX_PHOTOS_COUNT} photographs allowed per dossier (received {len(photos_raw)}).",
            [],
        )

    max_b64_len = ((MAX_SINGLE_PHOTO_BYTES + 2) // 3) * 4 + 64
    total_bytes = 0
    decoded_list: List[Dict[str, Any]] = []

    for idx, entry in enumerate(photos_raw, start=1):
        declared_mime: Optional[str] = None
        raw_data_str: Optional[str] = None
        orig_name_raw: Any = None

        if isinstance(entry, str):
            raw_data_str = entry.strip()
        elif isinstance(entry, dict):
            if "mime_type" in entry and entry["mime_type"] is not None:
                if not isinstance(entry["mime_type"], str):
                    return (
                        False,
                        400,
                        "INVALID_PHOTOS_PAYLOAD",
                        f"Photo #{idx} field 'mime_type' must be a string.",
                        [],
                    )
                declared_mime = entry["mime_type"].strip().lower()
            data_field = entry.get("data")
            if not isinstance(data_field, str):
                return (
                    False,
                    400,
                    "INVALID_PHOTOS_PAYLOAD",
                    f"Photo #{idx} missing string 'data' payload.",
                    [],
                )
            raw_data_str = data_field.strip()
            orig_name_raw = entry.get("name")
        else:
            return (
                False,
                400,
                "INVALID_PHOTOS_PAYLOAD",
                f"Photo #{idx} must be an object or Data URI string.",
                [],
            )

        if raw_data_str.startswith("data:"):
            match = DATA_URI_REGEX.match(raw_data_str)
            if not match:
                return (
                    False,
                    400,
                    "CORRUPT_PHOTO_DATA",
                    f"Photo #{idx} has a malformed Data URI header.",
                    [],
                )
            uri_mime = match.group(1).strip().lower()
            if declared_mime and declared_mime != uri_mime:
                return (
                    False,
                    400,
                    "MISMATCHED_PHOTO_MIME",
                    f"Photo #{idx} declared MIME '{declared_mime}' conflicts with Data URI '{uri_mime}'.",
                    [],
                )
            declared_mime = uri_mime
            b64_payload = re.sub(r"\s+", "", match.group(2))
        else:
            b64_payload = re.sub(r"\s+", "", raw_data_str)

        if not declared_mime or declared_mime not in ALLOWED_PHOTO_MIMES:
            return (
                False,
                400,
                "UNSUPPORTED_PHOTO_FORMAT",
                f"Photo #{idx} format '{declared_mime or 'unknown'}' is not allowed (accepted: JPEG, PNG, WebP).",
                [],
            )

        if not b64_payload:
            return (
                False,
                400,
                "CORRUPT_PHOTO_DATA",
                f"Photo #{idx} contains empty image data.",
                [],
            )

        if len(b64_payload) > max_b64_len:
            return (
                False,
                413,
                "PHOTO_SIZE_EXCEEDED",
                f"Photo #{idx} exceeds single-photo quota ({MAX_SINGLE_PHOTO_BYTES} bytes).",
                [],
            )

        try:
            binary_data = base64.b64decode(b64_payload, validate=True)
        except (binascii.Error, ValueError):
            return (
                False,
                400,
                "CORRUPT_PHOTO_DATA",
                f"Photo #{idx} contains invalid Base64 encoding.",
                [],
            )

        size_bytes = len(binary_data)
        if size_bytes == 0:
            return (
                False,
                400,
                "CORRUPT_PHOTO_DATA",
                f"Photo #{idx} decoded to 0 bytes.",
                [],
            )

        if size_bytes > MAX_SINGLE_PHOTO_BYTES:
            return (
                False,
                413,
                "PHOTO_SIZE_EXCEEDED",
                f"Photo #{idx} size ({size_bytes} bytes) exceeds maximum {MAX_SINGLE_PHOTO_BYTES} bytes.",
                [],
            )

        total_bytes += size_bytes
        if total_bytes > MAX_TOTAL_PHOTOS_BYTES:
            return (
                False,
                413,
                "TOTAL_PHOTO_QUOTA_EXCEEDED",
                f"Total photo payload ({total_bytes} bytes) exceeds dossier quota ({MAX_TOTAL_PHOTOS_BYTES} bytes).",
                [],
            )

        if not _verify_photo_signature(declared_mime, binary_data):
            return (
                False,
                400,
                "INVALID_PHOTO_SIGNATURE",
                f"Photo #{idx} binary header does not match declared MIME '{declared_mime}'.",
                [],
            )

        ext = ALLOWED_PHOTO_MIMES[declared_mime]
        safe_orig = _sanitize_original_name(orig_name_raw, f"photo-{idx:02d}{ext}")
        sha256_hex = hashlib.sha256(binary_data).hexdigest()

        decoded_list.append(
            {
                "index": idx,
                "ext": ext,
                "mime_type": declared_mime,
                "original_name": safe_orig,
                "size_bytes": size_bytes,
                "sha256": sha256_hex,
                "bytes": binary_data,
            }
        )

    return True, 200, "", "", decoded_list


def validate_inquiry(payload: Dict[str, Any], now_ms: Optional[float] = None) -> Tuple[bool, str, str]:
    """Valida o payload de consulta técnica contra spam, limites de campo e campos obrigatórios.

    Retorna: (is_valid, error_code, error_message)
    """
    if not isinstance(payload, dict):
        return False, "INVALID_JSON", "Payload must be a JSON object."

    if now_ms is None:
        now_ms = time.time() * 1000

    # 1. Protecção Anti-Spam: Honeypot trap
    website_trap = str(payload.get("website_trap", "")).strip()
    if website_trap:
        return False, "SPAM_HONEYPOT_TRIGGERED", "Honeypot field detected non-empty submission."

    # 2. Protecção Anti-Spam: Validação Temporal
    form_loaded_at = payload.get("form_loaded_at")
    if form_loaded_at is None or isinstance(form_loaded_at, bool):
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Missing form initialization timestamp."

    try:
        form_loaded_ms = float(form_loaded_at)
        # Se timestamp em segundos em vez de ms, converter
        if 0 < form_loaded_ms < 10000000000:
            form_loaded_ms *= 1000
    except (ValueError, TypeError):
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Invalid form timestamp format."

    elapsed_ms = now_ms - form_loaded_ms
    if elapsed_ms < -MAX_FUTURE_SKEW_MS:
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Form timestamp is in the future."

    if elapsed_ms < MIN_SUBMISSION_TIME_MS:
        return (
            False,
            "SPAM_TEMPORAL_THRESHOLD_VIOLATED",
            f"Submission completed in {elapsed_ms:.0f}ms (minimum required {MIN_SUBMISSION_TIME_MS}ms).",
        )

    if elapsed_ms > MAX_SUBMISSION_TIME_MS:
        return False, "SPAM_TEMPORAL_THRESHOLD_VIOLATED", "Form session expired (>24h). Please reload page."

    # 3. Validação de Campos Obrigatórios e Limites de Comprimento
    client_name = str(payload.get("client_name", "")).strip()
    if len(client_name) < 2:
        return False, "INVALID_FIELDS", "Field 'client_name' is required (minimum 2 characters)."
    if len(client_name) > MAX_SHORT_FIELD_LENGTH:
        return False, "FIELD_QUOTA_EXCEEDED", "Field 'client_name' exceeds maximum length."

    client_email = str(payload.get("client_email", "")).strip()
    if len(client_email) > MAX_SHORT_FIELD_LENGTH or not EMAIL_REGEX.match(client_email):
        return False, "INVALID_FIELDS", "Field 'client_email' must be a valid email address."

    location = str(payload.get("location", "")).strip()
    if len(location) < 2:
        return False, "INVALID_FIELDS", "Field 'location' is required (minimum 2 characters)."
    if len(location) > MAX_SHORT_FIELD_LENGTH:
        return False, "FIELD_QUOTA_EXCEEDED", "Field 'location' exceeds maximum length."

    client_phone = str(payload.get("client_phone", "")).strip()
    if len(client_phone) > MAX_SHORT_FIELD_LENGTH:
        return False, "FIELD_QUOTA_EXCEEDED", "Field 'client_phone' exceeds maximum length."

    project_notes = str(payload.get("project_notes", "")).strip()
    if len(project_notes) > MAX_NOTES_LENGTH:
        return False, "FIELD_QUOTA_EXCEEDED", f"Field 'project_notes' exceeds {MAX_NOTES_LENGTH} characters."

    return True, "", ""


def _fsync_directory(dir_path: Path) -> None:
    """Sincroniza metadados de directório no sistema de ficheiros quando suportado."""
    try:
        dir_fd = os.open(str(dir_path), os.O_RDONLY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except OSError:
        pass


def persist_photos(
    dossier_ref: str,
    decoded_photos: List[Dict[str, Any]],
    base_dir: Path,
) -> List[Dict[str, Any]]:
    """Persiste fotografias validadas de forma atómica em <base_dir>/photos/<dossier_ref>/."""
    if not decoded_photos:
        return []

    if not SAFE_REF_DIR_REGEX.match(dossier_ref):
        raise ValueError(f"Unsafe dossier reference for storage: {dossier_ref}")

    resolved_base = base_dir.resolve()
    photos_root = (resolved_base / "photos").resolve()
    dossier_dir = (photos_root / dossier_ref).resolve()
    if not dossier_dir.is_relative_to(photos_root):
        raise ValueError("Resolved photo directory escapes storage root.")

    dossier_dir.mkdir(parents=True, exist_ok=True)
    persisted_meta: List[Dict[str, Any]] = []

    try:
        for item in decoded_photos:
            idx = int(item["index"])
            ext = str(item["ext"])
            filename = f"{dossier_ref}-{idx:02d}{ext}"
            final_path = (dossier_dir / filename).resolve()
            if not final_path.is_relative_to(dossier_dir):
                raise ValueError("Resolved photo file path escapes dossier directory.")

            tmp_path = dossier_dir / f".tmp-{filename}-{os.getpid()}-{time.time_ns()}"
            with open(tmp_path, "wb") as f:
                f.write(item["bytes"])
                f.flush()
                os.fsync(f.fileno())
            os.replace(tmp_path, final_path)

            persisted_meta.append(
                {
                    "index": idx,
                    "filename": filename,
                    "rel_path": f"photos/{dossier_ref}/{filename}",
                    "original_name": item["original_name"],
                    "mime_type": item["mime_type"],
                    "size_bytes": item["size_bytes"],
                    "sha256": item["sha256"],
                }
            )
        _fsync_directory(dossier_dir)
    except Exception:
        shutil.rmtree(dossier_dir, ignore_errors=True)
        raise

    return persisted_meta


def persist_inquiry(record: Dict[str, Any], file_path: Path = DEFAULT_INQUIRIES_FILE) -> None:
    """Persiste um registo de consulta de forma atómica, isolada por lock exclusivo e durável (fsync)."""
    file_path.parent.mkdir(parents=True, exist_ok=True)
    serialized_line = json.dumps(record, ensure_ascii=False, allow_nan=False)
    if "\n" in serialized_line or "\r" in serialized_line:
        raise ValueError("Serialized JSONL record must not contain raw line breaks.")
    # Auto-verificação de integridade antes de tocar no log transaccional
    json.loads(serialized_line)
    payload_bytes = (serialized_line + "\n").encode("utf-8")

    lock_path = file_path.parent / f".{file_path.name}.lock"
    with open(lock_path, "a+b") as lock_file:
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        try:
            needs_leading_newline = False
            if file_path.exists():
                size = file_path.stat().st_size
                if size > 0:
                    with open(file_path, "rb") as rf:
                        rf.seek(size - 1)
                        needs_leading_newline = rf.read(1) != b"\n"

            with open(file_path, "ab") as f:
                if needs_leading_newline:
                    f.write(b"\n")
                f.write(payload_bytes)
                f.flush()
                os.fsync(f.fileno())
            _fsync_directory(file_path.parent)
        finally:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)


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
                    "quotas": {
                        "max_request_bytes": MAX_REQUEST_BODY_BYTES,
                        "max_photos": MAX_PHOTOS_COUNT,
                        "max_single_photo_bytes": MAX_SINGLE_PHOTO_BYTES,
                        "max_total_photos_bytes": MAX_TOTAL_PHOTOS_BYTES,
                    },
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            )
            return

        # Bloquear acesso público HTTP directo à pasta de dados/leads privados (RGPD fail-closed)
        normalized = os.path.normpath("/" + clean_path.lstrip("/"))
        if normalized == "/data" or normalized.startswith("/data/"):
            self._send_json_response(403, {"ok": False, "error": "FORBIDDEN"})
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
        except ValueError:
            self.close_connection = True
            self._send_json_response(400, {"ok": False, "error": "INVALID_CONTENT_LENGTH"})
            return

        if content_length <= 0:
            self.close_connection = True
            self._send_json_response(400, {"ok": False, "error": "INVALID_CONTENT_LENGTH"})
            return

        if content_length > MAX_REQUEST_BODY_BYTES:
            self.close_connection = True
            self._send_json_response(
                413,
                {
                    "ok": False,
                    "error": "PAYLOAD_TOO_LARGE",
                    "message": f"Request body ({content_length} bytes) exceeds maximum {MAX_REQUEST_BODY_BYTES} bytes.",
                    "max_bytes": MAX_REQUEST_BODY_BYTES,
                },
            )
            return

        try:
            raw_bytes = self.rfile.read(content_length)
            if len(raw_bytes) != content_length:
                raise ValueError("Incomplete HTTP request body")
            raw_body = raw_bytes.decode("utf-8")
            payload = json.loads(raw_body)
            if not isinstance(payload, dict):
                raise ValueError("Payload must be a JSON object")
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError) as e:
            self._send_json_response(
                400,
                {"ok": False, "error": "INVALID_JSON", "message": f"Malformed JSON payload: {str(e)}"},
            )
            return

        now_ms = time.time() * 1000
        is_valid, error_code, error_msg = validate_inquiry(payload, now_ms=now_ms)
        if not is_valid:
            status_code = 413 if error_code == "FIELD_QUOTA_EXCEEDED" else 400
            self._send_json_response(
                status_code,
                {"ok": False, "error": error_code, "message": error_msg},
            )
            return

        photos_ok, photos_status, photos_err, photos_msg, decoded_photos = validate_and_decode_photos(
            payload.get("photos")
        )
        if not photos_ok:
            self._send_json_response(
                photos_status,
                {"ok": False, "error": photos_err, "message": photos_msg},
            )
            return

        # Determinar referência única
        client_ref = payload.get("dossier_ref")
        dossier_ref = generate_unique_ref(self.inquiries_file, preferred_ref=client_ref)

        created_at = datetime.now(timezone.utc).isoformat()
        client_ip = self.client_address[0] if hasattr(self, "client_address") and self.client_address else "127.0.0.1"
        user_agent = self.headers.get("User-Agent", "unknown")[:300]

        try:
            form_loaded_ms = float(payload.get("form_loaded_at", now_ms))
            if 0 < form_loaded_ms < 10000000000:
                form_loaded_ms *= 1000
            elapsed_ms = int(now_ms - form_loaded_ms)
        except (ValueError, TypeError):
            elapsed_ms = -1

        saved_photos: List[Dict[str, Any]] = []
        try:
            saved_photos = persist_photos(
                dossier_ref=dossier_ref,
                decoded_photos=decoded_photos,
                base_dir=self.inquiries_file.parent,
            )
            record = {
                "ref": dossier_ref,
                "created_at": created_at,
                "client_name": str(payload.get("client_name", "")).strip(),
                "client_role": str(payload.get("client_role", "architect")).strip()[:64],
                "client_email": str(payload.get("client_email", "")).strip(),
                "client_phone": str(payload.get("client_phone", "")).strip(),
                "project_type": str(payload.get("project_type", "General Commission")).strip()[:64],
                "location": str(payload.get("location", "")).strip(),
                "project_notes": str(payload.get("project_notes", "")).strip(),
                "photos": saved_photos,
                "metadata": {
                    "source": str(payload.get("source", "web_concierge"))[:64],
                    "client_ip": client_ip,
                    "user_agent": user_agent,
                    "elapsed_ms": elapsed_ms,
                    "photo_count": len(saved_photos),
                    "photo_bytes": sum(p["size_bytes"] for p in saved_photos),
                },
            }
            persist_inquiry(record, file_path=self.inquiries_file)
        except Exception as e:
            if saved_photos:
                shutil.rmtree(self.inquiries_file.parent / "photos" / dossier_ref, ignore_errors=True)
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
                "photos_saved": len(saved_photos),
                "status": "ASSIGNED TO TECHNICAL DIRECTOR",
                "message": "Dossier persisted successfully in local transaction log.",
            },
        )


class ThreadedInquiryServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def run_server(port: int = 8080, host: str = "0.0.0.0", inquiries_file: Optional[Path] = None) -> None:
    """Inicia o servidor HTTP em modo multi-thread com persistência durável."""
    if inquiries_file:
        InquiryRequestHandler.inquiries_file = inquiries_file

    with ThreadedInquiryServer((host, port), InquiryRequestHandler) as httpd:
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
