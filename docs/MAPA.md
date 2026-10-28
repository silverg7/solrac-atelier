# Mapa de solrac-atelier

Generado por `make mapa` desde el código; no se edita a mano. `make mapa` en Noesis regenera el de toda
la flota; en un satélite, solo el suyo. El pulso de las 07:05 lo regenera y commitea solo.
«Último cambio» es la fecha del último commit que tocó el fichero.

## Estado del tablero

| Repo | Abiertos | Pendientes | En curso | Bloqueados |
|---|---|---|---|---|
| solrac-atelier | 1 | 1 | 0 | 0 |

## Comandos `make`

| Comando | Qué hace |
|---|---|
| `make serve` | Iniciar servidor web local en http://localhost:8080 |
| `make sync` | Sincronizar cambios locales y remotos con GitHub |
| `make check` | Verificación de salud y archivos canónicos |
| `make check-browser` | Real Chromium regressions. Run with `make check-browser` (Playwright + Chrome). |
| `make test` | Validar sintaxis y estructura del portfolio |
| `make ignite` | Despertar táctico y lectura de identidad |
| `make merge` | Ciclo completo fail-closed (preflights + push) |
| `make escala` | Protocolo 'escala a noesis' ante fricción o bloqueo |
| `make mariskal` | Generar orden de marcha quirúrgica determinista desde el tablero de cualquier satélite · alias `magnus` · alias `work-order` |
| `make magnus` | alias de `make mariskal` |
| `make relevo` | Sella el testigo de relevo canónico de un satélite |
| `make mapa` | — |
| `make cerrar` | — |

## Scripts

| Script | Qué hace | Último cambio |
|---|---|---|
| [`scripts/generar_dossier_pdf.py`](../scripts/generar_dossier_pdf.py) | Gera o dossier de entrega em PDF usando Chromium headless. | 2026-10-25 |
| [`scripts/leads.py`](../scripts/leads.py) | Consulta e exportação local dos pedidos recebidos pelo Concierge. | 2026-10-25 |
| [`scripts/merge.sh`](../scripts/merge.sh) | merge.sh — Full merge cycle: stage → commit → pre-push gates → push | 2026-10-25 |
| [`scripts/server.py`](../scripts/server.py) | SOL-05 / SOL-08: Serviço de ingesta de leads, persistência transaccional e quota de fotos. | 2026-10-24 |
| [`scripts/sync_local.sh`](../scripts/sync_local.sh) | — | 2026-10-06 |
| [`scripts/transversal.sh`](../scripts/transversal.sh) | — | 2026-10-06 |

## Claude Code en este repo

_Nada registrado._
