#!/usr/bin/env python3
"""Build the game and assemble the public GitHub Pages site.

Output: site/
  index.html        marketing site
  404.html
  robots.txt
  sitemap.xml
  assets/           site CSS, JS, images
  app/index.html    the playable game (built from src/)
"""
from pathlib import Path
import shutil
import subprocess
import sys

root = Path(__file__).resolve().parent
site = root / "site"

# 1. Build the game from src/ into app/index.html
subprocess.run([sys.executable, str(root / "build.py")], check=True, cwd=root)

# 2. Rebuild the public site directory
if site.exists():
    shutil.rmtree(site)
site.mkdir()

for name in ["index.html", "404.html", "robots.txt", "sitemap.xml", ".nojekyll"]:
    shutil.copy2(root / name, site / name)

shutil.copytree(
    root / "assets",
    site / "assets",
    ignore=shutil.ignore_patterns(".DS_Store", "*.map"),
)
(site / "app").mkdir()
shutil.copy2(root / "app" / "index.html", site / "app" / "index.html")

# 3. Lightweight sanity checks
required = [
    site / "index.html",
    site / "app" / "index.html",
    site / "assets" / "site.css",
    site / "assets" / "site.js",
    site / "assets" / "img" / "home.webp",
    site / "assets" / "og-cover.png",
]
missing = [str(p.relative_to(root)) for p in required if not p.exists()]
if missing:
    raise SystemExit("Missing build output: " + ", ".join(missing))

print(f"built {site}/index.html ({site.joinpath('index.html').stat().st_size:,} bytes)")
print(f"built {site}/app/index.html ({site.joinpath('app/index.html').stat().st_size:,} bytes)")
