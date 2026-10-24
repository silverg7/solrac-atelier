# SOLRAC · Blueprint prescritivo de interface

Contrato de SOL-BUG-02. Este documento rege alterações visuais incrementais no
HTML/CSS/JavaScript existente. A identidade é editorial, arquitetónica e
monocromática. Antes de editar, ler `AGENTS.md`, a tarefa e os ficheiros indicados
no mapa abaixo. Não é necessário criar um novo sistema de componentes.

**SETTLES_WHEN:** a alteração cumpre os tokens, o idioma, os estados e a matriz de
verificação; `make check` passa; o diff contém apenas o âmbito autorizado.
**FAILS_IF:** aparece cor cromática, texto de sistema noutra língua, estado de
sucesso sem confirmação de envio, overflow horizontal, scroll vertical aninhado
nos modais móveis, controlo inacessível ou qualquer gate falha. Corrigir antes de
integrar; uma captura isolada ou um teste de sintaxe não encerra a tarefa.

## 1. Mapa de fontes e responsabilidade

| Fonte | Responsabilidade | Regra de edição |
|---|---|---|
| `css/variables.css` | Paleta, famílias, escala, espaçamento, transições | Reutilizar o token pelo seu papel; alterar o dono, nunca remendar cada consumidor |
| `css/typography.css` | Títulos editoriais, texto e legendas técnicas | Conservar hierarquia e fallbacks; sem novas fontes |
| `css/style.css` | Layout, componentes e breakpoints | Editar a regra existente e a sua variante móvel; evitar overrides duplicados |
| `index.html` | Estrutura, rótulos, placeholders, ARIA e ações | PT-PT; preservar IDs, âncoras, `name`, `value` e canais de contacto |
| `js/main.js` · `PROJECTS_DATA` | Arquivo fotográfico, filtros e lightbox | Traduzir apresentação sem inventar factos; conservar IDs, categorias, caminhos e dimensões |
| `js/main.js` · `showInquiryFeedback` | Confirmação, falha de envio e canais manuais | Única fonte da apresentação dinâmica dos dois formulários |
| `scripts/test_concierge_flow.py` | Contratos de interface e execução do renderer | Acrescentar cobertura de comportamento quando houver uma regressão real |
| `scripts/test_lead_pipeline.py` | API local, antispam, persistência e resiliência | Manter o contrato do pedido; testar sem contactos reais |
| `scripts/test_portfolio_assets.py` | Integridade e orçamento de imagens | Não regravar assets numa correção de CSS |
| `docs/BRANDING.md` | Contexto editorial da marca | Para implementação, os tokens e este contrato fixam os valores exatos |

A variante bilingue com seletor e persistência pertence a SOL-06. A interface
atual tem uma única língua de sistema, `pt-PT`; SOL-BUG-02 não cria um motor i18n.

## 2. Tokens obrigatórios

### Cor

| Papel | Token | Valor |
|---|---|---|
| Fundo | `--bg-primary` / `--text-inverse` | `#070707` |
| Superfície | `--bg-surface` | `#0d0d0d` |
| Superfície elevada / hover | `--bg-surface-elevated` / `--bg-surface-hover` | `#1f1f1f` |
| Texto e ação principal | `--text-primary` | `#f5f5f5` |
| Texto secundário | `--text-secondary` | `#a0a0a0` |
| Legendas discretas | `--text-muted` | `#858585` |
| Sobreposição | `--bg-overlay` | Preto `rgba(7, 7, 7, 0.94)` |
| Linhas | `--border-subtle`, `--border-medium`, `--border-strong`, `--border-light` | Branco com alfa 0.08, 0.16, 0.32, 0.65 |

Em regras novas usar `var(...)`, incluindo SVG com `currentColor` ou tokens.
Branco/preto com transparência é admissível para sombras e divisórias. Os
valores legados de cinzento neutro existentes não autorizam uma segunda paleta.
Todos os canais R/G/B de uma cor têm de ser iguais. Não existem cores semânticas
verdes, vermelhas, douradas ou azuis: sucesso e falha distinguem-se por texto e
símbolo (`✓` / `!`). Nunca usar um visto para um pedido que ficou por enviar.
A regra aplica-se a ícones, status-dot, bordas, sombras, SVG, foco e hover.

### Tipografia, geometria e movimento

