---
layout: page
title: TRex Data to Movement
description: Converting larval tracking data into Movement datasets, with trajectory quality control, filtering, and reports. UCL Summer School, 2026.
importance: -2
category: "Research & Reference Figures"
img: /assets/img/projects/trex-to-movement/raw-filtered-trajectories.png
hero_img: /assets/img/projects/larval-behavior/dataset-snapshot.png
image_zoom_title: "Raw and filtered larval trajectories in the TRex-to-Movement workflow"
figure_captions:
  - 'Dataset overview: solitary and group trials of <em>Drosophila</em> larvae tracked with TRex. Data provided by Katrin Vogt and Akhila Mudunuri, University of Konstanz. <a href="https://doi.org/10.48606/f2edp3nxb0mmddgj">Dataset (Mudunuri and Vogt, 2025; CC BY 4.0)</a> · <a href="https://doi.org/10.1126/sciadv.ady0750">Paper (Mudunuri, Zadigue-Dubé and Vogt, 2026)</a>.'
---

During the UCL Summer School in 2026, I implemented a workflow that converts TRex trajectory CSV files into datasets compatible with the Movement Python package. I used larval tracking data to connect data loading with quality control, filtering, and visual inspection.

[View the code and usage instructions on GitHub](https://github.com/plussramiro/trexdata_to_movement).

### What the tool does

The loader aligns individuals by frame number, converts centroid coordinates into a position array, and calls `movement.io.load_poses.from_numpy` to create an `xarray.Dataset`. It preserves the raw trajectories and keeps experiment-specific quality control and filtering in a separate stage.

The configurable workflow selects an analysis window, checks missing frames and suspicious jumps across gaps, and filters retained trajectories. It generates trajectory plots, raw-versus-filtered comparisons, and CSV summaries of the dataset and quality-control decisions.

<a href="{{ '/assets/img/projects/trex-to-movement/workflow.png' | relative_url }}" data-image-zoomable data-image-title="TRex to Movement workflow">
  <img src="{{ '/assets/img/projects/trex-to-movement/workflow.png' | relative_url }}" class="img-fluid rounded" alt="Workflow from TRex CSV files through conversion, quality control, filtering, and reports" loading="lazy">
</a>
<p class="caption">Workflow diagram from my UCL presentation. Click to enlarge.</p>

<a href="{{ '/assets/img/projects/trex-to-movement/raw-filtered-trajectories.png' | relative_url }}" data-image-zoomable data-image-title="Raw and filtered larval trajectories">
  <img src="{{ '/assets/img/projects/trex-to-movement/raw-filtered-trajectories.png' | relative_url }}" class="img-fluid rounded" alt="Raw and filtered X and Y trajectories in a group trial" loading="lazy">
</a>
<p class="caption">Example group trial before and after trajectory quality control and filtering. Columns show raw and filtered data; rows show X and Y positions over time.</p>

### Example configuration

For the larval dataset, the example analyzes 20–860 seconds, excludes trajectories with more than 10% missing frames or suspicious gap transitions, interpolates gaps of at most 3 frames, and applies a 5-frame rolling median. These settings are configurable and specific to this example.

<a href="{{ '/assets/img/projects/trex-to-movement/trajectory-quality-control.png' | relative_url }}" data-image-zoomable data-image-title="Individual trajectory quality-control example">
  <img src="{{ '/assets/img/projects/trex-to-movement/trajectory-quality-control.png' | relative_url }}" class="img-fluid rounded" alt="Quality-control report showing a larva's coordinate traces and filtered spatial trajectory" loading="lazy">
</a>
<p class="caption">Example of an included trajectory, with its analysis window and spatial path.</p>

### Data and related work

The example data come from [Mudunuri and Vogt (2025), Social behavior in Drosophila larva](https://doi.org/10.48606/f2edp3nxb0mmddgj), University of Konstanz, distributed under CC BY 4.0. The associated publication is [Mudunuri, Zadigue-Dubé and Vogt (2026)](https://doi.org/10.1126/sciadv.ady0750).

My [individual and group behavior project]({{ '/projects/larval-individual-group-behavior/' | relative_url }}) explores the behavioral questions and random-walk models using these data.
