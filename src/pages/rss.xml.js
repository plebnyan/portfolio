import { isPublished } from '../lib/content';
import { getCollection } from 'astro:content';
import { originalsOnly } from '../lib/i18n';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(context) {
  const site = context.site?.href?.replace(/\/$/, '') ?? 'https://nyanlynntun.com';

  const posts = originalsOnly(await getCollection('blog', isPublished))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${site}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}/</guid>
      <description>${esc(p.data.excerpt)}</description>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
${p.data.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nyan Lynn Tun — Data Engineer</title>
    <link>${site}/</link>
    <description>Writing on lakehouse architecture, pipelines, and building data platforms.</description>
    <language>en</language>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
