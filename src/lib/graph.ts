import { isPublished } from './content';
import { getCollection, type CollectionEntry } from 'astro:content';
import { isTranslation } from './i18n';

// The link graph, computed at build time from the raw markdown of both
// collections. Backlinks are therefore static HTML — no client JS, no runtime
// cost, and a page knows what links to it without anyone maintaining a list.

export type Node = {
  key: string;              // "projects/jobnet-lakehouse"
  collection: 'blog' | 'projects';
  slug: string;
  url: string;
  title: string;
  excerpt: string;
  tags: string[];
  date?: Date;
};

const WIKILINK = /\[\[([^\]|#]+?)(?:#[^\]|]+?)?(?:\|[^\]]+?)?\]\]/g;

let cache: { nodes: Node[]; backlinks: Map<string, Node[]> } | null = null;

function toNode(
  collection: 'blog' | 'projects',
  e: CollectionEntry<'blog'> | CollectionEntry<'projects'>
): Node {
  const d: any = e.data;
  return {
    key: `${collection}/${e.slug}`,
    collection,
    slug: e.slug,
    url: `/${collection}/${e.slug}/`,
    title: d.title,
    excerpt: d.excerpt ?? d.summary ?? '',
    tags: d.tags ?? [],
    date: d.date,
  };
}

export async function buildGraph() {
  if (cache) return cache;

  // Translations share their original's URL, so they are not separate nodes.
  const posts = (await getCollection('blog', isPublished)).filter((e) => !isTranslation(e.slug));
  const projects = (await getCollection('projects', isPublished)).filter((e) => !isTranslation(e.slug));

  const nodes: Node[] = [
    ...projects.map((p) => toNode('projects', p)),
    ...posts.map((p) => toNode('blog', p)),
  ];

  // Same resolution rule as the remark plugin: qualified key first, then bare
  // slug, with projects winning a tie.
  const byKey = new Map<string, Node>();
  for (const n of nodes) byKey.set(n.key, n);
  const bySlug = new Map<string, Node>();
  for (const n of nodes) if (!bySlug.has(n.slug)) bySlug.set(n.slug, n);

  const resolve = (target: string) => {
    const t = target.trim();
    return byKey.get(t) ?? bySlug.get(t) ?? bySlug.get(t.toLowerCase()) ?? null;
  };

  const backlinks = new Map<string, Node[]>();
  const raw = [
    ...projects.map((p) => [toNode('projects', p), p.body] as const),
    ...posts.map((p) => [toNode('blog', p), p.body] as const),
  ];

  for (const [source, body] of raw) {
    const seen = new Set<string>();
    let m;
    WIKILINK.lastIndex = 0;
    while ((m = WIKILINK.exec(body)) !== null) {
      const hit = resolve(m[1]);
      if (!hit || hit.key === source.key || seen.has(hit.key)) continue;
      seen.add(hit.key);
      const list = backlinks.get(hit.key) ?? [];
      list.push(source);
      backlinks.set(hit.key, list);
    }
  }

  cache = { nodes, backlinks };
  return cache;
}

export async function getBacklinks(collection: 'blog' | 'projects', slug: string) {
  const { backlinks } = await buildGraph();
  return backlinks.get(`${collection}/${slug}`) ?? [];
}

export async function getAllTags() {
  const { nodes } = await buildGraph();
  const counts = new Map<string, { tag: string; total: number; posts: number; projects: number }>();
  for (const n of nodes) {
    for (const t of n.tags) {
      const row = counts.get(t) ?? { tag: t, total: 0, posts: 0, projects: 0 };
      row.total++;
      if (n.collection === 'blog') row.posts++;
      else row.projects++;
      counts.set(t, row);
    }
  }
  return [...counts.values()].sort((a, b) => b.total - a.total || a.tag.localeCompare(b.tag));
}

export async function getNodesForTag(tag: string) {
  const { nodes } = await buildGraph();
  return nodes.filter((n) => n.tags.includes(tag));
}
