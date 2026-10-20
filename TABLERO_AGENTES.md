# TABLERO DE AGENTES — SOLRAC ATELIER
# Centro de Mando Satélite · Sujeto a gobernanza Top-Down de Noesis
# Gramática RMAS: 6 columnas, 4 estados canónicos (PENDIENTE 🕓, EN_PROGRESO 🔵, LISTO 🟢, CERRADO ✅)

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-02** | Frontend / Portfolio | **Curaduría y carga de fotografías reales de obras en assets/images/.** Incorporar fotos de alta resolución de muros de contención, quintas no Douro y piezas de cantaria aparelhada. | 🕓 **PENDIENTE** | Imágenes organizadas en `assets/images/` y visualización correcta en grelha monocromática en `index.html`. | Imágenes rotas, rutas inexistentes o tiempos de carga excesivos sin optimización. |
| **SOL-03** | Marca & Concierge | **Refinamiento del módulo Concierge y formulario de contacto técnico.** Optimizar flujo de contacto directo para arquitectos y clientes de alto patrón en Grande Porto y Douro. | 🕓 **PENDIENTE** | Botón de concierge funcional con modal o enlace directo de contacto sin dependencias externas caídas. | Enlaces muertos, errores de consola JS o layout shift. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-04** | Infra / Merge | `make merge` desde un worktree de sesión (port de Noesis NOE-MERGE-WORKTREE-20261018): integra el destino en la rama, gates y staging en el worktree, publica HEAD y el checkout principal solo avanza por fast-forward si su trabajo sin commitear no choca (si choca, aviso). `scripts/test_merge_worktree.py` (en `make check`) con git real. | 2026-10-18 | Claude Opus 5.5 |
| **SOL-00** | Génesis | Creación de plataforma web inicial de alto patrón en HTML/CSS/JS | 2026-08-15 | Emanuel |
