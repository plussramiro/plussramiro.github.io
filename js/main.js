// js/main.js
(() => {
  'use strict';

  /* ===== Año automático en el footer ===== */
  function initYear() {
    const span = document.getElementById('y');
    if (span) span.textContent = new Date().getFullYear();
  }

  /* ===== Carrusel reusable =====
     Requiere estructura:
     <div class="carousel" data-autoplay="6000">
       <button class="nav prev">‹</button>   (ocultas por CSS si usás hotzones)
       <div class="track"> <figure class="slide">…</figure>… </div>
       <button class="nav next">›</button>
       <div class="dots"></div>
       <button class="hotzone hotzone--prev"></button>   (zonas clickeables amplias)
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

    // Crear puntitos
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
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }
    function nextSlide() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    // Botones flecha (si están visibles) y hotzones invisibles
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

    // Swipe (simple)
    let startX = 0, dragging = false;
    const threshold = 40;
    root.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; dragging = true;
    }, { passive: true });
    root.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const delta = e.touches[0].clientX - startX;
      if (Math.abs(delta) > threshold) {
        delta < 0 ? nextSlide() : prevSlide();
        dragging = false;
      }
    }, { passive: true });
    root.addEventListener('touchend', () => { dragging = false; });

    // Autoplay opcional
    let timer = null;
    const autoplayMs = Number(root.dataset.autoplay) || 0;
    function startAutoplay() {
      if (autoplayMs > 0 && !timer) timer = setInterval(nextSlide, autoplayMs);
    }
    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopAutoplay() : startAutoplay();
    });
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    update(); startAutoplay();
  }

  // === Abrir acordeón de secciones si URL trae hash (#posters o #programs)
  function expandTargetFromHash(openAnimated = false) {
    const id = location.hash.slice(1);
    if (!id) return;
    if (!['posters', 'programs'].includes(id)) return;
    const det = document.querySelector(`#${id} details`);
    if (!det) return;
    if (openAnimated) {
      // animado si ya está inicializado
      const content = det.querySelector('.details-content');
      if (content && !det.open) detailsOpen(det, content);
    } else {
      det.open = true;
    }
  }

  /* ===== Overlay “phone card” para videos (YouTube privacy-enhanced) ===== */
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

  /* ===== Animación suave para <details> (fold/exp) =====
     - Envuelve el contenido (excepto <summary>) en .details-content
     - Anima height + opacity al abrir/cerrar
  ===================================================== */
  function wrapDetailsContent(detailsEl) {
    // Si ya está envuelto, devolver
    if (detailsEl.querySelector(':scope > .details-content')) {
      return detailsEl.querySelector(':scope > .details-content');
    }
    const frag = document.createDocumentFragment();
    const kids = Array.from(detailsEl.children).filter(n => n.tagName.toLowerCase() !== 'summary');
    const wrap = document.createElement('div');
    wrap.className = 'details-content collapsible'; // reusa reglas de .collapsible (CSS)
    kids.forEach(n => frag.appendChild(n));
    wrap.appendChild(frag);
    detailsEl.appendChild(wrap);
    // Estado inicial según abierto o no
    if (detailsEl.open) {
      wrap.style.height = 'auto';
      wrap.style.opacity = '1';
      wrap.classList.add('collapsible--open');
      wrap.hidden = false;
    } else {
      wrap.style.height = '0px';
      wrap.style.opacity = '0';
      wrap.hidden = true;
    }
    return wrap;
  }

  function detailsOpen(detailsEl, content) {
    detailsEl.open = true;
    content.hidden = false;
    content.classList.add('collapsible--open');
    const start = content.offsetHeight;           // 0 si estaba oculto
    const target = content.scrollHeight;
    content.style.height  = start + 'px';
    content.style.opacity = '0';
    requestAnimationFrame(() => {
      content.style.height  = target + 'px';
      content.style.opacity = '1';
    });
    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      content.style.height = 'auto';
      content.removeEventListener('transitionend', onEnd);
    };
    content.addEventListener('transitionend', onEnd, { once: true });
  }

  function detailsClose(detailsEl, content) {
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
      content.hidden = true;
      detailsEl.open = false; // marcar cerrado tras animar
      content.removeEventListener('transitionend', onEnd);
    };
    content.addEventListener('transitionend', onEnd, { once: true });
  }

  function enhanceDetails(detailsEl) {
    const summary = detailsEl.querySelector(':scope > summary');
    if (!summary) return;
    const content = wrapDetailsContent(detailsEl);

    // Click en summary -> animar en vez de toggle instantáneo
    summary.addEventListener('click', (ev) => {
      ev.preventDefault(); // evitamos el toggle nativo inmediato
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        // comportamiento instantáneo para a11y
        detailsEl.open = !detailsEl.open;
        content.hidden = !detailsEl.open;
        if (detailsEl.open) {
          content.style.height = 'auto';
          content.style.opacity = '1';
          content.classList.add('collapsible--open');
        } else {
          content.style.height = '0px';
          content.style.opacity = '0';
          content.classList.remove('collapsible--open');
        }
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

/* ===== Collapsible helpers (height animation to/from scrollHeight) =====
   Estas funciones quedan disponibles si más adelante agregás paneles .collapsible
   controlados por botones .toggle-btn[aria-controls].
============================================================================ */
function openCollapsible(panel) {
  panel.hidden = false;                         // permite medir
  panel.classList.add('collapsible--open');
  const startHeight = panel.offsetHeight;       // 0 si estaba colapsado
  const targetHeight = panel.scrollHeight;      // altura real del contenido

  panel.style.height = startHeight + 'px';
  panel.style.opacity = '0';
  requestAnimationFrame(() => {
    panel.style.height = targetHeight + 'px';
    panel.style.opacity = '1';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;
    panel.style.height = 'auto';                // libera para responsive
    panel.removeEventListener('transitionend', onEnd);
  };
  panel.addEventListener('transitionend', onEnd, { once: true });
}

function closeCollapsible(panel) {
  const startHeight = panel.scrollHeight;
  panel.style.height = startHeight + 'px';      // fija altura actual
  panel.style.opacity = '1';
  requestAnimationFrame(() => {
    panel.style.height = '0px';
    panel.style.opacity = '0';
  });
  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;
    panel.classList.remove('collapsible--open');
    panel.hidden = true;                        // saca del flujo a11y
    panel.removeEventListener('transitionend', onEnd);
  };
  panel.addEventListener('transitionend', onEnd, { once: true });
}

/* Hook universal: .toggle-btn controla un #panel por aria-controls */
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.toggle-btn[aria-controls]');
  if (!btn) return;
  const id = btn.getAttribute('aria-controls');
  const panel = document.getElementById(id);
  if (!panel) return;

  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    panel.hidden = expanded;
    panel.classList.toggle('collapsible--open', !expanded);
    panel.style.height = '';
    panel.style.opacity = '';
    return;
  }

  expanded ? closeCollapsible(panel) : openCollapsible(panel);

  // Al abrir, asegurar visibilidad del inicio del panel
  if (!expanded) {
    setTimeout(() => {
      panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 60);
  }
});


