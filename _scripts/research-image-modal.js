---
permalink: /assets/js/research-image-modal.js
---
(function () {
  const MODAL_CLASS = "research-image-modal";
  const OPEN_CLASS = "is-open";
  const BODY_OPEN_CLASS = "research-image-modal-open";
  const INLINE_TRIGGER_SELECTOR = "[data-image-zoomable]";
  const ROBOTICS_IMAGE_SELECTOR = ".robotics-group-card .carousel-item .card-img-top";
  const RESEARCH_CARD_SELECTOR =
    'a[data-project-category="research"], a[data-project-category="research-reference-figures"]';
  const FALLBACK_TITLE = "Research figure";
  const ROBOTICS_VIDEO_LINK_SELECTOR = ".robotics-video-link";
  const IMAGE_VISIBLE_CLASS = "is-visible";
  const NAV_BUTTON_BASE_STYLE =
    "position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:2.2rem;height:2.2rem;border:1px solid var(--global-divider-color);border-radius:999px;background:rgba(0,0,0,.45);color:#fff;font-size:1.3rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;";

  const state = {
    overlay: null,
    items: [],
    index: 0
  };

  const getImageSrc = (image, zoomSrc = "") =>
    zoomSrc || image?.dataset?.zoomSrc || image?.currentSrc || image?.src || image?.getAttribute("src") || "";

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
      <div class="research-image-modal__dialog" role="dialog" aria-modal="true" aria-label="Research figure">
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
        <div class="research-image-modal__footer">
          <div class="research-image-modal__title"></div>
          <div class="research-image-modal__actions" hidden>
            <a
              class="btn btn-primary research-image-modal__video-link teaching-video-link"
              href="#"
              rel="noopener noreferrer"
            >
              See video demo
            </a>
          </div>
        </div>
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
    const actions = overlay.querySelector(".research-image-modal__actions");
    const videoLink = overlay.querySelector(".research-image-modal__video-link");
    const dialog = overlay.querySelector(".research-image-modal__dialog");
    modalImage.src = "";
    modalImage.alt = "";
    modalImage.classList.remove(IMAGE_VISIBLE_CLASS);
    modalTitle.textContent = "";
    if (dialog) dialog.classList.remove("has-video-action");
    if (actions) actions.hidden = true;
    if (videoLink) {
      videoLink.href = "#";
      delete videoLink.dataset.videoTitle;
      delete videoLink.dataset.videoCaption;
      delete videoLink.dataset.videoSourceLabel;
      delete videoLink.dataset.videoSourceUrl;
    }
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
    const imageSrc = getImageSrc(current.image, current.zoomSrc || "");
    if (!imageSrc) return;

    const modalImage = overlay.querySelector(".research-image-modal__image");
    const modalTitle = overlay.querySelector(".research-image-modal__title");
    const prevButton = overlay.querySelector(".research-image-modal__nav--prev");
    const nextButton = overlay.querySelector(".research-image-modal__nav--next");
    const actions = overlay.querySelector(".research-image-modal__actions");
    const videoLink = overlay.querySelector(".research-image-modal__video-link");
    const dialog = overlay.querySelector(".research-image-modal__dialog");
    const title = current.title || current.image.alt || FALLBACK_TITLE;
    const videoUrl = current.videoUrl || "";

    modalImage.classList.remove(IMAGE_VISIBLE_CLASS);
    modalImage.src = imageSrc;
    modalImage.alt = current.image.alt || title;
    modalTitle.textContent = title;
    const revealImage = () => {
      window.requestAnimationFrame(() => {
        modalImage.classList.add(IMAGE_VISIBLE_CLASS);
      });
    };
    if (modalImage.complete && modalImage.naturalWidth > 0) {
      revealImage();
    } else {
      modalImage.addEventListener("load", revealImage, { once: true });
    }
    if (dialog) dialog.classList.toggle("has-video-action", Boolean(videoUrl));

    const hasMultiple = state.items.length > 1;
    prevButton.style.display = hasMultiple ? "inline-flex" : "none";
    nextButton.style.display = hasMultiple ? "inline-flex" : "none";

    if (actions && videoLink) {
      if (videoUrl) {
        actions.hidden = false;
        videoLink.href = videoUrl;
        videoLink.dataset.videoTitle = current.videoTitle || title;
        videoLink.dataset.videoCaption = current.videoCaption || "";
        videoLink.dataset.videoSourceLabel = current.videoSourceLabel || "";
        videoLink.dataset.videoSourceUrl = current.videoSourceUrl || "";
      } else {
        actions.hidden = true;
        videoLink.href = "#";
        delete videoLink.dataset.videoTitle;
        delete videoLink.dataset.videoCaption;
        delete videoLink.dataset.videoSourceLabel;
        delete videoLink.dataset.videoSourceUrl;
      }
    }
  };

  const openModal = (items, startIndex = 0) => {
    const validItems = items.filter((item) => item?.image && getImageSrc(item.image, item.zoomSrc || ""));
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

  const getInlineItems = () => {
    return Array.from(document.querySelectorAll(INLINE_TRIGGER_SELECTOR)).flatMap((trigger) => {
      const image = trigger.matches("img") ? trigger : trigger.querySelector("img");
      if (!image) return [];
      const title = trigger.dataset.imageTitle || image.dataset.zoomTitle || image.alt || FALLBACK_TITLE;
      return [{ image, title }];
    });
  };

  const getRoboticsItems = () => {
    return Array.from(document.querySelectorAll(ROBOTICS_IMAGE_SELECTOR)).map((image) => {
      const slide = image.closest(".carousel-item");
      const slideTitle = slide?.querySelector(".robotics-slide-title")?.textContent?.trim();
      const videoLink = slide?.querySelector(ROBOTICS_VIDEO_LINK_SELECTOR);
      let zoomSrc = videoLink?.dataset.zoomImage || "";
      if (slideTitle === "Hexapod Gaits | Tripod, Ripple & Wave") {
        zoomSrc = "/assets/img/robotics/hexapod1_zoom.jpg?v=3";
      }
      return {
        image,
        title: slideTitle || image.alt || FALLBACK_TITLE,
        videoUrl: videoLink?.getAttribute("href") || "",
        videoTitle: videoLink?.dataset.videoTitle || "",
        videoCaption: videoLink?.dataset.videoCaption || "",
        videoSourceLabel: videoLink?.dataset.videoSourceLabel || "",
        videoSourceUrl: videoLink?.dataset.videoSourceUrl || "",
        zoomSrc
      };
    });
  };

  const getResearchCardItems = (root) => {
    return Array.from(root.querySelectorAll(`${RESEARCH_CARD_SELECTOR} img`)).flatMap((image) => {
      const link = image.closest(RESEARCH_CARD_SELECTOR);
      if (!link) return [];
      const title = link.dataset.imageTitle || link.dataset.projectTitle || image.alt || FALLBACK_TITLE;
      return [{ image, title }];
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener(
      "click",
      (event) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.target.closest(`.${MODAL_CLASS}`)) return;

        const inlineTrigger = event.target.closest(INLINE_TRIGGER_SELECTOR);
        if (inlineTrigger) {
          const image = inlineTrigger.matches("img") ? inlineTrigger : inlineTrigger.querySelector("img");
          if (!image) return;

          const items = getInlineItems();
          const index = items.findIndex((item) => item.image === image);
          event.preventDefault();
          event.stopPropagation();
          openModal(items, index >= 0 ? index : 0);
          return;
        }

        const roboticsImage = event.target.closest(ROBOTICS_IMAGE_SELECTOR);
        if (roboticsImage) {
          const items = getRoboticsItems();
          const index = items.findIndex((item) => item.image === roboticsImage);
          event.preventDefault();
          event.stopPropagation();
          openModal(items, index >= 0 ? index : 0);
          return;
        }

        const projectsSection = document.querySelector(".projects");
        if (!projectsSection) return;

        const image = event.target.closest(`${RESEARCH_CARD_SELECTOR} img`);
        if (!image || !projectsSection.contains(image)) return;

        const link = image.closest(RESEARCH_CARD_SELECTOR);
        if (!link) return;

        const items = getResearchCardItems(projectsSection);
        const index = items.findIndex((item) => item.image === image);
        event.preventDefault();
        event.stopPropagation();
        openModal(items, index >= 0 ? index : 0);
      },
      true
    );
  });
})();
