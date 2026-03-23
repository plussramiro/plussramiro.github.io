---
layout: page
title: Projects
permalink: /projects/
description: Research and development projects across computational neuroscience, connectomics, and embodied robotics.
nav: true
nav_order: 2
display_categories:
  - "Research & Reference Figures"
  - "Robotics Prototypes & Evolution"
horizontal: false
_styles: |
  @media (min-width: 1200px) {
    .container.mt-5[role='main'] {
      max-width: 1280px;
    }

    .robotics-group-card .carousel-inner {
      height: 410px;
    }

    .robotics-group-card .carousel-item {
      height: 100%;
      aspect-ratio: auto;
    }

    .robotics-group-card .card-img-top {
      height: 100%;
      object-fit: cover;
    }

    .robotics-group-card .card-img-top[src*="hexapod1.jpg"] {
      object-position: center 34%;
    }
  }

  .robotics-group-card .carousel-item {
    position: relative;
    aspect-ratio: 835 / 1043;
  }

  .robotics-group-card .carousel-inner {
    background-color: rgba(0, 0, 0, 0.28);
    transition: height 260ms ease;
  }

  .robotics-group-card .card-img-top {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    background-color: #111;
  }

  .projects a[data-project-category="research"] .card-img-top,
  .projects a[data-project-category="research-reference-figures"] .card-img-top {
    height: 200px !important;
    object-fit: contain;
    object-position: center;
    background-color: #fff;
  }

  .projects a#research-reference-figures .category,
  .projects a#robotics-prototypes-evolution .category {
    text-align: left;
  }

  .robotics-group-card.carousel-fade .carousel-item {
    transition: opacity 280ms ease-in-out;
  }

  .robotics-slide-overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.6rem 0.7rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.1));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    pointer-events: none;
  }

  .robotics-slide-title {
    color: #fff;
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    max-width: 74%;
  }

  .robotics-video-link {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    white-space: nowrap;
    min-height: 2rem;
    min-width: 7.6rem;
    font-size: 0.76rem;
    line-height: 1;
    padding: 0.35rem 0.75rem;
    border-radius: 0.35rem;
    pointer-events: auto;
    text-align: center;
    transform: translateY(1px);
  }

  .robotics-video-link__text {
    position: relative;
    top: 5px;
  }

  .robotics-group-card .carousel-control-prev,
  .robotics-group-card .carousel-control-next {
    width: 11%;
  }

  .robotics-group-card .carousel-indicators {
    margin-bottom: 0.2rem;
  }

  .robotics-group-card .carousel-indicators li {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .research-image-modal__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 0.9rem 0.9rem;
  }

  .research-image-modal__title {
    flex: none;
    width: 100%;
    margin: 0;
    text-align: center;
  }

  .research-image-modal__actions[hidden] {
    display: none;
  }

  .research-image-modal__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0;
  }

  .research-image-modal__video-link {
    min-width: 10.8rem;
    font-size: 0.8rem;
    line-height: 1.1;
    padding: 0.42rem 0.85rem;
    text-align: center;
  }

  .research-image-modal__dialog.has-video-action .research-image-modal__image-wrap {
    max-height: calc(92vh - 7.8rem);
  }

  .research-image-modal__dialog.has-video-action .research-image-modal__image {
    max-height: calc(92vh - 10.1rem);
  }

  @media (max-width: 767.98px) {
    .projects .category {
      text-align: left;
    }

    .projects a#research-reference-figures .category,
    .projects a#robotics-prototypes-evolution .category {
      font-size: 2rem;
      line-height: 1.05;
      text-align: left;
      white-space: normal;
    }

    .projects a[data-project-category="research"] .card-img-top,
    .projects a[data-project-category="research-reference-figures"] .card-img-top {
      height: 240px !important;
    }

    .robotics-group-card .carousel-control-prev,
    .robotics-group-card .carousel-control-next {
      display: none;
    }

  }

  @media (min-width: 768px) and (max-width: 1199.98px) {
    .projects .category {
      text-align: left;
    }

    .projects a#research-reference-figures .category,
    .projects a#robotics-prototypes-evolution .category {
      text-align: left;
      white-space: normal;
    }

    .projects a[data-project-category="research"] .card-img-top,
    .projects a[data-project-category="research-reference-figures"] .card-img-top {
      height: 430px !important;
    }

    .robotics-group-card .carousel-control-prev,
    .robotics-group-card .carousel-control-next {
      display: none;
    }

  }

  .research-image-modal__image {
    opacity: 0;
    transition: opacity 220ms ease-in-out;
  }

  .research-image-modal__image.is-visible {
    opacity: 1;
  }

  @media (max-width: 767.98px) {
    .robotics-video-link {
      min-height: 2.2rem;
      min-width: 8rem;
      padding: 0.42rem 0.8rem;
    }

    .research-image-modal__footer {
      gap: 0.42rem;
    }
  }

  @media (min-width: 1200px) {
    .projects a[data-project-category="research"] .card-img-top,
    .projects a[data-project-category="research-reference-figures"] .card-img-top {
      height: 220px !important;
    }
  }
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  {% assign category_slug = category | slugify %}
  <a id="{{ category_slug }}" href=".#{{ category_slug }}">
    <h1 class="post-title category">{{ category }}</h1>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}

  {% if category == "Robotics Prototypes & Evolution" %}
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
    {% assign robotics_groups = sorted_projects | map: "robotics_group" | uniq %}
    {% for group_key in robotics_groups %}
      {% if group_key %}
        {% assign group_items = sorted_projects | where: "robotics_group", group_key | sort: "importance" %}
        {% assign group_lead = group_items | first %}
        {% assign carousel_id = "robotics-carousel-" | append: forloop.index %}
        <div class="col">
          <div class="card h-100 hoverable robotics-group-card">
            <div id="{{ carousel_id }}" class="carousel slide carousel-fade" data-ride="carousel" data-interval="false">
              <div class="carousel-inner">
                {% for project in group_items %}
                  {% if project.redirect %}
                    {% assign project_href = project.redirect %}
                  {% else %}
                    {% assign project_href = project.url | relative_url %}
                  {% endif %}
                  <div class="carousel-item{% if forloop.first %} active{% endif %}">
                    {%
                      include figure.liquid
                      loading="lazy"
                      path=project.img
                      sizes = "380px"
                      alt=project.title
                      class="card-img-top"
                    %}
                    <div class="robotics-slide-overlay">
                      <p class="robotics-slide-title">{{ project.video_title | default: project.title }}</p>
                      <a
                        class="btn btn-primary robotics-video-link"
                        href="{{ project_href }}"
                        data-project-category="{{ project.category | default: '' | slugify }}"
                        data-project-title="{{ project.title | escape }}"
                        data-video-title="{{ project.video_title | default: project.title | escape }}"
                        data-video-caption="{{ project.video_caption | default: '' | escape }}"
                        data-video-source-label="{{ project.video_source_label | default: '' | escape }}"
                        data-video-source-url="{{ project.video_source_url | default: '' | escape }}"
                      >
                        <span class="robotics-video-link__text">See video demo</span>
                      </a>
                    </div>
                  </div>
                {% endfor %}
              </div>
              {% if group_items.size > 1 %}
                <a class="carousel-control-prev" href="#{{ carousel_id }}" role="button" data-slide="prev" aria-label="Previous slide">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </a>
                <a class="carousel-control-next" href="#{{ carousel_id }}" role="button" data-slide="next" aria-label="Next slide">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </a>
                <ol class="carousel-indicators">
                  {% for project in group_items %}
                    <li
                      data-target="#{{ carousel_id }}"
                      data-slide-to="{{ forloop.index0 }}"
                      {% if forloop.first %}class="active"{% endif %}
                      aria-label="Slide {{ forloop.index }}"
                    ></li>
                  {% endfor %}
                </ol>
              {% endif %}
            </div>
            <div class="card-body">
              <h2 class="card-title">{{ group_lead.robotics_group_title | default: group_lead.title }}</h2>
              <p class="card-text">{{ group_lead.robotics_group_description | default: group_lead.description }}</p>
            </div>
          </div>
        </div>
      {% endif %}
    {% endfor %}
  </div>
  {% else %}
    <!-- Generate cards for each project -->
    {% if page.horizontal %}
    <div class="container">
      <div class="row row-cols-1 row-cols-md-2">
      {% for project in sorted_projects %}
        {% include projects_horizontal.liquid %}
      {% endfor %}
      </div>
    </div>
    {% else %}
    <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4">
      {% for project in sorted_projects %}
        {% include projects.liquid %}
      {% endfor %}
    </div>
    {% endif %}
  {% endif %}

  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>

