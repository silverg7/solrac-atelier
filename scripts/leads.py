#!/usr/bin/env python3
"""Consulta e exportação local dos pedidos recebidos pelo Concierge."""

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INQUIRIES = ROOT / "data" / "inquiries.jsonl"
CSV_FIELDS = (
    "ref", "created_at", "client_name", "client_role", "client_email",
    "client_phone", "project_type", "location", "project_notes",
)


def load_leads(path):
    leads = []
    if not path.exists():
        return leads
    with path.open(encoding="utf-8") as source:
        for line_number, line in enumerate(source, start=1):
            if not line.strip():
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{line_number}: JSON inválido: {exc.msg}") from exc
            if not isinstance(item, dict):
                raise ValueError(f"{path}:{line_number}: cada registo deve ser um objeto JSON")
            leads.append(item)
    return leads


def _text(value):
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False)
    return "" if value is None else str(value)


def list_leads(leads):
    if not leads:
        print("Sem pedidos registados.")
        return
    for lead in leads:
        print(" | ".join(_text(lead.get(key)) or "—" for key in
                          ("ref", "created_at", "client_name", "client_email", "project_type", "location")))


def show_photos(leads, base_dir=ROOT):
    found = False
    for lead in leads:
        photos = lead.get("photos") or []
        if not isinstance(photos, list) or not photos:
            continue
        found = True
        print(f"{_text(lead.get('ref')) or 'Sem referência'}:")
        for photo in photos:
            if isinstance(photo, dict):
                rel_path = photo.get("rel_path", "")
                label = photo.get("original_name") or photo.get("filename") or rel_path
            else:
                rel_path, label = str(photo), str(photo)
            candidate = (base_dir / rel_path).resolve()
            if not candidate.is_relative_to(base_dir.resolve()):
                print(f"  [caminho inválido] {label}")
            elif candidate.is_file():
                print(f"  {label}: {candidate}")
            else:
                print(f"  [ficheiro em falta] {label} ({rel_path})")
    if not found:
        print("Não há fotografias associadas aos pedidos registados.")


def build_parser():
    parser = argparse.ArgumentParser(description="Lista e exporta pedidos do Concierge.")
    parser.add_argument("--file", type=Path, default=DEFAULT_INQUIRIES,
                        help=f"ficheiro JSONL (predefinição: {DEFAULT_INQUIRIES})")
    actions = parser.add_mutually_exclusive_group(required=True)
    actions.add_argument("--list", action="store_true", help="listar pedidos")
    actions.add_argument("--export-csv", metavar="FICHEIRO", type=Path, help="exportar pedidos para CSV")
    actions.add_argument("--export-json", metavar="FICHEIRO", type=Path, help="exportar pedidos para JSON")
    actions.add_argument("--show-photos", action="store_true", help="mostrar fotografias de cada pedido")
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    try:
        leads = load_leads(args.file)
        if args.list:
            list_leads(leads)
        elif args.show_photos:
            show_photos(leads, args.file.resolve().parent)
        elif args.export_json:
            args.export_json.parent.mkdir(parents=True, exist_ok=True)
            args.export_json.write_text(json.dumps(leads, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"{len(leads)} pedidos exportados para {args.export_json}")
        else:
            args.export_csv.parent.mkdir(parents=True, exist_ok=True)
            with args.export_csv.open("w", encoding="utf-8-sig", newline="") as target:
                writer = csv.DictWriter(target, fieldnames=CSV_FIELDS, extrasaction="ignore")
                writer.writeheader()
                writer.writerows({key: _text(lead.get(key)) for key in CSV_FIELDS} for lead in leads)
            print(f"{len(leads)} pedidos exportados para {args.export_csv}")
    except (OSError, ValueError) as exc:
        print(f"Erro: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
