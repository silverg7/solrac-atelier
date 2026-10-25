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
      "description": "A alvenaria acompanha a curva do terreno, com juntas desencontradas e uma face contínua de pedra.",
      "gallery": [
        {
          "image": "assets/images/muros/muro-curvo-1920.webp",
          "thumbnail": "assets/images/muros/muro-curvo-640.webp",
          "width": 1920,
          "height": 1082,
          "kind": "conjunto",
          "alt": "Muro de contenção curvo em pedra junto ao limite de um terreno ajardinado."
        },
        {
          "image": "assets/images/muros/muro-curvo-vista-2-1920.webp",
          "thumbnail": "assets/images/muros/muro-curvo-vista-2-640.webp",
          "width": 1920,
          "height": 1082,
          "kind": "remate",
          "alt": "Remate do muro curvo junto aos degraus de pedra."
        }
      ]
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
      "description": "Muro contínuo de pedra esquadriada, com fiadas, juntas e remate junto à entrada visíveis.",
      "gallery": [
        {
          "image": "assets/images/muros/muro-aparelhado-1920.webp",
          "thumbnail": "assets/images/muros/muro-aparelhado-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "conjunto",
          "alt": "Muro longo de blocos de pedra aparelhada junto a uma entrada recuada."
        },
        {
          "image": "assets/images/muros/muro-aparelhado-vista-2-1920.webp",
          "thumbnail": "assets/images/muros/muro-aparelhado-vista-2-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "aparejo",
          "alt": "Fiadas aparelhadas do mesmo muro vistas ao longo da face."
        }
      ]
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
      "description": "Estrutura rural de alvenaria existente com empena inclinada e blocos aparelhados a enquadrar a entrada.",
      "gallery": [
        {
          "image": "assets/images/quintas/portal-rural-1920.webp",
          "thumbnail": "assets/images/quintas/portal-rural-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "conjunto",
          "alt": "Empena rural em pedra com guarnição de entrada em cantaria durante a reabilitação."
        },
        {
          "image": "assets/images/quintas/portal-rural-vista-2-1920.webp",
          "thumbnail": "assets/images/quintas/portal-rural-vista-2-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "conjunto",
          "alt": "Vista oblíqua da empena e das ombreiras da entrada rural."
        }
      ]
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
      "description": "Paredes de alvenaria à vista e elementos aparelhados dos vãos, fotografados durante a reabilitação de um edifício rural.",
      "gallery": [
        {
          "image": "assets/images/quintas/reabilitacao-pedra-1920.webp",
          "thumbnail": "assets/images/quintas/reabilitacao-pedra-640.webp",
          "width": 1920,
          "height": 1080,
          "kind": "conjunto",
          "alt": "Interior de um edifício rural em pedra com ombreiras aparelhadas e alvenaria à vista."
        },
        {
          "image": "assets/images/quintas/reabilitacao-pedra-vista-2-1920.webp",
          "thumbnail": "assets/images/quintas/reabilitacao-pedra-vista-2-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "conjunto",
          "alt": "Vista superior das paredes e dos vãos do edifício em reabilitação."
        }
      ]
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
      "description": "Pormenor da junta entre a fiada diagonal aparelhada e a alvenaria de apoio sob a escada.",
      "gallery": [
        {
          "image": "assets/images/cantaria/escada-detalhe-1920.webp",
          "thumbnail": "assets/images/cantaria/escada-detalhe-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "conjunto",
          "alt": "Pormenor de uma fiada diagonal de cantaria na ligação à alvenaria sob uma escada."
        },
        {
          "image": "assets/images/cantaria/escada-detalhe-vista-2-1920.webp",
          "thumbnail": "assets/images/cantaria/escada-detalhe-vista-2-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "conjunto",
          "alt": "Vista da escada com fiada inclinada, alvenaria de apoio e fachada vermelha."
        }
      ]
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
      "description": "Lanço largo de degraus de pedra com linhas horizontais contínuas e remates laterais aparelhados, fotografado em obra.",
      "gallery": [
        {
          "image": "assets/images/cantaria/degraus-macicos-1920.webp",
          "thumbnail": "assets/images/cantaria/degraus-macicos-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "conjunto",
          "alt": "Degraus largos de entrada em pedra maciça com espelhos aparelhados e remates laterais."
        },
        {
          "image": "assets/images/cantaria/degraus-macicos-vista-2-1920.webp",
          "thumbnail": "assets/images/cantaria/degraus-macicos-vista-2-640.webp",
          "width": 1920,
          "height": 933,
          "kind": "remate",
          "alt": "Vista frontal dos degraus maciços e dos seus remates laterais."
        }
      ]
    }
  ];

  /* -------------------------------------------------------------------------
     2. Render Projects Grid
     ------------------------------------------------------------------------- */
  const projectsGrid = document.getElementById('projects-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  let activeFilter = 'all';

  function getLocalizedProject(project) {
    if (typeof I18N === 'undefined') return project;
    return {
      id: project.id,
      category: project.category,
      categoryLabel: I18N.t(`project.${project.id}.categoryLabel`, project.categoryLabel),
      title: I18N.t(`project.${project.id}.title`, project.title),
      material: I18N.t(`project.${project.id}.material`, project.material),
      detail: I18N.t(`project.${project.id}.detail`, project.detail),
      image: project.image,
      imageBase: project.imageBase,
      width: project.width,
      height: project.height,
      alt: I18N.t(`project.${project.id}.alt`, project.alt),
      specs: {
        element: I18N.t(`project.${project.id}.spec_element`, project.specs.element),
        masonry: I18N.t(`project.${project.id}.spec_masonry`, project.specs.masonry)
      },
      description: I18N.t(`project.${project.id}.description`, project.description)
    };
  }

  function renderProjects(filter = 'all') {
    if (!projectsGrid) return;
    activeFilter = filter;
    
    projectsGrid.innerHTML = '';
    
    const filteredProjects = filter === 'all' 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.category === filter);

    filteredProjects.forEach((baseProject) => {
      const project = getLocalizedProject(baseProject);
      const card = document.createElement('article');
      card.className = 'project-card';
      card.dataset.id = project.id;
      card.dataset.category = project.category;
      
      const labelMaterial = (typeof I18N !== 'undefined') ? I18N.t('lightbox.spec_material', 'Material') : 'Material';
      const labelDetail = (typeof I18N !== 'undefined') ? I18N.t('lightbox.spec_detail', 'Pormenor') : 'Pormenor';
      const labelOpenProject = (typeof I18N !== 'undefined') ? I18N.t('a11y.open_project', 'Inspecionar obra') : 'Inspecionar obra';

      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${labelOpenProject}: ${project.title} — ${project.categoryLabel}`);

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
            <span class="meta-field-label">${labelMaterial}</span>
            <span class="meta-field-val">${project.material}</span>
            <span class="meta-field-label">${labelDetail}</span>
            <span class="meta-field-val">${project.detail}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(project.id, card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(project.id, card);
        }
      });
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
     2.5 Accessibility: Strict Modal Focus Trap & Skip-to-Content (SOL-08)
     ------------------------------------------------------------------------- */
  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const siteWrapper = document.querySelector('.site-wrapper');
  const skipToContentLink = document.getElementById('skip-to-content');
  const mainContentLandmark = document.getElementById('main-content');

  if (skipToContentLink && mainContentLandmark) {
    skipToContentLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof mainContentLandmark.focus === 'function') {
        mainContentLandmark.focus();
      }
      if (typeof mainContentLandmark.scrollIntoView === 'function') {
        mainContentLandmark.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    });
  }

  const modalA11y = (() => {
    const triggers = new Map();

    function isFocusableVisible(el, boundaryRoot = null) {
      if (!el || el.disabled) return false;
      const tabAttr = typeof el.getAttribute === 'function' ? el.getAttribute('tabindex') : null;
      if (tabAttr === '-1') return false;

      let cur = el;
      while (cur && cur !== document.body && cur !== document.documentElement) {
        if (cur.hidden === true || (typeof cur.hasAttribute === 'function' && cur.hasAttribute('hidden'))) {
          return false;
        }
        if (cur !== boundaryRoot && typeof cur.getAttribute === 'function' && cur.getAttribute('aria-hidden') === 'true') {
          return false;
        }
        if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
          const computed = window.getComputedStyle(cur);
          if (computed && (computed.display === 'none' || computed.visibility === 'hidden')) {
            return false;
          }
        }
        if (boundaryRoot && cur === boundaryRoot) break;
        cur = cur.parentElement || null;
      }
      return true;
    }

    function getFocusableElements(modal) {
      if (!modal || typeof modal.querySelectorAll !== 'function') return [];
      return Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => isFocusableVisible(el, modal));
    }

    function getActiveModal() {
      if (typeof conciergeModal !== 'undefined' && conciergeModal && conciergeModal.classList.contains('active')) {
        return conciergeModal;
      }
      if (typeof lightboxModal !== 'undefined' && lightboxModal && lightboxModal.classList.contains('active')) {
        return lightboxModal;
      }
      return null;
    }

    function syncBackgroundState() {
      if (!siteWrapper) return;
      const active = getActiveModal();
      if (active) {
        if (typeof siteWrapper.setAttribute === 'function') {
          siteWrapper.setAttribute('aria-hidden', 'true');
        }
        siteWrapper.inert = true;
      } else {
        if (typeof siteWrapper.removeAttribute === 'function') {
          siteWrapper.removeAttribute('aria-hidden');
        }
        siteWrapper.inert = false;
      }
    }

    function resolveTriggerElement(record) {
      if (!record) return null;
      const { element, id, projectId } = record;
      if (element && element.isConnected !== false && isFocusableVisible(element)) {
        return element;
      }
      if (projectId && typeof document.querySelector === 'function') {
        const cardMatch = document.querySelector(`.project-card[data-id="${projectId}"]`);
        if (cardMatch && isFocusableVisible(cardMatch)) return cardMatch;
      }
      if (id && typeof document.getElementById === 'function') {
        const byId = document.getElementById(id);
        if (byId && isFocusableVisible(byId)) return byId;
      }
      const fallbackToggle = typeof document.getElementById === 'function' ? document.getElementById('mobile-toggle') : null;
      if (fallbackToggle && isFocusableVisible(fallbackToggle)) {
        return fallbackToggle;
      }
      const fallbackHeaderCta = typeof document.getElementById === 'function' ? document.getElementById('header-concierge-btn') : null;
      if (fallbackHeaderCta && isFocusableVisible(fallbackHeaderCta)) {
        return fallbackHeaderCta;
      }
      if (mainContentLandmark) {
        return mainContentLandmark;
      }
      return element || null;
    }

    function onOpen(modal, explicitTrigger = null, preferredFocus = null) {
      if (!modal) return;
      const candidate = explicitTrigger || document.activeElement || null;
      const insideModal = candidate && typeof modal.contains === 'function' && modal.contains(candidate);
      if (candidate && candidate !== document.body && candidate !== document.documentElement && !insideModal) {
        triggers.set(modal, {
          element: candidate,
          id: candidate.id || '',
          projectId: candidate.dataset ? (candidate.dataset.id || '') : ''
        });
      }
      syncBackgroundState();
      const focusables = getFocusableElements(modal);
      const initialTarget = (preferredFocus && isFocusableVisible(preferredFocus, modal))
        ? preferredFocus
        : (focusables[0] || modal);
      if (initialTarget && typeof initialTarget.focus === 'function') {
        initialTarget.focus();
      }
    }

    function onClose(modal, options = {}) {
      if (!modal) return;
      const restoreFocus = options.restoreFocus !== false;
      const saved = triggers.get(modal) || null;
      triggers.delete(modal);
      syncBackgroundState();
      if (restoreFocus && !getActiveModal() && saved) {
        const target = resolveTriggerElement(saved);
        if (target && typeof target.focus === 'function') {
          target.focus();
        }
      }
    }

    function getTrigger(modal) {
      const saved = triggers.get(modal);
      return saved ? saved.element : null;
    }

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
      const activeModal = getActiveModal();
      if (!activeModal) return;

      const focusables = getFocusableElements(activeModal);
      if (!focusables.length) {
        e.preventDefault();
        if (typeof activeModal.focus === 'function') activeModal.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;
      const inside = current && (
        (typeof activeModal.contains === 'function' && activeModal.contains(current)) ||
        focusables.includes(current)
      );

      if (e.shiftKey) {
        if (!inside || current === first || current === activeModal) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!inside || current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener('focusin', (e) => {
      const activeModal = getActiveModal();
      if (!activeModal || !e.target) return;
      const inside = e.target === activeModal || (
        typeof activeModal.contains === 'function' && activeModal.contains(e.target)
      );
      if (!inside) {
        const focusables = getFocusableElements(activeModal);
        const redirectTarget = focusables[0] || activeModal;
        if (redirectTarget && typeof redirectTarget.focus === 'function') {
          redirectTarget.focus();
        }
      }
    });

    return { onOpen, onClose, getTrigger, getFocusableElements, getActiveModal };
  })();

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

  const lightboxViewer = document.querySelector('.lightbox-image-viewer');
  const photoTab = document.getElementById('lightbox-photo-tab');
  const technicalTab = document.getElementById('lightbox-technical-tab');
  const technicalSheet = document.getElementById('lightbox-technical');
  const technicalDetail = document.getElementById('technical-detail');
  const lightboxPhotos = document.getElementById('lightbox-photos');
  let lightboxPhotoIndex = 0;
  let lightboxGallery = [];
  let lightboxIndex = -1;

  function selectLightboxPhoto(index) {
    const project = activeLightboxProject;
    const views = project?.gallery || [project];
    if (!project || index < 0 || index >= views.length) return;
    lightboxPhotoIndex = index;
    const view = views[index];
    const localized = getLocalizedProject(project);
    const label = typeof I18N !== 'undefined' ? I18N.t(`lightbox.angle_${view.kind}`, 'Conjunto') : 'Conjunto';
    lightboxImage.src = view.image;
    lightboxImage.alt = index === 0 ? localized.alt : `${localized.title} — ${label}`;
    lightboxImage.width = view.width;
    lightboxImage.height = view.height;
    lightboxPhotos.querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
  }

  function renderLightboxPhotos() {
    lightboxPhotos.replaceChildren();
    const views = activeLightboxProject.gallery || [activeLightboxProject];
    views.forEach((view, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `lightbox-photo-${index}`;
      button.setAttribute('aria-controls', 'lightbox-image');
      const label = typeof I18N !== 'undefined' ? I18N.t(`lightbox.angle_${view.kind}`, 'Conjunto') : 'Conjunto';
      const img = document.createElement('img');
      img.src = view.thumbnail || view.image;
      img.alt = '';
      img.width = 64;
      img.height = 40;
      img.decoding = 'async';
      const caption = document.createElement('span');
      caption.textContent = `${index + 1} · ${label}`;
      button.append(img, caption);
      button.addEventListener('click', () => selectLightboxPhoto(index));
      button.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowLeft') next = (index + views.length - 1) % views.length;
        else if (event.key === 'ArrowRight') next = (index + 1) % views.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = views.length - 1;
        else return;
        event.preventDefault();
        event.stopPropagation();
        selectLightboxPhoto(next);
        lightboxPhotos.querySelectorAll('button')[next].focus({ preventScroll: true });
      });
      lightboxPhotos.append(button);
    });
    selectLightboxPhoto(lightboxPhotoIndex);
  }

  function showLightboxView(technical) {
    lightboxImage.hidden = technical;
    lightboxPhotos.hidden = technical;
    technicalSheet.hidden = !technical;
    photoTab.setAttribute('aria-pressed', String(!technical));
    technicalTab.setAttribute('aria-pressed', String(technical));
  }

  function showTechnicalDetail() {
    document.querySelectorAll('[data-technical]').forEach(drawing => {
      drawing.toggleAttribute('hidden', drawing.dataset.technical !== technicalDetail.value);
    });
  }
  photoTab.addEventListener('click', () => showLightboxView(false));
  technicalTab.addEventListener('click', () => showLightboxView(true));
  technicalDetail.addEventListener('change', showTechnicalDetail);

  function navigateLightbox(step) {
    if (!lightboxModal.classList.contains('active') || !lightboxGallery.length) return;
    lightboxIndex = (lightboxIndex + step + lightboxGallery.length) % lightboxGallery.length;
    openLightbox(lightboxGallery[lightboxIndex].id);
  }
  document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));
  document.addEventListener('keydown', event => {
    if (!lightboxModal.classList.contains('active') || conciergeModal.classList.contains('active') ||
        event.altKey || event.ctrlKey || event.metaKey ||
        event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigateLightbox(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  let swipeStart = null;
  lightboxViewer.addEventListener('touchstart', event => {
    swipeStart = event.touches.length === 1 && !event.target.closest('button, select, a')
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY, time: Date.now() } : null;
  }, { passive: true });
  lightboxViewer.addEventListener('touchcancel', () => { swipeStart = null; }, { passive: true });
  lightboxViewer.addEventListener('touchend', event => {
    const start = swipeStart;
    swipeStart = null;
    if (!start || event.touches.length || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Date.now() - start.time < 800 && Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      navigateLightbox(dx < 0 ? 1 : -1);
    }
  }, { passive: true });

  function openLightbox(projectId, triggerEl = null) {
    const baseProject = PROJECTS_DATA.find(p => p.id === projectId);
    if (!baseProject || !lightboxModal) return;

    const opening = !lightboxModal.classList.contains('active');
    if (opening) {
      lightboxGallery = PROJECTS_DATA.filter(p => activeFilter === 'all' || p.category === activeFilter);
      if (!lightboxGallery.some(p => p.id === projectId)) lightboxGallery = [...PROJECTS_DATA];
      showLightboxView(false);
    }
    lightboxIndex = lightboxGallery.findIndex(p => p.id === projectId);
    document.getElementById('lightbox-position').textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;
    if (opening || activeLightboxProject?.id !== projectId) {
      lightboxPhotoIndex = 0;
      technicalDetail.value = baseProject.category === 'cantaria' ? 'stone' : 'masonry';
      showTechnicalDetail();
    }
    activeLightboxProject = baseProject;
    const project = getLocalizedProject(baseProject);

    renderLightboxPhotos();
    
    lightboxTitle.textContent = project.title;
    lightboxCategory.textContent = project.categoryLabel;
    lightboxDesc.textContent = project.description;

    // Render specs
    if (lightboxSpecsContainer) {
      lightboxSpecsContainer.innerHTML = Object.entries(project.specs).map(([key, val]) => `
        <div class="lightbox-spec-item">
          <span style="color: var(--text-secondary); text-transform: uppercase;">${typeof I18N !== 'undefined' ? I18N.t(`lightbox.spec_${key}`, key) : ({ element: 'Elemento', masonry: 'Alvenaria' })[key] || key}</span>
          <span style="color: var(--text-primary); font-weight: 500;">${val}</span>
        </div>
      `).join('');
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (opening && typeof modalA11y !== 'undefined') {
      modalA11y.onOpen(lightboxModal, triggerEl, lightboxClose);
    }
  }

  function closeLightbox(options = {}) {
    if (!lightboxModal) return;
    const wasActive = lightboxModal.classList.contains('active');
    lightboxModal.classList.remove('active');
    activeLightboxProject = null;
    swipeStart = null;
    if (!conciergeModal?.classList.contains('active')) {
      document.body.style.overflow = '';
    }
    if (wasActive && typeof modalA11y !== 'undefined') {
      modalA11y.onClose(lightboxModal, options);
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => closeLightbox());
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

  function openConciergeModal(prefillProject = null, triggerEl = null) {
    if (!conciergeModal) return;

    modalOpenTime = Date.now();
    // Keep pending submissions and unseen receipts when the dialog is reopened.
    if (modalFeedbackCard?.hidden) {
      photoIntakes.get(conciergeModalForm)?.restore();
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
        const project = getLocalizedProject(prefillProject);
        const template = typeof I18N !== 'undefined' ? I18N.t('inquiry.project_prefill')
          : 'Consulta sobre "{title}" ({category}).\nPedido de direção técnica / análise de viabilidade para uma obra em: ';
        notesField.value = template.replace(/\{(title|category)\}/g,
          (_, key) => key === 'title' ? project.title : project.categoryLabel);
      }
    }

    const firstInput = !modalFeedbackCard?.hidden ? modalFeedbackClose
      : conciergeModal.querySelector('#modal_client_name');
    if (typeof modalA11y !== 'undefined') {
      modalA11y.onOpen(conciergeModal, triggerEl, firstInput);
    } else if (firstInput && typeof firstInput.focus === 'function') {
      firstInput.focus();
    }
  }

  function closeConciergeModal(options = {}) {
    if (!conciergeModal) return;
    const wasActive = conciergeModal.classList.contains('active');
    conciergeModal.classList.remove('active');
    setTimeout(() => {
      if (!conciergeModal.classList.contains('active')) {
        conciergeModal.setAttribute('hidden', '');
      }
    }, 400);

    if (!lightboxModal?.classList.contains('active')) {
      document.body.style.overflow = '';
    }
    if (wasActive && typeof modalA11y !== 'undefined') {
      modalA11y.onClose(conciergeModal, options);
    }
  }

  if (conciergeModalClose) {
    conciergeModalClose.addEventListener('click', () => closeConciergeModal());
  }

  if (conciergeModal) {
    conciergeModal.addEventListener('click', (e) => {
      if (e.target === conciergeModal) closeConciergeModal();
    });
  }

  if (modalFeedbackClose) {
    modalFeedbackClose.addEventListener('click', () => closeConciergeModal());
  }

  if (modalJumpSection) {
    modalJumpSection.addEventListener('click', () => {
      closeConciergeModal({ restoreFocus: false });
    });
  }

  // Lightbox "Inquire on Similar Commission" button
  if (lightboxInquireBtn) {
    lightboxInquireBtn.addEventListener('click', () => {
      const project = activeLightboxProject;
      const originTrigger = typeof modalA11y !== 'undefined' ? modalA11y.getTrigger(lightboxModal) : null;
      closeLightbox({ restoreFocus: false });
      openConciergeModal(project, originTrigger);
    });
  }

  // Global triggers with [data-concierge-open]
  document.querySelectorAll('[data-concierge-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If mobile menu was open, close it
      header?.classList.remove('menu-open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
      openConciergeModal(null, btn);
    });
  });

  // Global ESC key management
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (conciergeModal?.classList.contains('active')) {
        e.preventDefault();
        closeConciergeModal({ restoreFocus: true });
      } else if (lightboxModal?.classList.contains('active')) {
        e.preventDefault();
        closeLightbox({ restoreFocus: true });
      } else if (header?.classList.contains('menu-open')) {
        e.preventDefault();
        header.classList.remove('menu-open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        if (typeof mobileToggle?.focus === 'function') {
          mobileToggle.focus();
        }
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
      const compactPayload = { ...payload };
      if (Array.isArray(compactPayload.photos)) {
        compactPayload.photos = compactPayload.photos.map((p) => ({
          name: p.name || '',
          mime_type: p.mime_type || 'image/jpeg',
          size_bytes: p.size_bytes || 0,
        }));
      }
      existing.push({
        ref: ref,
        timestamp: new Date().toISOString(),
        status: status,
        payload: compactPayload,
      });
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (_) {
      // Storage unavailable or private mode
    }
  }

  async function serializeIntakePhotos(form) {
    if (typeof photoIntakes === 'undefined') return [];
    const intake = photoIntakes.get(form);
    if (!intake) return [];
    await intake.pending;
    if (!Array.isArray(intake.photos) || !intake.photos.length) return [];
    const encoded = [];
    for (let i = 0; i < intake.photos.length; i++) {
      const item = intake.photos[i];
      if (!item || !item.blob) continue;
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('photo_encode_error'));
        reader.readAsDataURL(item.blob);
      });
      encoded.push({
        name: item.name || `${intake.ref}-${i + 1}.jpg`,
        mime_type: item.blob.type || 'image/jpeg',
        size_bytes: item.blob.size,
        data: dataUrl,
      });
    }
    return encoded;
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

  const inquiryFeedback = new Map();

  function showInquiryFeedback(prefix, form, card, payload, dossierRef, isBackendOffline, updateOnly = false) {
    if (typeof inquiryFeedback !== 'undefined') {
      inquiryFeedback.set(prefix, { form, card, payload, dossierRef, isBackendOffline });
    }
    const translate = (key, fallback) => typeof I18N !== 'undefined' ? I18N.t(key, fallback) : fallback;
    form.hidden = true;
    if (!card) return;
    card.hidden = false;

    const selectedLabel = (field, fallback) => {
      const value = form.elements.namedItem(field)?.value;
      const key = `inquiry.option.${value}`;
      return translate(key, form.elements.namedItem(field)?.selectedOptions?.[0]?.textContent.trim() || fallback);
    };
    const projectLabel = selectedLabel('project_type', 'Intervenção em pedra');
    const roleLabel = selectedLabel('client_role', 'Cliente');
    const state = isBackendOffline ? 'offline' : 'received';
    card.querySelector('.feedback-title').dataset.i18n = `feedback.title.${state}`;
    const description = document.getElementById(`${prefix}-feedback-desc`);
    description.dataset.i18n = `feedback.description.${state}`;
    card.querySelector('.feedback-title').textContent = translate(`feedback.title.${state}`,
      isBackendOffline ? 'Pedido por enviar' : 'Pedido recebido');
    const template = translate(`feedback.description.${state}`, isBackendOffline
      ? 'Não foi possível enviar o pedido de {name} sobre «{project}» em {location}. Referência local: {ref}.'
      : 'Obrigado, {name}. O seu pedido sobre «{project}» em {location} foi recebido com a referência {ref}.');
    const values = { name: payload.client_name, project: projectLabel, location: payload.location, ref: dossierRef };
    description.textContent = template.replace(/\{(name|project|location|ref)\}/g, (_, key) => values[key]);
    document.getElementById(`${prefix}-receipt-ref`).textContent = dossierRef;
    const receiptValues = card.querySelectorAll('.receipt-val');
    receiptValues[1].dataset.i18n = `feedback.status.${state}`;
    receiptValues[2].dataset.i18n = `feedback.next.${state}`;
    receiptValues[1].textContent = translate(`feedback.status.${state}`,
      isBackendOffline ? 'ENVIO MANUAL NECESSÁRIO' : 'PEDIDO RECEBIDO');
    receiptValues[2].textContent = translate(`feedback.next.${state}`,
      isBackendOffline ? 'ENVIAR POR EMAIL OU WHATSAPP' : 'AGUARDAR CONTACTO DA EQUIPA');
    // A check mark must never imply delivery when the backend could not confirm it.
    card.querySelector('.feedback-icon').textContent = isBackendOffline ? '!' : '✓';
    const subject = encodeURIComponent(`[${dossierRef}] ${translate('inquiry.modal.title', 'Pedido de consulta técnica')} — ${payload.client_name}`);
    const bodyText = [
      `${translate('feedback.reference', 'Referência:')} ${dossierRef}`,
      `${translate('inquiry.field.client_name', 'Nome / Gabinete')}: ${payload.client_name}`,
      `${translate('inquiry.field.client_role', 'Perfil do cliente')}: ${roleLabel}`,
      `${translate('inquiry.field.client_email', 'Email profissional')}: ${payload.client_email}`,
      `${translate('inquiry.field.client_phone', 'Telefone / WhatsApp')}: ${payload.client_phone}`,
      `${translate('inquiry.field.project_type', 'Tipo de intervenção')}: ${projectLabel}`,
      `${translate('inquiry.field.location', 'Local da obra')}: ${payload.location}`,
      '', `${translate('inquiry.field.project_notes', 'Descrição do projeto / Plantas')}:`, payload.project_notes,
    ].join('\n');
    document.getElementById(`${prefix}-mailto-fallback`).href =
      `mailto:director@solrac-tectonics.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    document.getElementById(`${prefix}-whatsapp-fallback`).href = getWhatsAppUrl('351912345678',
      `${translate('inquiry.photos.message', 'SOLRAC — Pedido de consulta técnica')}\n\n${bodyText}\n${translate('inquiry.photos.instructions', 'Vou anexar as fotografias da obra.')}`);
    if (typeof photoIntakes !== 'undefined') {
      const intake = photoIntakes.get(form);
      intake?.setRef(dossierRef);
      intake?.setDelivered(!isBackendOffline);
      intake?.showInFeedback(card);
    }
    if (updateOnly || (prefix === 'modal' && !conciergeModal.classList?.contains('active'))) return;
    if (prefix === 'modal') {
      conciergeModal.querySelector('.concierge-modal-dialog').scrollTop = 0;
    } else {
      card.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    const primaryAction = document.getElementById(
      prefix === 'modal' ? 'modal-feedback-close' : 'inpage-feedback-reset'
    );
    if (primaryAction && typeof primaryAction.focus === 'function') {
      primaryAction.focus();
    }
  }

  // Concierge Modal Form Submission
  if (conciergeModalForm) {
    conciergeModalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = conciergeModalForm.querySelector('button[type="submit"]');
      if (submitBtn.disabled) return;
      const originalText = submitBtn.innerHTML;

      const formData = new FormData(conciergeModalForm);
      const websiteTrap = (formData.get('website_trap') || '').toString().trim();

      // Anti-spam client check: if trap filled, drop silently
      if (websiteTrap !== '') {
        return;
      }

      submitBtn.innerHTML = `<span data-i18n="inquiry.submitting">A ENVIAR PEDIDO…</span>`;
      submitBtn.disabled = true;
      photoIntakes.get(conciergeModalForm)?.setSubmitting(true);

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

      payload.dossier_ref = photoIntakes.get(conciergeModalForm)?.ref || generateDossierRef();
      let dossierRef = payload.dossier_ref;
      let isBackendOffline = false;

      try {
        payload.photos = await serializeIntakePhotos(conciergeModalForm);
        const result = await transmitInquiry(payload);
        dossierRef = result.ref || payload.dossier_ref;
        cacheLeadLocally(dossierRef, payload, 'persisted_remote');
      } catch (err) {
        console.warn('Backend unavailable, activating resilient direct channels fallback:', err);
        dossierRef = payload.dossier_ref;
        isBackendOffline = true;
        cacheLeadLocally(dossierRef, payload, 'offline_cached');
      }

      showInquiryFeedback('modal', conciergeModalForm, modalFeedbackCard, payload, dossierRef, isBackendOffline);

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      photoIntakes.get(conciergeModalForm)?.setSubmitting(false);
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
      if (submitBtn.disabled) return;
      const originalText = submitBtn.innerHTML;

      const formData = new FormData(conciergeForm);
      const websiteTrap = (formData.get('website_trap') || '').toString().trim();

      // Anti-spam client check: if trap filled, drop silently
      if (websiteTrap !== '') {
        return;
      }

      submitBtn.innerHTML = `<span data-i18n="inquiry.submitting">A ENVIAR PEDIDO…</span>`;
      submitBtn.disabled = true;
      photoIntakes.get(conciergeForm)?.setSubmitting(true);

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

      payload.dossier_ref = photoIntakes.get(conciergeForm)?.ref || generateDossierRef();
      let dossierRef = payload.dossier_ref;
      let isBackendOffline = false;

      try {
        payload.photos = await serializeIntakePhotos(conciergeForm);
        const result = await transmitInquiry(payload);
        dossierRef = result.ref || payload.dossier_ref;
        cacheLeadLocally(dossierRef, payload, 'persisted_remote');
      } catch (err) {
        console.warn('Backend unavailable, activating resilient direct channels fallback:', err);
        dossierRef = payload.dossier_ref;
        isBackendOffline = true;
        cacheLeadLocally(dossierRef, payload, 'offline_cached');
      }

      showInquiryFeedback('inpage', conciergeForm, inpageFeedbackCard, payload, dossierRef, isBackendOffline);

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      photoIntakes.get(conciergeForm)?.setSubmitting(false);
    });

    if (inpageFeedbackReset) {
      inpageFeedbackReset.addEventListener('click', () => {
        pageLoadTime = Date.now();
        inquiryFeedback.delete('inpage');
        conciergeForm.reset();
        conciergeForm.hidden = false;
        if (inpageFeedbackCard) inpageFeedbackCard.hidden = true;
        document.getElementById('client_name').focus();
      });
    }
  }

  document.getElementById('modal-feedback-reset')?.addEventListener('click', () => {
    inquiryFeedback.delete('modal');
    conciergeModalForm.reset();
    conciergeModalForm.hidden = false;
    modalFeedbackCard.hidden = true;
    modalOpenTime = Date.now();
    document.getElementById('modal_client_name').focus();
  });

  /* Local photo preparation & compression (<=350 KB JPEG) for integrated
     /api/inquiry persistence (SOL-08) and resilient WhatsApp fallback. */
  const photoIntakes = new Map();
  const photoText = key => I18N.t(`inquiry.photos.${key}`);

  async function compressPhoto(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) {
      throw new Error('format');
    }
    const source = URL.createObjectURL(file);
    const image = new Image();
    try {
      image.src = source;
      await image.decode();
      if (!image.naturalWidth || image.naturalWidth * image.naturalHeight > 40000000) throw new Error('size');
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('canvas');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let blob;
      for (const quality of [0.82, 0.65, 0.45]) {
        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (!blob) throw new Error('encoding');
        if (blob.size <= 350 * 1024) break;
      }
      if (blob.size > 350 * 1024) throw new Error('size');
      return blob;
    } finally {
      URL.revokeObjectURL(source);
    }
  }

  document.querySelectorAll('[data-photo-intake]').forEach(root => {
    const form = root.closest('form');
    const input = root.querySelector('input[type="file"]');
    const dropzone = root.querySelector('.photo-dropzone');
    const thumbnails = root.querySelector('.photo-thumbnails');
    const status = root.querySelector('.photo-status');
    const whatsapp = root.querySelector('.photo-whatsapp');
    const state = { ref: generateDossierRef(), photos: [], busy: false, revision: 0, statusKey: '', pending: Promise.resolve(), submitting: false };
    const placeholder = document.createComment('photo intake position');
    root.before(placeholder);
    state.restore = () => { root.hidden = false; placeholder.after(root); };
    state.setDelivered = delivered => {
      state.delivered = delivered;
      root.hidden = delivered && !state.photos.length;
      input.disabled = delivered;
      dropzone.hidden = delivered;
      render();
    };
    state.setSubmitting = submitting => {
      state.submitting = submitting;
      root.inert = submitting;
    };
    state.showInFeedback = card => card.querySelector('.feedback-actions').before(root);
    state.setRef = ref => { state.ref = ref; render(); };
    photoIntakes.set(form, state);

    function updateWhatsApp() {
      const location = form.elements.namedItem('location').value.trim();
      const project = form.elements.namedItem('project_type').selectedOptions[0].textContent.trim();
      const text = `${photoText('message')}\n${state.ref}\n${project}\n${location}\n${photoText('instructions')}`;
      whatsapp.href = getWhatsAppUrl('351912345678', text);
    }
    function render() {
      thumbnails.replaceChildren();
      root.querySelector('.photo-dossier').textContent = state.ref;
      status.textContent = state.statusKey ? photoText(state.statusKey) : `${state.photos.length} / 4`;
      for (const photo of state.photos) {
        const card = document.createElement('div');
        card.className = 'photo-thumbnail';
        const image = document.createElement('img');
        image.src = photo.url;
        image.alt = photoText('preview');
        image.width = 160;
        image.height = 120;
        const save = document.createElement('a');
        save.href = photo.url;
        save.download = `${state.ref}-${state.photos.indexOf(photo) + 1}.jpg`;
        save.textContent = `${photoText('save')} · ${Math.ceil(photo.blob.size / 1024)} KB`;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = photoText('remove');
        remove.setAttribute('aria-label', `${photoText('remove')} ${state.photos.indexOf(photo) + 1}`);
        remove.addEventListener('click', () => {
          URL.revokeObjectURL(photo.url);
          state.photos = state.photos.filter(item => item !== photo);
          state.statusKey = '';
          render();
        });
        card.append(image, save);
        if (!state.delivered) card.append(remove);
        thumbnails.appendChild(card);
      }
      updateWhatsApp();
    }
    async function processPhotos(files) {
      if (state.busy || state.submitting || state.delivered) return;
      const selection = Array.from(files);
      if (!selection.length) return;
      if (selection.length + state.photos.length > 4) {
        state.statusKey = 'limit'; render(); input.value = ''; return;
      }
      state.busy = true;
      input.disabled = true;
      root.setAttribute('aria-busy', 'true');
      state.statusKey = 'processing';
      render();
      const revision = state.revision;
      let failed = false;
      for (const file of selection) {
        try {
          const blob = await compressPhoto(file);
          if (revision !== state.revision) break;
          state.photos.push({ blob, url: URL.createObjectURL(blob), name: file.name || '' });
          render();
        } catch (_) {
          failed = true;
        }
      }
      state.busy = false;
      input.disabled = false;
      input.value = '';
      root.setAttribute('aria-busy', 'false');
      state.statusKey = failed ? 'error' : '';
      render();
    }
    function addPhotos(files) {
      if (state.busy || state.submitting || state.delivered) return state.pending;
      state.pending = processPhotos(files);
      return state.pending;
    }
    input.addEventListener('change', () => addPhotos(input.files));
    for (const eventName of ['dragenter', 'dragover']) {
      dropzone.addEventListener(eventName, event => {
        event.preventDefault(); dropzone.classList.add('is-dragging');
      });
    }
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragging'));
    dropzone.addEventListener('drop', event => {
      event.preventDefault();
      dropzone.classList.remove('is-dragging');
      return addPhotos(event.dataTransfer.files);
    });
    form.addEventListener('input', updateWhatsApp);
    form.addEventListener('change', updateWhatsApp);
    form.addEventListener('reset', () => {
      state.restore();
      state.revision++;
      state.photos.forEach(photo => URL.revokeObjectURL(photo.url));
      state.photos = [];
      state.setDelivered(false);
      state.ref = generateDossierRef();
      state.statusKey = '';
      render();
      setTimeout(updateWhatsApp, 0);
    });
    document.addEventListener('languagechange', render);
    render();
  });

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

  document.addEventListener('languagechange', () => {
    renderProjects(activeFilter);
    if (activeLightboxProject) {
      openLightbox(activeLightboxProject.id);
    }
    inquiryFeedback.forEach(({ form, card, payload, dossierRef, isBackendOffline }, prefix) => {
      showInquiryFeedback(prefix, form, card, payload, dossierRef, isBackendOffline, true);
    });
  });

  // Initial render
  renderProjects('all');
});
