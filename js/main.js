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
  const lightboxInquireBtn = document.getElementById('lightbox-inquire-btn');
  let activeLightboxProject = null;

  function openLightbox(projectId) {
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    if (!project || !lightboxModal) return;

    activeLightboxProject = project;

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
    activeLightboxProject = null;
    if (!conciergeModal?.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  /* -------------------------------------------------------------------------
     4. Concierge Desk Modal & Lead Flow (High-End Architecture)
     ------------------------------------------------------------------------- */
  const conciergeModal = document.getElementById('concierge-modal');
  const conciergeModalClose = document.getElementById('concierge-modal-close');
  const conciergeModalForm = document.getElementById('concierge-modal-form');
  const modalFeedbackCard = document.getElementById('modal-feedback-card');
  const modalFeedbackClose = document.getElementById('modal-feedback-close');
  const modalJumpSection = document.getElementById('modal-jump-section');

  function openConciergeModal(prefillProject = null) {
    if (!conciergeModal) return;

    conciergeModal.removeAttribute('hidden');
    // Force layout flush for smooth CSS opacity transition
    void conciergeModal.offsetWidth;
    conciergeModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Pre-fill if originating from a specific archive project
    if (prefillProject && conciergeModalForm) {
      const typeSelect = conciergeModalForm.querySelector('#modal_project_type');
      if (typeSelect) {
        if (prefillProject.category === 'muros') typeSelect.value = 'structural_wall';
        else if (prefillProject.category === 'quintas') typeSelect.value = 'heritage_restoration';
        else if (prefillProject.category === 'cantaria') typeSelect.value = 'bespoke_stonework';
      }

      const notesField = conciergeModalForm.querySelector('#modal_project_notes');
      if (notesField && !notesField.value) {
        notesField.value = `Inquiry regarding "${prefillProject.title}" (${prefillProject.categoryLabel}).\nRequesting technical direction / feasibility analysis for site in: `;
      }
    }

    const firstInput = conciergeModal.querySelector('#modal_client_name');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  }

  function closeConciergeModal() {
    if (!conciergeModal) return;
    conciergeModal.classList.remove('active');
    setTimeout(() => {
      if (!conciergeModal.classList.contains('active')) {
        conciergeModal.setAttribute('hidden', '');
      }
    }, 400);

    if (!lightboxModal?.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  if (conciergeModalClose) {
    conciergeModalClose.addEventListener('click', closeConciergeModal);
  }

  if (conciergeModal) {
    conciergeModal.addEventListener('click', (e) => {
      if (e.target === conciergeModal) closeConciergeModal();
    });
  }

  if (modalFeedbackClose) {
    modalFeedbackClose.addEventListener('click', closeConciergeModal);
  }

  if (modalJumpSection) {
    modalJumpSection.addEventListener('click', () => {
      closeConciergeModal();
    });
  }

  // Lightbox "Inquire on Similar Commission" button
  if (lightboxInquireBtn) {
    lightboxInquireBtn.addEventListener('click', () => {
      const project = activeLightboxProject;
      closeLightbox();
      openConciergeModal(project);
    });
  }

  // Global triggers with [data-concierge-open]
  document.querySelectorAll('[data-concierge-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If mobile menu was open, close it
      header?.classList.remove('menu-open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
      openConciergeModal();
    });
  });

  // Global ESC key management
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (conciergeModal?.classList.contains('active')) {
        closeConciergeModal();
      } else if (lightboxModal?.classList.contains('active')) {
        closeLightbox();
      } else if (header?.classList.contains('menu-open')) {
        header.classList.remove('menu-open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  function generateDossierRef() {
    const year = new Date().getFullYear();
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SOL-${year}-${code}`;
  }

  // Concierge Modal Form Submission
  if (conciergeModalForm) {
    conciergeModalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = conciergeModalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>TRANSMITTING TECHNICAL DOSSIER...</span>`;
      submitBtn.disabled = true;

      const formData = new FormData(conciergeModalForm);
      const name = formData.get('client_name') || 'Principal';
      const email = formData.get('client_email') || '';
      const phone = formData.get('client_phone') || '';
      const projectType = formData.get('project_type') || 'Stone Commission';
      const location = formData.get('location') || 'Grande Porto / Douro';
      const notes = formData.get('project_notes') || '';
      const dossierRef = generateDossierRef();

      setTimeout(() => {
        conciergeModalForm.hidden = true;
        if (modalFeedbackCard) {
          modalFeedbackCard.hidden = false;

          const descEl = document.getElementById('modal-feedback-desc');
          if (descEl) {
            descEl.textContent = `Thank you, ${name}. Your commission feasibility inquiry regarding "${projectType}" in ${location} has been registered with priority technical status.`;
          }

          const refEl = document.getElementById('modal-receipt-ref');
          if (refEl) {
            refEl.textContent = dossierRef;
          }

          const mailtoBtn = document.getElementById('modal-mailto-fallback');
          if (mailtoBtn) {
            const subject = encodeURIComponent(`[${dossierRef}] Technical Direction Commission Inquiry - ${name}`);
            const body = encodeURIComponent(
              `Dossier Ref: ${dossierRef}\n` +
              `Principal/Studio: ${name}\n` +
              `Professional Email: ${email}\n` +
              `Phone/WhatsApp: ${phone}\n` +
              `Nature of Commission: ${projectType}\n` +
              `Location: ${location}\n\n` +
              `Technical Brief / Blueprints:\n${notes}\n`
            );
            mailtoBtn.href = `mailto:director@solrac-tectonics.com?subject=${subject}&body=${body}`;
          }
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 700);
    });
  }

  /* -------------------------------------------------------------------------
     5. High-Ticket In-Page Concierge Form (Section 04)
     ------------------------------------------------------------------------- */
  const conciergeForm = document.getElementById('concierge-form');
  const inpageFeedbackCard = document.getElementById('inpage-feedback-card');
  const inpageFeedbackReset = document.getElementById('inpage-feedback-reset');

  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = conciergeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>TRANSMITTING TECHNICAL INQUIRY...</span>`;
      submitBtn.disabled = true;

      const formData = new FormData(conciergeForm);
      const name = formData.get('client_name') || 'Principal';
      const email = formData.get('client_email') || '';
      const phone = formData.get('client_phone') || '';
      const projectType = formData.get('project_type') || 'Stone Commission';
      const location = formData.get('location') || 'Grande Porto';
      const notes = formData.get('project_notes') || '';
      const dossierRef = generateDossierRef();

      setTimeout(() => {
        conciergeForm.hidden = true;
        if (inpageFeedbackCard) {
          inpageFeedbackCard.hidden = false;

          const descEl = document.getElementById('inpage-feedback-desc');
          if (descEl) {
            descEl.textContent = `Thank you, ${name}. Your commission feasibility dossier regarding "${projectType}" in ${location} has been transmitted to Technical Direction.`;
          }

          const refEl = document.getElementById('inpage-receipt-ref');
          if (refEl) {
            refEl.textContent = dossierRef;
          }

          const mailtoBtn = document.getElementById('inpage-mailto-fallback');
          if (mailtoBtn) {
            const subject = encodeURIComponent(`[${dossierRef}] Commission Feasibility Intake - ${name}`);
            const body = encodeURIComponent(
              `Dossier Ref: ${dossierRef}\n` +
              `Principal/Studio: ${name}\n` +
              `Professional Email: ${email}\n` +
              `Phone/WhatsApp: ${phone}\n` +
              `Nature of Commission: ${projectType}\n` +
              `Location: ${location}\n\n` +
              `Technical Brief / Blueprints:\n${notes}\n`
            );
            mailtoBtn.href = `mailto:director@solrac-tectonics.com?subject=${subject}&body=${body}`;
          }
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 700);
    });

    if (inpageFeedbackReset) {
      inpageFeedbackReset.addEventListener('click', () => {
        conciergeForm.reset();
        conciergeForm.hidden = false;
        if (inpageFeedbackCard) inpageFeedbackCard.hidden = true;
      });
    }
  }

  /* -------------------------------------------------------------------------
     6. Header & Mobile Navigation Toggle
     ------------------------------------------------------------------------- */
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');

  if (mobileToggle && header) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('menu-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

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
