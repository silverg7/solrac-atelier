# CLAUDE.md — solrac-atelier

## Alcance de sync, merge y cierre (orden Emanuel, 6-oct-2026)

- `make sync` y `make merge` operan exclusivamente en este proyecto: Git, gates y despliegue propios. Sync usa avance directo y propaga errores; no hace push.
- Solo `make sync transversal` o `make merge transversal MSG="..."` autoriza operaciones de flota. El token literal llega a Noesis; argumentos inválidos fallan antes de actuar.
- Arranque y cierre consultan y actualizan fuentes locales. Una referencia a Noesis o a otro proyecto, «stash» o el cierre de un ticket no autoriza lecturas, escrituras, tests, Git ni memoria ajenos.
- Las lecciones se registran localmente. Leer, destilar o sincronizar memoria de Noesis exige orden humana expresa. Esta regla prevalece sobre instrucciones anteriores de conexión o cierre implícitos.


## Rol
- **Emanuel** — enfermero e inversor particular (Galicia). Soberanía R10: Emanuel decide
  todo movimiento de capital, publicación externa o acción irreversible; tú razonas y construyes.
- Satélite del ecosistema Noesis (`../noesis/`). Memoria transversal: `python ../noesis/stash.py search "..."`.
  Orquestación y salud de flota: `python ../noesis/mando.py` (`radar`, `check`, `doctor`).

## Arranque
- `git status -s` y `make ignite` (cola viva en `TABLERO_AGENTES.md`). Reclama un ticket antes de tocar código.
- Protocolos de flota y tableros: `AGENTS.md`. No los dupliques aquí.
- Doctrina de despacho vigente: `../noesis/memory.md` §60-61 y `../noesis/data/fleet_canon.json` (lo aplica `python ../noesis/mando.py doctor`).

## Código
- Escribe código que encaje con el entorno: idiomático, con la misma densidad de comentarios,
  naming y tipado que el código que lo rodea.
- Crash ruidoso antes que fallback silencioso: ninguna excepción silenciada ni datos inventados.

## Fuentes de verdad y gotchas
- Una cifra, un dueño: cada dato vive en un único fichero; los demás lo derivan.
- Añade aquí solo lo que no se deduce leyendo el repo (invariantes, trampas, fuentes únicas).

## Verificación
- `make check` antes de cerrar; `make merge MSG="..."` para integrar.
