# nyanlynntun.com

Source for my portfolio site, [nyanlynntun.com](https://nyanlynntun.com). It's a single static
page with no build step, hosted on GitHub Pages.

## Layout

```
site/                  ← everything here is published, as-is
  index.html           the whole site (HTML + inline CSS/JS)
  404.html             custom not-found page
  robots.txt, sitemap.xml
  apple-touch-icon.png iOS home-screen icon
  CNAME                custom domain for GitHub Pages
  img/                 favicon, photo (jpg + webp), og-image.png (social preview)
brand/                 not published: brand notes, logo concepts, email signature,
                       and make-images.py (regenerates the images in site/)
.github/workflows/     deploy.yml publishes site/ on every push to main
```

## Editing

1. Edit `site/index.html`.
2. Preview locally: `python3 -m http.server -d site 8000`, then open http://localhost:8000.
3. Push to `main`. The GitHub Action deploys within a minute or two.

When you add or change a page, update `<lastmod>` in `site/sitemap.xml`.

## Regenerating images

After changing the photo or your title, run:

```sh
python3 brand/make-images.py
```

This rebuilds `og-image.png` (the 1200×630 link preview), `apple-touch-icon.png` and the WebP
photo. It uses macOS system fonts and needs Pillow (`pip install pillow`); the WebP step also
needs `cwebp` (`brew install webp`). After it redeploys, refresh LinkedIn's cached preview with the
[Post Inspector](https://www.linkedin.com/post-inspector/).

## Notes

- `brand/BRAND-REQUIREMENTS.md` was written for the previous (Astro, eggshell + green) version
  of the site. The current site uses a dark/light theme with a violet accent; the CSS variables at
  the top of `site/index.html` are the source of truth for colours.
- Analytics: [GoatCounter](https://nyanlynntun.goatcounter.com) (no cookies). Links with
  `data-goatcounter-click` are tracked as events.
