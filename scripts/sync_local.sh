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
# Rama de un worktree que aún no existe en origin (las de Desktop/Codex): avanza desde la rama
# del checkout principal, como hace merge.sh en modo worktree.
COMMON_DIR="$(cd "$(git rev-parse --git-common-dir)" && pwd)"
if [[ "$(git rev-parse --absolute-git-dir)" != "$COMMON_DIR" ]] \
    && ! git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
    BRANCH="$(git -C "$(dirname "$COMMON_DIR")" rev-parse --abbrev-ref HEAD)"
    [[ "$BRANCH" == "master" || "$BRANCH" == "main" ]] || BRANCH="master"
fi
echo "[sync] $REPO: origin/$BRANCH (solo avance directo)"
git fetch origin "$BRANCH"
if ! git merge --ff-only -q FETCH_HEAD 2>/dev/null; then
    # Divergencia típica: commits locales sin subir que origin ya tiene reaplicados (mapa.py los
    # cherry-pickea sobre origin cuando el push choca). Si el árbol está limpio se reaplican sobre
    # origin; git descarta solos los que ya están. Con conflicto se deja todo como estaba.
    AHEAD="$(git rev-list --count FETCH_HEAD..HEAD)"
    if (( AHEAD > 0 )) && [[ -z "$(git status --porcelain --untracked-files=no)" ]]; then
        echo "[sync] $AHEAD commit(s) locales sin subir: se reaplican sobre origin/$BRANCH."
        if ! git rebase -q FETCH_HEAD; then
            git rebase --abort || true
            echo "[sync] Conflicto al reaplicar; la rama queda como estaba." >&2
            exit 1
        fi
    else
        git merge --ff-only FETCH_HEAD
    fi
fi
git status --short
