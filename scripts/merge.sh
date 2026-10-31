#!/usr/bin/env bash
# merge.sh — Full merge cycle: stage → commit → pre-push gates → push
# Sujeto al estándar universal de merge RMAS (patrón Astra / INFRA-MERGE-RAPIDO)
# Uso: bash scripts/merge.sh "mensaje descriptivo"

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$REPO/scripts:$PATH"
MSG="${1:-}"
[[ $# -le 1 ]] || { echo "Argumentos inválidos; merge local no admite alcance implícito." >&2; exit 2; }

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
WORKTREE_MODE=0
if [[ "$BRANCH" != "master" && "$BRANCH" != "main" ]]; then
    COMMON_DIR="$(cd "$(git rev-parse --git-common-dir)" && pwd)"
    [[ "$(git rev-parse --absolute-git-dir)" != "$COMMON_DIR" ]] \
        || die "Estás en '$BRANCH', no en master/main. Cambia a master/main primero."
    WORKTREE_MODE=1
fi

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

# ── Modo worktree (NOE-MERGE-WORKTREE-20261018, portado de Noesis) ───────────
# Desde la rama de un worktree se publica la rama, no el checkout principal: este
# puede tener trabajo sin commitear de otras sesiones, que no debe acabar en el
# commit ni bloquear el merge. Se integra origin/$TARGET ($TARGET local si no hay
# origin) en la rama, los gates y el staging actúan sobre este worktree y se
# publica HEAD en $TARGET. El checkout principal solo avanza por fast-forward; si
# sus cambios lo impiden, avisa.
if [[ $WORKTREE_MODE -eq 1 ]]; then
    MAIN="$(dirname "$COMMON_DIR")"
    # El intérprete local (.venv, fuera de git) solo vive en el principal: los gates de
    # este worktree lo usan enlazado entrada a entrada. Su .gitignore («*», como el que
    # escribe venv) se crea y no se enlaza: git no lee un .gitignore que sea symlink.
    if [[ -d "$MAIN/.venv" && ! -e "$REPO/.venv" ]]; then
        { mkdir "$REPO/.venv" && printf '*\n' > "$REPO/.venv/.gitignore" \
            && find "$MAIN/.venv" -mindepth 1 -maxdepth 1 ! -name .gitignore -exec ln -s {} "$REPO/.venv/" \; ; } \
            || die "No se pudo enlazar .venv desde $MAIN."
    fi
    TARGET="$(git -C "$MAIN" rev-parse --abbrev-ref HEAD)"
    [[ "$TARGET" == "master" || "$TARGET" == "main" ]] || TARGET="master"
    if git remote | grep -q "^origin$"; then
        UPSTREAM="origin/$TARGET"
        run_step "Actualizar referencia remota" git fetch origin "$TARGET"
    else
        UPSTREAM="$TARGET"
    fi
    if ! git merge-base --is-ancestor "$UPSTREAM" HEAD; then
        git merge -q --no-edit "$UPSTREAM" || {
            git merge --abort 2>/dev/null || true
            die "No se pudo integrar $UPSTREAM en '$BRANCH' (conflicto o cambios sin commitear en los mismos ficheros): resuélvelo en la rama y relanza."
        }
        ok "$UPSTREAM integrado en '$BRANCH'."
    fi
    ok "Modo worktree: '$BRANCH' → $TARGET, sin tocar el árbol de $MAIN."
    BRANCH="$TARGET"
fi

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
    # Solo atrasado respecto a origin: fast-forward (git lo rechaza si hay commits locales
    # divergentes o cambios sin commitear en ficheros que llegan); antes abortaba el merge.
    if ! git merge-base --is-ancestor "$REMOTE_REF" HEAD; then
        git merge --ff-only -q "$REMOTE_REF" \
            || die "$REMOTE_REF avanzó y no admite fast-forward (commits locales o cambios sin commitear en los mismos ficheros): integra con git pull --rebase origin $REMOTE_BRANCH y relanza."
        ok "Fast-forward a $REMOTE_REF; los cambios sin commitear siguen intactos."
    fi
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

# ── Poda (NOE-PODA-RAMAS-20261014) ────────────────────────────────────────────
# Cerrojo mecánico de "trabajo terminado = merge y poda". Solo tras un push con
# éxito: retira worktrees fusionados y limpios, y borra ramas fusionadas locales y
# remotas. Nunca toca worktrees sucios, bloqueados o recién creados (punta igual a
# la de origin antes del push), ni ramas sin fusionar. Un fallo sale con die().
# Los worktrees de Claude Desktop (<checkout principal>/.claude/worktrees/) son de la
# app: retirarlos deja a la sesión viva sin entorno (NOE-BUG-MERGE-PODA-CCD-20261015).
podar() {
    local exclusiva="${NOESIS_PODA_RAMA:-}"
    local fresh="$1" path="" head="" branch="" locked=0 line wt_branch app_dir
    local -a wt_paths=() wt_branches=() wt_heads=() wt_locked=() protegidas=("master" "main")
    local -a podados=()

    run_step "Podar referencias remotas" git fetch --prune origin
    if [[ -z "$exclusiva" ]]; then
        git worktree prune || die "git worktree prune falló."
    else
        git check-ref-format "refs/heads/$exclusiva" || die "NOESIS_PODA_RAMA inválida."
    fi

    while IFS= read -r line; do
        case "$line" in
            "worktree "*) path="${line#worktree }" ;;
            "HEAD "*) head="${line#HEAD }" ;;
            "branch refs/heads/"*) branch="${line#branch refs/heads/}" ;;
            locked|"locked "*) locked=1 ;;
            "")
                if [[ -n "$path" ]]; then
                    wt_paths+=("$path"); wt_heads+=("$head"); wt_branches+=("$branch"); wt_locked+=("$locked")
                fi
                path="" head="" branch="" locked=0
                ;;
        esac
    done < <(git worktree list --porcelain; echo)

    local i
    app_dir="${wt_paths[0]}/.claude/worktrees/"
    for i in "${!wt_paths[@]}"; do
        path="${wt_paths[$i]}" wt_branch="${wt_branches[$i]}"
        [[ -n "$wt_branch" ]] || continue
        if [[ -n "$exclusiva" && "$wt_branch" != "$exclusiva" ]]; then
            protegidas+=("$wt_branch")
            continue
        fi
        if [[ $i -eq 0 || "$path" -ef "$REPO" || "${wt_locked[$i]}" -eq 1 || "${wt_heads[$i]}" == "$fresh" \
            || "$path/" == "$app_dir"* ]] \
            || ! git merge-base --is-ancestor "refs/heads/$wt_branch" "$BRANCH"; then
            protegidas+=("$wt_branch")
            continue
        fi
        line="$(git -C "$path" status --porcelain)" || die "No se pudo leer el estado del worktree $path."
        if [[ -n "$line" ]]; then
            protegidas+=("$wt_branch")
            continue
        fi
        git worktree remove "$path" || die "No se pudo retirar el worktree $path."
        podados+=("worktree $path")
    done

    while IFS= read -r branch; do
        [[ -n "$branch" ]] || continue
        [[ -z "$exclusiva" || "$branch" == "$exclusiva" ]] || continue
        printf '%s\n' "${protegidas[@]}" | grep -qxF -- "$branch" && continue
        git branch -d -- "$branch" >/dev/null || die "No se pudo borrar la rama local $branch."
        podados+=("rama local $branch")
    done < <(git for-each-ref --merged "$BRANCH" --format='%(refname:short)' refs/heads/)

    local -a remotas=()
    while IFS= read -r branch; do
        [[ -n "$branch" && "$branch" != "HEAD" ]] || continue
        [[ -z "$exclusiva" || "$branch" == "$exclusiva" ]] || continue
        printf '%s\n' "${protegidas[@]}" | grep -qxF -- "$branch" && continue
        remotas+=("$branch")
    done < <(git for-each-ref --merged "$REMOTE_REF" --format='%(refname:lstrip=3)' refs/remotes/origin/)
    if [[ ${#remotas[@]} -gt 0 ]]; then
        run_step "Borrar ramas remotas fusionadas" git push origin --delete "${remotas[@]}"
        for branch in "${remotas[@]}"; do podados+=("rama remota origin/$branch"); done
    fi

    if [[ ${#podados[@]} -eq 0 ]]; then
        ok "Poda: nada que podar."
    else
        ok "Poda completada (${#podados[@]}):"
        printf '  - %s\n' "${podados[@]}"
    fi
}

# Modo worktree: la rama local $BRANCH sigue a lo publicado sin tocar el árbol ajeno.
# Si está en checkout en $MAIN, fast-forward allí (git lo rechaza solo si los cambios
# sin commitear chocan con ficheros publicados); si no, se mueve la referencia.
sincronizar_local() {
    local tip prev
    tip="$(git rev-parse HEAD)"
    prev="$(git rev-parse --verify -q "refs/heads/$BRANCH" || true)"
    if [[ -n "$prev" ]] && ! git merge-base --is-ancestor "$prev" "$tip"; then
        warn "$BRANCH local (${prev:0:8}) diverge de lo publicado: no se mueve."
    elif [[ "$(git -C "$MAIN" rev-parse --abbrev-ref HEAD)" == "$BRANCH" ]]; then
        if git -C "$MAIN" merge --ff-only -q "$tip"; then
            ok "$BRANCH en $MAIN: ${prev:0:8} → ${tip:0:8}; sus cambios sin commitear siguen intactos."
        else
            warn "$BRANCH en $MAIN no avanza: cambios sin commitear chocan con lo publicado (origin ya tiene ${tip:0:8})."
        fi
    else
        git update-ref "refs/heads/$BRANCH" "$tip" ${prev:+"$prev"} || die "No se pudo mover $BRANCH local a ${tip:0:8}."
        ok "$BRANCH local: ${prev:0:8} → ${tip:0:8}."
    fi
}

# ── Push ──────────────────────────────────────────────────────────────────────
if git remote | grep -q "^origin$"; then
    FRESH_TIP="$(git rev-parse --verify -q "$REMOTE_REF" || true)"
    echo ""
    echo -e "${BOLD}[merge] Push a origin/$REMOTE_BRANCH...${RESET}"
    run_step "Push" git push origin "HEAD:$REMOTE_BRANCH"
    ok "Merge y push completados en origin/$REMOTE_BRANCH."
    if [[ $WORKTREE_MODE -eq 1 ]]; then
        sincronizar_local
    fi
    podar "$FRESH_TIP"
fi

ok "Ciclo completo: ${SECONDS} s."
