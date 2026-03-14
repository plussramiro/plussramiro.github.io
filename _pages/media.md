---
layout: page
permalink: /media/
title: Media
description: Interviews, institutional features, and outreach videos.
nav: true
nav_order: 6.8
_styles: |
  .post .post-header .post-description {
    margin-bottom: 1rem;
  }

  .media-toolbar {
    margin-bottom: 0.9rem;
  }

  .media-publications {
    margin-top: 0.75rem;
  }

  .media-publications h2.bibliography {
    margin-top: 1.5rem;
  }

  .media-publications .media-year-group:first-of-type h2.bibliography {
    margin-top: 0.25rem;
  }

  .media-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .media-card {
    display: grid;
    grid-template-columns: minmax(290px, 430px) 1fr;
    align-items: center;
    background: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 0.55rem;
    overflow: hidden;
  }

  .media-card--vertical {
    grid-template-columns: minmax(290px, 430px) 1fr;
  }

  .media-card__embed {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    padding: 0;
    min-height: 100%;
  }

  .media-card__embed .ratio {
    width: 100%;
    max-width: none;
    border-radius: 0;
    overflow: hidden;
  }

  .media-card--horizontal .media-card__embed .ratio {
    aspect-ratio: 16 / 9;
  }

  .media-card--vertical .media-card__embed {
    padding: 0;
    align-items: stretch;
  }

  .media-instagram-frame {
    width: 100%;
    height: 36rem;
    overflow: hidden;
  }

  .media-card--vertical .media-card__embed .media-instagram-frame {
    max-width: none;
    margin: 0;
    border-radius: 0;
  }

  .media-card__embed iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

  .media-card__body {
    padding: 0.95rem 1.05rem 1.05rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .media-card__meta {
    margin: 0 0 0.35rem;
    color: var(--global-text-color-light);
    font-size: 0.83rem;
    font-weight: 650;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .media-card__title {
    margin: 0 0 0.45rem;
    line-height: 1.25;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--global-text-color);
  }

  .media-card__desc {
    margin: 0;
    line-height: 1.45;
    color: var(--global-text-color);
  }

  .media-card__link {
    display: inline-block;
    margin-top: 0.72rem;
    font-weight: 650;
  }

  @media (max-width: 991.98px) {
    .media-card,
    .media-card--vertical {
      grid-template-columns: 1fr;
    }

    .media-card__embed .ratio {
      max-width: 100%;
    }

    .media-card--vertical .media-card__embed .ratio {
      max-width: 420px;
    }

    .media-instagram-frame {
      height: 32rem;
    }
  }
---

<div class="media-toolbar bibsearch-input-wrap">
  <i class="fa-solid fa-magnifying-glass bibsearch-icon" aria-hidden="true"></i>
  <input
    type="text"
    id="media-search"
    class="search bibsearch-form-input"
    spellcheck="false"
    autocomplete="off"
    placeholder="Search media..."
  >
</div>

<div class="publications media-publications">
  <section class="media-year-group" data-media-year="2026">
    <h2 class="bibliography">2026</h2>
    <div class="media-list">
      <article
        class="media-card media-card--vertical"
        data-media-search="2026 instagram itba minilabs outreach high school students laboratories vocation"
      >
        <div class="media-card__embed">
          <div class="media-instagram-frame">
            <iframe
              src="https://www.instagram.com/p/DVjnXkxD_Sd/embed"
              title="MiniLabs ITBA"
              loading="lazy"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div class="media-card__body">
          <p class="media-card__meta">Instagram | ITBA</p>
          <h3 class="media-card__title">MiniLabs ITBA</h3>
          <p class="media-card__desc">
            Outreach activity for high-school students to explore labs, classes, and vocational paths.
          </p>
          <a
            class="media-card__link"
            href="https://www.instagram.com/p/DVjnXkxD_Sd/"
            target="_blank"
            rel="noopener noreferrer"
          >View on Instagram</a>
        </div>
      </article>
    </div>
  </section>

  <section class="media-year-group" data-media-year="2025">
    <h2 class="bibliography">2025</h2>
    <div class="media-list">
      <article
        class="media-card media-card--horizontal"
        data-media-search="2025 youtube itba donor appreciation event institutional video"
      >
        <div class="media-card__embed">
          <div class="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/JZdNWdHK-XQ"
              title="Donor Appreciation Event 2025"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div class="media-card__body">
          <p class="media-card__meta">YouTube | ITBA</p>
          <h3 class="media-card__title">Donor Appreciation Event 2025</h3>
          <p class="media-card__desc">
            Institutional event video featuring academic and laboratory activities.
          </p>
          <a
            class="media-card__link"
            href="https://www.youtube.com/watch?v=JZdNWdHK-XQ"
            target="_blank"
            rel="noopener noreferrer"
          >Watch on YouTube</a>
        </div>
      </article>
    </div>
  </section>
</div>

<script type="module">
  import { highlightSearchTerm } from "{{ '/assets/js/highlight-search-term.js' | relative_url | bust_file_cache }}";

  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('media-search');
    if (!searchInput) return;

    const entries = Array.from(document.querySelectorAll('[data-media-search]'));
    const yearGroups = Array.from(document.querySelectorAll('.media-year-group'));

    const applyFilter = () => {
      const query = (searchInput.value || '').toLowerCase().trim();

      entries.forEach((entry) => {
        const target = (entry.getAttribute('data-media-search') || '').toLowerCase();
        const matches = query === '' || target.includes(query);
        entry.classList.toggle('unloaded', !matches);
      });

      yearGroups.forEach((group) => {
        const hasVisibleEntry = group.querySelector('[data-media-search]:not(.unloaded)');
        group.classList.toggle('unloaded', !hasVisibleEntry);
      });

      if (CSS.highlights) {
        highlightSearchTerm({ search: query, selector: '.media-card:not(.unloaded)' });
      }
    };

    searchInput.addEventListener('input', applyFilter);
    applyFilter();
  });
</script>
