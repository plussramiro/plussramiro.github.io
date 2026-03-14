---
layout: about
title: About
permalink: /
seo_title: "Ramiro Plüss | Physicist and PhD(c)"
seo_description: "Computational Neuroscience, Connectomics, Complex Systems & Bio-inspired Robotics | ITBA"
subtitle: "<em>Computational Neuroscience, Connectomics, Complex Systems & Bioinspired Robotics</em>"

profile:
  align: right
  image: ramiropluss.jpg
  image_circular: false # use rectangular image (not cropped to circle)
  more_info: >
    <p><i class="fa-solid fa-atom fa-sm"></i> Physicist (UNR)</p>
    <p><i class="fa-solid fa-graduation-cap fa-sm"></i> PhD(c) (ITBA)</p>
    <p><i class="fa-solid fa-location-dot fa-sm"></i> CABA, Argentina</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---
Ramiro Pl&uuml;ss holds a degree in Physics from the National University of Rosario (UNR, FCEIA) and is currently a PhD candidate in Engineering at the Buenos Aires Institute of Technology (ITBA). His research focuses on the bidirectional relationship between structure, neural dynamics, and behavior, examining how anatomical organization shapes neural activity and motor control, and how neural activity and behavior, in turn, shape structure. He combines computational neuroscience, neural network models, and bioinspired robotic systems to study proprioception and embodied motor control.

<div class="row mt-3 mb-0 justify-content-center">
  <div class="col-12">
    <a
      href="{{ '/assets/img/research/research_scheme_v2.png' | relative_url }}"
      class="research-zoomable"
      style="display: block; cursor: zoom-in; text-decoration: none;"
      data-image-zoomable
      data-image-title="Schematic of how neural structure gives rise to behavior through dynamics, embodiment, and proprioceptive feedback."
      aria-label="Open research overview image"
    >
      {% include figure.liquid loading="eager" path="assets/img/research/research_scheme_v2.png" alt="Schematic overview linking connectome structure, neural dynamics, embodiment, and behavior." class="img-fluid rounded z-depth-1 mb-0" %}
    </a>
  </div>
</div>

In previous work, he studied how changes in connection density in adaptive networks affect collective dynamics and network organization, including integration and segregation. He has also applied dynamical network models to human connectome data from control subjects and patients with schizophrenia to improve the modeling of functional connectivity.

Currently, he is working with robotic models driven by real connectomics data from Drosophila and C. elegans to explore embodiment, autonomy, and sensorimotor feedback. These connectome based architectures can be viewed as biologically pre trained networks, offering a bridge between neuroscience and robotics while reducing reliance on conventional artificial training. Through this line of research, he aims to contribute to autonomous and bioinspired robotics, long range exploration, and broader questions about how structure, dynamics, and embodied interaction give rise to behavior and intelligence in both biological and artificial systems.

<script defer src="{{ '/assets/js/research-image-modal.js' | relative_url | bust_file_cache }}"></script>
