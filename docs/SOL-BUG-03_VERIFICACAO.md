# SOL-BUG-03 · Revisão e correções · 24/10/2026

Revisão do estado `59ed391`, incluindo SOL-08 e os fluxos anteriores do frontend.
Todos os testes de pedidos usam dados sintéticos e armazenamento temporário.

| Prioridade | Falha reproduzida | Correção |
|---|---|---|
| P1 | `/data/…` devolvia 403, mas `/%64ata/…` e `/data%2f…` devolviam o ficheiro; HEAD também contornava a proteção. | GET e HEAD autorizam o caminho descodificado e resolvido. Apenas a página e os diretórios públicos são servidos; listagens e symlinks para dados privados são bloqueados. |
| P1 | Dois pedidos simultâneos com a mesma referência recebiam 201, partilhavam a referência e sobrescreviam a mesma fotografia. Um hash do registo deixava de corresponder ao disco. | Bloqueio entre processos cobre reserva da referência, fotografias e registo. Colisões recebem referências distintas. |
| P1 | Uma falha depois da escrita do JSONL podia deixar um registo incompleto ou sem as fotografias removidas pelo rollback. | O append restaura o tamanho anterior se a escrita/fsync falhar. Um log ilegível/corrompido impede novas reservas; diretórios de fotografias existentes não são reutilizados. |
| P2 | A 800/1024 px o cabeçalho cortava navegação e CTA; a 320/390 px o hero excedia o viewport, chegando a 445 px em PT. | Menu compacto abaixo de 1280 px, hero com largura explícita, grelha flexível e badge com quebra de linha. O menu permite scroll em ecrãs baixos. |
| P2 | O envio durante a compressão confirmava o pedido com `photos: []`; a fotografia aparecia depois no recibo sem ter sido enviada. | O envio aguarda o lote pendente, bloqueia a edição durante a submissão e impede submissões simultâneas do mesmo formulário. |
| P2 | As fotografias de um pedido confirmado continuavam editáveis sem novo envio. | O recibo conserva as fotografias entregues e permite descarregá-las; alterar o lote exige iniciar outro pedido. O modo offline conserva preparação manual. |
| P2 | Fechar antes da resposta e reabrir apagava a confirmação, permitindo reenviar o pedido sem perceber que já tinha chegado. | Reabrir conserva o estado e o recibo. «Enviar outro pedido» limpa explicitamente o formulário; respostas a um modal fechado não deslocam o foco. |
| P2 | Feedback EN/ES recebia textos fixos em PT; traduzir removia os dados personalizados. Entidades como `&amp;` e `&copy;` eram apresentadas literalmente. | Dicionários com texto Unicode, feedback interpolado como texto e atualizado no idioma corrente. Labels da ficha, notas iniciais e canais de fallback também usam traduções. |
| P2 | Timestamps NaN/Infinity passavam a validação temporal e podiam terminar a ligação sem resposta JSON. | Timestamps não finitos são rejeitados com 400 antes da persistência. |

O recorte responsive e parte da deriva de tradução já estavam presentes antes de SOL-08.
A revisão não atribui todos os problemas à última implementação.

## Evidência de verificação

- `make check`: **65 testes aprovados**, incluindo 8 novos testes de regressão.
- `make check-browser BROWSER_PYTHON=<intérprete com Playwright>`: **5 testes aprovados** em Chrome real, incluindo 27 combinações de viewport/idioma (320, 390, 768, 800, 1024, 1200, 1279, 1280 e 1440 px × PT/EN/ES).
- Testes de navegador: compressão atrasada seguida de envio HTTP real e fotografia persistida; ausência de envio antes da compressão; recibo tardio; envio duplicado bloqueado; traduções com dados preservados; modo offline; reset/foco; Tab/Shift+Tab/Escape e transição ficha → concierge.
- Testes de servidor: rotas codificadas e HEAD, symlink privado, quatro pedidos concorrentes com referência preferida igual e verificação SHA-256 de cada fotografia; rollback de fotos e de append com falha de fsync; log corrompido e timestamps não finitos.
- `git diff --check`: sem erros.
- Inspeção das capturas de 320/800/1440 px: paleta e linguagem editorial monocromática preservadas.

A suite estrutural usa Python stdlib e Node. A suite de navegador é explícita,
com dependência de desenvolvimento em `requirements-browser.txt`, e não altera o runtime do site.
Esta verificação cobre os comportamentos descritos; não é uma certificação integral de WCAG,
um teste com leitor de ecrã ou uma avaliação jurídica dos textos legais.