<script defer src="{{ '/assets/js/projects-video-modal.js' | relative_url | bust_file_cache }}"></script>
<script defer src="{{ '/assets/js/research-image-modal.js' | relative_url | bust_file_cache }}"></script>
<script>
  (function () {
    var SWIPE_THRESHOLD = 40;

    function moveCarousel(carousel, direction) {
      if (!carousel) return;
      if (window.jQuery) {
        window.jQuery(carousel).carousel(direction);
      }
    }

    function enableTouchSwipe(carousel) {
      if (!carousel) return;

      var startX = 0;
      var startY = 0;
      var tracking = false;

      carousel.addEventListener(
        "touchstart",
        function (event) {
          if (!event.touches || event.touches.length !== 1) return;
          if (event.target && event.target.closest("a, button")) return;
          startX = event.touches[0].clientX;
          startY = event.touches[0].clientY;
          tracking = true;
        },
        { passive: true }
      );

      carousel.addEventListener(
        "touchend",
        function (event) {
          if (!tracking || !event.changedTouches || event.changedTouches.length !== 1) return;
          tracking = false;

          var endX = event.changedTouches[0].clientX;
          var endY = event.changedTouches[0].clientY;
          var deltaX = endX - startX;
          var deltaY = endY - startY;

          if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
          if (Math.abs(deltaY) > Math.abs(deltaX)) return;

          moveCarousel(carousel, deltaX < 0 ? "next" : "prev");
        },
        { passive: true }
      );
    }

    function getRenderedHeight(img) {
      if (!img) return 0;
      if (img.complete && img.naturalWidth > 0) {
        return Math.round(img.getBoundingClientRect().height);
      }
      return 0;
    }

    function setCarouselHeight(carousel, img) {
      var inner = carousel.querySelector(".carousel-inner");
      if (!inner) return;

      if (window.innerWidth >= 1200) {
        inner.style.removeProperty("height");
        return;
      }

      var targetImg = img || carousel.querySelector(".carousel-item.active img");
      if (!targetImg) return;

      var applyHeight = function () {
        var h = getRenderedHeight(targetImg);
        if (h > 0) {
          inner.style.height = h + "px";
        }
      };

      if (targetImg.complete && targetImg.naturalWidth > 0) {
        applyHeight();
      } else {
        targetImg.addEventListener("load", applyHeight, { once: true });
      }
    }

    function initRoboticsCarousel(carousel) {
      setCarouselHeight(carousel);
      enableTouchSwipe(carousel);

      if (window.jQuery) {
        var $carousel = window.jQuery(carousel);
        $carousel.on("slide.bs.carousel", function (event) {
          if (event.relatedTarget) {
            setCarouselHeight(carousel, event.relatedTarget.querySelector("img"));
          }
        });
        $carousel.on("slid.bs.carousel", function () {
          setCarouselHeight(carousel);
        });
      }
    }

    document.addEventListener("DOMContentLoaded", function () {
      var carousels = document.querySelectorAll(".robotics-group-card .carousel");
      carousels.forEach(initRoboticsCarousel);

      window.addEventListener("resize", function () {
        carousels.forEach(function (carousel) {
          setCarouselHeight(carousel);
        });
      });
    });
  })();
</script>
