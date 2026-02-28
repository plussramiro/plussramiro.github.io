# Ramiro Pluss Personal Academic Website

Live site: <https://plussramiro.github.io/>

Personal academic website built with [Jekyll](https://jekyllrb.com/) on top of the
[al-folio](https://github.com/alshedivat/al-folio) theme and customized for research content.

## Research Focus
- Computational neuroscience
- Connectomics
- Complex systems
- Bioinspired robotics

## Main Sections
- About
- Publications
- Projects
- Repositories
- CV
- Teaching
- Lab

## Local Development

### Recommended (Docker)
```bash
docker compose pull && docker compose up
```

Site URL: <http://localhost:8080>

### Rebuild after dependency or Dockerfile changes
```bash
docker compose up --build
```

### Stop local environment
```bash
docker compose down
```

## Repository Map
- `_pages/about.md`: Home page content.
- `_data/affiliations.yml`: Affiliations and support logos shown on the home page.
- `assets/img/affiliations/`: Logo image assets for affiliations.
- `_data/cv.yml`: CV content.
- `_bibliography/papers.bib`: Publications source.
- `_projects/`: Project entries.

## SEO and Verification
- Google Search Console verification file is kept at the repository root:
  `google39d421654054dd71.html`

## Deployment
- GitHub Actions workflow `.github/workflows/preview.yml` builds the site to `docs/`
  on every push to `main`.
- GitHub Pages serves the published site from the `docs/` directory in `main`.

## Notes
- `CONTRIBUTING.md` and `LICENSE` are kept as upstream references.
- This repository is maintained as a personal website codebase, not as a theme fork.
