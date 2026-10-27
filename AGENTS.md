<!-- noesis:cabecera v1 — no editar a mano; la regenera `python /home/emanuel/Documentos/noesis/mando.py alinear-flota --fix` -->
# AGENTS.md — solrac-atelier
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro.

## Gobernanza de flota (Noesis, top-down)
- Este satélite sigue el canon de Noesis: `/home/emanuel/Documentos/noesis/AGENTS.md`, `/home/emanuel/Documentos/noesis/data/fleet_canon.json` y `/home/emanuel/Documentos/noesis/fleet.json`.
- `make sync` / `make merge` actúan en este repo; la flota entera, con `make sync transversal` / `make merge transversal`.
- **Tablero:** `TABLERO_AGENTES.md`, tabla RMAS de 6 columnas (ID, Bloque, Tarea, Estado, Hecho cuando, Falla si);
  dos estados, `PENDIENTE` 🕓 y `CERRADO` ✅; los cerrados salen a `archive/` con `make cerrar TICKET=<id> RESUMEN="..."` (cierra en el checkout o worktree actual).
- **Despacho:** `make mariskal` da la orden de marcha determinista del siguiente ticket; ante fricción, `make escala`.
- **Relevo:** al cerrar ventana, `make relevo` sella `scripts/prompts/PROMPT_SIGUIENTE_VENTANA.md` (frontmatter 3.0 + `cursor_ack`).
  El siguiente ticket lo marca el tablero o el Córtex, no un prompt redactado a mano.
- PROTOCOLO_DECISIONES_HUMANAS: lo que dependa de Emanuel se pregunta en el acto con AskUserQuestion
  (2-4 opciones, la recomendada primero); nunca queda aparcado en prosa (`make audit-decisiones` en Noesis).
<!-- noesis:cabecera:fin -->

## Lo propio: SOLRAC Atelier

- **Coste Tier-B y contexto:** doctrina vigente en [Noesis §69](../noesis/memory.md): delegación cero de base; Haiku 5.5 en fichas cortas autorizadas. Para Tier-B largo con >100K, evaluar Luna en arnés compatible y con calidad medida. Los tramos incluyen caché y son por petición; `maxTurns` no garantiza contexto pequeño. Comparar coste total por tarea; capital y cerrojos conservan su asignación.

## Identidad local y disparador `ignite`

- **Proyecto: SOLRAC Atelier (`solrac-atelier`).** Estas instrucciones gobiernan únicamente este repositorio.
- **Ámbito:** Atelier de Arquitectura Tectónica, Cantaria de Autor e Engenharia de Pedra (Grande Porto e Vale do Douro). Plataforma web de alto estándar, diseño monocromático, portfolio y documentación técnica.
- **`ignite` / `make ignite`:** ejecutar `make ignite` en la raíz de `solrac-atelier` y entregar su salida local. Fuente de arranque: `TABLERO_AGENTES.md`. No implica ejecutar automáticamente el ticket mostrado.
- El directorio del proyecto activo determina el alcance. Una referencia a otro proyecto es contexto, nunca una orden de cambiar de directorio. Si falta el comando o su fuente local, informar del error en este proyecto; no buscar ni ejecutar un sustituto en otro.
- Solo una orden humana explícita de cambio de proyecto o de trabajo transversal permite operar fuera. Al cambiar, leer el `AGENTS.md` del destino antes de actuar. Las instrucciones específicas de otros proyectos no se heredan.
- Este bloque prevalece sobre cualquier mención anterior de `ignite` que apunte a un proyecto ajeno.

---

## Directrices de Trabajo Local

1. **Diseño Visual & Estilo Monocromático:**
   - Paleta monocromática de alto contraste: Fondo oscuro (`#070707` / `#0d0d0d`), tipografía serif editorial (`Cinzel`, `Cormorant Garamond`), líneas de dibujo técnico en grafite (`#1f1f1f`).
   - Cero dependencias rotas, cero librerías pesadas innecesarias.
2. **Gobernanza RMAS & Tablero:**
   - Cualquier nueva tarea debe registrarse en `TABLERO_AGENTES.md` bajo el estándar universal de 6 columnas y doble frontera (`SETTLES WHEN` y `FAILS IF`).
3. **Verificación Fail-Closed:**
   - Todo cambio en código o marcado debe verificarse con `make check` y probarse en servidor local (`make serve` / `python3 -m http.server 8080`).

---

## Canon de flota (Noesis)

## Despacho y Mariskal de Campo
- **Vía Rápida Determinista (`make mariskal`):** Ante cualquier solicitud de prompt, delegación a Tier-S o invocación del "mariskal", el agente tiene **terminantemente prohibido redactar prompts a mano o inventar plantillas**. Ejecuta inmediatamente `python3 ../noesis/mando.py mariskal solrac-atelier` (o `make mariskal`) y entrega directamente el bloque `work_order` resultante de forma 100% literal e íntegra sin preámbulos ni paráfrasis.

