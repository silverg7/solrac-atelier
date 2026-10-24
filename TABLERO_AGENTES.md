<!-- noesis:cabecera v1 — no editar a mano; la regenera `python ../noesis/mando.py alinear-flota --fix` -->
# TABLERO DE AGENTES — SOLRAC-ATELIER
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. · Gobernanza Noesis · RMAS: 6 columnas, `PENDIENTE` 🕓 / `CERRADO` ✅
<!-- noesis:cabecera:fin -->

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-10** | Frontend / UX Visual | **[P1] Cromatismo Tectónico: Transición B/N a color natural en hover de obras y hero.** Routing: Sol (Tier-S) [effort: medium]. Eliminar el forzado permanente de `grayscale(100%)` en hover dentro de `css/style.css`; configurar una transición CSS fluida (`--ease-tectonic`, 0.6s) que revele la textura, calidez y cromatismo natural del granito/piedra (`filter: grayscale(0%) contrast(100%)`) al posar el cursor sobre `.project-card`, `.hero-visual-frame` y miniaturas de galería, manteniendo la serenidad monocromática técnica en reposo; y añadir pruebas de renderizado en `scripts/test_visual_chroma.py`. | 🕓 **PENDIENTE** | En reposo las imágenes preservan la estética monocromática técnica (`grayscale(100%)`); en estado `:hover` la imagen del proyecto transiciona a color real (`grayscale(0%)`); sin saltos de layout shift (CLS=0); `scripts/test_visual_chroma.py` creado y verificando las reglas CSS y el estado computado en Chromium headless; `make check` verde. | Persistencia de fotos en B/N al hacer hover, rotura de contraste, parpadeos de transición, o fallo en `make check`. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-04** | Infra / Merge | `make merge` desde un worktree de sesión (port de Noesis NOE-MERGE-WORKTREE-20261018): integra el destino en la rama, gates y staging en el worktree, publica HEAD y el checkout principal solo avanza por fast-forward si su trabajo sin commitear no choca (si choca, aviso). `scripts/test_merge_worktree.py` (en `make check`) con git real. | 2026-10-18 | Claude Opus 5.5 |
| **SOL-00** | Génesis | Creación de plataforma web inicial de alto patrón en HTML/CSS/JS | 2026-08-15 | Emanuel |
