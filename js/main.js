// js/main.js
(() => {
  'use strict';

  /* ===== Theme toggle (opción A) ===== */
  const THEME_KEY = 'theme';

  function applyTheme(theme) {
    const root = document.documentElement;
    const btn  = document.getElementById('themeToggle');
    const isDark = theme === 'dark';

    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      btn?.setAttribute('aria-checked', 'true');
      btn?.querySelector('.icon')?.replaceChildren(document.createTextNode('☀️'));
    } else {
      root.removeAttribute('data-theme'); // claro por defecto
      btn?.setAttribute('aria-checked', 'false');
      btn?.querySelector('.icon')?.replaceChildren(document.createTextNode('🌙'));
    }
  }

  function detectInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function initThemeToggle() {
    applyTheme(detectInitialTheme());

    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const nowDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = nowDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });

    // Si el sistema cambia y el usuario no fijó preferencia, respetarlo
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', (e) => {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== 'dark' && saved !== 'light') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /* ===== Año automático en el footer ===== */
  function initYear() {
    const span = document.getElementById('y');
    if (span) span.textContent = new Date().getFullYear();
  }

  /* ===== Carrusel reusable =====
     Estructura:
     <div class="carousel" data-autoplay="6000">
       <button class="nav prev">‹</button>
       <div class="track"> <figure class="slide">…</figure>… </div>
       <button class="nav next">›</button>
       <div class="dots"></div>
       <button class="hotzone hotzone--prev"></button>
       <button class="hotzone hotzone--next"></button>
     </div>
  ======================================== */
  function initCarousel(root) {
    const track    = root.querySelector('.track');
    const slides   = Array.from(root.querySelectorAll('.slide'));
    const prevBtn  = root.querySelector('.prev');
    const nextBtn  = root.querySelector('.next');
    const hzPrev   = root.querySelector('.hotzone--prev');
    const hzNext   = root.querySelector('.hotzone--next');
    const dotsWrap = root.querySelector('.dots');

    if (!track || slides.length === 0 || !dotsWrap) return;

    let index = 0;

    // Puntitos
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i) { index = (i + slides.length) % slides.length; update(); }
    function nextSlide() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    // Flechas + hotzones
    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);
    hzNext?.addEventListener('click', nextSlide);
    hzPrev?.addEventListener('click', prevSlide);

    // Teclado
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft')  prevSlide();
    });

    // Swipe simple
    let startX = 0, dragging = false;
    const threshold = 40;
    root.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; dragging = true;
    }, { passive: true });
    root.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > threshold) { dx < 0 ? nextSlide() : prevSlide(); dragging = false; }
    }, { passive: true });
    root.addEventListener('touchend', () => { dragging = false; });

    // Autoplay opcional
    let timer = null;
    const autoplayMs = Number(root.dataset.autoplay) || 0;
    function startAutoplay() { if (autoplayMs > 0 && !timer) timer = setInterval(nextSlide, autoplayMs); }
    function stopAutoplay()  { if (timer) { clearInterval(timer); timer = null; } }
    document.addEventListener('visibilitychange', () => { document.hidden ? stopAutoplay() : startAutoplay(); });
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    update(); startAutoplay();
  }

  // === Abrir acordeón si URL trae hash (#posters o #programs)
  function expandTargetFromHash(openAnimated = false) {
    const id = location.hash.slice(1);
    if (!id) return;
    if (!['posters', 'programs'].includes(id)) return;
    const det = document.querySelector(`#${id} details`);
    if (!det) return;
    const content = ensureDetailsContent(det);
    if (openAnimated) {
      if (!det.open) {
        det.open = true;            // asegura estado lógico
        detailsOpen(det, content);  // sincroniza animación
      }
    } else {
      det.open = true;
      // Estado visual consistente (incluye padding suavizado)
      content.style.height        = 'auto';
      content.style.opacity       = '1';
      content.style.paddingTop    = DETAILS_PAD + 'px';
      content.style.paddingBottom = DETAILS_PAD + 'px';
      content.classList.add('collapsible--open');
    }
  }

  /* ===== Overlay “phone card” (YouTube nocookie) ===== */
  const VO = {
    root: null, playerWrap: null, title: null, duration: null, caption: null,

    mount() {
      this.root = document.getElementById('videoOverlay');
      if (!this.root) return;
      this.playerWrap = this.root.querySelector('.vo-player');
      this.title      = this.root.querySelector('.vo-title');
      this.duration   = this.root.querySelector('.vo-duration');
      this.caption    = this.root.querySelector('.vo-caption');

      // Cerrar: backdrop, botón X
      this.root.addEventListener('click', (e) => {
        if (e.target.matches('[data-vo-close]')) this.close();
      });
      // ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
      });
      // Evitar scroll de fondo
      this.root.addEventListener('wheel', (e) => { if (this.isOpen()) e.preventDefault(); }, { passive: false });
    },

    isOpen() { return this.root?.classList.contains('open'); },

    open({ id, title, duration, caption }) {
      if (!this.root) this.mount();
      if (!this.root) return;

      this.title.textContent    = title || '';
      this.duration.textContent = duration || '';
      this.caption.innerHTML    = caption || '';

      // Altura segura para controles en móvil (evita superposición del caption)
      const isNarrow = window.matchMedia('(max-width: 640px)').matches;
      const controlsH = isNarrow ? Math.max(84, Math.round(window.innerHeight * 0.1)) : 56;
      document.documentElement.style.setProperty('--yt-controls-h', `${controlsH}px`);

      // Inyectar iframe (nocookie)
      this.playerWrap.innerHTML =
        `<iframe
           src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1"
           title="${title || 'Demo video'}"
           loading="lazy"
           allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
           allowfullscreen></iframe>`;

      this.root.classList.add('open');
      document.body.classList.add('vo-open');
      this.root.setAttribute('aria-hidden', 'false');
    },

    close() {
      if (!this.root) return;
      this.playerWrap.innerHTML = '';
      this.root.classList.remove('open');
      document.body.classList.remove('vo-open');
      this.root.setAttribute('aria-hidden', 'true');
      // document.documentElement.style.removeProperty('--yt-controls-h'); // opcional
    }
  };

  function initDemoButtons() {
    document.querySelectorAll('.demo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (!id) return;
        VO.open({
          id,
          title:    btn.dataset.title    || '',
          duration: btn.dataset.duration || '',
          caption:  btn.dataset.caption  || ''
        });
      });
    });
  }

  /* ===== Lightbox de imágenes (doble-click / doble-tap) ===== */
  function initImageLightbox() {
    const overlay = document.getElementById('imgOverlay');
    if (!overlay) return;
  
    const imgEl = overlay.querySelector('.io-img');
    const capEl = overlay.querySelector('.io-cap');
  
    function open(src, alt, caption) {
      imgEl.src = src;
      imgEl.alt = alt || '';
      capEl.textContent = caption || '';
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('vo-open'); // reutiliza el body lock
    }
  
    function close() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      imgEl.src = '';
      document.body.classList.remove('vo-open');
    }
  
    // Cerrar con ❌, con el backdrop, o tocando en cualquier zona fuera de la imagen/controles
    overlay.addEventListener('click', (e) => {
      const clickedClose   = e.target.matches('[data-io-close], .io-backdrop');
      const clickedImage   = !!e.target.closest('.io-img');
      const clickedControl = !!e.target.closest('a, button, input, textarea, select, label, iframe');
  
      if (clickedClose || (!clickedImage && !clickedControl)) {
        close();
      }
    });
  
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  
    // Target: figuras de research y robotics
    const candidates = document.querySelectorAll('#figures .slide img, #robotics .slide img');
  
    candidates.forEach(img => {
      // Desktop: doble click para abrir
      img.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const fig  = img.closest('figure');
        const cap  = fig?.querySelector('figcaption')?.textContent?.trim() || '';
        const full = img.dataset.full || img.src;
        open(full, img.alt, cap);
      });
  
      // Móvil: doble-tap simple (~300 ms) para abrir
      let lastTap = 0;
      img.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          e.preventDefault();
          const fig  = img.closest('figure');
          const cap  = fig?.querySelector('figcaption')?.textContent?.trim() || '';
          const full = img.dataset.full || img.src;
          open(full, img.alt, cap);
        }
        lastTap = now;
      }, { passive: true });
    });
  }


  /* ===== <details> con transición suave (sin display:none) ===== */
  const DETAILS_PAD = 12; // px
  const DETAILS_DUR_MS = 220; // duración base (ajustable)

  function ensureDetailsContent(detailsEl) {
    let wrap = detailsEl.querySelector(':scope > .details-content');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'details-content collapsible';
      wrap.style.overflow = 'hidden';
      wrap.style.boxSizing = 'border-box';
      // Mover todo excepto summary
      const kids = Array.from(detailsEl.children).filter(n => n.tagName.toLowerCase() !== 'summary');
      kids.forEach(n => wrap.appendChild(n));
      detailsEl.appendChild(wrap);
    }
    // Estado inicial + padding
    if (detailsEl.open) {
      wrap.style.height        = 'auto';
      wrap.style.opacity       = '1';
      wrap.style.paddingTop    = DETAILS_PAD + 'px';
      wrap.style.paddingBottom = DETAILS_PAD + 'px';
      wrap.classList.add('collapsible--open');
    } else {
      wrap.style.height        = '0px';
      wrap.style.opacity       = '0';
      wrap.style.paddingTop    = '0px';
      wrap.style.paddingBottom = '0px';
      wrap.classList.remove('collapsible--open');
    }
    wrap.dataset.animating = '0';
    return wrap;
  }

  // Robustas: reflow + transitionend + fallback
  function detailsOpen(detailsEl, content) {
    if (content.dataset.animating === '1') return;
    content.dataset.animating = '1';

    content.style.display = 'block';
    content.style.overflow = 'hidden';
    content.style.opacity = '0';
    content.style.paddingTop = '0px';
    content.style.paddingBottom = '0px';
    content.style.height = '0px';

    // forzar reflow
    void content.offsetHeight;

    const target = content.scrollHeight;

    // animar a destino
    content.style.transition = `height ${DETAILS_DUR_MS}ms ease, opacity ${DETAILS_DUR_MS}ms ease, padding ${DETAILS_DUR_MS}ms ease`;
    content.style.height = target + 'px';
    content.style.opacity = '1';
    content.style.paddingTop = DETAILS_PAD + 'px';
    content.style.paddingBottom = DETAILS_PAD + 'px';
    content.classList.add('collapsible--open');

    const finish = () => {
      content.style.transition = '';
      content.style.height = 'auto';
      content.style.overflow = '';
      content.dataset.animating = '0';
      content.removeEventListener('transitionend', onEnd);
      clearTimeout(content.__animFallback);
    };
    const onEnd = (e) => { if (e.propertyName === 'height') finish(); };
    content.addEventListener('transitionend', onEnd);
    content.__animFallback = setTimeout(finish, DETAILS_DUR_MS + 120);
  }

  function detailsClose(detailsEl, content) {
    if (content.dataset.animating === '1') return;
    content.dataset.animating = '1';

    // de auto → px para poder animar a 0
    const startHeight = content.scrollHeight;
    content.style.height = startHeight + 'px';
    content.style.overflow = 'hidden';
    content.style.transition = ''; // reset
    void content.offsetHeight;     // reflow

    // animar a 0
    content.style.transition = `height ${DETAILS_DUR_MS}ms ease, opacity ${DETAILS_DUR_MS}ms ease, padding ${DETAILS_DUR_MS}ms ease`;
    content.style.height = '0px';
    content.style.opacity = '0';
    content.style.paddingTop = '0px';
    content.style.paddingBottom = '0px';
    content.classList.remove('collapsible--open');

    const finish = () => {
      content.style.transition = '';
      content.style.display = 'none';
      content.dataset.animating = '0';
      content.removeEventListener('transitionend', onEnd);
      clearTimeout(content.__animFallback);
    };
    const onEnd = (e) => { if (e.propertyName === 'height') finish(); };
    content.addEventListener('transitionend', onEnd);
    content.__animFallback = setTimeout(finish, DETAILS_DUR_MS + 120);
  }

  function enhanceDetails(detailsEl) {
    const content = ensureDetailsContent(detailsEl);
  
    // Limpia listeners viejos (por si quedaron del código anterior)
    const summary = detailsEl.querySelector(':scope > summary');
    if (summary && summary.__hasEnhancer) {
      summary.removeEventListener('click', summary.__enhancer);
      summary.__hasEnhancer = false;
      summary.__enhancer = null;
    }
    if (detailsEl.__toggleHandler) {
      detailsEl.removeEventListener('toggle', detailsEl.__toggleHandler);
    }
  
    // Nuevo: animación según estado nativo de <details>
    detailsEl.__toggleHandler = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        const toOpen = detailsEl.open;
        content.style.height        = toOpen ? 'auto' : '0px';
        content.style.opacity       = toOpen ? '1'    : '0';
        content.style.paddingTop    = toOpen ? (DETAILS_PAD + 'px') : '0px';
        content.style.paddingBottom = toOpen ? (DETAILS_PAD + 'px') : '0px';
        content.classList.toggle('collapsible--open', toOpen);
        content.dataset.animating = '0';
      } else {
        detailsEl.open ? detailsOpen(detailsEl, content)
                       : detailsClose(detailsEl, content);
      }
    };
    detailsEl.addEventListener('toggle', detailsEl.__toggleHandler);
  }

  function initDetailsAccordions() {
    document.querySelectorAll('details.fold, details.exp').forEach(enhanceDetails);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema antes que todo para evitar "flash"
    initThemeToggle();

    initYear();
    document.querySelectorAll('.carousel').forEach(initCarousel);

    // Acordeones animados (About + Posters + Programs)
    initDetailsAccordions();

    // Abrir desde hash si corresponde
    expandTargetFromHash();
    window.addEventListener('hashchange', () => expandTargetFromHash(true));

    VO.mount();
    initDemoButtons();

    // NUEVO: lightbox de imágenes
    initImageLightbox();
  });
})();

