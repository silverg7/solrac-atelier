#!/usr/bin/env bash
# merge.sh — Full merge cycle: stage → commit → pre-push gates → push
# Sujeto al estándar universal de merge RMAS (patrón Astra / INFRA-MERGE-RAPIDO)
# Uso: bash scripts/merge.sh "mensaje descriptivo"

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
MSG="${1:-}"

RED='\033[91m'
GREEN='\033[92m'
YELLOW='\033[93m'
BOLD='\033[1m'
RESET='\033[0m'

die() { echo -e "${RED}${BOLD}[merge] $*${RESET}" >&2; exit 1; }
ok()  { echo -e "${GREEN}${BOLD}[merge] $*${RESET}"; }
warn(){ echo -e "${YELLOW}[merge] $*${RESET}"; }

# ── Pre-flight ────────────────────────────────────────────────────────────────
command -v git >/dev/null 2>&1 || die "git no encontrado"

cd "$REPO"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$BRANCH" == "master" || "$BRANCH" == "main" ]] || die "Estás en '$BRANCH', no en master/main. Cambia a master/main primero."

# ── Preflight barato antes de cualquier gate ─────────────────────────────────
SECONDS=0
run_step() {
    local label="$1" start=$SECONDS
    shift
    echo -e "${BOLD}[merge] $label...${RESET}"
    "$@" || die "$label falló tras $((SECONDS - start)) s."
    ok "$label: $((SECONDS - start)) s."
}

# No gastar la suite para descubrir después un índice de solo lectura.
GIT_DIR="$(git rev-parse --absolute-git-dir)"
PROBE="$(mktemp "$GIT_DIR/merge-write-check.XXXXXX")" || die "Git no permite escritura; ejecuta fuera del sandbox antes de lanzar los gates."
rm -f -- "$PROBE"
[[ ! -e "$GIT_DIR/index.lock" ]] || die "Git está ocupado (index.lock); no se elimina el bloqueo."

REMOTE_BRANCH="$BRANCH"
REMOTE_REF="origin/$REMOTE_BRANCH"

if [[ -z "$(git status --porcelain)" ]] && [[ "$(git rev-list --count ${REMOTE_REF}..HEAD 2>/dev/null || echo 0)" == "0" ]]; then
    warn "Sin cambios ni commits pendientes. Nada que hacer."
    exit 0
fi

if [[ -n "$(git status --porcelain)" && -z "${MSG//[[:space:]]/}" ]]; then
    die 'Falta mensaje de commit. Uso: make merge MSG="descripción"'
fi

if git remote | grep -q "^origin$"; then
    run_step "Actualizar referencia remota" git fetch origin "$REMOTE_BRANCH"
    git merge-base --is-ancestor "$REMOTE_REF" HEAD || die "$REMOTE_REF avanzó: integra con git pull --rebase origin $REMOTE_BRANCH antes de ejecutar los gates."
fi

# ── Gates de prueba ───────────────────────────────────────────────────────────
if [[ "${SKIP_TESTS:-0}" == "1" ]]; then
    warn "SKIP_TESTS=1 — suite de pruebas OMITIDA. Declaralo en el mensaje del commit."
else
    if [[ -d "tests" ]]; then
        run_step "Tests" python3 -m pytest tests/ -q
    fi
fi

# ── Stage ─────────────────────────────────────────────────────────────────────
CHANGED="$(git diff --name-only | wc -l)"
STAGED="$(git diff --cached --name-only | wc -l)"
UNTRACKED="$(git ls-files --others --exclude-standard | wc -l)"

if [[ $CHANGED -eq 0 && $STAGED -eq 0 && $UNTRACKED -eq 0 ]]; then
    warn "Sin cambios de archivos; se publicarán los commits pendientes."
else
    echo -e "${BOLD}[merge] Staging cambios...${RESET}"
    echo "  Modificados: $CHANGED archivo(s)"
    echo "  Staged:      $STAGED archivo(s)"
    echo "  Nuevos:      $UNTRACKED archivo(s)"

    git add -u                                   # stage modified + deleted
    if [[ $UNTRACKED -gt 0 ]]; then
        git ls-files -z --others --exclude-standard | xargs -0 -r git add
    fi

    echo -e "${BOLD}[merge] Archivos staged:${RESET}"
    git diff --cached --name-status | sed -n '1,20p'
    if [[ $(git diff --cached --name-only | wc -l) -gt 20 ]]; then
        echo "  ... y $(($(git diff --cached --name-only | wc -l) - 20)) más"
    fi

    # ── Commit ────────────────────────────────────────────────────────────────
    echo ""
    echo -e "${BOLD}[merge] Commit: ${MSG}${RESET}"

    run_step "Commit" git commit -m "$MSG"

    SHA_AFTER="$(git rev-parse HEAD)"
    echo "  Commit: ${SHA_AFTER:0:8}"
fi

# ── Push ──────────────────────────────────────────────────────────────────────
if git remote | grep -q "^origin$"; then
    echo ""
    echo -e "${BOLD}[merge] Push a origin/$REMOTE_BRANCH...${RESET}"
    run_step "Push" git push origin "$REMOTE_BRANCH"
    ok "Merge y push completados en origin/$REMOTE_BRANCH."
fi

ok "Ciclo completo: ${SECONDS} s."
