# Publication formats

The active bibliography is `papers.bib`. Home's selected publications and the Publications page share `_layouts/bib.liquid`.

## arXiv format (preserved)

The arXiv style remains available for future preprints:

- Badge: `abbr = {arXiv}` uses the red `#b31b1b` color and the arXiv link defined in `_data/venues.yml`.
- Cover: `preview = {arxiv.png}` uses `assets/img/publication_preview/arxiv.png`.
- Button: `arxiv = {2505.11437}` produces an arXiv abstract-page link.
- `selected = {true}` also displays the entry on Home.

Historical example of the density paper's preprint format (documentation only):

```bibtex
@article{pluss2025density,
  abbr       = {arXiv},
  preview    = {arxiv.png},
  title      = {The Role of Connection Density in an Adaptive Network with Chaotic Units},
  author     = {Pl{\"u}ss, Ramiro and Gleiser, Pablo Mart{\'i}n},
  year       = {2025},
  arxiv      = {2505.11437},
  eprint     = {2505.11437},
  eprinttype = {arxiv},
  selected   = {true}
}
```

For a new preprint, copy this structure into `papers.bib` with a unique citation key and the actual title, authors, year, and arXiv identifier. Add its abstract and other links if available. Do not duplicate the example key: the existing density-paper entry now represents its journal publication in Nonlinear Science.

## Coauthor links and citation counts

Scholar profile links come from `_data/coauthors.yml`. First-name variants must match the BibTeX author names, including middle names.

Scholar badge counts come from `_data/citations.yml`; they are stored values, not live requests to Scholar. On September 29, 2026, the Hemispheric-Specific Coupling count was updated to 2 using the author's supplied Scholar screenshot. Other counts were left unchanged.
