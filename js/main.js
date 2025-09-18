// js/main.js
(() => {
  'use strict';

  /* ===== Año automático en el footer ===== */
  function initYear() {
    const span = document.getElementById('y');
    if (span) span.textContent = new Date().getFullYear();
  }

  /* ===== Carrusel reusable ===== */
  function initCarousel(root) {
    const track = root.querySelector('.track');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const dotsWrap = root.querySelector('.dots');
    if (!track || slides.length === 0 || !prev || !next || !dotsWrap) return;

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

    next.addEventListener('click', nextSlide);
    prev.addEventListener('click', prevSlide);

    // Teclado
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Swipe
    let startX = 0, dragging = false;
    const threshold = 40;
    root.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; dragging = true;
    }, { passive: true });
    root.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const delta = e.touches[0].clientX - startX;
      if (Math.abs(delta) > threshold) { delta < 0 ? nextSlide() : prevSlide(); dragging = false; }
    }, { passive: true });
    root.addEventListener('touchend', () => { dragging = false; });

    // Autoplay opcional
    let timer = null;
    const autoplayMs = Number(root.dataset.autoplay) || 0;
    function startAutoplay() { if (autoplayMs > 0 && !timer) timer = setInterval(nextSlide, autoplayMs); }
    function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }
    document.addEventListener('visibilitychange', () => { document.hidden ? stopAutoplay() : startAutoplay(); });
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    update(); startAutoplay();
  }

  // === Abre acordeón de secciones si la URL trae hash específico (sitio existente) ===
  function expandTargetFromHash() {
    const id = location.hash.slice(1);
    if (!id) return;
    if (!['posters', 'programs'].includes(id)) return;
    const det = document.querySelector(`#${id} details`);
    if (det) det.open = true;
  }

  /* ===== Overlay “phone card” para videos (YouTube privacy-enhanced) ===== */
  const VO = {
    root: null, playerWrap: null, title: null, duration: null, caption: null,

    mount() {
      this.root = document.getElementById('videoOverlay');
      this.playerWrap = this.root.querySelector('.vo-player');
      this.title = this.root.querySelector('.vo-title');
      this.duration = this.root.querySelector('.vo-duration');
      this.caption = this.root.querySelector('.vo-caption');

      // Cerrar: backdrop, botón X, ESC
      this.root.addEventListener('click', (e) => {
        if (e.target.matches('[data-vo-close]')) this.close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
      });
      // Evitar scroll de fondo
      this.root.addEventListener('wheel', (e) => { if (this.isOpen()) e.preventDefault(); }, { passive: false });
    },

    isOpen() { return this.root?.classList.contains('open'); },

    open({ id, title, duration, caption }) {
      if (!this.root) this.mount();
      this.title.textContent = title || '';
      this.duration.textContent = duration || '';
      this.caption.innerHTML = caption || '';

      // Inyectar iframe (9:16, sin autoplay, nocookie)
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
      // Remover iframe para pausar la reproducción
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
          title: btn.dataset.title || '',
          duration: btn.dataset.duration || '',
          caption: btn.dataset.caption || ''
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initYear();
    document.querySelectorAll('.carousel').forEach(initCarousel);

    expandTargetFromHash();
    window.addEventListener('hashchange', expandTargetFromHash);

    // Botones “Watch …” -> overlay
    initDemoButtons();
  });
})();

/* ===== Collapsible helpers (height animation to/from scrollHeight) ===== */
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

/* Hook universal para botones con aria-controls */
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.toggle-btn[aria-controls]');
  if (!btn) return;
  const id = btn.getAttribute('aria-controls');
  const panel = document.getElementById(id);
  if (!panel) return;

  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Sin animación: alterna directamente
    panel.hidden = expanded;
    panel.classList.toggle('collapsible--open', !expanded);
    panel.style.height = '';
    panel.style.opacity = '';
    return;
  }
  expanded ? closeCollapsible(panel) : openCollapsible(panel);

  // Si abrimos, procurar que el inicio del panel quede visible
  if (!expanded) {
    setTimeout(() => {
      panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 60);
  }
});


