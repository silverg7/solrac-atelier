<!-- noesis:cabecera v1 — no editar a mano; la regenera `python /home/emanuel/Documentos/noesis/mando.py alinear-flota --fix` -->
# CLAUDE.md — solrac-atelier
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. **Emanuel** (enfermero e inversor, Galicia) decide capital (R10), publicación externa y lo irreversible; tú razonas y construyes.
## La única regla
- Manga ancha: sin cerrojos ni cortes de acceso por iniciativa propia; lo que rompe se arregla. Si dudas entre freno y arreglo, pregunta en una línea.
## Mando CEO (Noesis) y coordinación local
- Noesis (Emanuel + Opus como CEO) fija prioridades y despacha objetivo, perímetro, destino y criterios; este repo coordina su propio trabajo con sus fuentes (AGENTS.md, «Coordinación local»).
- No cargues `/home/emanuel/Documentos/noesis/` (memory.md, stash, docs) ni otro satélite como contexto de trabajo: las utilidades de flota se ejecutan, no se leen. Doctrina de despacho y routing: los aplican `make mariskal` y `python /home/emanuel/Documentos/noesis/mando.py doctor` desde `/home/emanuel/Documentos/noesis/data/fleet_canon.json`.
- **Flota vigente** (generada del canon; el modelo de cada ticket lo fija `make mariskal`): Tier-S+ GPT-6.2 Astra [codex] · Claude Opus 5.5 [claude] · Gemini 4 Neon [agy] · Gemini 4 Carbon [agy] | Tier-S Claude Fable 5.2 [claude] | Tier-A+ GPT-6.2 Sol [codex] | Tier-A GPT-6.1 Terra [codex] · Gemini 4 Hydrogen [agy] · Claude Sonnet 5.5 [claude] | Tier-B GPT-6 Luna [codex] · Claude Haiku 5.5 [claude] · Gemini 4 Hydrogen [agy].
- Arranque `git status -s` + `make ignite` → un ticket a la vez, `PENDIENTE` 🕓 / `CERRADO` ✅ → cierre `make check`, `make cerrar TICKET=...`, `make merge MSG="..."` y `make relevo` (`scripts/prompts/PROMPT_SIGUIENTE_VENTANA.md`).
<!-- noesis:cabecera:fin -->

## Lo propio: solrac-atelier
- **Consejo de diosas (Afrodita)**: Ver [docs/diosa/](docs/diosa/) (alma, voz, decisiones y perfil Hermes).

- Satélite del ecosistema Noesis (`../noesis/`), que despacha y recibe resultados; su memoria no es contexto de trabajo aquí.
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
