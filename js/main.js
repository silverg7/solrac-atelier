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
      "categoryLabel": "Muro de contenção",
      "title": "Muro de contenção curvo",
      "material": "Alvenaria de pedra",
      "detail": "Alinhamento curvo",
      "image": "assets/images/muros/muro-curvo-1920.webp",
      "imageBase": "assets/images/muros/muro-curvo",
      "width": 1920,
      "height": 1082,
      "alt": "Muro de contenção curvo em pedra junto ao limite de um terreno ajardinado.",
      "specs": {
        "element": "Alinhamento curvo",
        "masonry": "Pedra à vista"
      },
      "description": "A alvenaria acompanha a curva do terreno, com juntas desencontradas e uma face contínua de pedra."
    },
    {
      "id": "muro-aparelhado",
      "category": "muros",
      "categoryLabel": "Muro de contenção",
      "title": "Muro de delimitação em cantaria aparelhada",
      "material": "Alvenaria de pedra",
      "detail": "Fiadas aparelhadas",
      "image": "assets/images/muros/muro-aparelhado-1920.webp",
      "imageBase": "assets/images/muros/muro-aparelhado",
      "width": 1920,
      "height": 933,
      "alt": "Muro longo de blocos de pedra aparelhada junto a uma entrada recuada.",
      "specs": {
        "element": "Fiadas aparelhadas",
        "masonry": "Pedra à vista"
      },
      "description": "Muro contínuo de pedra esquadriada, com fiadas, juntas e remate junto à entrada visíveis."
    },
    {
      "id": "portal-rural",
      "category": "quintas",
      "categoryLabel": "Alvenaria rural",
      "title": "Empena e guarnição de entrada em pedra",
      "material": "Alvenaria de pedra",
      "detail": "Guarnição de entrada",
      "image": "assets/images/quintas/portal-rural-1920.webp",
      "imageBase": "assets/images/quintas/portal-rural",
      "width": 1920,
      "height": 933,
      "alt": "Empena rural em pedra com guarnição de entrada em cantaria durante a reabilitação.",
      "specs": {
        "element": "Guarnição de entrada",
        "masonry": "Pedra à vista"
      },
      "description": "Estrutura rural de alvenaria existente com empena inclinada e blocos aparelhados a enquadrar a entrada."
    },
    {
      "id": "reabilitacao-pedra",
      "category": "quintas",
      "categoryLabel": "Alvenaria rural",
      "title": "Reabilitação de alvenaria rural",
      "material": "Alvenaria de pedra",
      "detail": "Ombreiras do vão",
      "image": "assets/images/quintas/reabilitacao-pedra-1920.webp",
      "imageBase": "assets/images/quintas/reabilitacao-pedra",
      "width": 1920,
      "height": 1080,
      "alt": "Interior de um edifício rural em pedra com ombreiras aparelhadas e alvenaria à vista.",
      "specs": {
        "element": "Ombreiras do vão",
        "masonry": "Pedra à vista"
      },
      "description": "Paredes de alvenaria à vista e elementos aparelhados dos vãos, fotografados durante a reabilitação de um edifício rural."
    },
    {
      "id": "escada-detalhe",
      "category": "cantaria",
      "categoryLabel": "Cantaria aparelhada",
      "title": "Escada · Pormenor de junta em pedra",
      "material": "Alvenaria de pedra",
      "detail": "Fiada de pedra diagonal",
      "image": "assets/images/cantaria/escada-detalhe-1920.webp",
      "imageBase": "assets/images/cantaria/escada-detalhe",
      "width": 1920,
      "height": 933,
      "alt": "Pormenor de uma fiada diagonal de cantaria na ligação à alvenaria sob uma escada.",
      "specs": {
        "element": "Fiada de pedra diagonal",
        "masonry": "Pedra à vista"
      },
      "description": "Pormenor da junta entre a fiada diagonal aparelhada e a alvenaria de apoio sob a escada."
    },
    {
      "id": "degraus-macicos",
      "category": "cantaria",
      "categoryLabel": "Cantaria aparelhada",
      "title": "Degraus de entrada em pedra maciça",
      "material": "Alvenaria de pedra",
      "detail": "Degraus de pedra maciça",
      "image": "assets/images/cantaria/degraus-macicos-1920.webp",
      "imageBase": "assets/images/cantaria/degraus-macicos",
      "width": 1920,
      "height": 933,
      "alt": "Degraus largos de entrada em pedra maciça com espelhos aparelhados e remates laterais.",
      "specs": {
        "element": "Degraus de pedra maciça",
        "masonry": "Pedra à vista"
      },
      "description": "Lanço largo de degraus de pedra com linhas horizontais contínuas e remates laterais aparelhados, fotografado em obra."
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
            <span class="meta-field-label">Pormenor</span>
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
          <span style="color: var(--text-secondary); text-transform: uppercase;">${({ element: 'Elemento', masonry: 'Alvenaria' })[key] || key.replaceAll('_', ' ')}</span>
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

    modalOpenTime = Date.now();

    if (conciergeModalForm) {
      conciergeModalForm.hidden = false;
    }
    if (modalFeedbackCard) {
      modalFeedbackCard.hidden = true;
    }

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
        notesField.value = `Consulta sobre "${prefillProject.title}" (${prefillProject.categoryLabel}).\nPedido de direção técnica / análise de viabilidade para uma obra em: `;
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

  let pageLoadTime = Date.now();
  let modalOpenTime = Date.now();

  function generateDossierRef() {
    const year = new Date().getFullYear();
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SOL-${year}-${code}`;
  }

  function getWhatsAppUrl(phone, text) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }

  function cacheLeadLocally(ref, payload, status) {
    try {
      const storageKey = 'solrac_dossier_vault';
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.push({
        ref: ref,
        timestamp: new Date().toISOString(),
        status: status,
        payload: payload,
      });
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (_) {
      // Storage unavailable or private mode
    }
  }

  async function transmitInquiry(payload) {
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.error) {
          errorMsg = errorJson.error;
        }
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return await response.json();
  }

  function showInquiryFeedback(prefix, form, card, payload, dossierRef, isBackendOffline) {
    form.hidden = true;
    if (!card) return;
    card.hidden = false;

    // API values remain stable; user-facing text always comes from PT-PT labels.
    const selectedLabel = (field, fallback) =>
      form.elements.namedItem(field)?.selectedOptions?.[0]?.textContent.trim() || fallback;
    const projectLabel = selectedLabel('project_type', 'Intervenção em pedra');
    const roleLabel = selectedLabel('client_role', 'Cliente');
    card.querySelector('.feedback-title').textContent = isBackendOffline
      ? 'Pedido por enviar'
      : 'Pedido recebido';
    document.getElementById(`${prefix}-feedback-desc`).textContent = isBackendOffline
      ? `Não foi possível enviar o pedido de ${payload.client_name} sobre «${projectLabel}» em ${payload.location}. Utilize o email ou o WhatsApp abaixo para concluir o envio. Referência local: ${dossierRef}.`
      : `Obrigado, ${payload.client_name}. O seu pedido sobre «${projectLabel}» em ${payload.location} foi recebido com a referência ${dossierRef}.`;
    document.getElementById(`${prefix}-receipt-ref`).textContent = dossierRef;
    const receiptValues = card.querySelectorAll('.receipt-val');
    receiptValues[1].textContent = isBackendOffline ? 'ENVIO MANUAL NECESSÁRIO' : 'PEDIDO RECEBIDO';
    receiptValues[2].textContent = isBackendOffline ? 'ENVIAR POR EMAIL OU WHATSAPP' : 'AGUARDAR CONTACTO DA EQUIPA';
    // A check mark must never imply delivery when the backend could not confirm it.
    card.querySelector('.feedback-icon').textContent = isBackendOffline ? '!' : '✓';
    const subject = encodeURIComponent(`[${dossierRef}] Pedido de consulta técnica — ${payload.client_name}`);
    const bodyText =
      `Referência: ${dossierRef}\n` +
      `Nome / Gabinete: ${payload.client_name}\n` +
      `Perfil do cliente: ${roleLabel}\n` +
      `Email profissional: ${payload.client_email}\n` +
      `Telefone / WhatsApp: ${payload.client_phone}\n` +
      `Tipo de intervenção: ${projectLabel}\n` +
      `Local da obra: ${payload.location}\n\n` +
      `Descrição do projeto / Plantas:\n${payload.project_notes}\n`;
    document.getElementById(`${prefix}-mailto-fallback`).href =
      `mailto:director@solrac-tectonics.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    document.getElementById(`${prefix}-whatsapp-fallback`).href =
      getWhatsAppUrl('351912345678', `SOLRAC — Pedido de consulta técnica\n\n${bodyText}`);
    if (prefix === 'modal') {
      conciergeModal.querySelector('.concierge-modal-dialog').scrollTop = 0;
    } else {
      card.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  // Concierge Modal Form Submission
  if (conciergeModalForm) {
    conciergeModalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = conciergeModalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const formData = new FormData(conciergeModalForm);
      const websiteTrap = (formData.get('website_trap') || '').toString().trim();

      // Anti-spam client check: if trap filled, drop silently
      if (websiteTrap !== '') {
        return;
      }

      submitBtn.innerHTML = `<span>A ENVIAR PEDIDO…</span>`;
      submitBtn.disabled = true;

      const name = (formData.get('client_name') || '').toString().trim() || 'Cliente';
      const role = (formData.get('client_role') || 'architect').toString().trim();
      const email = (formData.get('client_email') || '').toString().trim();
      const phone = (formData.get('client_phone') || '').toString().trim();
      const projectType = (formData.get('project_type') || 'bespoke_stonework').toString().trim();
      const location = (formData.get('location') || '').toString().trim() || 'Grande Porto / Douro';
      const notes = (formData.get('project_notes') || '').toString().trim();

      const payload = {
        client_name: name,
        client_role: role,
        client_email: email,
        client_phone: phone,
        project_type: projectType,
        location: location,
        project_notes: notes,
        website_trap: websiteTrap,
        form_loaded_at: modalOpenTime,
        source: 'modal_form',
      };

      let dossierRef = '';
      let isBackendOffline = false;

      try {
        const result = await transmitInquiry(payload);
        dossierRef = result.ref || generateDossierRef();
        cacheLeadLocally(dossierRef, payload, 'persisted_remote');
      } catch (err) {
        console.warn('Backend unavailable, activating resilient direct channels fallback:', err);
        dossierRef = generateDossierRef();
        isBackendOffline = true;
        cacheLeadLocally(dossierRef, payload, 'offline_cached');
      }

      showInquiryFeedback('modal', conciergeModalForm, modalFeedbackCard, payload, dossierRef, isBackendOffline);

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }

  /* -------------------------------------------------------------------------
     5. High-Ticket In-Page Concierge Form (Section 04)
     ------------------------------------------------------------------------- */
  const conciergeForm = document.getElementById('concierge-form');
  const inpageFeedbackCard = document.getElementById('inpage-feedback-card');
  const inpageFeedbackReset = document.getElementById('inpage-feedback-reset');

  if (conciergeForm) {
    conciergeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = conciergeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const formData = new FormData(conciergeForm);
      const websiteTrap = (formData.get('website_trap') || '').toString().trim();

      // Anti-spam client check: if trap filled, drop silently
      if (websiteTrap !== '') {
        return;
      }

      submitBtn.innerHTML = `<span>A ENVIAR PEDIDO…</span>`;
      submitBtn.disabled = true;

      const name = (formData.get('client_name') || '').toString().trim() || 'Cliente';
      const role = (formData.get('client_role') || 'architect').toString().trim();
      const email = (formData.get('client_email') || '').toString().trim();
      const phone = (formData.get('client_phone') || '').toString().trim();
      const projectType = (formData.get('project_type') || 'bespoke_stonework').toString().trim();
      const location = (formData.get('location') || '').toString().trim() || 'Grande Porto';
      const notes = (formData.get('project_notes') || '').toString().trim();

      const payload = {
        client_name: name,
        client_role: role,
        client_email: email,
        client_phone: phone,
        project_type: projectType,
        location: location,
        project_notes: notes,
        website_trap: websiteTrap,
        form_loaded_at: pageLoadTime,
        source: 'inpage_form',
      };

      let dossierRef = '';
      let isBackendOffline = false;

      try {
        const result = await transmitInquiry(payload);
        dossierRef = result.ref || generateDossierRef();
        cacheLeadLocally(dossierRef, payload, 'persisted_remote');
      } catch (err) {
        console.warn('Backend unavailable, activating resilient direct channels fallback:', err);
        dossierRef = generateDossierRef();
        isBackendOffline = true;
        cacheLeadLocally(dossierRef, payload, 'offline_cached');
      }

      showInquiryFeedback('inpage', conciergeForm, inpageFeedbackCard, payload, dossierRef, isBackendOffline);

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });

    if (inpageFeedbackReset) {
      inpageFeedbackReset.addEventListener('click', () => {
        pageLoadTime = Date.now();
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
