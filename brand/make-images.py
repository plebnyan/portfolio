"""Generate the site's raster images from the photo + brand colours.

    python3 brand/make-images.py      (run from the repo root, macOS fonts)

Outputs:
    site/img/og-image.png       1200x630 social preview (LinkedIn, X, Slack...)
    site/apple-touch-icon.png   180x180 iOS home-screen icon (same mark as favicon.svg)
    site/img/literally_me.webp  smaller copy of the hero photo (needs `cwebp`)
"""
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "site" / "img"
PHOTO = IMG / "literally_me.jpg"

# Colours from site/index.html (dark theme)
BG, INK, MUTE, LINE, ACCENT = "#0c0d10", "#f2f3f5", "#9aa0ab", "#2c303a", "#8b7cf6"

SANS = "/System/Library/Fonts/HelveticaNeue.ttc"  # stand-in for Inter
MONO = "/System/Library/Fonts/Menlo.ttc"          # stand-in for JetBrains Mono


def font(path, size, index=0):
    return ImageFont.truetype(path, size, index=index)


def og_image():
    W, H = 1200, 630
    S = 2  # draw at 2x, downsample for smooth edges
    im = Image.new("RGB", (W * S, H * S), BG)

    # soft accent glow, top right
    glow = Image.new("L", im.size, 0)
    ImageDraw.Draw(glow).ellipse((W * S * 0.55, -H * S * 0.5, W * S * 1.25, H * S * 0.7), fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(160 * S))
    im = Image.composite(Image.new("RGB", im.size, ACCENT), im, glow)
    d = ImageDraw.Draw(im)

    x = 72 * S
    # site name with accent dot
    d.ellipse((x, 150 * S, x + 12 * S, 162 * S), fill=ACCENT)
    d.text((x + 24 * S, 156 * S), "nyanlynntun.com", font=font(MONO, 22 * S), fill=MUTE, anchor="lm")
    # name + role
    d.text((x - 3 * S, 200 * S), "Nyan Lynn Tun", font=font(SANS, 76 * S, 1), fill=INK)
    d.text((x, 300 * S), "Data Engineer", font=font(SANS, 36 * S, 10), fill=ACCENT)

    # stack chips
    chip_font = font(MONO, 19 * S)
    cx, cy = x, 400 * S
    for label in ["Databricks", "Azure", "dbt", "Lakehouse", "SAP data"]:
        w = d.textlength(label, font=chip_font) + 28 * S
        d.rounded_rectangle((cx, cy, cx + w, cy + 40 * S), radius=8 * S, outline=LINE, width=2 * S)
        d.text((cx + 14 * S, cy + 20 * S), label, font=chip_font, fill=MUTE, anchor="lm")
        cx += w + 10 * S

    # photo card, right side (crop matches the site's object-position: center 75%)
    pw, ph = 380 * S, 475 * S
    photo = ImageOps.fit(Image.open(PHOTO).convert("RGB"), (pw, ph), Image.LANCZOS, centering=(0.5, 0.75))
    mask = Image.new("L", (pw, ph), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, pw, ph), radius=20 * S, fill=255)
    px, py = (W - 72 - 380) * S, (H - 475) // 2 * S
    im.paste(photo, (px, py), mask)
    d.rounded_rectangle((px, py, px + pw, py + ph), radius=20 * S, outline="#23262e", width=2 * S)

    im.resize((W, H), Image.LANCZOS).save(IMG / "og-image.png", optimize=True)


def touch_icon():
    # Same mark as favicon.svg, full-bleed (iOS adds its own rounded corners).
    S = 4
    N = 180 * S
    im = Image.new("RGB", (N, N), "#0b1016")
    d = ImageDraw.Draw(im)
    u = N / 84  # favicon.svg units → px, cropping its 8-unit margin
    d.text(((20 - 8) * u, (55 - 8) * u), "nlt", font=font(MONO, int(28 * u)), fill="#e2e8ee", anchor="lm")
    d.rectangle(((72 - 8) * u, (40 - 8) * u, (84 - 8) * u, (68 - 8) * u), fill="#3fcf75")
    im.resize((180, 180), Image.LANCZOS).save(ROOT / "site" / "apple-touch-icon.png", optimize=True)


def webp():
    if shutil.which("cwebp"):
        subprocess.run(["cwebp", "-quiet", "-q", "82", str(PHOTO), "-o", str(IMG / "literally_me.webp")], check=True)
    else:
        print("cwebp not found; skipping WebP (brew install webp)")


if __name__ == "__main__":
    og_image()
    touch_icon()
    webp()
    print("done")
