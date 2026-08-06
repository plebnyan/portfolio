import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

// Turns [[slug]] and [[slug|custom label]] in markdown into real links.
//
// Resolution happens against a map built once from the content directory, so a
// link can be written as a bare slug ([[jobnet-lakehouse]]) or qualified
// ([[projects/jobnet-lakehouse]]) when two collections share a slug.
//
// Unresolved links still render — as a dimmed span, not a dead link — so a
// [[note]] you haven't written yet is a visible placeholder rather than a 404.

const COLLECTIONS = [
  { name: 'projects', dir: 'src/content/projects', base: '/projects' },
  { name: 'blog', dir: 'src/content/blog', base: '/blog' },
];

function readFrontmatterTitle(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const t = m[1].match(/^title:\s*(.+)$/m);
  if (!t) return null;
  return t[1].trim().replace(/^["']|["']$/g, '');
}

function readFrontmatterExcerpt(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const t = m[1].match(/^(?:excerpt|summary):\s*(.+)$/m);
  if (!t) return null;
  return t[1].trim().replace(/^["']|["']$/g, '');
}

function buildMap(root) {
  const map = new Map();
  for (const c of COLLECTIONS) {
    const dir = path.join(root, c.dir);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const slug = file.replace(/\.mdx?$/, '');
      // Translations (`foo-my.md`) render inside their original's page and have
      // no URL of their own, so they must never become a link target.
      if (slug.endsWith('-my')) continue;
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const entry = {
        url: `${c.base}/${slug}/`,
        title: readFrontmatterTitle(raw) || slug,
        excerpt: readFrontmatterExcerpt(raw) || '',
        collection: c.name,
      };
      map.set(`${c.name}/${slug}`, entry);
      // Bare slug resolves to the first collection that claims it (projects
      // win, since they're the evergreen layer things link into most).
      if (!map.has(slug)) map.set(slug, entry);
    }
  }
  return map;
}

const WIKILINK = /\[\[([^\]|#]+?)(?:#([^\]|]+?))?(?:\|([^\]]+?))?\]\]/g;

export default function remarkWikilink(options = {}) {
  const root = options.root || process.cwd();

  return function transformer(tree) {
    // Rebuilt per file so adding a note in dev picks it up without a restart.
    const map = buildMap(root);

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || parent.type === 'link') return;
      const value = node.value;
      if (!value.includes('[[')) return;

      const children = [];
      let last = 0;
      let m;
      WIKILINK.lastIndex = 0;

      while ((m = WIKILINK.exec(value)) !== null) {
        const [full, rawTarget, heading, label] = m;
        if (m.index > last) {
          children.push({ type: 'text', value: value.slice(last, m.index) });
        }
        const target = rawTarget.trim();
        const hit = map.get(target) || map.get(target.toLowerCase());
        const text = (label || (hit ? hit.title : target)).trim();

        if (hit) {
          children.push({
            type: 'html',
            value:
              `<a class="wikilink" href="${hit.url}${heading ? '#' + slugifyHeading(heading) : ''}"` +
              ` data-preview-title="${esc(hit.title)}"` +
              ` data-preview-text="${esc(hit.excerpt)}"` +
              ` data-preview-kind="${hit.collection}">${esc(text)}</a>`,
          });
        } else {
          children.push({
            type: 'html',
            value: `<span class="wikilink wikilink-missing" title="Not written yet">${esc(text)}</span>`,
          });
        }
        last = m.index + full.length;
      }

      if (!children.length) return;
      if (last < value.length) children.push({ type: 'text', value: value.slice(last) });
      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugifyHeading(h) {
  return h.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}
