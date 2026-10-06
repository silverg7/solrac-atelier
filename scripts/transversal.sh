#!/usr/bin/env bash
set -euo pipefail
case "${1:-}" in
    sync) [[ $# -eq 1 ]] || exit 2 ;;
    merge) [[ $# -eq 2 && -n "${2//[[:space:]]/}" ]] || { echo 'Uso: make merge transversal MSG="..."' >&2; exit 2; } ;;
    *) echo 'Uso: transversal.sh sync | merge "mensaje"' >&2; exit 2 ;;
esac
REPO="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$REPO/scripts:$PATH"
COMMON="$(git -C "$REPO" rev-parse --path-format=absolute --git-common-dir)"
[[ "$(basename "$COMMON")" == '.git' ]] || { echo '[transversal] Raíz Git no reconocida.' >&2; exit 2; }
NOESIS="$(dirname "$(dirname "$COMMON")")/noesis"
[[ -f "$NOESIS/mando.py" ]] || { echo '[transversal] Falta el coordinador Noesis.' >&2; exit 2; }
if [[ "$1" == sync ]]; then
    exec "$NOESIS/scripts/python3" "$NOESIS/mando.py" sync transversal
fi
exec "$NOESIS/scripts/python3" "$NOESIS/mando.py" merge transversal --message "$2"
