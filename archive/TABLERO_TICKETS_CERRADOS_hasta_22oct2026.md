# TICKETS CERRADOS · archivo hasta 22oct2026

Filas retiradas de la cola viva de `TABLERO_AGENTES.md` al cerrarse, sin modificar.

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-02** | Frontend / Portfolio | **Curaduría y carga de fotografías reales de obras en assets/images/.** Incorporar fotos de alta resolución de muros de contención, quintas no Douro y piezas de cantaria aparelhada. | ✅ **CERRADO 2026-10-22**. 7 fotografías del álbum propio en 21 WebP locales; grelha y 18 ampliaciones verificadas en 1440/1024/390 px, sin 404 ni errores JS; make check: 8 pruebas. Evidencia: docs/SOL-02_VERIFICACAO.md. Implementación: 577ac8d. Overflow previo de Concierge registrado como SOL-BUG-01. | Imágenes organizadas en `assets/images/` y visualización correcta en grelha monocromática en `index.html`. | Imágenes rotas, rutas inexistentes o tiempos de carga excesivos sin optimización. |
