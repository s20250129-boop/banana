#!/usr/bin/env python3
"""Bundle the game prototype into app/index.html (deployed as /app/)."""
from pathlib import Path

root = Path(__file__).resolve().parent
src = root / "src"

js_order = ["app.js", "questions.js", "ui.js", "boot.js"]
js = "\n\n".join((src / name).read_text(encoding="utf-8") for name in js_order)
css = (src / "styles.css").read_text(encoding="utf-8")
shell = (src / "shell.html").read_text(encoding="utf-8")

html = shell.replace("{{CSS}}", css).replace("{{JS}}", js)
out = root / "app" / "index.html"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"built {out} ({len(html):,} bytes)")
