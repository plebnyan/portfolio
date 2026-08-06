# Writing this site in Obsidian

The content folder *is* an Obsidian vault. There's no export step, no sync
service and no plugin required — Obsidian edits the same `.md` files the site
builds from.

## Setup (once)

**1. Open the vault.** Obsidian → *Open folder as vault* → select the `src/`
folder of this repo. You'll see only markdown; Obsidian hides `.astro`, `.json`
and `.ts` files unless you turn on *Detect all file extensions*.

```
src/
├── content/
│   ├── blog/       ← posts
│   ├── projects/   ← case studies
│   └── pages/      ← the About page
└── templates/      ← starting points for new notes
```

**2. Attachments.** Settings → *Files and links*:

| Setting | Value |
|---|---|
| Default location for new attachments | *In the folder specified below* → `../public/img` |
| New link format | **Absolute path in vault** |
| Use [[Wikilinks]] | **On** — leave it |

Pasted images then land where the site looks for them, as `/img/whatever.png`.

**3. Templates.** Settings → *Templates* → set the template folder to
`templates`. Then `Ctrl/Cmd+P` → *Insert template* in a new note gives you
correct frontmatter for a post, a project, or a translation.

**4. Publishing.** The vault is a git repo, so publishing is a commit and push.
The **Obsidian Git** plugin does it without leaving the app; the terminal works
just as well.

## Writing

Create the note in `content/blog/` or `content/projects/`, insert the matching
template, fill in the frontmatter, write.

| You write | The site does |
|---|---|
| `[[jobnet-lakehouse]]` | Link, with a hover preview of that page's summary |
| `[[jobnet-lakehouse\|the lakehouse]]` | Same link, custom text |
| `[[something-unwritten]]` | Dimmed placeholder, not a broken link |
| `##` headings | Table of contents on the page |
| `draft: true` | Excluded from the build entirely |
| `tags: [spark, dbt]` | Listed on `/tags/spark/` alongside matching projects |

The filename is the URL. `medallion-lakehouse.md` → `/blog/medallion-lakehouse/`.

Every page ends with **Linked mentions** — the reverse of your links, computed at
build time. Obsidian's own backlinks panel shows the same thing while you write,
which is the point: the graph you see writing is the graph readers get.

## Two languages

A translation is a **separate file next to the original**:

```
content/blog/medallion-lakehouse.md      ← English
content/blog/medallion-lakehouse-my.md   ← Burmese
```

The translation needs only `title` and `excerpt` (or `summary` for a project).
Date, tags, stack and the optional project blocks all come from the original, so
there's nothing to keep in sync. The site renders it behind the EN / မြန်မာ
toggle rather than giving it a page of its own.

The suffix is `-my`, not `.my`: Astro strips dots when deriving a slug from a
filename, so `foo.my.md` would become the slug `foomy`.

## What Obsidian can't edit

The site's own wording — homepage headline, page headers, author card, nav
labels, your email — lives in `src/data/site.json`, and the Now page in
`src/data/now.json`. JSON isn't something Obsidian is good at, so edit those at
**`/admin`** under *Site text*, or in a normal text editor.

Rough division: **Obsidian for writing, `/admin` for the furniture.** The About
page (`content/pages/about.md`) is markdown, so either works.

## Using the CMS instead

`/admin` edits the same files through a browser and commits to GitHub — useful
from a phone. The two are interchangeable; nothing needs to know which one wrote
a file.

One catch: the CMS commits to the branch named in `public/admin/config.yml`
(`backend.branch`). Make sure that's the branch that actually deploys.
