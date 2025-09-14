// js/main.js
(() => {
  'use strict';

  /* ===== Año automático en el footer ===== */
  function initYear() {
    const span = document.getElementById('y');
    if (span) span.textContent = new Date().getFullYear();
  }

  /* ===== Carrusel reusable =====
     Estructura esperada dentro de .carousel:
       .track (contiene .slide*)
       .nav.prev  .nav.next
       .dots (contenedor para los puntitos)
     Opcional: data-autoplay="ms" en .carousel para avance automático.
  */
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
      index = (i + slides.length) % slides.length; // wrap circular
      update();
    }
    function nextSlide() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    // Controles
    next.addEventListener('click', nextSlide);
    prev.addEventListener('click', prevSlide);

    // Teclado
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Swipe en pantallas táctiles
    let startX = 0, dragging = false;
    const threshold = 40;
    root.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
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

    // Autoplay opcional (data-autoplay="4000")
    let timer = null;
    const autoplayMs = Number(root.dataset.autoplay) || 0;
    function startAutoplay() {
      if (autoplayMs > 0 && !timer) {
        timer = setInterval(nextSlide, autoplayMs);
      }
    }
    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopAutoplay() : startAutoplay();
    });
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    // Inicio
    update();
    startAutoplay();
  }

  // === Abre el acordeón si la URL trae #posters o #programs ===
  function expandTargetFromHash() {
    const id = location.hash.slice(1);
    if (!id) return;
    if (!['posters', 'programs'].includes(id)) return;
    const det = document.querySelector(`#${id} details`);
    if (det) det.open = true;
  }

  /* ===== Lazy YouTube dentro de <details class="demo"> ===== */
  function buildYT(id, title) {
    const wrap = document.createElement('div');
    wrap.className = 'yt-wrap';
    wrap.innerHTML =
      `<iframe
         src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1"
         title="${title || 'Demo video'}"
         loading="lazy"
         allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         allowfullscreen></iframe>`;
    return wrap;
  }

  function loadDemo(det) {
    const ph = det.querySelector('.yt-lazy');
    if (!ph || ph.dataset.loaded === '1') return;
    const id = ph.dataset.id;
    const title = ph.dataset.title || '';
    if (!id) return;
    ph.replaceWith(buildYT(id, title));
    det.dataset.loaded = '1';
  }

  function initLazyDemos() {
    document.querySelectorAll('details.demo').forEach(det => {
      det.addEventListener('toggle', () => { if (det.open) loadDemo(det); });
      // Si ya estaba abierto cuando cargó el JS, cargar igual
      if (det.open) loadDemo(det);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initYear();
    document.querySelectorAll('.carousel').forEach(initCarousel);

    expandTargetFromHash();
    window.addEventListener('hashchange', expandTargetFromHash);

    // Demos de video (click-to-embed)
    initLazyDemos();
  });
})();


