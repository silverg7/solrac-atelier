<!-- noesis:cabecera v1 — no editar a mano; la regenera `python ../noesis/mando.py alinear-flota --fix` -->
# TABLERO DE AGENTES — SOLRAC-ATELIER
> SOLRAC: atelier de cantería y arquitectura en piedra del Grande Porto y el Douro. · Gobernanza Noesis · RMAS: 6 columnas, `PENDIENTE` 🕓 / `CERRADO` ✅
<!-- noesis:cabecera:fin -->

---

## 1. COLA VIVA DE TAREAS ACTIVAS

| # | Bloque | Tarea / Descripción | Estado | Criterio de Aceptación (SETTLES WHEN) | Modos de Fallo (FAILS IF) |
|---|---|---|:---:|---|---|
| **SOL-06** | Frontend / I18n | **Motor bilingüe nativo PT-PT / EN.** Implementar selector de idioma en header (Português de Portugal canónico para Grande Porto/Douro e Inglês internacional), traducción completa del léxico técnico de arquitectura ("cantaria aparelhada", "muros de contenção", "aparejador/direção técnica") y persistencia de preferencia en `localStorage`. | 🕓 **PENDIENTE** | Conmutador PT/EN funcional en desktop y móvil sin recarga de página ni layout shift, textos técnicos traducidos fielmente al padrão luso, tests verifican paridad de claves y `make check` pasa. | Textos mezclados en pantalla, flash de idioma no deseado al cargar o claves de traducción huérfanas/no definidas. |
| **SOL-07** | Frontend / UX & Galería | **Navegación secuencial de proyectos y archivo técnico.** Añadir navegación anterior/siguiente en el Lightbox modal (botones UI, teclado `ArrowLeft`/`ArrowRight`, gestos swipe en móvil) e incorporar visualización de planos/detalles técnicos de aparejo y drenaje en la sección de método. | 🕓 **PENDIENTE** | Usuario puede navegar fluidamente entre los 6+ proyectos del archivo desde el lightbox abierto con teclado y botones sin cerrar el modal; detalles técnicos visibles con cotas milimétricas; tests en `make check` verdes. | Navegación cíclica rota en extremos, modal se desincroniza con el proyecto activo o saltos visuales bruscos. |
| **SOL-08** | Frontend / Performance & SEO | **Auditoría de rendimiento, PWA y Open Graph.** Eliminar `@import` bloqueante de fuentes en CSS (migrar a preconnect/preload local), enlazar paquete de iconos PWA (`site.webmanifest`, `apple-touch-icon`, `favicon-32.png`), completar meta-etiquetas Open Graph / Twitter Card con imagen de previsualización y enriquecer Schema.org. | 🕓 **PENDIENTE** | HTML incluye todas las cabeceras PWA y Open Graph con imágenes existentes, CSS no usa `@import`, auditoría de assets en tests confirma cero 404 y `make check` pasa. | Fuentes externas bloquean render inicial, enlaces a iconos rotos en consola o previsualización social sin imagen/descripción. |
| **SOL-09** | A11y & Legal Portugal | **Accesibilidad de modales, RGPD y cumplimiento legal luso.** Implementar focus trap en modales (Lightbox y Concierge) y retorno de foco al elemento desencadenador; añadir skip-to-content; incorporar pie legal con política de privacidad RGPD, datos fiscales/estaleiro y enlace al Livro de Reclamações Eletrónico. | 🕓 **PENDIENTE** | TAB dentro de modales no escapa al fondo, ESC restaura foco exacto, aviso RGPD y enlace oficial a Livro de Reclamações presentes y verificados por tests en `make check`. | Foco perdido en modales, imposibilidad de navegar con teclado o enlaces legales inexistentes. |
| **SOL-10** | Producto / Entrega Cliente | **Manual de entrega a Carlos y CLI de gestión de leads.** Crear `docs/MANUAL_CLIENTE_CARLOS.md` con instrucciones directas para el cliente final (cómo consultar leads, desplegar en hosting comercial/Cloudflare y añadir nuevas obras al catálogo) y script `scripts/leads.py` para consultar/exportar contactos recibidos. | 🕓 **PENDIENTE** | Manual de cliente completo y comprensible sin jerga técnica de desarrollo; `scripts/leads.py` funcional para listar y exportar leads en CSV/JSON con tests automatizados; `make check` verde. | Documentación incompleta que impida al cliente operar el sitio o fallos en la herramienta de consulta de leads. |

---

## 2. HISTÓRICO DE TAREAS CERRADAS (MÁXIMO 5 EN COLA VIVA)

| # | Bloque | Descripción | Fecha Cierre | Agente |
|---|---|---|:---:|:---:|
| **SOL-04** | Infra / Merge | `make merge` desde un worktree de sesión (port de Noesis NOE-MERGE-WORKTREE-20261018): integra el destino en la rama, gates y staging en el worktree, publica HEAD y el checkout principal solo avanza por fast-forward si su trabajo sin commitear no choca (si choca, aviso). `scripts/test_merge_worktree.py` (en `make check`) con git real. | 2026-10-18 | Claude Opus 5.5 |
| **SOL-00** | Génesis | Creación de plataforma web inicial de alto patrón en HTML/CSS/JS | 2026-08-15 | Emanuel |
