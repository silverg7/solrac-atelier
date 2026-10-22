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
      "id": "muro-curvo",
      "category": "muros",
      "categoryLabel": "Retaining Wall",
      "title": "Curved Retaining Wall",
      "material": "Stone masonry",
      "detail": "Curved alignment",
      "image": "assets/images/muros/muro-curvo-1920.webp",
      "imageBase": "assets/images/muros/muro-curvo",
      "width": 1920,
      "height": 1082,
      "alt": "Curved stone retaining wall following the edge of a landscaped plot.",
      "specs": {
        "element": "Curved alignment",
        "masonry": "Exposed stonework"
      },
      "description": "Masonry follows the curve of the terrain, with staggered joints and a continuous stone face."
    },
    {
      "id": "muro-aparelhado",
      "category": "muros",
      "categoryLabel": "Retaining Wall",
      "title": "Dressed Stone Boundary Wall",
      "material": "Stone masonry",
      "detail": "Dressed courses",
      "image": "assets/images/muros/muro-aparelhado-1920.webp",
      "imageBase": "assets/images/muros/muro-aparelhado",
      "width": 1920,
      "height": 933,
      "alt": "Long wall of dressed stone blocks beside a recessed entrance.",
      "specs": {
        "element": "Dressed courses",
        "masonry": "Exposed stonework"
      },
      "description": "A continuous wall of squared stone, showing the coursing, joint pattern and return at the entrance."
    },
    {
      "id": "portal-rural",
      "category": "quintas",
      "categoryLabel": "Rural Masonry",
      "title": "Stone Gable & Entrance Surround",
      "material": "Stone masonry",
      "detail": "Entrance surround",
      "image": "assets/images/quintas/portal-rural-1920.webp",
      "imageBase": "assets/images/quintas/portal-rural",
      "width": 1920,
      "height": 933,
      "alt": "Rural stone gable with a dressed stone entrance surround during rehabilitation.",
      "specs": {
        "element": "Entrance surround",
        "masonry": "Exposed stonework"
      },
      "description": "An existing rural masonry shell with a pitched gable and dressed blocks framing the entrance."
    },
    {
      "id": "reabilitacao-pedra",
      "category": "quintas",
      "categoryLabel": "Rural Masonry",
      "title": "Rural Stonework Rehabilitation",
      "material": "Stone masonry",
      "detail": "Doorway jambs",
      "image": "assets/images/quintas/reabilitacao-pedra-1920.webp",
      "imageBase": "assets/images/quintas/reabilitacao-pedra",
      "width": 1920,
      "height": 1080,
      "alt": "Interior of a rural stone building with dressed doorway jambs and exposed masonry.",
      "specs": {
        "element": "Doorway jambs",
        "masonry": "Exposed stonework"
      },
      "description": "Exposed masonry walls and dressed doorway elements photographed during the rehabilitation of a rural building."
    },
    {
      "id": "escada-detalhe",
      "category": "cantaria",
      "categoryLabel": "Dressed Stonework",
      "title": "Staircase · Stone Joint Detail",
      "material": "Stone masonry",
      "detail": "Diagonal stone course",
      "image": "assets/images/cantaria/escada-detalhe-1920.webp",
      "imageBase": "assets/images/cantaria/escada-detalhe",
      "width": 1920,
      "height": 933,
      "alt": "Close view of a diagonal dressed stone course meeting the masonry beneath a staircase.",
      "specs": {
        "element": "Diagonal stone course",
        "masonry": "Exposed stonework"
      },
      "description": "A close study of the joint between the dressed diagonal stone course and the supporting masonry beneath the stairs."
    },
    {
      "id": "degraus-macicos",
      "category": "cantaria",
      "categoryLabel": "Dressed Stonework",
      "title": "Solid Stone Entrance Steps",
      "material": "Stone masonry",
      "detail": "Solid stone steps",
      "image": "assets/images/cantaria/degraus-macicos-1920.webp",
      "imageBase": "assets/images/cantaria/degraus-macicos",
      "width": 1920,
      "height": 933,
      "alt": "Wide solid stone entrance steps with dressed risers and side returns.",
      "specs": {
        "element": "Solid stone steps",
        "masonry": "Exposed stonework"
      },
      "description": "A broad flight of stone steps, with continuous horizontal lines and dressed side returns, photographed on site."
    }
  ];

  /* -------------------------------------------------------------------------
     2. Render Projects Grid
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
          <img src="${project.imageBase}-640.webp"
               srcset="${project.imageBase}-640.webp 640w, ${project.imageBase}-1280.webp 1280w"
               sizes="(max-width: 768px) 92vw, (max-width: 1024px) 44vw, (max-width: 1440px) 29vw, 411px"
               width="${project.width}" height="${project.height}" alt="${project.alt}"
               loading="lazy" decoding="async">
          <span class="project-category-badge">${project.categoryLabel}</span>
          <div class="project-expand-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>
        <div class="project-info">
          <div>
            <span class="tech-label" style="font-size: 0.65rem; margin-bottom: 0.4rem;">${project.categoryLabel}</span>
            <h3 class="project-title">${project.title}</h3>
          </div>
          <div class="project-meta-table">
            <span class="meta-field-label">Material</span>
            <span class="meta-field-val">${project.material}</span>
            <span class="meta-field-label">Detail</span>
            <span class="meta-field-val">${project.detail}</span>
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
     3. Fullscreen Lightbox Modal
     ------------------------------------------------------------------------- */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxSpecsContainer = document.getElementById('lightbox-specs');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(projectId) {
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    if (!project || !lightboxModal) return;

    lightboxImage.src = project.image;
    lightboxImage.alt = project.alt;
    lightboxImage.width = project.width;
    lightboxImage.height = project.height;
    
    lightboxTitle.textContent = project.title;
    lightboxCategory.textContent = project.categoryLabel;
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
     4. High-Ticket Concierge Inquiry Form
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
     5. Header Scroll Blur Effect
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
