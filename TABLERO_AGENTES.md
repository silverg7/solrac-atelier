<!-- noesis:cabecera v1 — no editar a mano; la regenera `python ../noesis/mando.py alinear-flota --fix` -->
# TABLERO DE AGENTES — SOLRAC-ATELIER
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. · Gobernanza Noesis · RMAS: 6 columnas, `PENDIENTE` 🕓 / `CERRADO` ✅
<!-- noesis:cabecera:fin -->

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-10** | Producto / Entrega Cliente | **[P3] Manual de entrega a Carlos y CLI de gestión de leads (Zero-Dep).** Routing: Luna (Tier-B) [effort: low]. Redactar `docs/MANUAL_CLIENTE_CARLOS.md` en Português canónico elegante y directo (instrucciones paso a paso para Carlos sobre cómo consultar solicitudes y fotos recibidas, responder presupuestos en <24h por WhatsApp/Email, desplegar en Cloudflare/servidor propio y actualizar imágenes de proyectos sin tocar CSS); y desarrollar script CLI `scripts/leads.py` en Python stdlib para consultar, filtrar y exportar leads de `data/inquiries.jsonl` en CSV/JSON con marcas de seguimiento y visualización de fotos. | 🕓 **PENDIENTE** | Manual `docs/MANUAL_CLIENTE_CARLOS.md` completo, formateado con claridad y sin jerga innecesaria de desarrollo; herramienta `scripts/leads.py` funcional mediante CLI (`--list`, `--export-csv`, `--export-json`, `--mark-contacted`, `--show-photos`) usando únicamente librerías estándar de Python; `scripts/test_leads_cli.py` añadido verificando todas las opciones de la CLI; `make check` verde. | Dependencias pip externas en `scripts/leads.py`, manual incompleto o confuso para el cliente final, corrupción de datos en exportaciones de leads, o fallo en `make check`. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-04** | Infra / Merge | `make merge` desde un worktree de sesión (port de Noesis NOE-MERGE-WORKTREE-20261018): integra el destino en la rama, gates y staging en el worktree, publica HEAD y el checkout principal solo avanza por fast-forward si su trabajo sin commitear no choca (si choca, aviso). `scripts/test_merge_worktree.py` (en `make check`) con git real. | 2026-10-18 | Claude Opus 5.5 |
| **SOL-00** | Génesis | Creación de plataforma web inicial de alto patrón en HTML/CSS/JS | 2026-08-15 | Emanuel |
