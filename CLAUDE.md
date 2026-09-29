# CLAUDE.md — solrac-atelier

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
- Historia y lecciones van a `../noesis/memory.md`, nunca a este archivo.
