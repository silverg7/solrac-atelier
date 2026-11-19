<!-- noesis:cabecera v1 — no editar a mano; la regenera `python /home/emanuel/Documentos/noesis/mando.py alinear-flota --fix` -->
# TABLERO DE AGENTES — SOLRAC-ATELIER
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. · Gobernanza Noesis · RMAS: 6 columnas, `PENDIENTE` 🕓 / `CERRADO` ✅
<!-- noesis:cabecera:fin -->

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **AFRO-00** | Arranque / Consulta Humana (Tier-S) | **[P0 · TIER-S] Consulta humana estructurada e integración inicial de Afrodita.** Routing: Claude Opus 5.5 [effort: high]. Entrevistar a Emanuel vía `AskUserQuestion` para fijar: (1) prioridad de arranque entre los 5 dominios (`AFRO-01..05`), (2) destino del legado web `SOLRAC` (`index.html` / `fleet.json`), (3) restricciones reales de tiempo, presupuesto y vida familiar en Galicia, y (4) recogida del paquete inicial de fotos/medidas según `docs/KIT_DOCUMENTACION_Y_FOTOS.md`. | 🕓 **PENDIENTE** | Respuestas humanas recogidas y volcadas en `SOUL.md` y `dominios/*.md`; alcance de `AFRO-01..05` priorizado y `make ignite` limpio. | Asume gustos, medidas o presupuesto sin preguntar; deja decisiones abiertas en prosa sin usar `AskUserQuestion`; rompe `make check` o la cabecera de Noesis. |
| **AFRO-01** | Estilo / Ropa, Complementos & Olores | **[P0] Ficha fisonómica, colorimetría y armario cápsula familiar.** Construir el perfil estético real (colorimetría, corte, tejidos para Galicia, turnos hospitalarios y vida con niñas) y firma olfativa a partir de las fotos y medidas aportadas en `docs/KIT_DOCUMENTACION_Y_FOTOS.md`. | 🕓 **PENDIENTE** | Ficha completa en `dominios/estilo_ropa_olores.md` con paleta personal, reglas de silueta, cápsula por estación y lista de olores/perfumes sin compras impulsivas. | Inventa medidas o tonos sin fotos/datos de Emanuel; propone prendas incompatibles con lluvia o turnos. |
| **AFRO-02** | Hogar / Arquitectura, Muebles & Color | **[P0] Auditoría visual de espacios, mobiliario y paleta del hogar.** Mapear estancias con fotos reales, orientación de luz, muebles actuales, puntos de fricción visual y olores por zona. | 🕓 **PENDIENTE** | Diagnóstico por estancia en `dominios/arquitectura_hogar.md` y `dominios/muebles_interiores.md` con paleta cromática, materiales recomendados y lista priorizada de mejoras. | Propone reformas o compras sin medidas, luz real ni contraste de coste con Hestia/Emanuel. |
| **AFRO-03** | Exterior / Jardín, Plantas & Huerto | **[P1] Plan botánico atlántico: jardín, plantas de interior y huerto familiar.** Definir zonificación (sol/sombra/viento), especies resistentes en Galicia (seguras para niñas/mascotas si aplica) y calendario anual de huerto. | 🕓 **PENDIENTE** | Plano de especies y calendario de siembra/riego/poda en `dominios/jardin_plantas_huerto.md` adaptado a microclima real y tiempo disponible de mantenimiento. | Elige especies no aptas para clima atlántico húmedo o con mantenimiento incompatible con turnos. |
| **AFRO-04** | Digital / Web Design, UI & SVG | **[P1] Canon UI y sistema de diseño de Afrodita para el ecosistema.** Consolidar tokens de color, jerarquía tipográfica, checklist anti-slop y plantillas **SVG 1.2 Tiny** sin filtros `<filter>`/`<feGaussianBlur>` para KWin/plasmashell. | 🕓 **PENDIENTE** | Guía operativa y tokens verificables en `dominios/web_ui_design.md`; cero filtros prohibidos en SVG/CSS; compatible con el estándar visual del ecosistema. | Introduce filtros que rompen KWin, dependencias pesadas o estética genérica de plantilla IA. |
| **AFRO-05** | Conocimiento / Biblioteca | **[P2] Destilación de libros técnicos y estéticos para Afrodita.** Destilar en fichas accionables (no resúmenes vagos) los manuales clave de `biblioteca/PLAN_LECTURAS.md` en cada dominio. | 🕓 **PENDIENTE** | Al menos 1 ficha destilada por dominio en `biblioteca/` con reglas aplicables, proporciones, tablas o heurísticas concretas. | Copia citas genéricas sin reglas operativas aplicables a la familia o al diseño. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-10** | Frontend / UX Visual | Cromatismo Tectónico: Transición B/N a color natural en hover de obras y hero. | 2026-10-24 | GPT-6.1 Sol |
| **SOL-09** | Frontend / Performance & SEO | Auditoría de rendimiento, PWA y Open Graph (Zero Render Blocking): CSS sin imports, precarga de fuentes, iconos PWA reales Tiny 1.2 y Schema.org completo. | 2026-10-24 | GPT-6.1 Sol |
| **SOL-BUG-03** | Frontend & Persistencia | Corrección de recortes responsive, concurrencia de referencias, acceso codificado a datos privados y traducciones. | 2026-10-24 | GPT-6.1 Sol |
| **SOL-08** | Backend, A11y & Legal | Focus trap WCAG 2.1 AA, skip-link, pie legal PT (RGPD, foro Porto y Livro de Reclamações) y límites fail-closed de fotos. | 2026-10-24 | Gemini 4 Argon |
| **SOL-07** | UX & Presupuesto Express | Galería tectónica Lightbox con navegación cíclica, esquemas técnicos vectoriales y dropzone de fotos para WhatsApp. | 2026-10-24 | Claude Opus 5.5 |
