# SOL-12-REV · Revisão do guia para Carlos

25 de outubro de 2026 · Codex

## Entrega

- `docs/DOSSIER_CLIENTE_CARLOS.pdf`: edição 02, seis páginas A4, português de Portugal.
- `docs/dossier_cliente_carlos.html`: fonte editável; regeneração com `python3 scripts/generar_dossier_pdf.py`.
- Capa monocromática e duas vistas do mesmo muro com fotografias existentes no manifesto do projeto; sem novas imagens geradas.
- Instruções de utilização para Carlos e apêndice separado de operação local.

## Correções de conteúdo

A edição anterior indicava uma área de consulta do Concierge que não existe na aplicação. A revisão explica a consulta local com `scripts/leads.py`, a ausência de alertas automáticos por email e a necessidade de definir como os registos chegam a Carlos.

A confirmação do serviço e o envio manual têm instruções diferentes: abrir email ou WhatsApp não conclui o envio, e nesse percurso as fotografias têm de ser anexadas pelo visitante. A primeira resposta em 24 horas é apresentada como objetivo recomendado.

O apêndice descreve as quatro opções reais da CLI, os dados incluídos no CSV/JSON e a cópia conjunta do registo e das imagens. Não inclui dados reais de pedidos.

## Verificação realizada

- `make check`: **82 testes aprovados**, 77,775 segundos.
- PDF regenerado com o script existente e Chromium; seis páginas A4, texto extraível, fontes incorporadas e quatro destinos internos funcionais.
- Seis páginas renderizadas com Poppler e inspecionadas visualmente, incluindo revisão das legendas das fotografias e das páginas mais densas.
- Fonte HTML servida num servidor temporário reservado a localhost: três imagens carregadas, quatro âncoras válidas e zero erros JavaScript. Sem elementos fora da largura da página; espaço mínimo medido de 21,64 mm entre o conteúdo e o início do rodapé.
- Serviço do projeto iniciado em `127.0.0.1:8081`, porque a porta 8080 já estava ocupada. Página, fotografia e `/api/inquiry/health` responderam 200; documento interno e ficheiro de pedidos responderam 403, como previsto.
- Comandos da CLI confrontados com a implementação e cobertos pela suite existente, com dados temporários.

As imagens de inspeção e as medições ficam em `scratch/sol-12-revision/`, ignorado pelo Git.

## Âmbito da entrega

Este trabalho revê o documento e a sua correspondência com o funcionamento local. A instalação publicada, a titularidade dos contactos configurados e o processo efetivo de receção por Carlos têm de ser verificados na entrega do site. O ticket SOL-13 conserva a auditoria final da aplicação.
