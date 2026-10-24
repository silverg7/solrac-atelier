# SOL-03 · Verificação do Módulo Concierge & Contacto Técnico · 24/10/2026

## 1. Contrato Dual-Boundary (RMAS - Pilar 1)
- **SETTLES_WHEN:** Botão de concierge funcional com modal e ligação direta de contacto sem dependências externas caídas.
  - Verificado: Modal de Concierge arquitetónico (`#concierge-modal`) com canais diretos (`director@solrac-tectonics.com`, linha direta/WhatsApp), intake prioritário e fallback nativo para cliente de email.
- **FAILS_IF:** Enlaces mortos, erros de consola JS ou layout shift.
  - Verificado: Zero erros de consola JS (`Runtime.consoleAPICalled` = 0, `Runtime.exceptionThrown` = 0), zero ligações mortas (todas as âncoras `#` resolvem em nós existentes do DOM), e layout shift eliminado a 390 px, 1024 px e 1440 px.

## 2. Eliminação do Overflow Móvel (SOL-BUG-01)
- A 390 px (viewport móvel iPhone), o documento apresentava anteriormente `scrollWidth` de 511 px devido ao padding fixo de 72 px em `.concierge-form` e à largura intrínseca dos `<select>` com texto longo.
- Correções aplicadas em `css/style.css`:
  - `min-width: 0; max-width: 100%;` em controlos de formulário e contentores da grelha.
  - `text-overflow: ellipsis; white-space: nowrap;` em `.form-select`.
  - Padding móvel proporcional (`1.5rem 1.25rem`) em `.concierge-form`.
  - Grelha flexível com `grid-template-columns: minmax(0, 1fr);`.
- Resultado medido via Chromium headless CDP:
  - `scrollWidth: 390, innerWidth: 390, overflows: []`. Zero desbordamento horizontal.

## 3. Experiência de Concierge & Semiótica Monocromática de Luxo
- Substituição do aviso intrusivo `alert()` por cartões de confirmação técnica in-situ (`.concierge-feedback-card`) com geração de código de referência de dossier (ex.: `SOL-2026-XXXX`).
- Integração bidirecional do Arquivo com o Concierge: ao clicar em "Inquire on Similar Commission" no Lightbox, o modal de Concierge abre automaticamente com a natureza da comissão e notas pré-preenchidas com a obra em consulta.
- Menu móvel funcional (`.mobile-toggle`) com acesso direto ao desk de Concierge.
