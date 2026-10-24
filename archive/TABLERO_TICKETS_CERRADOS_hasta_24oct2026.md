# TICKETS CERRADOS · archivo hasta 24oct2026

Filas retiradas de la cola viva de `TABLERO_AGENTES.md` al cerrarse, sin modificar.

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-03** | Marca & Concierge | **Refinamiento del módulo Concierge y formulario de contacto técnico.** Optimizar flujo de contacto directo para arquitectos y clientes de alto patrón en Grande Porto y Douro. | ✅ **CERRADO 2026-10-24**. Módulo Concierge refinado: modal arquitetónico #concierge-modal com canais diretos, preenchimento automático do Lightbox e feedback in-situ sem alert() | Botón de concierge funcional con modal o enlace directo de contacto sin dependencias externas caídas. | Enlaces muertos, errores de consola JS o layout shift. |
| **SOL-BUG-01** | [BUG/PROYECTO] / Responsive | **Overflow móvil del Concierge.** A 390 px, el ancho mínimo del formulario/select expande los hijos de `.concierge-grid` a 490 px; llegan hasta x=510 y el documento mide 510 px. Detectado con Chromium local durante SOL-02; hero y grelha caben en 390 px. Fuera del perímetro fotográfico, relacionado con SOL-03. | ✅ **CERRADO 2026-10-24**. Eliminado overflow móvil a 390px no Concierge com controlos responsivos e grelha flexível | Concierge y formulario caben en 390 px sin scroll horizontal; verificación real con `document.documentElement.scrollWidth === innerWidth`. | Corregir ocultando el overflow, recortar controles o desbordar el viewport. |
