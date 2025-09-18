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
      // Estado visual consistente
      content.style.display = 'block';
      content.style.height  = 'auto';
      content.style.opacity = '1';
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
      // (opcional) limpiar la variable si querés
      // document.documentElement.style.removeProperty('--yt-controls-h');
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

  /* ===== <details> con transición suave =====
     - Se envuelve el contenido (todo menos <summary>) en .details-content
     - Se anima height + opacity al abrir/cerrar
  ===================================================== */
  function ensureDetailsContent(detailsEl) {
    const existing = detailsEl.querySelector(':scope > .details-content');
    if (existing) return existing;

    const wrap = document.createElement('div');
    wrap.className = 'details-content collapsible';
    wrap.style.overflow = 'hidden';
    // Mover todo lo que no sea summary dentro del wrap
    const kids = Array.from(detailsEl.children).filter(n => n.tagName.toLowerCase() !== 'summary');
    kids.forEach(n => wrap.appendChild(n));
    detailsEl.appendChild(wrap);

    // Estado inicial
    if (detailsEl.open) {
      wrap.style.display = 'block';
      wrap.style.height  = 'auto';
      wrap.style.opacity = '1';
      wrap.classList.add('collapsible--open');
      wrap.dataset.animating = '0';
    } else {
      wrap.style.display = 'none';
      wrap.style.height  = '0px';
      wrap.style.opacity = '0';
      wrap.dataset.animating = '0';
    }
    return wrap;
  }

  function detailsOpen(detailsEl, content) {
    if (content.dataset.animating === '1') return;
    content.dataset.animating = '1';

    detailsEl.open = true;
    content.style.display = 'block';          // aseguro medible
    const start = 0;
    const target = content.scrollHeight;

    // Reset inicial
    content.classList.add('collapsible--open');
    content.style.height  = start + 'px';
    content.style.opacity = '0';

    requestAnimationFrame(() => {
      content.style.height  = target + 'px';
      content.style.opacity = '1';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      content.style.height = 'auto';          // libera para responsive
      content.dataset.animating = '0';
      content.removeEventListener('transitionend', onEnd);
    };
    content.addEventListener('transitionend', onEnd, { once: true });
  }

  function detailsClose(detailsEl, content) {
    if (content.dataset.animating === '1') return;
    content.dataset.animating = '1';

    const start = content.scrollHeight;
    content.style.height  = start + 'px';
    content.style.opacity = '1';

    requestAnimationFrame(() => {
      content.style.height  = '0px';
      content.style.opacity = '0';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      content.classList.remove('collapsible--open');
      content.style.display = 'none';
      detailsEl.open = false;
      content.dataset.animating = '0';
      content.removeEventListener('transitionend', onEnd);
    };
    content.addEventListener('transitionend', onEnd, { once: true });
  }

  function enhanceDetails(detailsEl) {
    const summary = detailsEl.querySelector(':scope > summary');
    if (!summary) return;
    const content = ensureDetailsContent(detailsEl);

    // Click en summary -> animación controlada
    summary.addEventListener('click', (ev) => {
      ev.preventDefault(); // evitamos el toggle nativo
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        // modo sin animación
        detailsEl.open = !detailsEl.open;
        content.style.display = detailsEl.open ? 'block' : 'none';
        content.style.height  = detailsEl.open ? 'auto' : '0px';
        content.style.opacity = detailsEl.open ? '1' : '0';
        content.classList.toggle('collapsible--open', detailsEl.open);
        content.dataset.animating = '0';
        return;
      }
      detailsEl.open ? detailsClose(detailsEl, content) : detailsOpen(detailsEl, content);
    });
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
    panel.style.height = 'auto';
    panel.removeEventListener('transitionend', onEnd);
  };
  panel.addEventListener('transitionend', onEnd, { once: true });
}

function closeCollapsible(panel) {
  const startHeight = panel.scrollHeight;
  panel.style.height = startHeight + 'px';
  panel.style.opacity = '1';
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



