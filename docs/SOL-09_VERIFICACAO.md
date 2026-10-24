# SOL-09 · Fontes, ícones e metadados · 24/10/2026

As folhas locais são descobertas diretamente no HTML pela ordem original:
`variables.css`, `typography.css`, `style.css`. Não há `@import` em `css/`.
Google Fonts usa `preload` como estilo, ativação após carregamento,
`display=swap`, preconnect e alternativa `noscript`.

Os estilos locais essenciais continuam síncronos para preservar a apresentação.
A verificação de pintura com a resposta de fontes retida confirma que as fontes
remotas não bloqueiam a primeira apresentação; não é uma pontuação Lighthouse
nem uma medição de Core Web Vitals em produção.

## Ícones e aplicação

`assets/icons/` contém o monograma existente em SVG Tiny 1.2, sem filtros,
e as versões rasterizadas em Chrome: PNG 180/192/512 px e ICO 16/32/48 px.
O manifest usa identidade SOLRAC, idioma `pt-PT`, modo standalone e
`theme_color`/`background_color` `#070707`. As referências são relativas ao
manifest e o âmbito/start URL regressam à raiz da aplicação, incluindo quando
publicada num subdiretório. Não foi acrescentado um service worker.

## Metadados públicos

A API de GitHub Pages do próprio repositório confirmou `status: built`,
`cname: null` e URL `https://silverg7.github.io/solrac-atelier/`.
A página e a fotografia de partilha existente
`assets/images/muros/muro-aparelhado-1280.webp` responderam HTTP 200 nessa URL.
Canonical, Open Graph, Twitter Card e JSON-LD usam essa publicação confirmada.
A fotografia mede 1280 × 622 px; os textos alternativos descrevem o muro.
Não foi inventada uma conta social.

O JSON-LD mantém `HomeAndConstructionBusiness` e acrescenta identidade por URL,
logótipo, imagem, zonas servidas, especialidades e catálogo de três serviços com
referência ao prestador. As dimensões usam `QuantitativeValue` com unidade E37
(pixel). O endereço, coordenadas e escalão de preço preexistentes foram preservados;
a validação estrutural não constitui verificação factual desses dados.

## Verificação

- `make check`: **71 testes aprovados**, incluindo seis novos testes em
  `scripts/test_performance_seo.py`, integrados no target.
- A nova suite usa o servidor real `scripts/server.py` numa porta efémera:
  ligações locais, scripts, imagens/srcset, fotografias do portfolio e ícones do
  manifest respondem HTTP 200; o manifest tem MIME JSON apropriado.
- Binários PNG/ICO verificados por assinatura/dimensões; fonte SVG verificada por
  XML, versão Tiny 1.2 e ausência de filtros.
- Open Graph: propriedades obrigatórias, idioma e imagem coerentes; Twitter Card:
  título, descrição, imagem e texto alternativo presentes no HTML inicial.
- JSON-LD: **38 verificações de propriedades**, incluindo domínio, herança e
  tipos de valores, contra o vocabulário oficial descarregado em 24/10/2026.
  SHA-256 do vocabulário: `0a4b8c4c910fc831ec8695196510973390906a5ee34dc6b862dfec4d21a12f74`.
  A suite local mantém as verificações do contrato sem depender da rede.
- `make check-browser BROWSER_PYTHON=<intérprete com Playwright>`: **cinco testes
  aprovados** em Chrome, incluindo 27 combinações de viewport/idioma existentes.
- Chrome adicional: fontes retidas a 390 px permitem `first-contentful-paint`,
  estilos locais aplicados, fundo `rgb(7, 7, 7)` e ausência de overflow; sem
  JavaScript a 1440 px, a página mantém estilos e solicita a alternativa de fontes.
  Nesse cenário sem JavaScript a resposta de fontes foi substituída por CSS vazio.
- Inspeção visual do ícone de 512 px e das capturas em
  `scratch/sol-09/` (fora do Git); `git diff --check` sem erros.

Referências: [Open Graph](https://ogp.me/),
[HomeAndConstructionBusiness](https://schema.org/HomeAndConstructionBusiness),
[hasOfferCatalog](https://schema.org/hasOfferCatalog),
[vocabulário oficial](https://schema.org/version/latest/schemaorg-current-https.jsonld),
[preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload).
A antiga referência oficial de Twitter Cards redireciona para a página geral de X;
a validação da card é local, sem confirmação de cache/preview por esse serviço.
