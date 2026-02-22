from pathlib import Path

# Directorios base
ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
SECTIONS_DIR = SRC / "sections"
DIST = ROOT / "dist"

# Asegurarse de que dist/ exista
DIST.mkdir(exist_ok=True)

# Leer layout base
layout_path = SRC / "layout.html"
layout_html = layout_path.read_text(encoding="utf-8")

# Mapear marcadores @@TAG@@ -> archivo de sección
partials = {
    "ABOUT": "about.html",
    "PUBLICATIONS": "publications.html",
    "FIGURES": "figures.html",
    "ROBOTICS": "robotics.html",
    "POSTERS": "posters.html",
    "TALKS": "talks.html",
    "PROGRAMS": "programs.html",
    "TEACHING": "teaching.html",
    "VOLUNTEERING": "volunteering.html",
    "AFFILIATIONS": "affiliations.html",
    "CONTACT": "contact.html",
}

html_final = layout_html

# Reemplazar cada marcador por el contenido de su sección
for tag, filename in partials.items():
    marker = f"@@{tag}@@"
    section_path = SECTIONS_DIR / filename
    section_html = section_path.read_text(encoding="utf-8")

    if marker not in html_final:
        print(f"[WARN] Marcador {marker} no encontrado en layout.html")

    html_final = html_final.replace(marker, section_html)

# Escribir index.html en raíz y en dist/
root_index = ROOT / "index.html"
dist_index = DIST / "index.html"

root_index.write_text(html_final, encoding="utf-8")
dist_index.write_text(html_final, encoding="utf-8")

print(f"✔ Sitio generado en {root_index}")
print(f"✔ Copia adicional en {dist_index}")
