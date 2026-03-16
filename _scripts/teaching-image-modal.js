---
permalink: /assets/js/teaching-image-modal.js
---
(function () {
  const MODAL_CLASS = "research-image-modal";
  const OPEN_CLASS = "is-open";
  const BODY_OPEN_CLASS = "research-image-modal-open";
  const TARGET_SELECTOR = ".teaching-zoomable";
  const FALLBACK_TITLE = "Teaching figure";
  const NAV_BUTTON_BASE_STYLE =
    "position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:2.2rem;height:2.2rem;border:1px solid var(--global-divider-color);border-radius:999px;background:rgba(0,0,0,.45);color:#fff;font-size:1.3rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;";

  const state = {
    overlay: null,
    items: [],
    index: 0
  };

  const getImageSrc = (image) => image?.currentSrc || image?.src || image?.getAttribute("src") || "";

  const normalizeIndex = (index, total) => {
    if (!total) return 0;
    return ((index % total) + total) % total;
  };

  const createModal = () => {
    const existing = document.querySelector(`.${MODAL_CLASS}`);
    if (existing) {
      state.overlay = existing;
      return existing;
    }

    const overlay = document.createElement("div");
    overlay.className = MODAL_CLASS;
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
      <div class="research-image-modal__dialog" role="dialog" aria-modal="true" aria-label="Teaching figure">
        <button type="button" class="research-image-modal__close" aria-label="Close image">&times;</button>
        <button
          type="button"
          class="research-image-modal__nav research-image-modal__nav--prev"
          aria-label="Previous image"
          style="${NAV_BUTTON_BASE_STYLE}left:.55rem;"
        >&#10094;</button>
        <button
          type="button"
          class="research-image-modal__nav research-image-modal__nav--next"
          aria-label="Next image"
          style="${NAV_BUTTON_BASE_STYLE}right:.55rem;"
        >&#10095;</button>
        <div class="research-image-modal__image-wrap">
          <img class="research-image-modal__image" alt="" />
        </div>
        <div class="research-image-modal__title"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector(".research-image-modal__close");
    const prevButton = overlay.querySelector(".research-image-modal__nav--prev");
    const nextButton = overlay.querySelector(".research-image-modal__nav--next");
    closeButton.addEventListener("click", () => closeModal());
    prevButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showPrevious();
    });
    nextButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showNext();
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (!state.overlay?.classList.contains(OPEN_CLASS)) return;
      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    });

    state.overlay = overlay;
    return overlay;
  };

  const closeModal = () => {
    const overlay = state.overlay || document.querySelector(`.${MODAL_CLASS}`);
    if (!overlay) return;

    const modalImage = overlay.querySelector(".research-image-modal__image");
    const modalTitle = overlay.querySelector(".research-image-modal__title");
    modalImage.src = "";
    modalImage.alt = "";
    modalTitle.textContent = "";
    overlay.classList.remove(OPEN_CLASS);
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove(BODY_OPEN_CLASS);
    state.items = [];
    state.index = 0;
  };

  const renderCurrentItem = () => {
    const overlay = createModal();
    if (!state.items.length) return;

    state.index = normalizeIndex(state.index, state.items.length);
    const current = state.items[state.index];
    const imageSrc = getImageSrc(current.image);
    if (!imageSrc) return;

    const modalImage = overlay.querySelector(".research-image-modal__image");
    const modalTitle = overlay.querySelector(".research-image-modal__title");
    const prevButton = overlay.querySelector(".research-image-modal__nav--prev");
    const nextButton = overlay.querySelector(".research-image-modal__nav--next");
    const title = current.title || current.image.alt || FALLBACK_TITLE;

    modalImage.src = imageSrc;
    modalImage.alt = current.image.alt || title;
    modalTitle.textContent = title;

    const hasMultiple = state.items.length > 1;
    prevButton.style.display = hasMultiple ? "inline-flex" : "none";
    nextButton.style.display = hasMultiple ? "inline-flex" : "none";
  };

  const openModal = (items, startIndex = 0) => {
    const validItems = items.filter((item) => item?.image && getImageSrc(item.image));
    if (!validItems.length) return;

    const overlay = createModal();
    state.items = validItems;
    state.index = normalizeIndex(startIndex, validItems.length);
    renderCurrentItem();
    overlay.classList.add(OPEN_CLASS);
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add(BODY_OPEN_CLASS);
  };

  const showNext = () => {
    if (state.items.length < 2) return;
    state.index = normalizeIndex(state.index + 1, state.items.length);
    renderCurrentItem();
  };

  const showPrevious = () => {
    if (state.items.length < 2) return;
    state.index = normalizeIndex(state.index - 1, state.items.length);
    renderCurrentItem();
  };

  document.addEventListener("DOMContentLoaded", () => {
    const targets = document.querySelectorAll(TARGET_SELECTOR);
    if (!targets.length) return;

    const targetsArray = Array.from(targets);
    const buildGalleryItems = (target) => {
      const group = (target.dataset.zoomGroup || "").trim();
      const galleryTargets = group
        ? targetsArray.filter((image) => (image.dataset.zoomGroup || "").trim() === group)
        : [target];

      return galleryTargets.map((image) => ({
        image,
        title: image.dataset.zoomTitle || image.alt || FALLBACK_TITLE
      }));
    };

    targets.forEach((target) => {
      target.addEventListener("click", (event) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const items = buildGalleryItems(target);
        const index = items.findIndex((item) => item.image === target);
        openModal(items, index >= 0 ? index : 0);
      });
    });
  });
})();
