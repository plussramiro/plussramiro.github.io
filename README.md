# 🌐 Personal Academic Website — Ramiro Plüss

This repository hosts the source code of my academic website:  
👉 <https://plussramiro.github.io>

The site is built with plain **HTML, CSS, and JavaScript** (no frameworks), plus a small
**Python build script** to assemble the final `index.html` from modular HTML sections.
Deployment is handled through **GitHub Pages**.

---

## 📂 Repository Structure

```text
plussramiro.github.io/
│
├── build_site.py          # Small build script that generates index.html
├── index.html             # Generated home page (DO NOT edit by hand)
│
├── src/                   # Source templates (edit these)
│   ├── layout.html        # Base layout with @@TAGS@@ placeholders
│   └── sections/          # Individual content sections
│       ├── about.html
│       ├── publications.html
│       ├── figures.html
│       ├── robotics.html
│       ├── posters.html
│       ├── talks.html
│       ├── programs.html
│       ├── teaching.html
│       ├── volunteering.html
│       ├── affiliations.html
│       └── contact.html
│
├── dist/                  # Extra build output (index.html copy for testing)
│
├── css/
│   └── style.css          # Styles (layout, typography, carousels, themes…)
│
├── js/
│   └── main.js            # Theme toggle, carousels, video overlay, lightbox…
│
└── images/                # Profile, affiliations, robotics, figures, etc.
```

---

## 🧩 Templating System

The homepage is defined by `src/layout.html`, which contains placeholders such as:

```html
@@ABOUT@@
@@PUBLICATIONS@@
@@FIGURES@@
@@ROBOTICS@@
@@POSTERS@@
@@TALKS@@
@@PROGRAMS@@
@@TEACHING@@
@@VOLUNTEERING@@
@@AFFILIATIONS@@
@@CONTACT@@
```

Each placeholder is replaced by the corresponding HTML file in `src/sections/`
(e.g. `about.html`, `publications.html`, `robotics.html`, etc.).

The Python script `build_site.py`:

1. Reads `src/layout.html`.
2. Injects all section files from `src/sections/`.
3. Writes the final `index.html` at the repo root.
4. Creates a copy at `dist/index.html`.

**Important:** you should normally **edit only files under `src/`, `css/` and `js/`**,  
_not_ `index.html` directly.

---

## 🛠 How to Build & Edit Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/plussramiro/plussramiro.github.io.git
   cd plussramiro.github.io
   ```

2. **Edit content**

   - Text & sections: edit files in `src/sections/`
     (e.g. `about.html`, `publications.html`, `figures.html`, `robotics.html`, etc.).
   - Layout & navigation: edit `src/layout.html`.
   - Styling: edit `css/style.css`.
   - Behaviour (carousels, theme toggle, overlays): edit `js/main.js`.

3. **Build the site**

   ```bash
   python build_site.py
   ```

   This generates/overwrites:

   - `index.html` at the repository root  
   - `dist/index.html` as an extra copy for local testing

4. **Preview locally**

   - Option A: open `index.html` in your browser (double-click).
   - Option B (recommended): run a simple local server, e.g.:

     ```bash
     python -m http.server 8000
     ```

     and visit <http://localhost:8000>.

---

## 🚀 Deployment (GitHub Pages)

The `main` branch is published automatically with **GitHub Pages**.

After running `python build_site.py` and verifying `index.html`:

```bash
git add .
git commit -m "Update website"
git push origin main
```

GitHub Pages will serve the updated site from `index.html`.

---

## ✨ Main Features

- Responsive layout with **light/dark theme toggle**.
- Modular sections (About, Publications, Figures, Robotics, Posters, Talks, Programs,
  Teaching, Volunteering, Affiliations, Contact & CV).
- **Carousels** for research figures and robotics prototypes.
- YouTube demo overlay in a mobile-style “phone card”.
- Image **lightbox** for research and robotics figures.
- Automatic update of the **year** in the footer.

---

## 📑 License

Feel free to explore and adapt the structure for your own academic website.  
All content (text, CV, images) is © Ramiro Plüss unless otherwise specified.
