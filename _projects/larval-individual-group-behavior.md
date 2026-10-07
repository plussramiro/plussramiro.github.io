---
layout: page
title: Individual and Group Behavior in Drosophila Larvae
description: Comparing larval exploration and dispersal with empirical trajectories and random-walk models. Konstanz Summer School, 2026.
importance: -1
new_row_after: true
category: "Research & Reference Figures"
img: /assets/img/projects/larval-behavior/spatial-occupancy.png
hero_img: /assets/img/projects/larval-behavior/dataset-snapshot.png
image_zoom_title: "Spatial occupancy of solitary and grouped Drosophila larvae"
figure_captions:
  - 'Dataset overview: solitary and group trials of Drosophila larvae tracked with TRex. Data provided by Katrin Vogt and Akhila Mudunuri, University of Konstanz. <a href="https://doi.org/10.48606/f2edp3nxb0mmddgj">Dataset (Mudunuri and Vogt, 2025; CC BY 4.0)</a> · <a href="https://doi.org/10.1126/sciadv.ady0750">Paper (Mudunuri, Zadigue-Dubé and Vogt, 2026)</a>.'
---

I developed this project during the Konstanz Summer School on Collective Behavior in August 2026. I analyzed how _Drosophila_ larvae explore an arena when alone and in groups, and asked how much of the observed group dispersal can be explained by independent movement.

### Data and analysis

The dataset contains 30 solitary trials and 8 group trials with 15 larvae per group, tracked with TRex at 1 frame per second for approximately 900 seconds. The data were provided by Katrin Vogt and Akhila Mudunuri at the University of Konstanz.

I checked tracking quality, excluded missing frames and implausible centroid jumps, and compared spatial occupancy, distance from the arena center, and inter-individual separation. In these analyses, solitary larvae remained more concentrated around the release region, while groups dispersed more rapidly and occupied a broader area.

<a href="{{ '/assets/img/projects/larval-behavior/spatial-occupancy.png' | relative_url }}" data-image-zoomable data-image-title="Spatial occupancy of solitary and grouped larvae">
  <img src="{{ '/assets/img/projects/larval-behavior/spatial-occupancy.png' | relative_url }}" class="img-fluid rounded" alt="Spatial occupancy heatmaps comparing solitary and grouped larvae" loading="lazy">
</a>
<p class="caption">Spatial occupancy heatmaps from my analysis of solitary and group trials.</p>

### Modeling individual and group movement

I constructed empirical random-walk models using step lengths and turning angles from solitary larvae. I compared independent sampling, joint step-turn sampling, and resampling consecutive movement sequences to preserve temporal correlations. I then initialized independent simulated walkers using configurations sampled from group trials.

Preserving temporal correlations improved the description of solitary movement. Independent walkers reproduced part of the later group spacing but did not reproduce the rapid initial dispersal. This suggests that explicit interactions may be needed to explain that early behavior; it does not establish a specific interaction mechanism.

<a href="{{ '/assets/img/projects/larval-behavior/solitary-and-grouped-larvae.png' | relative_url }}" data-image-zoomable data-image-title="Schematic comparison of solitary and grouped larvae">
  <img src="{{ '/assets/img/projects/larval-behavior/solitary-and-grouped-larvae.png' | relative_url }}" class="img-fluid rounded" style="background-color: white" alt="Schematic of solitary and grouped larvae with example paths" loading="lazy">
</a>
<p class="caption">Conceptual illustration from my presentation; the paths are schematic.</p>

### Data and related work

- [Source dataset: Social behavior in Drosophila larva, Mudunuri and Vogt (2025)](https://doi.org/10.48606/f2edp3nxb0mmddgj), distributed under CC BY 4.0.
- [Mudunuri, Zadigue-Dubé and Vogt (2026), Multimodal social context modulates larval behavior in Drosophila](https://doi.org/10.1126/sciadv.ady0750).
- [Related project: TRex data to Movement]({{ '/projects/trex-to-movement/' | relative_url }}), my workflow for converting and processing these tracking data.
