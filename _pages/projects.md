---
layout: page
title: Projects
permalink: /projects/
description: Research and development projects across computational neuroscience, connectomics, and embodied robotics.
nav: true
nav_order: 3
display_categories:
  - "Research & Reference Figures"
  - "Robotics Prototypes & Evolution"
horizontal: false
_styles: |
  @media (min-width: 1200px) {
    .container.mt-5[role='main'] {
      max-width: 1280px;
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
