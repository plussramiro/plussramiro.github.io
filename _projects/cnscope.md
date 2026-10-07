---
layout: page
title: "CNScope: Male CNS Connectome Viewer"
description: Interactive exploration of the Drosophila Male CNS connectome in napari. BrainGlobe track, UCL Summer School, 2026.
importance: -3
category: "Research & Reference Figures"
img: /assets/img/projects/cnscope/viewer-demo.gif
hero_img: /assets/img/projects/cnscope/male-cns-dataset.png
image_zoom_title: "CNScope: neuropil visualization and exploration of anatomical EM sections"
figure_captions:
  - 'Overview of the FlyEM Male CNS v1.0 dataset, from my UCL presentation. Dataset and source imagery: Janelia FlyEM and collaborators. <a href="https://www.janelia.org/project-team/flyem/male-cns-connectome">Dataset, publication, and data access</a> (CC BY).'
---

I developed CNScope during the BrainGlobe track at the UCL Summer School in 2026. The viewer brings anatomical labels, selected neuronal morphologies, and electron microscopy (EM) into a shared napari coordinate space, making it possible to explore the Male CNS connectome at different spatial scales.

[View the code, configuration, and usage instructions on GitHub](https://github.com/plussramiro/male-cns-napari-viewer).

### Dataset and motivation

The Janelia FlyEM Male CNS dataset covers the central brain, optic lobes, and ventral nerve cord of an adult male _Drosophila melanogaster_. Its large EM volume makes downloading and loading the complete native-resolution array impractical for local exploration.

I implemented remote access with TensorStore and Dask so the viewer requests the data chunks needed for the current view. This allows exploration without downloading the complete EM volume.

### Interactive exploration

The viewer combines brain and ventral nerve cord neuropil labels with selected neuron skeletons and somas. It supports a 3D EM overview and multiscale 2D inspection. A faster contrast-enhanced layer supports navigation, while the original EM layer remains available for inspection of the original intensities.

<a href="{{ '/assets/img/projects/cnscope/viewer-demo.gif' | relative_url }}" data-image-zoomable data-image-title="CNScope demo: anatomical sections, not time points">
  <img src="{{ '/assets/img/projects/cnscope/viewer-demo.gif' | relative_url }}" class="img-fluid rounded" alt="Animated CNScope demo showing colored neuropils and a traversal through electron microscopy sections" loading="lazy">
</a>
<p class="caption">Interactive exploration of Male CNS neuropils and EM sections. The animation traverses spatial anatomical sections; it does not show neuronal activity over time.</p>

### Workflow

I aligned neuropil segmentations, neuronal skeletons and somas, and multiscale EM as napari Labels, Vectors, Points, and Image layers. Configurable resolutions and a bounded shared cache help manage remote data access during exploration.

<a href="{{ '/assets/img/projects/cnscope/workflow.png' | relative_url }}" data-image-zoomable data-image-title="CNScope multimodal visualization workflow">
  <img src="{{ '/assets/img/projects/cnscope/workflow.png' | relative_url }}" class="img-fluid rounded" alt="Workflow combining neuropil labels, selected neuronal morphologies, and remotely accessed EM in napari" loading="lazy">
</a>
<p class="caption">Workflow from my BrainGlobe track presentation. The diagram shows the example configuration used for the demonstration; viewer settings are configurable.</p>

### Sources and related work

- [Male CNS connectome: dataset, publication, and access tools](https://www.janelia.org/project-team/flyem/male-cns-connectome). Data acquired, reconstructed, and annotated by Janelia FlyEM, the Cambridge Drosophila Connectomics Group / MRC LMB, and Google Research; distributed under CC BY.
- [Male CNS napari viewer repository](https://github.com/plussramiro/male-cns-napari-viewer), including setup instructions and data attribution.
- [TRex Data to Movement]({{ '/projects/trex-to-movement/' | relative_url }}), my other UCL project, focused on behavioral tracking data.
