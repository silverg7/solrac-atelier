# TABLERO DE AGENTES — SOLRAC ATELIER
# Centro de Mando Satélite · Sujeto a gobernanza Top-Down de Noesis
# Gramática RMAS: 6 columnas, 4 estados canónicos (PENDIENTE 🕓, EN_PROGRESO 🔵, LISTO 🟢, CERRADO ✅)

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-01** | Arquitectura / RMAS | **Integración satélite en gobernanza Noesis y enlace con GitHub.** Repositorio enlazado con remoto `silverg7/solrac-atelier`, Makefile operativo, acceso directo en escritorio e icono KDE multirresolución. | 🟢 **LISTO** | Repositorio clonado, iconografía instalada, linters en verde y detectado por `mando.py`. | Faltan archivos de frontera o scripts de lanzamiento rotos. |
| **SOL-02** | Frontend / Portfolio | **Curaduría y carga de fotografías reales de obras en assets/images/.** Incorporar fotos de alta resolución de muros de contención, quintas no Douro y piezas de cantaria aparelhada. | 🕓 **PENDIENTE** | Imágenes organizadas en `assets/images/` y visualización correcta en grelha monocromática en `index.html`. | Imágenes rotas, rutas inexistentes o tiempos de carga excesivos sin optimización. |
| **SOL-03** | Marca & Concierge | **Refinamiento del módulo Concierge y formulario de contacto técnico.** Optimizar flujo de contacto directo para arquitectos y clientes de alto patrón en Grande Porto y Douro. | 🕓 **PENDIENTE** | Botón de concierge funcional con modal o enlace directo de contacto sin dependencias externas caídas. | Enlaces muertos, errores de consola JS o layout shift. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-00** | Génesis | Creación de plataforma web inicial de alto patrón en HTML/CSS/JS | 2026-08-15 | Emanuel |
