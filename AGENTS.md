# AGENTS.md — SOLRAC Atelier

## Alcance de sync, merge y cierre (orden Emanuel, 6-oct-2026)

- `make sync` y `make merge` operan exclusivamente en este proyecto: Git, gates y despliegue propios. Sync usa avance directo y propaga errores; no hace push.
- Solo `make sync transversal` o `make merge transversal MSG="..."` autoriza operaciones de flota. El token literal llega a Noesis; argumentos inválidos fallan antes de actuar.
- Arranque y cierre consultan y actualizan fuentes locales. Una referencia a Noesis o a otro proyecto, «stash» o el cierre de un ticket no autoriza lecturas, escrituras, tests, Git ni memoria ajenos.
- Las lecciones se registran localmente. Leer, destilar o sincronizar memoria de Noesis exige orden humana expresa. Esta regla prevalece sobre instrucciones anteriores de conexión o cierre implícitos.


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
- Doctrina de despacho vigente: `../noesis/memory.md` §60-61 y `../noesis/data/fleet_canon.json` (lo aplica `python ../noesis/mando.py doctor`).

## Despacho y Mariskal de Campo
- **Vía Rápida Determinista (`make mariskal`):** Ante cualquier solicitud de prompt, delegación a Tier-S o invocación del "mariskal", el agente tiene **terminantemente prohibido redactar prompts a mano o inventar plantillas**. Ejecuta inmediatamente `python3 ../noesis/mando.py mariskal solrac-atelier` (o `make mariskal`) y entrega directamente el bloque `work_order` resultante de forma 100% literal e íntegra sin preámbulos ni paráfrasis.

