# AFRODITA (`solrac`) · Coordinadora de Belleza Familiar y Estética del Ecosistema

> **«La belleza no es un lujo añadido al final: es la coherencia entre proporción, material, luz, uso y vida real.»**

Este repositorio alberga el núcleo operativo, criterio estético, biblioteca destilada y especificaciones visuales de **Afrodita** (identificador técnico `solrac` en la constelación Noesis), encargada de coordinar la belleza de todos los elementos de la familia y del ecosistema.

---

## 1. Dominios bajo Coordinación de Afrodita

| Dominio | Alcance | Documento guía |
|---|---|---|
| **Arquitectura y Hogar** | Espacios, luz, materiales, reformas, distribución | [dominios/arquitectura_hogar.md](dominios/arquitectura_hogar.md) |
| **Muebles e Interiores** | Mobiliario, textiles, ergonomía familiar, almacenaje | [dominios/muebles_interiores.md](dominios/muebles_interiores.md) |
| **Jardín, Plantas y Huerto** | Paisajismo gallego, botánica interior/exterior, huerto | [dominios/jardin_plantas_huerto.md](dominios/jardin_plantas_huerto.md) |
| **Estilo, Ropa, Complementos y Olores** | Colorimetría, armario cápsula, calzado, perfumería/hogar | [dominios/estilo_ropa_olores.md](dominios/estilo_ropa_olores.md) |
| **Web Design & UI Design** | Sistemas visuales, tokens, SVG 1.2 Tiny, anti-slop | [dominios/web_ui_design.md](dominios/web_ui_design.md) |

---

## 2. Estructura del Repositorio

```text
solrac/ (enlace hermano: solrac-atelier)
├── SOUL.md                          # Alma, voz, criterio y límites de Afrodita
├── AGENTS.md                        # Gobernanza Noesis + directrices locales de Afrodita
├── TABLERO_AGENTES.md               # Cola viva RMAS (AFRO-01..AFRO-05)
├── dominios/                        # Fichas operativas por cada dominio estético
├── biblioteca/
│   └── PLAN_LECTURAS.md             # Libros técnicos y no técnicos a destilar
├── docs/
│   └── KIT_DOCUMENTACION_Y_FOTOS.md # Qué fotos y datos necesita Afrodita de la familia
├── assets/                          # Activos visuales y web
├── css/, js/, index.html            # Base web heredada (atelier/portfolio)
└── scripts/                         # Verificación y pipeline local
```

---

## 3. Gobernanza y Reglas de Operación

- **Alma y criterio:** [SOUL.md](SOUL.md)
- **Compras y decisiones:** Afrodita propone y debate con Hestia (`metabole`) cuando hay gasto; **Emanuel decide (R10)**.
- **Biblioteca y evidencias:** Ver [biblioteca/PLAN_LECTURAS.md](biblioteca/PLAN_LECTURAS.md) y [docs/KIT_DOCUMENTACION_Y_FOTOS.md](docs/KIT_DOCUMENTACION_Y_FOTOS.md).
- **Verificación local:** `make serve` (puerto `8080`) · `make ignite` · `make check`.
