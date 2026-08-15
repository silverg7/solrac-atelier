/* ==========================================================================
   SOLRAC · ATELIER DE ARQUITETURA TECTÓNICA & CANTARIA DE AUTOR
   JAVASCRIPT ENGINE (Portfolio Data, Lightbox, Filtering, Concierge)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------------------------------------------------------
     1. Portfolio Projects Database (Structured for High-End Curation)
     ------------------------------------------------------------------------- */
  const PROJECTS_DATA = [
    {
      id: 'muro-douro-01',
      category: 'muros',
      categoryLabel: 'Muro Estrutural',
      title: 'Muro de Contenção Ciclópico · Quinta no Douro',
      location: 'Pinhão, Vale do Douro',
      material: 'Granito Amarelo de Real (Maciço)',
      role: 'Direção Técnica & Cantaria',
      year: '2025',
      image: 'assets/images/muros/muro_douro_01.jpg',
      placeholderSvg: generateStonePatternSvg('Ciclópico Douro', '41.1892° N, 7.5456° W'),
      specs: {
        altura: '4.80 metros',
        extensao: '62 metros lineares',
        drenagem: 'Tubagem Geotécnica Oculta c/ Brita Filtrante',
        acabamento: 'Aparelhado à Picadeira com Juntas Secas'
      },
      description: 'Muro de contenção de encosta de alta carga para proteção de socalcos vinícolas centenários. Cálculo de impulso de terras de acordo com o Eurocódigo 7 e execução em blocos de granito maciço talhados à mão.'
    },
    {
      id: 'solar-foz-02',
      category: 'quintas',
      categoryLabel: 'Restauro Nobre',
      title: 'Reabilitação de Fachada & Cantarias Nobres',
      location: 'Foz do Douro, Porto',
      material: 'Granito Pedras Salgadas & Argamassa de Cal',
      role: 'Consultoria de Aparejador & Reabilitação',
      year: '2024',
      image: 'assets/images/quintas/solar_foz_02.jpg',
      placeholderSvg: generateStonePatternSvg('Solar Foz', '41.1512° N, 8.6732° W'),
      specs: {
        area: '340 m² de Fachada',
        elementos: '14 Vãos Nobres, Cimalhas e Cornijas Históricas',
        tolerancia: '±1.0 mm em Prumos e Esquadrias',
        conservacao: 'Descontaminação e Consolidação Mineral'
      },
      description: 'Restauro integral de cantarias históricas numa moradia senhorial do século XIX na Foz. Alinhamento de cimalhas, reconstrução de ombreiras com enxertos cirúrgicos e consolidação estrutural contra maresia.'
    },
    {
      id: 'cantaria-gaia-03',
      category: 'cantaria',
      categoryLabel: 'Cantaria de Autor',
      title: 'Escadaria Helicoidal & Lareira Monolítica',
      location: 'Afurada, Vila Nova de Gaia',
      material: 'Granito Cinzento Alpinista (Maciço)',
      role: 'Escultura Tectónica & Montagem',
      year: '2025',
      image: 'assets/images/cantaria/escadaria_gaia_03.jpg',
      placeholderSvg: generateStonePatternSvg('Escadaria Tectónica', '41.1445° N, 8.6511° W'),
      specs: {
        degraus: '18 Degraus Maciços Engastados',
        peso_bloco: '420 kg por unidade',
        fixacao: 'Ancoragens em Aço Inox AISI 316',
        textura: 'Bujardado Fino de Alta Aderência'
      },
      description: 'Peça de arquitetura contemporânea executada em blocos puros de granito. Cada degrau foi aparelhado individualmente para encaixe em consola de parede de betão aparente com fixação oculta.'
    },
    {
      id: 'muro-porto-04',
      category: 'muros',
      categoryLabel: 'Muro Estrutural',
      title: 'Muro de Fecho & Cantaria Geométrica',
      location: 'Nevogilde, Porto',
      material: 'Granito Azulino de Ponte de Lima',
      role: 'Execução Integral & Cálculo',
      year: '2024',
      image: 'assets/images/muros/muro_nevogilde_04.jpg',
      placeholderSvg: generateStonePatternSvg('Nevogilde Tectonics', '41.1620° N, 8.6820° W'),
      specs: {
        extensao: '45 metros lineares',
        sistema: 'Junta Esquadrejada 5mm s/ Argamassa Aparente',
        impermeabilizacao: 'Membrana Betuminosa com Drenagem Periférica',
        seguranca: 'Cálculo Sísmico Certificado'
      },
      description: 'Delimitação arquitetónica de moradia minimalista de luxo. Rigor geométrico absoluto em granito aparelhado com linhas de junta contínuas e integração oculta de iluminação linear LED.'
    },
    {
      id: 'quinta-amarante-05',
      category: 'quintas',
      categoryLabel: 'Património & Adega',
      title: 'Adega Monolítica & Abóbada de Berço em Granito',
      location: 'Amarante / Marco de Canaveses',
      material: 'Granito Regional Rústico Aparelhado',
      role: 'Direção de Obra & Alvenaria Nobre',
      year: '2023',
      image: 'assets/images/quintas/adega_amarante_05.jpg',
      placeholderSvg: generateStonePatternSvg('Adega Granítica', '41.2711° N, 8.0772° W'),
      specs: {
        vao: 'Arco de 6.2 metros em Volta Perfeita',
        espessura: 'Paredes de 70 cm de Inércia Térmica',
        fundacao: 'Encastramento Direto no Maciço Rochoso',
        climatizacao: 'Inércia Natural (14°C constante)'
      },
      description: 'Construção de adega semi-subterrânea de guarda de vinhos nobres. Utilização da massa mineral para estabilização térmica e higrométrica passiva com cantaria de juntas travadas.'
    },
    {
      id: 'cantaria-portais-06',
      category: 'cantaria',
      categoryLabel: 'Cantaria de Autor',
      title: 'Pórtico Monolítico & Painéis Ventilados',
      location: 'Matosinhos Sul',
      material: 'Granito Escuro Pedras Salgadas',
      role: 'Engenharia de Fachada & Execução',
      year: '2025',
      image: 'assets/images/cantaria/portico_matosinhos_06.jpg',
      placeholderSvg: generateStonePatternSvg('Pórtico Matosinhos', '41.1812° N, 8.6912° W'),
      specs: {
        altura_portico: '3.60 metros livre',
        tolerancia: 'Zero desvio em diagonais',
        tratamento: 'Hidrófugo Mineral Respirável Oleofóbico',
        acabamento: 'Corte à Serra com Escovado Texturado'
      },
      description: 'Entrada monumental para edifício residencial de luxo. Montagem de ombreiras de grande porte com tolerância zero de alinhamento com a caixilharia oculta suíça.'
    }
  ];

  /* -------------------------------------------------------------------------
     2. SVG Fallback / Architectural Blueprint Placeholder Generator
     ------------------------------------------------------------------------- */
  function generateStonePatternSvg(title, coords) {
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="100%">
        <rect width="800" height="550" fill="#0c0c0c"/>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#181818" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="800" height="550" fill="url(#grid)" />
        <g stroke="#262626" stroke-width="1.5" fill="none">
          <polygon points="120,80 380,80 340,240 80,240" fill="#141414"/>
          <polygon points="380,80 720,80 680,240 340,240" fill="#171717"/>
          <polygon points="80,240 340,240 300,420 50,420" fill="#121212"/>
          <polygon points="340,240 680,240 640,420 300,420" fill="#151515"/>
        </g>
        <line x1="50" y1="480" x2="750" y2="480" stroke="#333" stroke-width="1"/>
        <text x="60" y="510" fill="#888" font-family="monospace" font-size="12" letter-spacing="2">SOLRAC TECTONIC ARCHITECTURE</text>
        <text x="740" y="510" fill="#555" font-family="monospace" font-size="11" text-anchor="end" letter-spacing="1">${coords}</text>
        <text x="400" y="260" fill="#f0f0f0" font-family="serif" font-size="18" text-anchor="middle" letter-spacing="3">${title.toUpperCase()}</text>
        <text x="400" y="290" fill="#777" font-family="sans-serif" font-size="11" text-anchor="middle" letter-spacing="1">CANTEIRO &amp; APARELHADOR</text>
      </svg>
    `;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
  }

  /* -------------------------------------------------------------------------
     3. Render Projects Grid
     ------------------------------------------------------------------------- */
  const projectsGrid = document.getElementById('projects-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function renderProjects(filter = 'all') {
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    const filteredProjects = filter === 'all' 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.category === filter);

    filteredProjects.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.dataset.id = project.id;
      card.dataset.category = project.category;
      
      card.innerHTML = `
        <div class="project-thumb-wrapper">
          <img src="${project.image}" alt="${project.title}" 
               onerror="this.onerror=null; this.src='${project.placeholderSvg}';" 
               loading="lazy">
          <span class="project-category-badge">${project.categoryLabel}</span>
          <div class="project-expand-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>
        <div class="project-info">
          <div>
            <span class="tech-label" style="font-size: 0.65rem; margin-bottom: 0.4rem;">${project.location}</span>
            <h3 class="project-title">${project.title}</h3>
          </div>
          <div class="project-meta-table">
            <span class="meta-field-label">Material</span>
            <span class="meta-field-val">${project.material}</span>
            <span class="meta-field-label">Função</span>
            <span class="meta-field-val">${project.role}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(project.id));
      projectsGrid.appendChild(card);
    });
  }

  // Filter interaction
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderProjects(filter);
    });
  });

  /* -------------------------------------------------------------------------
     4. Fullscreen Lightbox Modal
     ------------------------------------------------------------------------- */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxSpecsContainer = document.getElementById('lightbox-specs');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(projectId) {
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    if (!project || !lightboxModal) return;

    lightboxImage.src = project.image;
    lightboxImage.onerror = () => {
      lightboxImage.src = project.placeholderSvg;
    };
    
    lightboxTitle.textContent = project.title;
    lightboxCategory.textContent = `${project.categoryLabel} · ${project.year}`;
    lightboxLocation.textContent = project.location;
    lightboxDesc.textContent = project.description;

    // Render specs
    if (lightboxSpecsContainer) {
      lightboxSpecsContainer.innerHTML = Object.entries(project.specs).map(([key, val]) => `
        <div class="lightbox-spec-item">
          <span style="color: var(--text-secondary); text-transform: uppercase;">${key.replace('_', ' ')}</span>
          <span style="color: var(--text-primary); font-weight: 500;">${val}</span>
        </div>
      `).join('');
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* -------------------------------------------------------------------------
     5. High-Ticket Concierge Inquiry Form
     ------------------------------------------------------------------------- */
  const conciergeForm = document.getElementById('concierge-form');
  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = conciergeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `<span>A PROCESSAR CONSULTA TÉCNICA...</span>`;
      submitBtn.disabled = true;

      // Extract details
      const formData = new FormData(conciergeForm);
      const name = formData.get('client_name') || 'Cliente';
      const projectType = formData.get('project_type') || 'Obra em Pedra';
      const location = formData.get('location') || 'Grande Porto';
      
      setTimeout(() => {
        submitBtn.innerHTML = `<span>✓ CONSULTA ENVIADA COM SUCESSO</span>`;
        submitBtn.style.background = '#222';
        submitBtn.style.color = '#55ff55';
        submitBtn.style.borderColor = '#55ff55';
        
        alert(`Obrigado, ${name}.\n\nA sua solicitação para "${projectType}" em ${location} foi registada com prioridade de Direção Técnica.\n\nO Diretor Técnico e Mestre Canteiro entrará em contacto dentro de 24 horas úteis.`);
        
        conciergeForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style = '';
        }, 5000);
      }, 1200);
    });
  }

  /* -------------------------------------------------------------------------
     6. Header Scroll Blur Effect
     ------------------------------------------------------------------------- */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Initial render
  renderProjects('all');
});
