<!-- noesis:cabecera v1 — no editar a mano; la regenera `python ../noesis/mando.py alinear-flota --fix` -->
# TABLERO DE AGENTES — SOLRAC-ATELIER
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. · Gobernanza Noesis · RMAS: 6 columnas, `PENDIENTE` 🕓 / `CERRADO` ✅
<!-- noesis:cabecera:fin -->

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-12** | Producto / Entrega Cliente | **[P2] Dossier Ejecutivo de Entrega a Carlos en PDF Arquitectónico + CLI de leads.** Routing: Sol (Tier-S) [effort: medium]. Crear plantilla HTML arquitectónica sobria en `docs/dossier_cliente_carlos.html` con maquetación para impresión A4 (tipografía técnica, paleta sobria, guía paso a paso en Português canónico para Carlos: gestión de presupuestos del Concierge, consulta de fotos recibidas, respuesta por WhatsApp en <24h y mantenimiento de la web) y script `scripts/generar_dossier_pdf.py` usando Chromium headless (`--print-to-pdf`) para emitir `docs/DOSSIER_CLIENTE_CARLOS.pdf`; y desarrollar la CLI estándar `scripts/leads.py` en Python stdlib para listar y exportar dossiers de `data/inquiries.jsonl`. | 🕓 **PENDIENTE** | Archivo `docs/DOSSIER_CLIENTE_CARLOS.pdf` generado físicamente, legible, maquetado con rigor editorial y sin dependencias pesadas de servidor; CLI `scripts/leads.py` funcional con `--list`, `--export-csv`, `--export-json` y `--show-photos` en Python stdlib puro; `scripts/test_leads_cli.py` validando opciones de la CLI y existencia del PDF; `make check` verde. | Falta del binario PDF generado, jerga técnica inaccesible para Carlos, dependencias pip externas o fallo en `make check`. |
| **SOL-13** | Gobernanza / Calidad & Auditoría | **[P0] Auditoría Forense Integral de Entrega (Revisión 360° antes de entrega a Carlos).** Routing: Claude Opus 5.5 [effort: medium]. Auditoría de código, accesibilidad WCAG 2.1 AA, responsive en 5 viewports (320px a 1440px), paridad lingüística en Português canónico, ausencia total de 404s, integridad de datos en Concierge/leads y verificación de experiencia final de usuario previa al despliegue y entrega definitiva a Carlos (programada para el lunes). | 🕓 **PENDIENTE** | Informe exhaustivo de auditoría con 0 vulnerabilidades, 0 enlaces rotos, 0 errores de consola en Chromium headless y confirmación de que todas las gates de calidad de Noesis están superadas; `make check` verde. | Aprobación con fallos no documentados, regresión visual o fallo en `make check`. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-10** | Frontend / UX Visual | Cromatismo Tectónico: Transición B/N a color natural en hover de obras y hero. | 2026-10-24 | GPT-6.1 Sol |
| **SOL-09** | Frontend / Performance & SEO | Auditoría de rendimiento, PWA y Open Graph (Zero Render Blocking): CSS sin imports, precarga de fuentes, iconos PWA reales Tiny 1.2 y Schema.org completo. | 2026-10-24 | GPT-6.1 Sol |
| **SOL-BUG-03** | Frontend & Persistencia | Corrección de recortes responsive, concurrencia de referencias, acceso codificado a datos privados y traducciones. | 2026-10-24 | GPT-6.1 Sol |
| **SOL-08** | Backend, A11y & Legal | Focus trap WCAG 2.1 AA, skip-link, pie legal PT (RGPD, foro Porto y Livro de Reclamações) y límites fail-closed de fotos. | 2026-10-24 | Gemini 4 Argon |
| **SOL-07** | UX & Presupuesto Express | Galería tectónica Lightbox con navegación cíclica, esquemas técnicos vectoriales y dropzone de fotos para WhatsApp. | 2026-10-24 | Claude Opus 5.5 |
