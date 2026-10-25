# SOL-11 · Galeria multi-fotografia

Cada uma das seis obras apresenta duas fotografias reais e independentes, com
proveniência e correspondências visuais descritas em `GUIA_IMAGENS.md` e no
manifesto. Foram acrescentados 18 WebP locais; o total de 39 versões mantém-se
abaixo do orçamento existente de 8 MiB.

O seletor inferior muda apenas a fotografia da obra aberta, por clique,
Enter/Espaço, ←/→ e Home/End. Os controlos de obra e as setas fora do seletor
mantêm a navegação cíclica entre obras, respeitando o filtro. Mudar idioma ou
alternar o desenho técnico conserva a fotografia; abrir outra obra reinicia na
primeira. O modal e o elemento de imagem mantêm-se durante a seleção.

Verificação em 25-10-2026:

- `make check PYTHON=/home/emanuel/Documentos/solrac-atelier/.venv/bin/python3`:
  **77 testes, OK**, incluindo `scripts/test_lightbox_multifoto.py` em Chromium.
- `make check-browser BROWSER_PYTHON=/home/emanuel/Documentos/solrac-atelier/.venv/bin/python3`:
  **5 testes, OK**.
- `node --check js/main.js`, `node --check js/i18n.js`, `git diff --check`: OK.
- Servidor HTTP local real: descodificação das doze fotografias, seleção rápida,
  teclado, restauro de foco, vista técnica, PT/EN/ES e larguras 320/390/1024/1440 px.
  Sem respostas HTTP de erro nem erros JavaScript nas interações verificadas;
  sem sobreposição entre imagem e seletor ou deslocação da página ao selecionar.
- Adaptadores DOM dos testes anteriores atualizados para incluir o novo seletor;
  a verificação de focus trap continua ativa.

Capturas locais revistas visualmente, sem aprovação artística humana implícita:

- [Desktop, 1440 × 900](verificacao/SOL-11-desktop.png)
- [Telemóvel, 390 × 900](verificacao/SOL-11-mobile.png)