| Uso | Contrato |
|---|---|
| Títulos | `--font-serif`: Cinzel, Cormorant Garamond, Didot, serif; títulos maiúsculos definidos no CSS |
| Texto e campos | `--font-sans`: Plus Jakarta Sans e fallbacks de sistema |
| Legendas, recibos, ações | `--font-mono`: JetBrains Mono, Space Mono, monospace |
| Escala editorial | `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`; conservar `clamp()` |
| Corpo | `--text-body-lg` 1.125rem, `--text-body` 0.9375rem, `--text-body-sm` 0.8125rem |
| Texto micro | `--text-micro` 0.6875rem; não reduzir para fazer caber uma tradução |
| Espaçamento | `--space-xs` 0.5rem, `sm` 1rem, `md` 1.5rem, `lg` 2.5rem, `xl` 4.5rem, `2xl` 7.5rem |
| Contentor | `--max-width` 1440px, `--container-padding` fluido, cabeçalho 84px |
| Geometria | Linhas de 1px, cantos retos; círculo apenas no indicador/ícone existente |
| Movimento | `--transition-fast`, `normal`, `slow` com easings existentes; sem novas animações decorativas |

Não misturar serif nos campos nem introduzir fontes por componente. Testar
com fontes remotas indisponíveis: o fallback tem de permitir leitura e ações.

## 3. Componentes e estados

### Ações e feedback

- `.btn-concierge`: ação principal, superfície clara e texto escuro; hover
  transparente com texto claro. `.btn-outline`: ação secundária, contorno.
- `.btn-submit-luxury`: envio do formulário; durante transporte, desativado,
  `A ENVIAR PEDIDO…`; restaurar texto e disponibilidade no fim.
- `.feedback-actions`: grelha de duas colunas `minmax(0, 1fr)`, gap `--space-sm`;
  primeira ação ocupa a linha inteira. Até 768px: uma coluna.
- Ordem fixa nos dois cartões: **Enviar outro pedido / Fechar consulta** como
  principal, **Enviar por email** e **Enviar por WhatsApp** como secundárias.
- Ações do feedback: largura integral da célula, mínimo 48px de altura, texto
  centrado com quebra de linha, padding `--space-sm`, foco visível de 2px.
  Usar `<button type="button">` para ação e `<a>` para navegação/canal externo.
- `.concierge-feedback-card`: superfície, contorno e espaçamento existentes;
  `.feedback-icon`: texto principal sobre superfície elevada; sem cor de alerta.
- Recibo e descrição quebram palavras longas. Nunca resolver overflow escondendo
  conteúdo, reduzindo a fonte ou impondo `white-space: nowrap` às ações.

| Estado | Título e símbolo | Recibo / próximo passo |
|---|---|---|
| Inicial | Formulário visível; feedback oculto | Sem confirmação antecipada |
| A enviar | Botão desativado | Aguardar resultado do transporte |
| API confirma | `Pedido recebido` / `✓` | `PEDIDO RECEBIDO`; aguardar contacto da equipa |
| Transporte falha | `Pedido por enviar` / `!` | `ENVIO MANUAL NECESSÁRIO`; enviar por email ou WhatsApp |
| Novo pedido | Formulário reposto e feedback oculto | Reiniciar o tempo de carregamento usado pelo antispam |
| Reabrir modal | Formulário visível e feedback oculto | Preservar o preenchimento de obra quando aplicável |

`[hidden]` tem de prevalecer sobre `display: flex/grid`: o reset global contém
`display: none !important`. Nunca remover esta regra para mostrar um componente;
retirar o atributo/alterar a propriedade `hidden` no JavaScript.

### Formulários e idioma

- Documento com `<html lang="pt-PT">`; rótulos, ajuda, opções, feedback,
  placeholders, texto ARIA e mensagens geradas em português de Portugal.
- Léxico: **ficheiro**, **telemóvel/telefone**, **gabinete**, **pedido**,
  **direção técnica**, **cantaria aparelhada**, **muro de contenção**, **obra**.
  A marca SOLRAC TECTONICS, email, WhatsApp, IDs e dados escritos pelo visitante
  não são traduções de sistema.
- `client_role=architect` e `project_type=heritage_restoration`, por exemplo,
  continuam iguais no payload. Mostrar o texto da opção selecionada ao cliente;
  se não existir, usar `Cliente` / `Intervenção em pedra`, sempre em PT-PT.
- Email e WhatsApp usam as mesmas etiquetas PT-PT e a mesma referência do cartão;
  construir os URLs com codificação, nunca concatenar texto livre sem escape.
- Inserir nome, localização, referência e mensagens com `textContent`, nunca
  `innerHTML`. Conservar conteúdo do visitante sem interpretá-lo como HTML.
- Falha de rede não significa entrega. Cache local existente não é prova de
  envio. Não prometer atribuição, prioridade, prazo ou encriptação sem evidência.
- Manter campos obrigatórios, honeypot fora do foco e valores de API existentes.
  `.form-row`: duas colunas que podem encolher; até 768px, uma coluna.

### Modais e scroll

