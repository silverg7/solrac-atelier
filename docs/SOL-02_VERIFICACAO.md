# SOL-02 · Verificação local · 22/10/2026

- 7 fotografias do álbum fornecido: capa e 6 fichas em muros, quintas e cantaria.
- 21 WebP locais, 640/1280/1920 px; total 5 357 450 bytes. As 6 miniaturas
  de 640 px somam 307 150 bytes. Ampliações da grelha carregadas ao abrir a ficha.
- `make check`: 8 testes aprovados, incluindo caminhos, categorias e limites de bytes.
- `node --check js/main.js` e `git diff --check`: aprovados.
- `make serve` + Chromium silencioso, em 1440×1000, 1024×1000 e 390×844:
  6 fichas, filtros com 2/2/2/6 resultados, 18 ampliações de 1920 px descodificadas,
  fecho por Escape, zero respostas HTTP de erro e zero erros JavaScript.
- Todas as 21 versões descodificadas com Pillow, dimensões conferidas com o manifesto,
  sem EXIF ou XMP. Capa e grelha revistas visualmente; monocromia preservada.
- Hero e grelha sem overflow horizontal nos três tamanhos. Existe overflow móvel
  no Concierge, fora deste ticket: causa e reprodução registadas em `SOL-BUG-01`.
- A origem não identifica as localidades: as fichas não atribuem estas obras ao
  Douro nem publicam as medidas, datas ou certificações das antigas fichas de exemplo.

Capturas e relatório da sessão ficam em `scratch/sol-02-*.png` e
`scratch/verification.json` no worktree (ignorados pelo Git). Originais mantidos
no álbum e cópias de trabalho em `scratch/originals/`; o site publica apenas WebP.
