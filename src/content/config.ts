import { defineCollection, z } from 'astro:content';

// Two collections, one link graph.
//
// BLOG is chronological — dated posts, newest first.
// PROJECTS is evergreen — undated case studies entered by topic. Posts link
// into projects with [[wiki-links]]; every page lists what links back to it.
//
// Translations are separate files: `medallion-lakehouse.my.md` sits next to
// `medallion-lakehouse.md`. A translation only needs a title and a summary —
// everything else (date, tags, stack, blocks) is inherited from the original,
// so there's nothing to keep in sync. See src/lib/i18n.ts.

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Defaulted, not required: a half-written note in the folder must not break
    // the build. Anything without a title is treated as a draft — see
    // src/lib/content.ts.
    title: z.string().default(''),
    // Optional so a `.my.md` translation doesn't have to repeat it. Originals
    // always set it — an undated post sorts last and is obvious immediately.
    date: z.coerce.date().optional(),
    excerpt: z.string().default(''),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().default(''),
    summary: z.string().default(''),

    // Shared with blog — this is what makes /tags/<tag> list both collections
    // together, and it is the main thing tying the two halves of the site.
    tags: z.array(z.string()).default([]),

    stack: z.array(z.string()).default([]),
    status: z.enum(['active', 'shipped', 'archived']).default('shipped'),
    order: z.number().default(0),
    featured: z.boolean().default(false),

    // Optional blocks. The case study is the markdown body; these render only
    // when present, so no project is forced into a fixed shape.
    problems: z.array(z.string()).default([]),
    quality: z.array(z.string()).default([]),
    dataModelImage: z.string().optional(),
    dashboardUrl: z.string().optional(),
    repoUrl: z.string().optional(),

    draft: z.boolean().default(false),
  }),
});

// Standalone pages whose prose is long enough to want markdown rather than a
// field in site.json — currently just /about.
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    lede: z.string().optional(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  }),
});

export const collections = { blog, projects, pages };
