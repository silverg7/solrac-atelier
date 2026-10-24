/* ==========================================================================
   SOLRAC TECTONICS · STONECRAFT & ARCHITECTURAL ENGINEERING
   NATIVE INSTANT I18N ENGINE (PT / EN / ES) · ZERO-DEP & CLS=0
   ========================================================================== */

(function (global) {
  'use strict';

  const SUPPORTED_LANGUAGES = ['pt', 'en', 'es'];
  const DEFAULT_LANGUAGE = 'pt';
  const STORAGE_KEY = 'solrac_lang';

  const TRANSLATIONS = {
    pt: {
      "lightbox.views": "Vista da obra",
      "lightbox.photo": "Fotografia",
      "lightbox.technical": "Detalhe técnico",
      "lightbox.detail_label": "Estudo construtivo",
      "lightbox.masonry": "Aparelho · alçado",
      "lightbox.stone": "Cantaria · secção",
      "lightbox.drain": "Drenagem · secção",
      "lightbox.drawing": "Esquemas construtivos com cotas indicativas em milímetros",
      "lightbox.indicative": "Esquemas de princípio · cotas indicativas, não medidas da obra. Dimensionamento sujeito a levantamento e projeto.",
      "lightbox.navigation": "Navegação de obras",
      "lightbox.previous": "Obra anterior",
      "lightbox.next": "Obra seguinte",
      "lightbox.left": "←",
      "lightbox.right": "→",
      "inquiry.photos.title": "Orçamento express · fotografias da obra",
      "inquiry.photos.choose": "Selecionar ou arrastar 1–4 fotografias",
      "inquiry.photos.help": "JPG, PNG ou WebP · até 12 MB por foto (máx. 4). Pré-visualização e compressão locais com envio integrado no formulário; se offline, guarde e anexe no WhatsApp.",
      "inquiry.photos.reference": "Referência local",
      "inquiry.photos.whatsapp": "WhatsApp · pedir agendamento em menos de 24 h",
      "inquiry.photos.timing": "Envie uma vista geral, um pormenor e a localização. Solicite contacto em menos de 24 h; o orçamento depende da análise técnica.",
      "inquiry.photos.preview": "Pré-visualização da fotografia da obra",
      "inquiry.photos.save": "Guardar",
      "inquiry.photos.remove": "Retirar foto",
      "inquiry.photos.limit": "Máximo de 4 fotos. Retire uma antes de adicionar outras.",
      "inquiry.photos.processing": "A preparar fotografias…",
      "inquiry.photos.error": "Uma foto não pôde ser preparada. Use JPG, PNG ou WebP até 12 MB / 40 MP. As restantes foram mantidas.",
      "inquiry.photos.message": "SOLRAC — Pedido de orçamento express",
      "inquiry.photos.instructions": "Vou anexar 1–4 fotos da obra: vista geral, pormenores de pedra e acesso. Solicito contacto e agendamento para orçamento em menos de 24 h.",

      // Brand & Meta
      "meta.title": "SOLRAC TECTONICS · Cantaria &amp; Engenharia de Pedra | Porto",
      "brand.subtitle": "TECTONICS · PORTO",
      "i18n.switcher_aria": "Seleção de idioma",

      // Navigation
      "nav.works": "Obras selecionadas",
      "nav.mastery": "A dupla mestria",
      "nav.method": "O método",
      "nav.inquiry": "Consulta privada",
      "nav.mobile_cta": "Consulta técnica privada",
      "nav.header_cta": "Pedir consulta",
      "nav.mobile_toggle": "Abrir ou fechar o menu de navegação",

      // Hero
      "hero.coords": "COORD: 41.1579° N, 8.6291° W · GRANDE PORTO &amp; VALE DO DOURO",
      "hero.status": "CAPACIDADE TÉCNICA DISPONÍVEL (3.º/4.º TRIMESTRE 2026)",
      "hero.badge": "Engenharia de Pedra &amp; Cantaria de Autor",
      "hero.title_part1": "A tectónica da pedra.",
      "hero.title_part2": "O rigor da engenharia.",
      "hero.description": "Muros de contenção ciclópicos, cantaria de granito de corte preciso e conservação de património. Concebidos com o cálculo da <strong>Direção Técnica</strong> e esculpidos por um <strong>Mestre Canteiro</strong>.",
      "hero.explore": "Explorar arquivo",
      "hero.mastery": "A dupla mestria",
      "hero.frame_title": "ARQUIVO #01 · CANTARIA APARELHADA",
      "hero.frame_subtitle": "Pormenor de esquina · arquivo de cantaria",
      "hero.frame_type": "ALVENARIA DE PEDRA",
      "hero.image_alt": "Esquina de um muro de cantaria aparelhada com fiadas de pedra interligadas",
      "hero.stat1_val": "±1.0mm",
      "hero.stat1_label": "Tolerância de alinhamento",
      "hero.stat2_val": "EC-7",
      "hero.stat2_label": "Cálculo geotécnico &amp; drenagem oculta",
      "hero.stat3_val": "100%",
      "hero.stat3_label": "Granito maciço do Norte de Portugal",
      "hero.stat4_val": "Excelência",
      "hero.stat4_label": "Direção técnica integral em obra",

      // Section 01: Dual Mastery
      "mastery.section": "01 / DIFERENCIAÇÃO TÉCNICA",
      "mastery.title": "A dupla mestria",
      "mastery.subtitle": "A distância entre o desenho em gabinete e a execução em obra afeta muitos projetos de arquitetura. A SOLRAC une o cálculo técnico à mestria da cantaria para aproximar estas duas etapas.",
      "mastery.card1_label": "RIGOR TÉCNICO",
      "mastery.card1_title": "A direção técnica",
      "mastery.card1_feat1": "<strong>Cálculo de impulsos de terras:</strong> Dimensionamento por gravidade e contrafortes para contenção de encostas, prevenindo deslizamentos e microfissuras.",
      "mastery.card1_feat2": "<strong>Drenagem subterrânea:</strong> Membranas geotêxteis multicamada e condutas de descompressão para alívio da pressão hidrostática.",
      "mastery.card1_feat3": "<strong>Colaboração com gabinetes:</strong> Diálogo com gabinetes de arquitetura, leitura de desenhos CAD e verificação rigorosa de tolerâncias.",
      "mastery.card1_quote": "«A elegância intemporal da pedra exige domínio da água subterrânea e da física estrutural com precisão milimétrica.»",
      "mastery.card2_label": "SABER DE OFÍCIO",
      "mastery.card2_title": "O mestre canteiro",
      "mastery.card2_feat1": "<strong>Intuição mineral:</strong> Identificação dos planos naturais de clivagem e da orientação do grão do granito português para cortes limpos.",
      "mastery.card2_feat2": "<strong>Trabalho artesanal:</strong> Trabalho à mão, bujardagem e acabamento flamejado para superfícies tácteis sem juntas de argamassa visíveis.",
      "mastery.card2_feat3": "<strong>Geometrias tectónicas:</strong> Arcos de volta perfeita, escadas monolíticas em consola, cornijas históricas e cunhais de arestas precisas.",
      "mastery.card2_quote": "«A pedra tem memória. Cada golpe de maço deve respeitar o bloco da pedreira para que a estrutura atravesse os séculos.»",

      // Section 02: Selected Works
      "works.section": "02 / ARQUIVO DE OBRAS",
      "works.title": "Obras de arquitetura selecionadas",
      "works.subtitle": "Seleção fotográfica de muros de contenção, alvenaria rural e pormenores de cantaria do arquivo SOLRAC.",
      "works.filter_all": "Todas as obras",
      "works.filter_muros": "Muros de contenção",
      "works.filter_quintas": "Rural &amp; património",
      "works.filter_cantaria": "Cantaria de autor",
      "works.filter_label": "SELEÇÃO DE OBRAS",

      // Section 03: The Tectonic Method
      "method.section": "03 / PROTOCOLO DE EXECUÇÃO",
      "method.title": "O protocolo tectónico em 4 fases",
      "method.subtitle": "Cada obra SOLRAC segue um protocolo técnico rigoroso, desde a seleção dos blocos na pedreira até à certificação estrutural final.",
      "method.step1_title": "Estudo geotécnico &amp; seleção de blocos",
      "method.step1_desc": "Levantamento topográfico, cálculo de impulsos de terras e inspeção individual dos blocos de granito quanto à densidade mineral e ausência de microfissuras.",
      "method.step2_title": "Aparelhamento &amp; esquadria milimétrica",
      "method.step2_desc": "Aparelhamento geométrico e acabamento à medida (bujardado, flamejado ou picado à mão) de acordo com o projeto de arquitetura.",
      "method.step3_title": "Travamento estrutural &amp; drenagem oculta",
      "method.step3_desc": "Montagem de fiadas travadas, tubagem de alívio de águas subterrâneas e ancoragens em aço inoxidável de grau marítimo quando especificadas.",
      "method.step4_title": "Direção técnica &amp; certificação",
      "method.step4_desc": "Verificação do prumo por laser, ensaios de escoamento da drenagem e entrega da documentação de responsabilidade técnica para a durabilidade da obra.",

      // Section 04: Inquiry (Form & Details)
      "inquiry.section": "04 / PEDIDO DE CONSULTA TÉCNICA",
      "inquiry.title": "Consulta para arquitetos &amp; proprietários",
      "inquiry.intro": "A SOLRAC aceita um número limitado de obras por ano para assegurar a presença direta da direção técnica e do mestre canteiro em cada fase crítica.",
      "inquiry.collaboration": "Colaboramos com gabinetes de arquitetura, entidades de conservação do património e proprietários na Foz do Douro, Nevogilde, Gaia e nas quintas do Vale do Douro.",
      "inquiry.region.label": "ÁREA GEOGRÁFICA PRINCIPAL",
      "inquiry.region.value": "Foz do Douro · Nevogilde · Matosinhos Sul · Vila Nova de Gaia · Vale do Douro (Pinhão, Régua) · Minho &amp; Galiza.",
      "inquiry.field.website_trap": "Deixar em branco",
      "inquiry.field.client_name": "Nome / Gabinete",
      "inquiry.placeholder.client_name": "Ex.: Gabinete de Arquitetura Sampaio",
      "inquiry.field.client_role": "Perfil do cliente",
      "inquiry.option.architect": "Gabinete de arquitetura",
      "inquiry.option.private_owner": "Proprietário particular",
      "inquiry.option.developer": "Promotor imobiliário / Gestor de património",
      "inquiry.field.client_email": "Email profissional",
      "inquiry.placeholder.client_email": "gabinete@arquitetura.pt",
      "inquiry.field.client_phone": "Telefone / WhatsApp",
      "inquiry.placeholder.client_phone": "+351 9xx xxx xxx",
      "inquiry.field.project_type": "Tipo de intervenção",
      "inquiry.option.structural_wall": "Muro de contenção ciclópico",
      "inquiry.option.heritage_restoration": "Restauro de pedra em quinta / solar / património",
      "inquiry.option.bespoke_stonework": "Cantaria de autor / Portais",
      "inquiry.option.full_direction": "Direção técnica integral &amp; cantaria",
      "inquiry.field.location": "Local da obra",
      "inquiry.placeholder.location": "Ex.: Foz do Douro, Porto",
      "inquiry.field.project_notes": "Descrição do projeto &amp; requisitos técnicos",
      "inquiry.placeholder.project_notes": "Indique se já existem plantas, levantamentos estruturais ou tipos de pedra definidos…",
      "inquiry.submit": "Enviar pedido de viabilidade",

      // Feedback States
      "feedback.label": "ESTADO DO PEDIDO",
      "feedback.title.initial": "Pedido de consulta",
      "feedback.title.received": "Pedido recebido",
      "feedback.title.offline": "Pedido por enviar",
      "feedback.description.initial": "",
      "feedback.description.received": "O seu pedido foi recebido com sucesso. A direção técnica analisará as especificações e responderá com brevidade.",
      "feedback.description.offline": "Não foi possível enviar o pedido automaticamente. Utilize o email ou WhatsApp abaixo para concluir o envio.",
      "feedback.reference": "REFERÊNCIA:",
      "feedback.status.label": "ESTADO:",
      "feedback.status.received": "PEDIDO RECEBIDO",
      "feedback.status.offline": "ENVIO MANUAL NECESSÁRIO",
      "feedback.next.label": "PRÓXIMO PASSO:",
      "feedback.next.received": "AGUARDAR CONTACTO DA EQUIPA",
      "feedback.next.offline": "ENVIAR POR EMAIL OU WHATSAPP",
      "feedback.reset": "Enviar outro pedido",
      "feedback.close": "Fechar consulta",
      "feedback.email": "Enviar por email",
      "feedback.whatsapp": "Enviar por WhatsApp",

      // Modal Inquiry
      "inquiry.modal.label": "CONSULTA PRIVADA · DIREÇÃO TÉCNICA",
      "inquiry.modal.title": "Consulta técnica privada",
      "inquiry.modal.intro": "Canal direto para gabinetes de arquitetura, entidades de conservação do património e proprietários no Grande Porto e Vale do Douro.",
      "inquiry.modal.close": "✕ FECHAR [ESC]",
      "inquiry.modal.closeLabel": "Fechar consulta técnica",
      "inquiry.direct.email": "EMAIL DIRETO",
      "inquiry.direct.phone": "TELEFONE / WHATSAPP",
      "inquiry.direct.capacity": "RESERVA DE CAPACIDADE",
      "inquiry.direct.availability": "3.º/4.º TRIMESTRE 2026 DISPONÍVEL",
      "inquiry.modal.jump": "Ver a secção de consulta técnica na página ↓",

      // Footer
      "footer.brand_subtitle": "CANTARIA &amp; ENGENHARIA DE PEDRA · PORTO",
      "footer.desc": "Cantaria monolítica de precisão, engenharia geotécnica de muros e direção técnica para projetos de arquitetura em Portugal e na Galiza.",
      "footer.hq_label": "SEDE &amp; ESTALEIRO",
      "footer.hq_desc": "Grande Porto &amp; Norte de Portugal<br>Jurisdição: Tribunal Judicial do Porto<br>Consultas exclusivamente por marcação",
      "footer.dir_label": "DIREÇÃO TÉCNICA",
      "footer.dir_desc": "Direção técnica &amp; mestre canteiro<br>Canal direto para gabinetes de arquitetura",
      "footer.copyright": "&copy; 2026 SOLRAC TECTONICS. TODOS OS DIREITOS RESERVADOS.",
      "footer.tagline": "TECTÓNICA ARQUITETÓNICA MONOCROMÁTICA · PORTUGAL",
      "a11y.skip_to_content": "Saltar para o conteúdo principal",
      "a11y.open_project": "Inspecionar obra",
      "inquiry.rgpd_notice": "Tratamento confidencial exclusivo para análise técnica e orçamentação pela Direção Técnica SOLRAC (RGPD · UE 2016/679), sem cedência comercial a terceiros.",
      "footer.legal.aria_label": "Informação legal, fiscal e proteção de dados",
      "footer.legal.fiscal_label": "IDENTIFICAÇÃO FISCAL &amp; ESTALEIRO",
      "footer.legal.fiscal_text": "SOLRAC TECTONICS · Estaleiro Operacional: Grande Porto &amp; Vale do Douro, Portugal · NIF/NIPC e habilitação técnica IMPIC constantes na proposta e contrato de empreitada · Foro: Comarca do Porto · RAL: CICAP Porto (Lei n.º 144/2015).",
      "footer.legal.rgpd_label": "PRIVACIDADE &amp; RGPD (UE 2016/679)",
      "footer.legal.rgpd_text": "Plataforma isenta de cookies de rastreamento ou analítica de terceiros. Dados e fotografias tratados exclusivamente para viabilidade técnica e orçamentação (Lei n.º 58/2019). Direitos RGPD:",
      "footer.legal.lre_label": "CONFORMIDADE REGULATÓRIA · PORTUGAL",
      "footer.legal.lre_link": "LIVRO DE RECLAMAÇÕES ELETRÓNICO ↗",
      "footer.legal.lre_meta": "Direção-Geral do Consumidor · DL n.º 156/2005",

      // Lightbox
      "lightbox.close": "✕ FECHAR [ESC]",
      "lightbox.close_label": "Fechar",
      "lightbox.inquire": "Consultar sobre uma obra semelhante",
      "lightbox.spec_material": "Material",
      "lightbox.spec_detail": "Pormenor",
      "lightbox.category_default": "CATEGORIA",

      // Dynamic Projects
      "project.muro-curvo.title": "Muro de contenção curvo",
      "project.muro-curvo.categoryLabel": "Muro de contenção",
      "project.muro-curvo.material": "Alvenaria de pedra",
      "project.muro-curvo.detail": "Alinhamento curvo",
      "project.muro-curvo.alt": "Muro de contenção curvo em pedra junto ao limite de um terreno ajardinado.",
      "project.muro-curvo.description": "A alvenaria acompanha a curva do terreno, com juntas desencontradas e uma face contínua de pedra.",
      "project.muro-curvo.spec_element": "Alinhamento curvo",
      "project.muro-curvo.spec_masonry": "Pedra à vista",

      "project.muro-aparelhado.title": "Muro de delimitação em cantaria aparelhada",
      "project.muro-aparelhado.categoryLabel": "Muro de contenção",
      "project.muro-aparelhado.material": "Alvenaria de pedra",
      "project.muro-aparelhado.detail": "Fiadas aparelhadas",
      "project.muro-aparelhado.alt": "Muro longo de blocos de pedra aparelhada junto a uma entrada recuada.",
      "project.muro-aparelhado.description": "Muro contínuo de pedra esquadriada, com fiadas, juntas e remate junto à entrada visíveis.",
      "project.muro-aparelhado.spec_element": "Fiadas aparelhadas",
      "project.muro-aparelhado.spec_masonry": "Pedra à vista",

      "project.portal-rural.title": "Empena e guarnição de entrada em pedra",
      "project.portal-rural.categoryLabel": "Alvenaria rural",
      "project.portal-rural.material": "Alvenaria de pedra",
      "project.portal-rural.detail": "Guarnição de entrada",
      "project.portal-rural.alt": "Empena rural em pedra com guarnição de entrada em cantaria durante a reabilitação.",
      "project.portal-rural.description": "Estrutura rural de alvenaria existente com empena inclinada e blocos aparelhados a enquadrar a entrada.",
      "project.portal-rural.spec_element": "Guarnição de entrada",
      "project.portal-rural.spec_masonry": "Pedra à vista",

      "project.reabilitacao-pedra.title": "Reabilitação de alvenaria rural",
      "project.reabilitacao-pedra.categoryLabel": "Alvenaria rural",
      "project.reabilitacao-pedra.material": "Alvenaria de pedra",
      "project.reabilitacao-pedra.detail": "Ombreiras do vão",
      "project.reabilitacao-pedra.alt": "Interior de um edifício rural em pedra com ombreiras aparelhadas e alvenaria à vista.",
      "project.reabilitacao-pedra.description": "Paredes de alvenaria à vista e elementos aparelhados dos vãos, fotografados durante a reabilitação de um edifício rural.",
      "project.reabilitacao-pedra.spec_element": "Ombreiras do vão",
      "project.reabilitacao-pedra.spec_masonry": "Pedra à vista",

      "project.escada-detalhe.title": "Escada · Pormenor de junta em pedra",
      "project.escada-detalhe.categoryLabel": "Cantaria aparelhada",
      "project.escada-detalhe.material": "Alvenaria de pedra",
      "project.escada-detalhe.detail": "Fiada de pedra diagonal",
      "project.escada-detalhe.alt": "Pormenor de uma fiada diagonal de cantaria na ligação à alvenaria sob uma escada.",
      "project.escada-detalhe.description": "Pormenor da junta entre a fiada diagonal aparelhada e a alvenaria de apoio sob a escada.",
      "project.escada-detalhe.spec_element": "Fiada de pedra diagonal",
      "project.escada-detalhe.spec_masonry": "Pedra à vista",

      "project.degraus-macicos.title": "Degraus de entrada em pedra maciça",
      "project.degraus-macicos.categoryLabel": "Cantaria aparelhada",
      "project.degraus-macicos.material": "Alvenaria de pedra",
      "project.degraus-macicos.detail": "Degraus de pedra maciça",
      "project.degraus-macicos.alt": "Degraus largos de entrada em pedra maciça com espelhos aparelhados e remates laterais.",
      "project.degraus-macicos.description": "Lanço largo de degraus de pedra com linhas horizontais contínuas e remates laterais aparelhados, fotografado em obra.",
      "project.degraus-macicos.spec_element": "Degraus de pedra maciça",
      "project.degraus-macicos.spec_masonry": "Pedra à vista"
    },

    en: {
      "lightbox.views": "Project view",
      "lightbox.photo": "Photograph",
      "lightbox.technical": "Technical detail",
      "lightbox.detail_label": "Construction study",
      "lightbox.masonry": "Masonry · elevation",
      "lightbox.stone": "Stonework · section",
      "lightbox.drain": "Drainage · section",
      "lightbox.drawing": "Construction diagrams with indicative dimensions in millimetres",
      "lightbox.indicative": "Concept diagrams · indicative dimensions, not measured project data. Sizing requires a survey and design.",
      "lightbox.navigation": "Project navigation",
      "lightbox.previous": "Previous project",
      "lightbox.next": "Next project",
      "lightbox.left": "←",
      "lightbox.right": "→",
      "inquiry.photos.title": "Express estimate · site photographs",
      "inquiry.photos.choose": "Select or drop 1–4 photographs",
      "inquiry.photos.help": "JPG, PNG or WebP · up to 12 MB per photo (max. 4). Local preview and compression with integrated form submission; if offline, save and attach via WhatsApp.",
      "inquiry.photos.reference": "Local reference",
      "inquiry.photos.whatsapp": "WhatsApp · request scheduling within 24 h",
      "inquiry.photos.timing": "Send an overview, a detail and the location. Request contact within 24 h; the estimate requires technical review.",
      "inquiry.photos.preview": "Site photograph preview",
      "inquiry.photos.save": "Save",
      "inquiry.photos.remove": "Remove photo",
      "inquiry.photos.limit": "Maximum 4 photos. Remove one before adding more.",
      "inquiry.photos.processing": "Preparing photographs…",
      "inquiry.photos.error": "A photo could not be prepared. Use JPG, PNG or WebP up to 12 MB / 40 MP. Other photos have been kept.",
      "inquiry.photos.message": "SOLRAC — Express estimate request",
      "inquiry.photos.instructions": "I will attach 1–4 site photos: overview, stone details and access. Please contact me to schedule an estimate within 24 h.",

      // Brand & Meta
      "meta.title": "SOLRAC TECTONICS · Stonework &amp; Stone Engineering | Porto",
      "brand.subtitle": "TECTONICS · PORTO",
      "i18n.switcher_aria": "Language selection",

      // Navigation
      "nav.works": "Selected works",
      "nav.mastery": "The dual mastery",
      "nav.method": "The method",
      "nav.inquiry": "Private consultation",
      "nav.mobile_cta": "Private technical consultation",
      "nav.header_cta": "Request consultation",
      "nav.mobile_toggle": "Open or close navigation menu",

      // Hero
      "hero.coords": "COORD: 41.1579° N, 8.6291° W · GREATER PORTO &amp; DOURO VALLEY",
      "hero.status": "TECHNICAL CAPACITY AVAILABLE (Q3/Q4 2026)",
      "hero.badge": "Stone Engineering &amp; Master Stonemasonry",
      "hero.title_part1": "The tectonics of stone.",
      "hero.title_part2": "The precision of engineering.",
      "hero.description": "Cyclopean retaining walls, dressed granite stonework and heritage conservation. Designed with the calculation of <strong>Technical Direction</strong> and sculpted by a <strong>Master Stonemason</strong>.",
      "hero.explore": "Explore archive",
      "hero.mastery": "The dual mastery",
      "hero.frame_title": "ARCHIVE #01 · DRESSED STONEWORK",
      "hero.frame_subtitle": "Corner detail · stonework archive",
      "hero.frame_type": "STONE MASONRY",
      "hero.image_alt": "Corner of a dressed stonework wall with interlocking stone courses",
      "hero.stat1_val": "±1.0mm",
      "hero.stat1_label": "Alignment tolerance",
      "hero.stat2_val": "EC-7",
      "hero.stat2_label": "Geotechnical calculation &amp; concealed drainage",
      "hero.stat3_val": "100%",
      "hero.stat3_label": "Solid granite from Northern Portugal",
      "hero.stat4_val": "Excellence",
      "hero.stat4_label": "Full on-site technical direction",

      // Section 01: Dual Mastery
      "mastery.section": "01 / TECHNICAL DIFFERENTIATION",
      "mastery.title": "The dual mastery",
      "mastery.subtitle": "The gap between studio drafting and on-site execution compromises many architectural projects. SOLRAC bridges technical calculation with stonemasonry craftsmanship to unify both phases.",
      "mastery.card1_label": "TECHNICAL RIGOR",
      "mastery.card1_title": "Technical direction",
      "mastery.card1_feat1": "<strong>Earth pressure calculation:</strong> Gravity dimensioning and buttresses for slope stabilization, preventing landslides and micro-fractures.",
      "mastery.card1_feat2": "<strong>Subsurface drainage:</strong> Multi-layer geotextile membranes and decompression conduits to relieve hydrostatic pressure.",
      "mastery.card1_feat3": "<strong>Studio collaboration:</strong> Technical dialogue with architectural practices, CAD drawing review, and rigorous tolerance verification.",
      "mastery.card1_quote": "«The timeless elegance of stone demands mastery over groundwater and structural physics with millimetric precision.»",
      "mastery.card2_label": "CRAFT MASTERY",
      "mastery.card2_title": "The master stonemason",
      "mastery.card2_feat1": "<strong>Mineral intuition:</strong> Identification of natural cleavage planes and grain orientation in Portuguese granite for clean cuts.",
      "mastery.card2_feat2": "<strong>Handcrafted work:</strong> Hand carving, bush-hammering, and flamed finishes for tactile surfaces with zero visible mortar joints.",
      "mastery.card2_feat3": "<strong>Tectonic geometries:</strong> Semicircular arches, monolithic cantilevered stairs, historic cornices, and sharp-edged quoins.",
      "mastery.card2_quote": "«Stone has memory. Each mallet blow must respect the quarry block so the structure endures through centuries.»",

      // Section 02: Selected Works
      "works.section": "02 / PROJECT ARCHIVE",
      "works.title": "Selected architectural works",
      "works.subtitle": "Photographic curation of retaining walls, vernacular masonry, and bespoke stonework details from the SOLRAC archive.",
      "works.filter_all": "All works",
      "works.filter_muros": "Retaining walls",
      "works.filter_quintas": "Rural &amp; heritage",
      "works.filter_cantaria": "Bespoke stonework",
      "works.filter_label": "PROJECT CURATION",

      // Section 03: The Tectonic Method
      "method.section": "03 / EXECUTION PROTOCOL",
      "method.title": "The 4-phase tectonic protocol",
      "method.subtitle": "Every SOLRAC project follows a rigorous technical protocol, from quarry block selection to final structural certification.",
      "method.step1_title": "Geotechnical survey &amp; block selection",
      "method.step1_desc": "Topographic survey, earth pressure calculation, and individual inspection of granite blocks for mineral density and absence of micro-fractures.",
      "method.step2_title": "Dressing &amp; millimetric squaring",
      "method.step2_desc": "Geometric stone dressing and bespoke finishing (bush-hammered, flamed, or hand-chiseled) tailored to the architectural specification.",
      "method.step3_title": "Structural interlocking &amp; concealed drainage",
      "method.step3_desc": "Assembly of interlocked courses, groundwater relief piping, and marine-grade stainless steel anchors when specified.",
      "method.step4_title": "Technical direction &amp; certification",
      "method.step4_desc": "Laser plumb verification, drainage flow testing, and delivery of structural responsibility documentation for lasting durability.",

      // Section 04: Inquiry (Form & Details)
      "inquiry.section": "04 / TECHNICAL CONSULTATION INQUIRY",
      "inquiry.title": "Consultation for architects &amp; owners",
      "inquiry.intro": "SOLRAC accepts a limited number of commissions each year to ensure the direct presence of technical direction and the master stonemason at every critical stage.",
      "inquiry.collaboration": "We collaborate with architecture studios, heritage conservation bodies, and private estate owners across Foz do Douro, Nevogilde, Gaia, and Douro Valley estates.",
      "inquiry.region.label": "PRIMARY GEOGRAPHIC SCOPE",
      "inquiry.region.value": "Foz do Douro · Nevogilde · Matosinhos Sul · Vila Nova de Gaia · Douro Valley (Pinhão, Régua) · Minho &amp; Galicia.",
      "inquiry.field.website_trap": "Leave blank",
      "inquiry.field.client_name": "Name / Practice",
      "inquiry.placeholder.client_name": "e.g. Sampaio Architecture Practice",
      "inquiry.field.client_role": "Client profile",
      "inquiry.option.architect": "Architecture practice",
      "inquiry.option.private_owner": "Private estate owner",
      "inquiry.option.developer": "Property developer / Heritage manager",
      "inquiry.field.client_email": "Professional email",
      "inquiry.placeholder.client_email": "studio@architecture.com",
      "inquiry.field.client_phone": "Phone / WhatsApp",
      "inquiry.placeholder.client_phone": "+351 9xx xxx xxx",
      "inquiry.field.project_type": "Intervention type",
      "inquiry.option.structural_wall": "Cyclopean retaining wall",
      "inquiry.option.heritage_restoration": "Stone restoration in estate / manor / heritage",
      "inquiry.option.bespoke_stonework": "Bespoke stonework / Portals",
      "inquiry.option.full_direction": "Full technical direction &amp; stonework",
      "inquiry.field.location": "Site location",
      "inquiry.placeholder.location": "e.g. Foz do Douro, Porto",
      "inquiry.field.project_notes": "Project description &amp; technical specifications",
      "inquiry.placeholder.project_notes": "Please specify if floor plans, structural surveys, or stone types are already defined…",
      "inquiry.submit": "Submit feasibility inquiry",

      // Feedback States
      "feedback.label": "ORDER STATUS",
      "feedback.title.initial": "Consultation inquiry",
      "feedback.title.received": "Inquiry received",
      "feedback.title.offline": "Inquiry pending submission",
      "feedback.description.initial": "",
      "feedback.description.received": "Your inquiry has been successfully received. Technical direction will evaluate specifications and follow up shortly.",
      "feedback.description.offline": "Automatic delivery could not be completed. Please use email or WhatsApp below to finalize submission.",
      "feedback.reference": "REFERENCE:",
      "feedback.status.label": "STATUS:",
      "feedback.status.received": "INQUIRY RECEIVED",
      "feedback.status.offline": "MANUAL SUBMISSION REQUIRED",
      "feedback.next.label": "NEXT STEP:",
      "feedback.next.received": "AWAIT TEAM CONTACT",
      "feedback.next.offline": "SUBMIT VIA EMAIL OR WHATSAPP",
      "feedback.reset": "Submit another inquiry",
      "feedback.close": "Close consultation",
      "feedback.email": "Send via email",
      "feedback.whatsapp": "Send via WhatsApp",

      // Modal Inquiry
      "inquiry.modal.label": "PRIVATE CONSULTATION · TECHNICAL DIRECTION",
      "inquiry.modal.title": "Private technical consultation",
      "inquiry.modal.intro": "Direct channel for architecture practices, heritage conservation authorities, and private estate owners in Greater Porto and Douro Valley.",
      "inquiry.modal.close": "✕ CLOSE [ESC]",
      "inquiry.modal.closeLabel": "Close technical consultation",
      "inquiry.direct.email": "DIRECT EMAIL",
      "inquiry.direct.phone": "PHONE / WHATSAPP",
      "inquiry.direct.capacity": "CAPACITY ALLOCATION",
      "inquiry.direct.availability": "Q3/Q4 2026 AVAILABLE",
      "inquiry.modal.jump": "View technical consultation section on page ↓",

      // Footer
      "footer.brand_subtitle": "STONEWORK &amp; STONE ENGINEERING · PORTO",
      "footer.desc": "Precision monolithic stonework, geotechnical wall engineering, and full technical direction for architectural projects in Portugal and Galicia.",
      "footer.hq_label": "HEADQUARTERS &amp; YARD",
      "footer.hq_desc": "Greater Porto &amp; Northern Portugal<br>Jurisdiction: Porto Judicial Court<br>Consultations strictly by appointment",
      "footer.dir_label": "TECHNICAL DIRECTION",
      "footer.dir_desc": "Technical direction &amp; master stonemason<br>Direct channel for architecture practices",
      "footer.copyright": "&copy; 2026 SOLRAC TECTONICS. ALL RIGHTS RESERVED.",
      "footer.tagline": "MONOCHROMATIC ARCHITECTURAL TECTONICS · PORTUGAL",
      "a11y.skip_to_content": "Skip to main content",
      "a11y.open_project": "Inspect project",
      "inquiry.rgpd_notice": "Confidential processing exclusively for technical feasibility assessment and cost estimation by SOLRAC Technical Direction (GDPR · EU 2016/679), with zero commercial third-party sharing.",
      "footer.legal.aria_label": "Legal, tax, and data protection notice",
      "footer.legal.fiscal_label": "TAX IDENTIFICATION &amp; OPERATIONAL YARD",
      "footer.legal.fiscal_text": "SOLRAC TECTONICS · Operational Yard: Greater Porto &amp; Douro Valley, Portugal · Tax ID (NIF/NIPC) and IMPIC technical license provided in technical proposals and construction contracts · Jurisdiction: Porto Court · ADR: CICAP Porto (Law No. 144/2015).",
      "footer.legal.rgpd_label": "PRIVACY &amp; GDPR (EU 2016/679)",
      "footer.legal.rgpd_text": "Zero tracking cookies or third-party analytics. Submitted specifications and site photographs are processed solely for technical feasibility and estimation (Portuguese Law No. 58/2019). GDPR rights:",
      "footer.legal.lre_label": "REGULATORY COMPLIANCE · PORTUGAL",
      "footer.legal.lre_link": "ELECTRONIC COMPLAINTS BOOK (LIVRO DE RECLAMAÇÕES) ↗",
      "footer.legal.lre_meta": "Directorate-General for the Consumer · Decree-Law No. 156/2005",

      // Lightbox
      "lightbox.close": "✕ CLOSE [ESC]",
      "lightbox.close_label": "Close",
      "lightbox.inquire": "Inquire about a similar project",
      "lightbox.spec_material": "Material",
      "lightbox.spec_detail": "Detail",
      "lightbox.category_default": "CATEGORY",

      // Dynamic Projects
      "project.muro-curvo.title": "Curved retaining wall",
      "project.muro-curvo.categoryLabel": "Retaining wall",
      "project.muro-curvo.material": "Stone masonry",
      "project.muro-curvo.detail": "Curved alignment",
      "project.muro-curvo.alt": "Curved stone retaining wall along the boundary of landscaped grounds.",
      "project.muro-curvo.description": "Masonry follows terrain contours with staggered joints and a continuous dressed stone face.",
      "project.muro-curvo.spec_element": "Curved alignment",
      "project.muro-curvo.spec_masonry": "Exposed stone",

      "project.muro-aparelhado.title": "Boundary wall in dressed stonework",
      "project.muro-aparelhado.categoryLabel": "Retaining wall",
      "project.muro-aparelhado.material": "Stone masonry",
      "project.muro-aparelhado.detail": "Dressed stone courses",
      "project.muro-aparelhado.alt": "Long dressed stone block wall alongside a recessed entrance.",
      "project.muro-aparelhado.description": "Continuous squared stone wall with visible courses, tight joints, and finished entrance terminations.",
      "project.muro-aparelhado.spec_element": "Dressed stone courses",
      "project.muro-aparelhado.spec_masonry": "Exposed stone",

      "project.portal-rural.title": "Gable and entrance surround in stone",
      "project.portal-rural.categoryLabel": "Rural masonry",
      "project.portal-rural.material": "Stone masonry",
      "project.portal-rural.detail": "Entrance surround",
      "project.portal-rural.alt": "Vernacular stone gable with dressed stonework portal during restoration.",
      "project.portal-rural.description": "Existing vernacular stone masonry structure with sloped gable and dressed blocks framing the entrance.",
      "project.portal-rural.spec_element": "Entrance surround",
      "project.portal-rural.spec_masonry": "Exposed stone",

      "project.reabilitacao-pedra.title": "Restoration of vernacular stone masonry",
      "project.reabilitacao-pedra.categoryLabel": "Rural masonry",
      "project.reabilitacao-pedra.material": "Stone masonry",
      "project.reabilitacao-pedra.detail": "Opening jambs",
      "project.reabilitacao-pedra.alt": "Interior of rural stone building with dressed jambs and exposed masonry.",
      "project.reabilitacao-pedra.description": "Exposed stone walls and dressed opening features photographed during the rehabilitation of a rural estate.",
      "project.reabilitacao-pedra.spec_element": "Opening jambs",
      "project.reabilitacao-pedra.spec_masonry": "Exposed stone",

      "project.escada-detalhe.title": "Staircase · Stone joint detail",
      "project.escada-detalhe.categoryLabel": "Dressed stonework",
      "project.escada-detalhe.material": "Stone masonry",
      "project.escada-detalhe.detail": "Diagonal stone course",
      "project.escada-detalhe.alt": "Detail of a diagonal dressed stone course connecting to support masonry beneath stairs.",
      "project.escada-detalhe.description": "Close-up of junction between diagonal dressed course and supporting masonry underneath the staircase.",
      "project.escada-detalhe.spec_element": "Diagonal stone course",
      "project.escada-detalhe.spec_masonry": "Exposed stone",

      "project.degraus-macicos.title": "Entrance steps in solid stone",
      "project.degraus-macicos.categoryLabel": "Dressed stonework",
      "project.degraus-macicos.material": "Stone masonry",
      "project.degraus-macicos.detail": "Solid stone steps",
      "project.degraus-macicos.alt": "Wide entrance steps in solid stone with dressed risers and lateral returns.",
      "project.degraus-macicos.description": "Broad flight of stone steps with continuous horizontal courses and dressed lateral terminations.",
      "project.degraus-macicos.spec_element": "Solid stone steps",
      "project.degraus-macicos.spec_masonry": "Exposed stone"
    },

    es: {
      "lightbox.views": "Vista de la obra",
      "lightbox.photo": "Fotografía",
      "lightbox.technical": "Detalle técnico",
      "lightbox.detail_label": "Estudio constructivo",
      "lightbox.masonry": "Aparejo · alzado",
      "lightbox.stone": "Cantería · sección",
      "lightbox.drain": "Drenaje · sección",
      "lightbox.drawing": "Esquemas constructivos con cotas indicativas en milímetros",
      "lightbox.indicative": "Esquemas de principio · cotas orientativas, no medidas de la obra. Dimensionado sujeto a levantamiento y proyecto.",
      "lightbox.navigation": "Navegación de obras",
      "lightbox.previous": "Obra anterior",
      "lightbox.next": "Obra siguiente",
      "lightbox.left": "←",
      "lightbox.right": "→",
      "inquiry.photos.title": "Presupuesto express · fotografías de la obra",
      "inquiry.photos.choose": "Seleccionar o arrastrar 1–4 fotografías",
      "inquiry.photos.help": "JPG, PNG o WebP · hasta 12 MB por foto (máx. 4). Vista previa y compresión locales con envío integrado en el formulario; si está sin conexión, guárdelas y adjúntelas en WhatsApp.",
      "inquiry.photos.reference": "Referencia local",
      "inquiry.photos.whatsapp": "WhatsApp · solicitar cita en menos de 24 h",
      "inquiry.photos.timing": "Envíe una vista general, un detalle y la ubicación. Solicite contacto en menos de 24 h; el presupuesto depende del análisis técnico.",
      "inquiry.photos.preview": "Vista previa de la fotografía de la obra",
      "inquiry.photos.save": "Guardar",
      "inquiry.photos.remove": "Retirar foto",
      "inquiry.photos.limit": "Máximo de 4 fotos. Retire una antes de añadir más.",
      "inquiry.photos.processing": "Preparando fotografías…",
      "inquiry.photos.error": "No se pudo preparar una foto. Use JPG, PNG o WebP hasta 12 MB / 40 MP. Se conservaron las demás.",
      "inquiry.photos.message": "SOLRAC — Solicitud de presupuesto express",
      "inquiry.photos.instructions": "Adjuntaré 1–4 fotos de la obra: vista general, detalles de piedra y acceso. Solicito contacto y cita para presupuesto en menos de 24 h.",

      // Brand & Meta
      "meta.title": "SOLRAC TECTONICS · Cantería &amp; Ingeniería de Piedra | Porto",
      "brand.subtitle": "TECTONICS · PORTO",
      "i18n.switcher_aria": "Selección de idioma",

      // Navigation
      "nav.works": "Obras seleccionadas",
      "nav.mastery": "La doble maestría",
      "nav.method": "El método",
      "nav.inquiry": "Consulta privada",
      "nav.mobile_cta": "Consulta técnica privada",
      "nav.header_cta": "Pedir consulta",
      "nav.mobile_toggle": "Abrir o cerrar el menú de navegación",

      // Hero
      "hero.coords": "COORD: 41.1579° N, 8.6291° W · GRAN PORTO Y VALLE DEL DOURO",
      "hero.status": "CAPACIDAD TÉCNICA DISPONIBLE (3.º/4.º TRIMESTRE 2026)",
      "hero.badge": "Ingeniería de Piedra &amp; Cantería de Autor",
      "hero.title_part1": "La tectónica de la piedra.",
      "hero.title_part2": "El rigor de la ingeniería.",
      "hero.description": "Muros de contención ciclópeos, cantería de granito de corte preciso y conservación de patrimonio. Concebidos con el cálculo de la <strong>Dirección Técnica</strong> y esculpidos por un <strong>Maestro Cantero</strong>.",
      "hero.explore": "Explorar archivo",
      "hero.mastery": "La doble maestría",
      "hero.frame_title": "ARCHIVO #01 · CANTERÍA APAREJADA",
      "hero.frame_subtitle": "Detalle de esquina · archivo de cantería",
      "hero.frame_type": "MAMPOSTERÍA DE PIEDRA",
      "hero.image_alt": "Esquina de un muro de cantería aparejada con hiladas de piedra trabadas",
      "hero.stat1_val": "±1.0mm",
      "hero.stat1_label": "Tolerancia de alineación",
      "hero.stat2_val": "EC-7",
      "hero.stat2_label": "Cálculo geotécnico &amp; drenaje oculto",
      "hero.stat3_val": "100%",
      "hero.stat3_label": "Granito macizo del Norte de Portugal",
      "hero.stat4_val": "Excelencia",
      "hero.stat4_label": "Dirección técnica integral en obra",

      // Section 01: Dual Mastery
      "mastery.section": "01 / DIFERENCIACIÓN TÉCNICA",
      "mastery.title": "La doble maestría",
      "mastery.subtitle": "La distancia entre el dibujo en estudio y la ejecución en obra afecta a muchos proyectos de arquitectura. SOLRAC une el cálculo técnico a la maestría de la cantería para unificar ambas etapas.",
      "mastery.card1_label": "RIGOR TÉCNICO",
      "mastery.card1_title": "La dirección técnica",
      "mastery.card1_feat1": "<strong>Cálculo de empujes de tierras:</strong> Dimensionamiento por gravedad y contrafuertes para contención de laderas, previniendo deslizamientos y microfisuras.",
      "mastery.card1_feat2": "<strong>Drenaje subterráneo:</strong> Membranas geotextiles multicapa y conducciones de descompresión para alivio de la presión hidrostática.",
      "mastery.card1_feat3": "<strong>Colaboración con estudios:</strong> Diálogo con estudios de arquitectura, lectura de planos CAD y verificación rigurosa de tolerancias.",
      "mastery.card1_quote": "«La elegancia atemporal de la piedra exige dominio del agua subterránea y de la física estructural con precisión milimétrica.»",
      "mastery.card2_label": "SABER DE OFICIO",
      "mastery.card2_title": "El maestro cantero",
      "mastery.card2_feat1": "<strong>Intuición mineral:</strong> Identificación de los planos naturales de exfoliación y de la veta del granito portugués para cortes limpios.",
      "mastery.card2_feat2": "<strong>Trabajo artesanal:</strong> Labra a mano, abujardado y acabado flameado para superficies táctiles sin juntas de mortero visibles.",
      "mastery.card2_feat3": "<strong>Geometrías tectónicas:</strong> Arcos de medio punto, escaleras monolíticas en voladizo, cornisas históricas y esquinales de aristas vivas.",
      "mastery.card2_quote": "«La piedra tiene memoria. Cada golpe de maza debe respetar el bloque de cantera para que la estructura atraviese los siglos.»",

      // Section 02: Selected Works
      "works.section": "02 / ARCHIVO DE OBRAS",
      "works.title": "Obras de arquitectura seleccionadas",
      "works.subtitle": "Selección fotográfica de muros de contención, mampostería rural y detalles de cantería del archivo SOLRAC.",
      "works.filter_all": "Todas las obras",
      "works.filter_muros": "Muros de contención",
      "works.filter_quintas": "Rural &amp; patrimonio",
      "works.filter_cantaria": "Cantería de autor",
      "works.filter_label": "SELECCIÓN DE OBRAS",

      // Section 03: The Tectonic Method
      "method.section": "03 / PROTOCOLO DE EJECUCIÓN",
      "method.title": "El protocolo tectónico en 4 fases",
      "method.subtitle": "Cada obra SOLRAC sigue un riguroso protocolo técnico, desde la selección de los bloques en cantera hasta la certificación estructural final.",
      "method.step1_title": "Estudio geotécnico &amp; selección de bloques",
      "method.step1_desc": "Levantamiento topográfico, cálculo de empujes de tierras e inspección individual de los bloques de granito respecto a densidad mineral y ausencia de microfisuras.",
      "method.step2_title": "Aparejo &amp; escuadría milimétrica",
      "method.step2_desc": "Aparejo geométrico y labra a medida (abujardado, flameado o picado a mano) según el proyecto de arquitectura.",
      "method.step3_title": "Trabazón estructural &amp; drenaje oculto",
      "method.step3_desc": "Montaje de hiladas trabadas, tuberías de alivio de aguas subterráneas y anclajes en acero inoxidable de grado marino según especificación.",
      "method.step4_title": "Dirección técnica &amp; certificación",
      "method.step4_desc": "Verificación del plomo por láser, ensayos de evacuación de drenaje y entrega de la documentación de responsabilidad técnica para la durabilidad de la obra.",

      // Section 04: Inquiry (Form & Details)
      "inquiry.section": "04 / SOLICITUD DE CONSULTA TÉCNICA",
      "inquiry.title": "Consulta para arquitectos &amp; propietarios",
      "inquiry.intro": "SOLRAC acepta un número limitado de encargos al año para asegurar la presencia directa de la dirección técnica y del maestro cantero en cada fase crítica.",
      "inquiry.collaboration": "Colaboramos con estudios de arquitectura, entidades de conservación del patrimonio y propietarios en Foz do Douro, Nevogilde, Gaia y en las fincas del Valle del Douro.",
      "inquiry.region.label": "ÁREA GEOGRÁFICA PRINCIPAL",
      "inquiry.region.value": "Foz do Douro · Nevogilde · Matosinhos Sul · Vila Nova de Gaia · Valle del Douro (Pinhão, Régua) · Minho &amp; Galicia.",
      "inquiry.field.website_trap": "Dejar en blanco",
      "inquiry.field.client_name": "Nombre / Estudio",
      "inquiry.placeholder.client_name": "Ej.: Estudio de Arquitectura Sampaio",
      "inquiry.field.client_role": "Perfil del cliente",
      "inquiry.option.architect": "Estudio de arquitectura",
      "inquiry.option.private_owner": "Propietario particular",
      "inquiry.option.developer": "Promotor inmobiliario / Gestor de patrimonio",
      "inquiry.field.client_email": "Email profesional",
      "inquiry.placeholder.client_email": "estudio@arquitectura.es",
      "inquiry.field.client_phone": "Teléfono / WhatsApp",
      "inquiry.placeholder.client_phone": "+34 6xx xxx xxx",
      "inquiry.field.project_type": "Tipo de intervención",
      "inquiry.option.structural_wall": "Muro de contención ciclópeo",
      "inquiry.option.heritage_restoration": "Restauración de piedra en finca / pazo / patrimonio",
      "inquiry.option.bespoke_stonework": "Cantería de autor / Portadas",
      "inquiry.option.full_direction": "Dirección técnica integral &amp; cantería",
      "inquiry.field.location": "Ubicación de la obra",
      "inquiry.placeholder.location": "Ej.: Foz do Douro, Porto",
      "inquiry.field.project_notes": "Descripción del proyecto &amp; requisitos técnicos",
      "inquiry.placeholder.project_notes": "Indique si ya existen planos, levantamientos estructurales o tipos de piedra definidos…",
      "inquiry.submit": "Enviar solicitud de viabilidad",

      // Feedback States
      "feedback.label": "ESTADO DE LA SOLICITUD",
      "feedback.title.initial": "Solicitud de consulta",
      "feedback.title.received": "Solicitud recibida",
      "feedback.title.offline": "Solicitud pendiente de envío",
      "feedback.description.initial": "",
      "feedback.description.received": "Su solicitud ha sido recibida con éxito. La dirección técnica evaluará los requisitos y le responderá a la mayor brevedad.",
      "feedback.description.offline": "No fue posible enviar la solicitud automáticamente. Utilice el email o WhatsApp inferior para completar el envío.",
      "feedback.reference": "REFERENCIA:",
      "feedback.status.label": "ESTADO:",
      "feedback.status.received": "SOLICITUD RECIBIDA",
      "feedback.status.offline": "ENVÍO MANUAL NECESARIO",
      "feedback.next.label": "SIGUIENTE PASO:",
      "feedback.next.received": "ESPERAR CONTACTO DEL EQUIPO",
      "feedback.next.offline": "ENVIAR POR EMAIL O WHATSAPP",
      "feedback.reset": "Enviar otra solicitud",
      "feedback.close": "Cerrar consulta",
      "feedback.email": "Enviar por email",
      "feedback.whatsapp": "Enviar por WhatsApp",

      // Modal Inquiry
      "inquiry.modal.label": "CONSULTA PRIVADA · DIRECCIÓN TÉCNICA",
      "inquiry.modal.title": "Consulta técnica privada",
      "inquiry.modal.intro": "Canal directo para estudios de arquitectura, entidades de conservación del patrimonio y propietarios en el Gran Porto y Valle del Douro.",
      "inquiry.modal.close": "✕ CERRAR [ESC]",
      "inquiry.modal.closeLabel": "Cerrar consulta técnica",
      "inquiry.direct.email": "EMAIL DIRECTO",
      "inquiry.direct.phone": "TELÉFONO / WHATSAPP",
      "inquiry.direct.capacity": "RESERVA DE CAPACIDAD",
      "inquiry.direct.availability": "3.º/4.º TRIMESTRE 2026 DISPONIBLE",
      "inquiry.modal.jump": "Ver la sección de consulta técnica en la página ↓",

      // Footer
      "footer.brand_subtitle": "CANTERÍA &amp; INGENIERÍA DE PIEDRA · PORTO",
      "footer.desc": "Cantería monolítica de precisión, ingeniería geotécnica de muros y dirección técnica para proyectos de arquitectura en Portugal y Galicia.",
      "footer.hq_label": "SEDE &amp; TALLER",
      "footer.hq_desc": "Gran Porto &amp; Norte de Portugal<br>Jurisdicción: Tribunal Judicial de Porto<br>Consultas exclusivamente con cita previa",
      "footer.dir_label": "DIRECCIÓN TÉCNICA",
      "footer.dir_desc": "Dirección técnica &amp; maestro cantero<br>Canal directo para estudios de arquitectura",
      "footer.copyright": "&copy; 2026 SOLRAC TECTONICS. TODOS LOS DERECHOS RESERVADOS.",
      "footer.tagline": "TECTÓNICA ARQUITECTÓNICA MONOCROMÁTICA · PORTUGAL",
      "a11y.skip_to_content": "Saltar al contenido principal",
      "a11y.open_project": "Inspeccionar obra",
      "inquiry.rgpd_notice": "Tratamiento confidencial exclusivo para análisis técnico y presupuestación por la Dirección Técnica SOLRAC (RGPD · UE 2016/679), sin cesión comercial a terceros.",
      "footer.legal.aria_label": "Información legal, fiscal y protección de datos",
      "footer.legal.fiscal_label": "IDENTIFICACIÓN FISCAL &amp; TALLER",
      "footer.legal.fiscal_text": "SOLRAC TECTONICS · Taller Operativo: Gran Porto &amp; Valle del Douro, Portugal · NIF/NIPC y habilitación técnica IMPIC consignados en propuesta y contrato de obra · Fuero: Comarca de Porto · RAL: CICAP Porto (Ley n.º 144/2015).",
      "footer.legal.rgpd_label": "PRIVACIDAD &amp; RGPD (UE 2016/679)",
      "footer.legal.rgpd_text": "Plataforma libre de cookies de rastreo o analítica de terceros. Datos y fotografías tratados exclusivamente para viabilidad técnica y presupuestación (Ley n.º 58/2019). Derechos RGPD:",
      "footer.legal.lre_label": "CONFORMIDAD NORMATIVA · PORTUGAL",
      "footer.legal.lre_link": "LIBRO DE RECLAMACIONES ELECTRÓNICO ↗",
      "footer.legal.lre_meta": "Dirección General del Consumidor · DL n.º 156/2005",

      // Lightbox
      "lightbox.close": "✕ CERRAR [ESC]",
      "lightbox.close_label": "Cerrar",
      "lightbox.inquire": "Consultar sobre una obra similar",
      "lightbox.spec_material": "Material",
      "lightbox.spec_detail": "Detalle",
      "lightbox.category_default": "CATEGORÍA",

      // Dynamic Projects
      "project.muro-curvo.title": "Muro de contención curvo",
      "project.muro-curvo.categoryLabel": "Muro de contención",
      "project.muro-curvo.material": "Mampostería de piedra",
      "project.muro-curvo.detail": "Alineación curva",
      "project.muro-curvo.alt": "Muro de contención curvo en piedra junto al lindero de un terreno ajardinado.",
      "project.muro-curvo.description": "La mampostería acompaña la curva del terreno, con juntas a contrapecho y un paramento continuo de piedra labrada.",
      "project.muro-curvo.spec_element": "Alineación curva",
      "project.muro-curvo.spec_masonry": "Piedra vista",

      "project.muro-aparelhado.title": "Muro de delimitación en cantería aparejada",
      "project.muro-aparelhado.categoryLabel": "Muro de contención",
      "project.muro-aparelhado.material": "Mampostería de piedra",
      "project.muro-aparelhado.detail": "Hiladas aparejadas",
      "project.muro-aparelhado.alt": "Muro largo de sillares de piedra aparejada junto a una entrada retranqueada.",
      "project.muro-aparelhado.description": "Muro continuo de piedra escuadrada, con hiladas, juntas vivas y remates acabados junto a la entrada.",
      "project.muro-aparelhado.spec_element": "Hiladas aparejadas",
      "project.muro-aparelhado.spec_masonry": "Piedra vista",

      "project.portal-rural.title": "Testero y recercado de entrada en piedra",
      "project.portal-rural.categoryLabel": "Mampostería rural",
      "project.portal-rural.material": "Mampostería de piedra",
      "project.portal-rural.detail": "Recercado de entrada",
      "project.portal-rural.alt": "Testero rural en piedra con recercado de entrada en cantería durante su rehabilitación.",
      "project.portal-rural.description": "Estructura rural de mampostería tradicional con testero inclinado y sillares aparejados enmarcando el vano.",
      "project.portal-rural.spec_element": "Recercado de entrada",
      "project.portal-rural.spec_masonry": "Piedra vista",

      "project.reabilitacao-pedra.title": "Rehabilitación de mampostería rural",
      "project.reabilitacao-pedra.categoryLabel": "Mampostería rural",
      "project.reabilitacao-pedra.material": "Mampostería de piedra",
      "project.reabilitacao-pedra.detail": "Jambas del vano",
      "project.reabilitacao-pedra.alt": "Interior de edificación rural en piedra con jambas aparejadas y mampostería vista.",
      "project.reabilitacao-pedra.description": "Muros de mampostería vista y piezas aparejadas de los vanos, fotografiados durante la rehabilitación de una finca rural.",
      "project.reabilitacao-pedra.spec_element": "Jambas del vano",
      "project.reabilitacao-pedra.spec_masonry": "Piedra vista",

      "project.escada-detalhe.title": "Escalera · Detalle de junta en piedra",
      "project.escada-detalhe.categoryLabel": "Cantería aparejada",
      "project.escada-detalhe.material": "Mampostería de piedra",
      "project.escada-detalhe.detail": "Hilada de piedra diagonal",
      "project.escada-detalhe.alt": "Detalle de una hilada diagonal de cantería en el encuentro con la mampostería bajo la escalera.",
      "project.escada-detalhe.description": "Detalle de la junta entre la hilada diagonal aparejada y la mampostería de apoyo bajo la escalera.",
      "project.escada-detalhe.spec_element": "Hilada de piedra diagonal",
      "project.escada-detalhe.spec_masonry": "Piedra vista",

      "project.degraus-macicos.title": "Peldaños de entrada en piedra maciza",
      "project.degraus-macicos.categoryLabel": "Cantería aparejada",
      "project.degraus-macicos.material": "Mampostería de piedra",
      "project.degraus-macicos.detail": "Peldaños de piedra maciza",
      "project.degraus-macicos.alt": "Peldaños anchos de acceso en piedra maciza con tabicas labradas y remates laterales.",
      "project.degraus-macicos.description": "Tramo ancho de peldaños de cantería con hiladas horizontales continuas y remates laterales labrados en obra.",
      "project.degraus-macicos.spec_element": "Peldaños de piedra maciza",
      "project.degraus-macicos.spec_masonry": "Piedra vista"
    }
  };

  function getStoredLanguage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const lang = localStorage.getItem(STORAGE_KEY);
        if (lang && SUPPORTED_LANGUAGES.indexOf(lang) !== -1) {
          return lang;
        }
      }
    } catch (e) {
      /* ignore storage access restrictions */
    }
    return null;
  }

  function getBrowserLanguage() {
    try {
      if (typeof navigator !== 'undefined') {
        const navLangs = navigator.languages || [navigator.language || navigator.userLanguage];
        for (let i = 0; i < navLangs.length; i++) {
          const l = (navLangs[i] || '').toLowerCase().slice(0, 2);
          if (SUPPORTED_LANGUAGES.indexOf(l) !== -1) {
            return l;
          }
        }
      }
    } catch (e) {
      /* fallback to default */
    }
    return DEFAULT_LANGUAGE;
  }

  let currentLanguage = DEFAULT_LANGUAGE;
  const changeListeners = [];

  function t(key, fallback) {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS[DEFAULT_LANGUAGE];
    if (dict && Object.prototype.hasOwnProperty.call(dict, key)) {
      return dict[key];
    }
    const defDict = TRANSLATIONS[DEFAULT_LANGUAGE];
    if (defDict && Object.prototype.hasOwnProperty.call(defDict, key)) {
      return defDict[key];
    }
    return fallback !== undefined ? fallback : key;
  }

  function applyTranslations(lang) {
    if (typeof document === 'undefined') return;

    // Update html lang attribute
    document.documentElement.lang = (lang === 'pt' ? 'pt-PT' : lang);

    // Update document title
    const metaTitle = t('meta.title');
    if (metaTitle) {
      document.title = metaTitle.replace(/&amp;/g, '&');
    }

    // Update elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const key = el.getAttribute('data-i18n');
      if (!key) continue;
      const text = t(key);
      if (text !== undefined && text !== key) {
        if (text.indexOf('<') !== -1) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    }

    // Update placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (let i = 0; i < placeholders.length; i++) {
      const el = placeholders[i];
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', t(key, el.getAttribute('placeholder')));
      }
    }

    // Update aria-labels
    const ariaLabels = document.querySelectorAll('[data-i18n-aria-label]');
    for (let i = 0; i < ariaLabels.length; i++) {
      const el = ariaLabels[i];
      const key = el.getAttribute('data-i18n-aria-label');
      if (key) {
        el.setAttribute('aria-label', t(key, el.getAttribute('aria-label')));
      }
    }

    // Update alt texts
    const alts = document.querySelectorAll('[data-i18n-alt]');
    for (let i = 0; i < alts.length; i++) {
      const el = alts[i];
      const key = el.getAttribute('data-i18n-alt');
      if (key) {
        el.setAttribute('alt', t(key, el.getAttribute('alt')));
      }
    }

    // Synchronize all language switcher controls
    const switchers = document.querySelectorAll('.lang-switcher');
    for (let s = 0; s < switchers.length; s++) {
      const buttons = switchers[s].querySelectorAll('.lang-btn');
      for (let b = 0; b < buttons.length; b++) {
        const btn = buttons[b];
        const btnLang = btn.getAttribute('data-lang');
        const isActive = (btnLang === lang);
        if (isActive) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }
      }
    }
  }

  function setLanguage(lang) {
    if (SUPPORTED_LANGUAGES.indexOf(lang) === -1) {
      lang = DEFAULT_LANGUAGE;
    }
    currentLanguage = lang;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch (e) {
      /* ignore */
    }

    applyTranslations(lang);

    for (let i = 0; i < changeListeners.length; i++) {
      try {
        changeListeners[i](lang);
      } catch (err) {
        console.error(err);
      }
    }

    if (typeof document !== 'undefined') {
      try {
        const event = new CustomEvent('languagechange', { detail: { lang: lang } });
        document.dispatchEvent(event);
      } catch (e) {
        /* old browser fallback if needed */
      }
    }
  }

  function getLanguage() {
    return currentLanguage;
  }

  function onLanguageChange(fn) {
    if (typeof fn === 'function') {
      changeListeners.push(fn);
    }
  }

  function bindSwitcherEvents() {
    if (typeof document === 'undefined') return;
    const buttons = document.querySelectorAll('.lang-btn');
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      if (btn && typeof btn.addEventListener === 'function') {
        btn.addEventListener('click', function (e) {
          if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
          }
          const targetLang = this.getAttribute('data-lang');
          if (targetLang && targetLang !== currentLanguage) {
            setLanguage(targetLang);
          }
        });
      }
    }
  }

  function init() {
    const saved = getStoredLanguage();
    const initial = saved || getBrowserLanguage();
    currentLanguage = initial;
    bindSwitcherEvents();
    if (initial !== DEFAULT_LANGUAGE) {
      applyTranslations(initial);
    } else {
      applyTranslations(DEFAULT_LANGUAGE);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  const I18N = {
    SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE: DEFAULT_LANGUAGE,
    STORAGE_KEY: STORAGE_KEY,
    TRANSLATIONS: TRANSLATIONS,
    t: t,
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    applyTranslations: applyTranslations,
    onLanguageChange: onLanguageChange,
    init: init
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18N;
  }
  global.I18N = I18N;

})(typeof window !== 'undefined' ? window : globalThis);
