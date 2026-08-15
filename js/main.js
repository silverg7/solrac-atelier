/* ==========================================================================
   SOLRAC TECTONICS · STONECRAFT & ARCHITECTURAL ENGINEERING
   JAVASCRIPT ENGINE (Archive Data, Lightbox, Filtering, Concierge)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------------------------------------------------------
     1. Portfolio Projects Database (Structured for High-End Curation)
     ------------------------------------------------------------------------- */
  const PROJECTS_DATA = [
    {
      id: 'wall-douro-01',
      category: 'muros',
      categoryLabel: 'Cyclopean Retaining Wall',
      title: 'Cyclopean Retaining Structure · Douro Valley Wine Estate',
      location: 'Pinhão, Douro Valley',
      material: 'Solid Yellow Real Granite (Hand-Dressed)',
      role: 'Technical Direction & Master Masonry',
      year: '2025',
      image: 'assets/images/muros/muro_douro_01.jpg',
      placeholderSvg: generateStonePatternSvg('Cyclopean Douro', '41.1892° N, 7.5456° W'),
      specs: {
        height: '4.80 meters',
        length: '62 linear meters',
        drainage: 'Concealed Geotextile Hydro-Conduit & Filter Gravel',
        finish: 'Hand-Pointed with Tight Dry-Joint Tolerance'
      },
      description: 'High-load hillside retaining structure safeguarding centuries-old vineyard terraces. Designed and calculated in compliance with Eurocode 7 geotechnical standards, hand-dressed and interlocked with millimeter precision.'
    },
    {
      id: 'solar-foz-02',
      category: 'quintas',
      categoryLabel: 'Heritage Estate Restoration',
      title: 'Noble Facade & Historic Quoin Conservation',
      location: 'Foz do Douro, Porto',
      material: 'Pedras Salgadas Granite & Natural Hydraulic Lime',
      role: 'Quantity Surveying & Masonry Restoration',
      year: '2024',
      image: 'assets/images/quintas/solar_foz_02.jpg',
      placeholderSvg: generateStonePatternSvg('Foz Manor Estate', '41.1512° N, 8.6732° W'),
      specs: {
        facade_area: '340 m² Historic Granite Facade',
        elements: '14 Noble Window Surrounds, Cornices & Entablatures',
        tolerance: '±1.0 mm Alignment in Plumb & Square',
        preservation: 'Mineral Desalination & Structural Consolidation'
      },
      description: 'Comprehensive restoration of 19th-century noble granite masonry in a coastal manor in Foz. Careful alignment of cornices, surgical micro-grafting on jambs, and maritime atmosphere waterproofing.'
    },
    {
      id: 'cantaria-gaia-03',
      category: 'cantaria',
      categoryLabel: 'Bespoke Architectural Stone',
      title: 'Cantilevered Monolithic Staircase & Hearth',
      location: 'Afurada, Vila Nova de Gaia',
      material: 'Alpine Gray Solid Granite Block',
      role: 'Tectonic Sculpture & Engineering',
      year: '2025',
      image: 'assets/images/cantaria/escadaria_gaia_03.jpg',
      placeholderSvg: generateStonePatternSvg('Tectonic Staircase', '41.1445° N, 8.6511° W'),
      specs: {
        treads: '18 Solid Granite Cantilevered Treads',
        block_weight: '420 kg per monolith',
        anchoring: 'Concealed AISI 316 Stainless Structural Pins',
        texture: 'Fine Bush-Hammered Non-Slip Grip'
      },
      description: 'Contemporary architectural centerpiece crafted from solid granite monoliths. Each tread individually dressed and slotted into exposed architectural concrete walls with hidden structural anchoring.'
    },
    {
      id: 'wall-porto-04',
      category: 'muros',
      categoryLabel: 'Cyclopean Retaining Wall',
      title: 'Perimeter Monolith Wall & Geometric Ashlar',
      location: 'Nevogilde, Porto',
      material: 'Ponte de Lima Blue Granite',
      role: 'Full Execution & Geotechnical Calculation',
      year: '2024',
      image: 'assets/images/muros/muro_nevogilde_04.jpg',
      placeholderSvg: generateStonePatternSvg('Nevogilde Tectonics', '41.1620° N, 8.6820° W'),
      specs: {
        length: '45 linear meters',
        system: '5mm Dressed Joints / No Exposed Mortar',
        waterproofing: 'Bituminous Membrane with Subsurface Trench',
        safety: 'Seismic Stability Certification'
      },
      description: 'Architectural perimeter for an ultra-luxury minimalist residence. Absolute geometric discipline in dressed granite with uninterrupted joint lines and concealed linear LED channels.'
    },
    {
      id: 'quinta-amarante-05',
      category: 'quintas',
      categoryLabel: 'Heritage Estate & Vault',
      title: 'Monolithic Wine Vault & Semicircular Granite Arch',
      location: 'Amarante / Douro Sub-Region',
      material: 'Hand-Squared Regional Quarry Granite',
      role: 'Technical Direction & Noble Masonry',
      year: '2023',
      image: 'assets/images/quintas/adega_amarante_05.jpg',
      placeholderSvg: generateStonePatternSvg('Granite Vault', '41.2711° N, 8.0772° W'),
      specs: {
        arch_span: '6.2 meters Semicircular Barrel Vault',
        thickness: '70 cm Thermal Mass Granite Walls',
        foundation: 'Direct Bedrock Socketing',
        climate: 'Passive Thermal Inertia (14°C constant)'
      },
      description: 'Semi-subterranean private wine cellar constructed from massive granite blocks. Harnesses mineral mass for completely passive humidity and temperature regulation.'
    },
    {
      id: 'cantaria-portais-06',
      category: 'cantaria',
      categoryLabel: 'Bespoke Architectural Stone',
      title: 'Monolithic Entrance Portal & Cladding Panels',
      location: 'Matosinhos Sul',
      material: 'Pedras Salgadas Deep Granite',
      role: 'Facade Engineering & Installation',
      year: '2025',
      image: 'assets/images/cantaria/portico_matosinhos_06.jpg',
      placeholderSvg: generateStonePatternSvg('Matosinhos Portal', '41.1812° N, 8.6912° W'),
      specs: {
        portal_height: '3.60 meters clear height',
        tolerances: 'Zero diagonal deviation',
        treatment: 'Oleophobic Breathable Mineral Seal',
        finish: 'Saw-Cut with Brushed Tactile Texture'
      },
      description: 'Monumental entrance portal for a luxury private residence. Installation of large-scale stone jambs with micro-tolerances interfacing seamlessly with Swiss minimalist glazing frames.'
    }
  ];

  /* -------------------------------------------------------------------------
     2. SVG Fallback / Architectural Blueprint Placeholder Generator
     ------------------------------------------------------------------------- */
  function generateStonePatternSvg(title, coords) {
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="100%">
        <rect width="800" height="550" fill="#0a0a0a"/>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161616" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="800" height="550" fill="url(#grid)" />
        <g stroke="#262626" stroke-width="1.5" fill="none">
          <polygon points="120,80 380,80 340,240 80,240" fill="#121212"/>
          <polygon points="380,80 720,80 680,240 340,240" fill="#151515"/>
          <polygon points="80,240 340,240 300,420 50,420" fill="#101010"/>
          <polygon points="340,240 680,240 640,420 300,420" fill="#141414"/>
        </g>
        <line x1="50" y1="480" x2="750" y2="480" stroke="#333" stroke-width="1"/>
        <text x="60" y="510" fill="#888" font-family="'JetBrains Mono', monospace" font-size="12" letter-spacing="2">SOLRAC TECTONICS · PORTO</text>
        <text x="740" y="510" fill="#555" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" letter-spacing="1">${coords}</text>
        <text x="400" y="260" fill="#f0f0f0" font-family="'Cinzel', serif" font-size="18" text-anchor="middle" letter-spacing="3">${title.toUpperCase()}</text>
        <text x="400" y="290" fill="#777" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" text-anchor="middle" letter-spacing="1">QUANTITY SURVEYOR &amp; MASTER MASON</text>
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

    filteredProjects.forEach((project) => {
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
            <span class="meta-field-label">Role</span>
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
      
      submitBtn.innerHTML = `<span>PROCESSING TECHNICAL INQUIRY...</span>`;
      submitBtn.disabled = true;

      // Extract details
      const formData = new FormData(conciergeForm);
      const name = formData.get('client_name') || 'Client';
      const projectType = formData.get('project_type') || 'Stone Commission';
      const location = formData.get('location') || 'Grande Porto';
      
      setTimeout(() => {
        submitBtn.innerHTML = `<span>✓ INQUIRY TRANSMITTED SUCCESSFULLY</span>`;
        submitBtn.style.background = '#222';
        submitBtn.style.color = '#55ff55';
        submitBtn.style.borderColor = '#55ff55';
        
        alert(`Thank you, ${name}.\n\nYour technical inquiry regarding "${projectType}" in ${location} has been registered with priority technical direction status.\n\nThe Technical Director & Master Craftsman will be in touch within 24 business hours.`);
        
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
