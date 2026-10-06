#!/usr/bin/env bash
set -euo pipefail
[[ $# -eq 0 ]] || { echo 'Uso: sync_local.sh (solo proyecto local)' >&2; exit 2; }
REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"
BRANCH="$(git symbolic-ref --quiet --short HEAD)" || { echo '[sync] HEAD separado: selecciona una rama local.' >&2; exit 1; }
if ! git remote | grep -qx origin; then
    echo '[sync] Repositorio local sin origin.'
    git status --short
    exit 0
fi
echo "[sync] $REPO: origin/$BRANCH (solo avance directo)"
git pull --ff-only origin "$BRANCH"
git status --short