| Superfície | Dono do scroll vertical | Regras |
|---|---|---|
| Concierge | `.concierge-modal-dialog` | Overlay sem scroll; body interno sem `overflow-y: auto`; todo o diálogo, incluindo fechar e rodapé, é alcançável |
| Lightbox >1024px | `.lightbox-sidebar` | Duas colunas que podem encolher, imagem contida |
| Lightbox ≤1024px | `.lightbox-dialog` | Bloco único com scroll; sidebar com overflow visível |

- Overlay: `width: 100%`, `height: 100vh` seguido de `height: 100dvh`.
  Não usar `100vw`, que pode incluir a largura da barra do documento.
- Concierge: diálogo com `max-height: 100%`, `min-width: 0`; até 768px ocupa a
  área disponível, sem margens; cabeçalho permite quebra e botão fechar ≥44px.
- Documento bloqueado enquanto um modal está aberto. ESC, clique de fecho e
  transição lightbox→concierge têm de conservar esse comportamento.
- Testar tanto o formulário comprido como o feedback curto, inclusive horizontal
  e com pouca altura. O número de ancestrais/descendentes realmente deslocáveis
  verticalmente dentro do modal é no máximo um em móvel.
- Não esconder barras globalmente como reparação. Não criar um segundo painel
  com scroll para preservar um cabeçalho fixo. Focus trap e retorno de foco
  completo são âmbito de SOL-09; este ticket conserva os controlos existentes.

## 4. Receita mecânica para alterações

1. Identificar o seletor/estado dono no mapa; ler o componente e os breakpoints.
2. Declarar o resultado esperado e a condição de falha da tarefa concreta.
3. Reutilizar tokens, classes e funções; alterar o mínimo de fontes necessário.
4. Rever a variante in-page e a variante modal em conjunto; não copiar renderer.
5. Confirmar idioma, payload, visibilidade, foco visível e canais manuais.
6. Executar a matriz abaixo no servidor local e inspecionar capturas reais.
7. Executar `make check`, rever `git diff --check` e o diff completo.
8. Com gates verdes, seguir o fecho e merge locais do ticket. Não executar
   automaticamente o ticket seguinte nem alterar outros repositórios.

## 5. Checklist fail-closed

- [ ] IDs/classes e valores de API preservados; nenhuma dependência nova.
- [ ] Tokens canónicos usados; nenhum canal RGB desigual, incluindo transparências.
- [ ] `lang`, rótulos, placeholders, ARIA, dados do arquivo e mensagens em PT-PT.
- [ ] API confirmada e falha de rede verificadas nos dois formulários.
- [ ] Cartão visível implica formulário oculto; reset/reabertura funcionam.
- [ ] Nome com `<`, `&`, palavras longas e referência não executam HTML.
- [ ] Email/WhatsApp têm referência e rótulos legíveis, sem enums técnicos.
- [ ] As três ações cabem, quebram texto e têm altura mínima de 48px.
- [ ] 320×568, 390×844, 768×1024, 844×390 e 1440×1000 verificados.
- [ ] Sem overflow horizontal no documento, cartão, diálogo ou ações.
- [ ] No máximo um scroll vertical móvel por modal; todos os controlos alcançáveis.
- [ ] Lightbox→concierge mantém pré-preenchimento; ESC/fechar/reset funcionam.
- [ ] Capturas desktop/móvel revistas; zero exceções JavaScript.
- [ ] `make check` e `git diff --check` verdes; nenhum facto novo de portfolio.

`make check` executa testes de estrutura/recursos, integração Git, pipeline de
leads e o renderer de feedback em Node. Deteta a paleta cromática, tokens,
contrato de `hidden`, hierarquia das ações e estados online/offline dos dois
cartões. Geometria, scroll e renderização exigem também navegador real; não
considerar os testes estáticos como evidência visual.

## 6. Verificação de SOL-BUG-02 · 24-10-2026

- `make check`: 31 testes aprovados; `git diff --check`: sem erros.
- Chromium/Playwright em servidor HTTP local: 20 cenários (cinco viewports ×
  dois formulários × API confirmada/falha de rede), repetidos com fontes remotas
  bloqueadas e com carregamento normal de fontes: 40 cenários aprovados.
- Verificados geometria real das ações (≥48px), ausência de overflow horizontal,
  no máximo um dono do scroll por modal móvel, acesso ao último botão em ecrã
  curto, lightbox→concierge, pré-preenchimento, reset, ESC e zero exceções JS.
- Capturas revistas: formulário móvel, feedback móvel com falha e feedback
  desktop confirmado. Os pedidos de navegador usaram dados sintéticos e respostas
  de API interceptadas; não enviaram email/WhatsApp nem criaram contactos reais.
  A persistência real do servidor é coberta separadamente pela suite local.
- Corrigida também a largura da grelha/cartões de dupla mestria a 320px, detetada
  na verificação da página em PT-PT; o ajuste conserva conteúdo e hierarquia.
