(function () {
  const YOUTUBE_HOST_RE = /(youtube\.com|youtu\.be)/i;
  const OVERLAY_CLASS = "video-modal";
  const OPEN_CLASS = "is-open";
  const DEFAULT_MODAL_TITLE = "Project Video";
  const VIDEO_TRIGGER_SELECTOR = ".projects a[href], a.teaching-video-link[href]";

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const escapeUrl = (value) => {
    try {
      const parsed = new URL(value, window.location.origin);
      return parsed.href;
    } catch (error) {
      return "";
    }
  };

  const getYoutubeVideoId = (rawUrl) => {
    try {
      const url = new URL(rawUrl, window.location.origin);
      const host = url.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        return url.pathname.replace(/^\/+/, "").split("/")[0] || null;
      }

      if (!host.endsWith("youtube.com")) return null;

      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const embedIndex = segments.findIndex((segment) => segment === "embed" || segment === "shorts");
      if (embedIndex >= 0 && segments[embedIndex + 1]) {
        return segments[embedIndex + 1];
      }
    } catch (error) {
      return null;
    }

    return null;
  };

  const createModal = () => {
    const existing = document.querySelector(`.${OVERLAY_CLASS}`);
    if (existing) return existing;

    const overlay = document.createElement("div");
    overlay.className = OVERLAY_CLASS;
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
      <div class="video-modal__dialog" role="dialog" aria-modal="true" aria-label="Video preview">
        <div class="video-modal__header">
          <span class="video-modal__title">${DEFAULT_MODAL_TITLE}</span>
          <button type="button" class="video-modal__close" aria-label="Close video">&times;</button>
        </div>
        <div class="video-modal__frame-wrap">
          <iframe class="video-modal__frame" title="Project video" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div class="video-modal__footer">
          <div class="video-modal__meta"></div>
          <a class="video-modal__open-link" target="_blank" rel="noopener noreferrer">Open in YouTube</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector(".video-modal__close");
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

  const buildMetaHtml = (caption, sourceLabel, sourceUrl) => {
    const parts = [];
    const safeCaption = escapeHtml(caption);
    const safeLabel = escapeHtml(sourceLabel);
    const safeUrl = escapeUrl(sourceUrl);

    if (safeCaption) {
      parts.push(`<span>${safeCaption}</span>`);
    }

    if (safeLabel && safeUrl) {
      parts.push(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`);
    } else if (safeLabel) {
      parts.push(`<span>${safeLabel}</span>`);
    }

    return parts.join(" - ");
  };

  const openModal = (videoUrl, triggerElement) => {
    const videoId = getYoutubeVideoId(videoUrl);
    if (!videoId) {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const overlay = createModal();
    const iframe = overlay.querySelector(".video-modal__frame");
    const title = overlay.querySelector(".video-modal__title");
    const meta = overlay.querySelector(".video-modal__meta");
    const openLink = overlay.querySelector(".video-modal__open-link");

    const videoTitle = triggerElement?.dataset.videoTitle || DEFAULT_MODAL_TITLE;
    const videoCaption = triggerElement?.dataset.videoCaption || "";
    const sourceLabel = triggerElement?.dataset.videoSourceLabel || "";
    const sourceUrl = triggerElement?.dataset.videoSourceUrl || "";

    title.textContent = videoTitle;
    meta.innerHTML = buildMetaHtml(videoCaption, sourceLabel, sourceUrl);

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    openLink.href = videoUrl;

    overlay.classList.add(OPEN_CLASS);
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("video-modal-open");
  };

  const closeModal = (overlay) => {
    const iframe = overlay.querySelector(".video-modal__frame");
    iframe.src = "";
    overlay.classList.remove(OPEN_CLASS);
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("video-modal-open");
  };

  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(VIDEO_TRIGGER_SELECTOR);
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !YOUTUBE_HOST_RE.test(href)) return;

      link.addEventListener("click", (event) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openModal(href, link);
      });
    });
  });
})();
