// js/main.js
(() => {
  'use strict';

  /* ===== Año automático en el footer ===== */
  function initYear() {
    const span = document.getElementById('y');
    if (span) span.textContent = new Date().getFullYear();
  }

  /* ===== Carrusel reusable =====
     Estructura:
     <div class="carousel" data-autoplay="6000">
       <button class="nav prev">‹</button>   (pueden estar ocultas por CSS)
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
      if (!det.open) detailsOpen(det, content);
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

  /* ===== <details> con transición suave (sin display:none) =====
     - Envolvemos todo menos <summary> en .details-content
     - Animamos height + opacity (el padding lo cambiamos sin animar)
     - Durante el cierre mantenemos details.open=true y lo cambiamos a false al final
  ================================================================= */

  // Padding acolchonado para la animación
  const DETAILS_PAD = 12; // px

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

// --- Apertura SUAVE y repetible ---
function detailsOpen(detailsEl, content) {
  if (content.dataset.animating === '1') return;
  content.dataset.animating = '1';

  detailsEl.open = true;
  content.classList.add('collapsible--open');

  // Limpieza por si quedó algo de un ciclo previo
  content.style.transition = '';            // usar la del CSS
  content.style.willChange = 'height, opacity';

  // Estado inicial
  content.style.height        = '0px';
  content.style.opacity       = '0';
  content.style.paddingTop    = '0px';
  content.style.paddingBottom = '0px';

  // Reflow para fijar el estado inicial
  content.getBoundingClientRect();

  // Fijamos padding destino ANTES de medir target
  content.style.paddingTop    = DETAILS_PAD + 'px';
  content.style.paddingBottom = DETAILS_PAD + 'px';
  const target = content.scrollHeight;

  // 1er frame: aseguramos que el estado inicial quedó aplicado
  requestAnimationFrame(() => {
    // 2º frame: disparamos la transición hacia el destino
    requestAnimationFrame(() => {
      content.style.height  = target + 'px';
      content.style.opacity = '1';
    });
  });

  let ended = false;
  const finish = () => {
    if (ended) return; ended = true;
    // Pasar a 'auto' sin salto
    const prev = content.style.transition;
    content.style.transition = 'none';
    content.style.height = target + 'px';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.style.height = 'auto';
        content.style.transition = '';      // limpiar inline
        content.style.willChange = '';      // limpiar hint
        content.dataset.animating = '0';
      });
    });
  };

  const onEnd = () => { finish(); cleanup(); };
  const cleanup = () => content.removeEventListener('transitionend', onEnd);

  content.addEventListener('transitionend', onEnd);
  // Fallback por si no llega el evento (Safari, blur de pestaña, etc.)
  setTimeout(onEnd, 800);
}

// --- Cierre SUAVE + limpia cualquier transition inline al final ---
function detailsClose(detailsEl, content) {
  if (content.dataset.animating === '1') return;
  content.dataset.animating = '1';

  // Si está en 'auto', fijamos altura actual primero
  const start = content.scrollHeight;
  content.style.height  = start + 'px';
  content.style.opacity = '1';

  // Quitar padding sin animación (altura objetivo = 0 exacto)
  content.style.paddingTop    = '0px';
  content.style.paddingBottom = '0px';

  // Reflow
  content.getBoundingClientRect();

  // Si por CSS no hubiera transición, inyectamos una temporal
  const td = getComputedStyle(content).transitionDuration
               .split(',')
               .some(v => parseFloat(v) > 0);
  if (!td) {
    content.style.transition = 'height 280ms cubic-bezier(.22,.61,.36,1), opacity 220ms ease';
  }
  content.style.willChange = 'height, opacity';

  requestAnimationFrame(() => {
    content.style.height  = '0px';
    content.style.opacity = '0';
  });

  let ended = false;
  const finish = () => {
    if (ended) return; ended = true;
    content.classList.remove('collapsible--open');
    detailsEl.open = false;
    content.dataset.animating = '0';
    // Limpieza total para que la PRÓXIMA apertura sea igual de suave
    content.style.willChange = '';
    content.style.transition = '';   // <- clave: no dejar inline pegado
    content.style.height = '0px';
  };

  const onEnd = () => { finish(); cleanup(); };
  const cleanup = () => content.removeEventListener('transitionend', onEnd);

  content.addEventListener('transitionend', onEnd);
  setTimeout(onEnd, 900);
}


  function enhanceDetails(detailsEl) {
    const summary = detailsEl.querySelector(':scope > summary');
    if (!summary) return;
    const content = ensureDetailsContent(detailsEl);

    // Evitar múltiples listeners si volvemos a inicializar
    summary.__hasEnhancer && summary.removeEventListener('click', summary.__enhancer);
    summary.__enhancer = (ev) => {
      ev.preventDefault(); // evita el toggle nativo
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        // sin animación
        const toOpen = !detailsEl.open;
        detailsEl.open = toOpen;
        content.style.height        = toOpen ? 'auto' : '0px';
        content.style.opacity       = toOpen ? '1'    : '0';
        content.style.paddingTop    = toOpen ? (DETAILS_PAD + 'px') : '0px';
        content.style.paddingBottom = toOpen ? (DETAILS_PAD + 'px') : '0px';
        content.classList.toggle('collapsible--open', toOpen);
        content.dataset.animating = '0';
        return;
        }
      detailsEl.open ? detailsClose(detailsEl, content) : detailsOpen(detailsEl, content);
    };
    summary.addEventListener('click', summary.__enhancer);
    summary.__hasEnhancer = true;
  }

  function initDetailsAccordions() {
    document.querySelectorAll('details.fold, details.exp').forEach(enhanceDetails);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initYear();

    // Carruseles (Figures + Robotics)
    document.querySelectorAll('.carousel').forEach(initCarousel);

    // Acordeones animados para About (fold) y Posters/Programs (exp)
    initDetailsAccordions();

    // Abrir desde hash si corresponde
    expandTargetFromHash();
    window.addEventListener('hashchange', () => expandTargetFromHash(true));

    // Botones “Watch …” -> overlay
    VO.mount();
    initDemoButtons();
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

  // quitar padding si correspondiera (si tu panel lo usa)
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

// Hook universal: .toggle-btn controla un #panel por aria-controls
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


