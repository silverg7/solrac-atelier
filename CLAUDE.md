<!-- noesis:cabecera v1 — no editar a mano; la regenera `python ../noesis/mando.py alinear-flota --fix` -->
# CLAUDE.md — solrac-atelier
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. **Emanuel** (enfermero e inversor, Galicia) decide capital (R10), publicación externa y lo irreversible; tú razonas y construyes.
## La única regla
- **Economia_Familiar es air gap**: su contenido no sale a la nube ni a modelos remotos. **Nada se publica fuera de local** (los GitHub de Emanuel cuentan como suyos).
- Todo lo demás, manga ancha: sin cerrojos ni cortes de acceso por iniciativa propia; lo que rompe se arregla. Si dudas entre freno y arreglo, pregunta en una línea.
## Noesis manda (top-down)
- `../noesis/` es la autoridad de la constelación: canon, memoria (`python ../noesis/stash.py search "..."`), salud (`python ../noesis/mando.py doctor`) y flota (`fleet.json`) se usan libremente.
- Doctrina de despacho vigente: `../noesis/memory.md` §60-70 y `../noesis/data/fleet_canon.json` (lo aplica `python ../noesis/mando.py doctor`).
## Forma de trabajar
- Arranque `git status -s` + `make ignite` → un ticket a la vez, `PENDIENTE` 🕓 / `CERRADO` ✅ → cierre `make check`, `make merge MSG="..."` y `make relevo` (`scripts/prompts/PROMPT_SIGUIENTE_VENTANA.md`).
<!-- noesis:cabecera:fin -->

## Lo propio: solrac-atelier

- Satélite del ecosistema Noesis (`../noesis/`). Memoria transversal: `python ../noesis/stash.py search "..."`.
  Orquestación y salud de flota: `python ../noesis/mando.py` (`radar`, `check`, `doctor`).

## Arranque
- `git status -s` y `make ignite` (cola viva en `TABLERO_AGENTES.md`). Reclama un ticket antes de tocar código.
- Protocolos de flota y tableros: `AGENTS.md`. No los dupliques aquí.

## Código
- Escribe código que encaje con el entorno: idiomático, con la misma densidad de comentarios,
  naming y tipado que el código que lo rodea.
- Crash ruidoso antes que fallback silencioso: ninguna excepción silenciada ni datos inventados.

## Fuentes de verdad y gotchas
- Una cifra, un dueño: cada dato vive en un único fichero; los demás lo derivan.
- Añade aquí solo lo que no se deduce leyendo el repo (invariantes, trampas, fuentes únicas).

## Verificación
- `make check` antes de cerrar; `make merge MSG="..."` para integrar.
