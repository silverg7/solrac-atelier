#!/usr/bin/env python3
"""Gera o dossier de entrega em PDF usando Chromium headless."""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "docs" / "dossier_cliente_carlos.html"
PDF = ROOT / "docs" / "DOSSIER_CLIENTE_CARLOS.pdf"


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", help="caminho para Chromium/Chrome (ou variável CHROME_BIN)")
    parser.add_argument("--output", type=Path, default=PDF, help="destino do PDF")
    args = parser.parse_args(argv)
    browser = args.browser or __import__("os").environ.get("CHROME_BIN")
    if not browser:
        browser = next((shutil.which(name) for name in
                        ("chromium", "chromium-browser", "google-chrome", "google-chrome-stable", "chrome")
                        if shutil.which(name)), None)
    if not browser:
        parser.error("Chromium/Chrome não encontrado; instale-o ou indique --browser/CHROME_BIN")
    if not HTML.is_file():
        parser.error(f"modelo HTML não encontrado: {HTML}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    command = [browser, "--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
               "--no-pdf-header-footer", f"--print-to-pdf={args.output.resolve()}", HTML.resolve().as_uri()]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode or not args.output.is_file() or args.output.stat().st_size < 1000:
        print(result.stderr.strip() or "Chromium não conseguiu criar um PDF válido.", file=sys.stderr)
        return result.returncode or 1
    print(f"PDF criado: {args.output.resolve()} ({args.output.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
