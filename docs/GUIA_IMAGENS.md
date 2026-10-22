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
