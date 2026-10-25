# Gestão de imagens do portfolio · SOLRAC

## Seleção SOL-02

Fotografias provenientes do álbum **Muros pedra**, fornecido pelo responsável do
projeto em 22 de outubro de 2026. As posições abaixo correspondem à ordem do álbum
na importação. O link partilhado e os URLs temporários de descarga não fazem parte
do site. Os originais continuam no álbum, sem alterações.

| Pasta / nome base | Posição no álbum | Conteúdo visível |
|---|---:|---|
| `hero/cantaria-esquina` | 20 | Esquina de muro com pedras aparelhadas; recorte 4:5 para capa |
| `muros/muro-curvo` | 6 | Muro de contenção com alinhamento curvo |
| `muros/muro-aparelhado` | 21 | Muro de blocos aparelhados junto a uma entrada |
| `quintas/portal-rural` | 28 | Empena e portal de edifício rural em reabilitação |
| `quintas/reabilitacao-pedra` | 32 | Alvenaria e ombreiras de edifício rural em obra |
| `cantaria/escada-detalhe` | 54 | Encontro de cantaria inclinada com alvenaria sob uma escada |
| `cantaria/degraus-macicos` | 66 | Degraus maciços com remates laterais |

As legendas descrevem apenas os elementos visíveis. O álbum não identifica a
localização das obras: não é atribuído nenhum concelho ou quinta no Douro às
fotografias. Datas de execução, medidas, proveniências de pedreira e certificações
das antigas fichas de exemplo foram retiradas destas fichas.

## Ficheiros e carregamento

- Cada fotografia dispõe de versões WebP de **640, 1280 e 1920 px de largura**.
  As proporções originais são mantidas nas fichas; a capa usa um recorte 4:5.
- A grelha pede 640 ou 1280 px com `srcset`, `sizes`, `loading="lazy"` e
  `decoding="async"`. A imagem de 1920 px é pedida ao abrir o lightbox.
- A capa tem `fetchpriority="high"` e três larguras responsivas. Os atributos
  `width` e `height` e as caixas CSS reservam o espaço das fotografias.
- Os ficheiros conservam a cor; o CSS aplica o filtro monocromático, também no hover
  e no lightbox. Não há dependência de Google Photos durante a navegação.
- A exportação corrige a orientação e elimina EXIF, GPS e outros metadados pessoais.
  Não foram usadas imagens sintéticas nem bancos de imagem.

`assets/images/manifest.json` regista a posição de origem, as dimensões originais,
o SHA-256 do ficheiro recebido, as dimensões e os bytes de cada versão publicada.
Orçamento verificado em `make check`: até 100 KiB por miniatura, 700 KiB por
ficheiro e 8 MiB para o conjunto de versões. As sete fotografias têm 21 versões;
o conjunto ocupa cerca de 5,1 MiB, sem ser transferido integralmente ao abrir a página.

## Atualizar a seleção

1. Preservar o original na origem e preparar versões WebP, sem ampliar fotografias
   pequenas. Na seleção inicial foi usado Pillow, qualidade 80 (74 na capa).
2. Guardar as versões na pasta correspondente e atualizar `manifest.json`.
3. Atualizar `PROJECTS_DATA` em `js/main.js`: `imageBase`, `image`, dimensões, texto
   alternativo e descrição factual. A capa é configurada em `index.html`.
   Copiar ficheiros para uma pasta não cria fichas automaticamente.
4. Executar `make check`, `node --check js/main.js` e `make serve`. Verificar a
   grelha em desktop e telemóvel, os três filtros e a ampliação de cada fotografia.
   Confirmar ausência de imagens partidas, erros de consola e pedidos 404.

## SOL-11 · Galerias por obra

Cada uma das seis fichas dispõe agora de duas fotografias independentes do álbum,
com a primeira seleção preservada. A segunda fotografia não é um recorte nem uma
variante de resolução da primeira. Correspondências revistas visualmente pelos
elementos construídos e pela envolvente:

| Ficha | Posições no álbum | Correspondência visível |
|---|---|---|
| `muro-curvo` | 6, 5 | Curva, árvore e escada de remate do mesmo muro |
| `muro-aparelhado` | 21, 19 | Fiadas e entrada recuada em betão, vistas frontal e oblíqua |
| `portal-rural` | 28, 29 | Empena, abertura e blocos das ombreiras |
| `reabilitacao-pedra` | 32, 31 | Mesmos vãos, paredes e placas azuis no interior |
| `escada-detalhe` | 54, 56 | Fiada diagonal, apoio irregular e fachada vermelha |
| `degraus-macicos` | 66, 67 | Mesmo lanço, remates laterais e entrada |

O manifesto associa explicitamente cada fotografia à ficha (`project_id`). As novas
versões WebP usam qualidade 52 e larguras 640/1280/1920; o conjunto completo mantém
39 ficheiros abaixo do orçamento existente de 8 MiB (8 205 374 bytes). O SHA-256
regista os bytes recebidos na descarga, limitada a 1920 px; `source_dimensions`
regista as dimensões indicadas no álbum. Sem EXIF ou URLs temporários no site.

No lightbox, clicar nas miniaturas ou usar Enter/Espaço seleciona a fotografia.
Com foco no seletor, ←/→ percorrem as fotografias; Home/End selecionam a primeira
ou a última. Fora do seletor, ←/→ e os controlos de obra mantêm a navegação entre
fichas, incluindo os filtros. A fotografia selecionada é preservada ao alternar
idioma ou detalhe técnico e regressa à primeira ao abrir outra obra.
