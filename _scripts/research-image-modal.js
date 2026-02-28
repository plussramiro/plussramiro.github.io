---
permalink: /assets/js/research-image-modal.js
---
(function () {
  const MODAL_CLASS = "research-image-modal";
  const OPEN_CLASS = "is-open";
  const BODY_OPEN_CLASS = "research-image-modal-open";
  const RESEARCH_CARD_SELECTOR =
    'a[data-project-category="research"], a[data-project-category="research-reference-figures"]';
  const FALLBACK_TITLE = "Research figure";

  const createModal = () => {
    const existing = document.querySelector(`.${MODAL_CLASS}`);
    if (existing) return existing;

    const overlay = document.createElement("div");
    overlay.className = MODAL_CLASS;
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
      <div class="research-image-modal__dialog" role="dialog" aria-modal="true" aria-label="Research figure">
        <button type="button" class="research-image-modal__close" aria-label="Close image">&times;</button>
        <div class="research-image-modal__image-wrap">
          <img class="research-image-modal__image" alt="" />
        </div>
        <div class="research-image-modal__title"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector(".research-image-modal__close");
    closeButton.addEventListener("click", () => closeModal(overlay));

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeModal(overlay);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains(OPEN_CLASS)) {
        closeModal(overlay);
      }
    });

    return overlay;
  };

  const closeModal = (overlay) => {
    const modalImage = overlay.querySelector(".research-image-modal__image");
    modalImage.src = "";
    modalImage.alt = "";
    overlay.classList.remove(OPEN_CLASS);
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove(BODY_OPEN_CLASS);
  };

  const openModal = (image, link) => {
    const imageSrc = image.currentSrc || image.src || image.getAttribute("src");
    if (!imageSrc) return;

    const overlay = createModal();
    const modalImage = overlay.querySelector(".research-image-modal__image");
    const modalTitle = overlay.querySelector(".research-image-modal__title");
    const title = link?.dataset.projectTitle || image.alt || FALLBACK_TITLE;

    modalImage.src = imageSrc;
    modalImage.alt = image.alt || title;
    modalTitle.textContent = title;

    overlay.classList.add(OPEN_CLASS);
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add(BODY_OPEN_CLASS);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const projectsSection = document.querySelector(".projects");
    if (!projectsSection) return;

    projectsSection.addEventListener(
      "click",
      (event) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const image = event.target.closest(`${RESEARCH_CARD_SELECTOR} img`);
        if (!image || !projectsSection.contains(image)) return;

        const link = image.closest(RESEARCH_CARD_SELECTOR);
        if (!link) return;

        event.preventDefault();
        event.stopPropagation();
        openModal(image, link);
      },
      true
    );
  });
})();