/* ===== Collapsible helpers genéricos (por si usás .toggle-btn en el futuro) ===== */
function openCollapsible(panel) {
  panel.style.display = 'block';
  panel.classList.add('collapsible--open');

  const startHeight = 0;
  const targetHeight = panel.scrollHeight;

  panel.style.height = startHeight + 'px';
  panel.style.opacity = '0';
  requestAnimationFrame(() => {
    panel.style.height = targetHeight + 'px';
    panel.style.opacity = '1';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;
    const prevTransition = panel.style.transition;
    panel.style.transition = 'none';
    panel.style.height = targetHeight + 'px';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.style.height = 'auto';
        panel.style.transition = prevTransition || '';
        panel.removeEventListener('transitionend', onEnd);
      });
    });
  };
  panel.addEventListener('transitionend', onEnd, { once: true });
}

function closeCollapsible(panel) {
  const startHeight = panel.scrollHeight;
  panel.style.height = startHeight + 'px';
  panel.style.opacity = '1';

  panel.style.paddingTop = '0px';
  panel.style.paddingBottom = '0px';

  requestAnimationFrame(() => {
    panel.style.height = '0px';
    panel.style.opacity = '0';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;
    panel.classList.remove('collapsible--open');
    panel.style.display = 'none';
    panel.removeEventListener('transitionend', onEnd);
  };
  panel.addEventListener('transitionend', onEnd, { once: true });
}

document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.toggle-btn[aria-controls]');
  if (!btn) return;
  const id = btn.getAttribute('aria-controls');
  const panel = document.getElementById(id);
  if (!panel) return;

  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    panel.style.display = expanded ? 'none' : 'block';
    panel.classList.toggle('collapsible--open', !expanded);
    panel.style.height = expanded ? '0px' : 'auto';
    panel.style.opacity = expanded ? '0' : '1';
    return;
  }

  expanded ? closeCollapsible(panel) : openCollapsible(panel);

  if (!expanded) {
    setTimeout(() => panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 60);
  }
});
