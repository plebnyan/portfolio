# Brand Requirements — Nyan Lynn Tun

The goal: a small, consistent set of assets that all feel like they came from the same place, so
that wherever someone runs into you — site, inbox, LinkedIn — it reinforces one impression:
*a precise, credible data engineer worth hiring.*

Everything below extends the system already established by the website. We are not inventing a new
look; we are making the existing one portable.

---

## 0. Brand foundation (source of truth)

Pulled directly from the live site. Every other asset must use these.

**Colours**
- Background (eggshell): `#f6f2e9`
- Ink / text: `#16181d`
- Muted text: `#655f52`
- Accent (green): `#16a34a`, darker `#15803d`
- Borders / hairlines: `#e4dfd1`
- Card / surface white: `#ffffff`

**Type**
- `Segoe UI` — primary; headings and UI (system font, falls back to native sans off-Windows)
- `DM Mono` — labels, code, technical accents (the "engineer" texture)
- `Newsreader` (serif) — long-form reading (blog body only)
- `Noto Sans Myanmar` — Burmese text

**Voice**
- Quietly expert. Clear, restrained, technical. No hype, no adjectives doing the work.
- The work is the proof; the writing is calm and precise.

**Principles**
- Monochrome + a single green accent. Never introduce a second accent colour.
- Generous whitespace; hairline borders over heavy boxes.
- Mono type is the signature texture — use it for small labels everywhere.

---

## 1. Logo / personal mark

**Purpose:** a mark that works as a favicon, a round avatar, and a stamp on documents and banners.

**Requirements**
- Legible at 16px (favicon) and clean as a large hero mark.
- Works on eggshell **and** dark, and in a single flat colour (one-colour version required).
- Two colours maximum (ink + green).
- Vector (SVG) master; feels technical/precise, not playful or hand-drawn.
- A defined clear-space rule and a minimum size.

**Directions to choose from** (see the concepts sheet — `logo-concepts.html`):
- **Monogram (NLT)** — safest, most versatile, best favicon.
- **Wordmark** — reinforces the name; weaker as a standalone icon.
- **Data symbol** — most distinctive (layers / nodes / flow); higher risk to get right.

**Deliverables once a direction is chosen**
- SVG in three treatments: full-colour, single-colour ink, reversed (for dark).
- Favicon set (SVG + 32/180px PNG) to replace the current placeholder favicon.
- Avatar: square and circle crops for GitHub / LinkedIn / Substack.
- One-line usage rule (clear space, min size, what not to do).

---

## 2. Email signature

**Purpose:** every email quietly reinforces the brand and gives an easy path to your site.

**Requirements**
- Pure inline-styled HTML (email clients strip `<style>` blocks and external CSS).
- **No web fonts** — clients drop them; use a system stack that echoes the brand
  (`Arial, Helvetica, sans-serif` as the DM Sans stand-in).
- Max width ~460–500px; renders in Gmail, Outlook, Apple Mail, mobile.
- Light background only (many clients force light); green used sparingly as accent.
- Contents: name, role, one-line positioning, `nyanlynntun.com`, email, LinkedIn, GitHub, and the
  monogram once it exists.
- A plain-text fallback version (some setups need it).

**Proposed layout**
Two columns: small monogram tile on the left; on the right — **Nyan Lynn Tun** (bold ink),
"Data Engineer" (muted), a hairline divider, then a mono-style row of links in green.

---

## 3. Social banners

**Purpose:** consistent header art where people vet you, matching the site exactly.

**Requirements & specs**
- **LinkedIn cover:** 1584 × 396px. Keep text out of the bottom-left (your avatar overlaps there)
  and away from the right edge (edit-button overlay). Safe content sits centre / upper-left.
- **X / Twitter header:** 1500 × 500px. Avatar overlaps bottom-left; bottom strip may be covered by
  the profile card on some layouts — keep key text in the upper two-thirds.
- Both: eggshell background, ink headline, single green accent, DM-Sans-style type, the monogram,
  and `nyanlynntun.com`. One short line of positioning, not a paragraph.
- Export at 2× for crispness; deliver PNG (and the editable SVG source).

---

## 4. Build sequence

1. **Pick the logo direction** from the concepts sheet.
2. Finalise the mark → produce favicon + avatars (also upgrades the site's favicon).
3. Build the **email signature** around the mark.
4. Design the **two social banners** around the mark.
5. (Optional later) matching résumé/CV header and a slide template.
