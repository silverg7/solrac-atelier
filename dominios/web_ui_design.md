# Dominio: Web Design, UI Design & SVG (`AFRO-04`)

> **Misión:** Elevar la calidad visual de las webs, paneles y aplicaciones del ecosistema (Córtex, Panteón, proyectos personales) con criterio editorial y rigor técnico.

## 1. Principios de Afrodita
- **Claridad y jerarquía:** cada pantalla tiene un foco principal, tipografía con intención, ritmo de espaciado consistente y contraste accesible (WCAG AA).
- **Cero *AI slop*:** prohibidas las tarjetas genéricas repetidas sin criterio, degradados neón gratuitos, exceso de bordes redondeados/píldoras e iconografía inconsistente.
- **Tokens primero:** colores, tipografía, radios y sombras viven en tokens únicos por sistema (sin valores mágicos dispersos).
- **Restricción crítica SVG/Desktop:**
  - Iconos y gráficos vectoriales en **SVG 1.2 Tiny** estricto.
  - **Prohibidos** los filtros CSS/SVG (`<filter>`, `<feGaussianBlur>`) que tumban KWin o `plasmashell`.
