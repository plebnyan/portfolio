import { getCollection } from 'astro:content';
import { isPublished } from '../lib/content';
import { isTranslation, baseSlug } from '../lib/i18n';

// A flat search index built at build time. Small enough to ship as one file and
// filter in the browser — no search service, no server, no request per keystroke.
//
// Translations are folded into their original's entry rather than listed
// separately, so searching in Burmese finds the post but the result points at
// the one page that actually exists.

const strip = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, ' ')       // fenced code
    .replace(/`[^`]*`/g, ' ')              // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, '$2$1') // wiki-links → their text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')              // markdown links → their text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')    // heading markers
    .replace(/[*_>#-]/g, ' ')              // leftover syntax
    .replace(/\s+/g, ' ')
    .trim();

export async function GET() {
  const [posts, projects] = await Promise.all([
    getCollection('blog', isPublished),
    getCollection('projects', isPublished),
  ]);

  const build = (entries, collection) => {
    const originals = entries.filter((e) => !isTranslation(e.slug));
    const translations = entries.filter((e) => isTranslation(e.slug));

    return originals.map((e) => {
      const tr = translations.find((t) => baseSlug(t.slug) === e.slug);
      const d = e.data;
      // A project's substance is as much in its frontmatter as its body — the
      // stack, the problems, the quality points all need to be findable.
      const fields = [
        ...(d.stack ?? []),
        ...(d.problems ?? []),
        ...(d.quality ?? []),
      ].join(' ');
      return {
        title: d.title,
        titleMy: tr?.data.title ?? '',
        summary: d.excerpt ?? d.summary ?? '',
        tags: d.tags ?? [],
        collection,
        url: `/${collection}/${e.slug}/`,
        date: d.date ? d.date.toISOString().slice(0, 10) : '',
        // Cap the body so the index stays small; the opening of a page is
        // where the searchable substance usually is anyway.
        text: (fields ? fields + ' ' : '') + strip(e.body).slice(0, 4000),
        textMy: tr ? strip(tr.body).slice(0, 4000) : '',
      };
    });
  };

  const index = [...build(projects, 'projects'), ...build(posts, 'blog')];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
