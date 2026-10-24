<!-- noesis:cabecera v1 — no editar a mano; la regenera `python ../noesis/mando.py alinear-flota --fix` -->
# TABLERO DE AGENTES — SOLRAC-ATELIER
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. · Gobernanza Noesis · RMAS: 6 columnas, `PENDIENTE` 🕓 / `CERRADO` ✅
<!-- noesis:cabecera:fin -->

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-BUG-03** | Auditoría / Frontend y persistencia | **[P1] Corregir fallos reproducidos en la revisión de SOL-08 y del frontend actual:** acceso codificado a datos privados, colisión concurrente de referencias/fotos, recorte responsive, envío durante compresión, confirmación tardía del modal y deriva de traducciones. | 🕓 **PENDIENTE** | Rutas privadas bloqueadas también codificadas y por HEAD; solicitudes concurrentes conservan referencias y fotos propias; interfaz sin recortes entre 320 y 1440 px en PT/EN/ES; envío espera las fotos y conserva su confirmación; traducciones coherentes; regresiones cubiertas y `make check` verde con navegador local. | Exposición de datos, sobrescritura de fotografías, fotos omitidas, confirmación perdida, controles fuera de pantalla o pruebas fallidas. |
| **SOL-09** | Frontend / Performance & SEO | **[P2] Auditoría de rendimiento, PWA y Open Graph (Zero Render Blocking).** Routing: Luna (Tier-B) [effort: low]. Erradicar `@import` bloqueantes en `css/style.css` migrando fuentes a etiquetas `<link rel="preload">` en `index.html`; generar y enlazar paquete de iconos PWA reales en `assets/icons/` (`site.webmanifest`, `favicon.ico`, `apple-touch-icon`, `icon-192`, `icon-512`) con `theme_color` `#070707`; configurar meta-etiquetas Open Graph y Twitter Cards completas con imagen representativa existente; y enriquecer JSON-LD Schema.org de atelier arquitectónico. | 🕓 **PENDIENTE** | `index.html` enlaza CSS sin ningún `@import` bloqueante; todos los assets de iconos y manifest existen físicamente en disco y responden HTTP 200 en `scripts/server.py`; metadatos OG y JSON-LD validados contra especificación Schema.org; `scripts/test_performance_seo.py` creado y confirmando cero 404 de assets y ausencia de `@import`; `make check` verde. | Persistencia de `@import` en CSS, rutas rotas (404) a imágenes o manifest, iconos generados con filtros SVG incompatibles (SVG 1.2 Tiny obligatorio), JSON-LD inválido, o fallo en `make check`. |
| **SOL-10** | Producto / Entrega Cliente | **[P3] Manual de entrega a Carlos y CLI de gestión de leads (Zero-Dep).** Routing: Luna (Tier-B) [effort: low]. Redactar `docs/MANUAL_CLIENTE_CARLOS.md` en Português canónico elegante y directo (instrucciones paso a paso para Carlos sobre cómo consultar solicitudes y fotos recibidas, responder presupuestos en <24h por WhatsApp/Email, desplegar en Cloudflare/servidor propio y actualizar imágenes de proyectos sin tocar CSS); y desarrollar script CLI `scripts/leads.py` en Python stdlib para consultar, filtrar y exportar leads de `data/inquiries.jsonl` en CSV/JSON con marcas de seguimiento y visualización de fotos. | 🕓 **PENDIENTE** | Manual `docs/MANUAL_CLIENTE_CARLOS.md` completo, formateado con claridad y sin jerga innecesaria de desarrollo; herramienta `scripts/leads.py` funcional mediante CLI (`--list`, `--export-csv`, `--export-json`, `--mark-contacted`, `--show-photos`) usando únicamente librerías estándar de Python; `scripts/test_leads_cli.py` añadido verificando todas las opciones de la CLI; `make check` verde. | Dependencias pip externas en `scripts/leads.py`, manual incompleto o confuso para el cliente final, corrupción de datos en exportaciones de leads, o fallo en `make check`. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-04** | Infra / Merge | `make merge` desde un worktree de sesión (port de Noesis NOE-MERGE-WORKTREE-20261018): integra el destino en la rama, gates y staging en el worktree, publica HEAD y el checkout principal solo avanza por fast-forward si su trabajo sin commitear no choca (si choca, aviso). `scripts/test_merge_worktree.py` (en `make check`) con git real. | 2026-10-18 | Claude Opus 5.5 |
| **SOL-00** | Génesis | Creación de plataforma web inicial de alto patrón en HTML/CSS/JS | 2026-08-15 | Emanuel |
