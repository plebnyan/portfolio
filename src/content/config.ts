import { defineCollection, z } from 'astro:content';

// BLOG — one entry per post. English lives in the Markdown body (syntax-highlighted).
// Burmese lives in the `bodyMy` field so a single CMS entry holds both languages.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),                 // English title
    titleMy: z.string().optional(),    // Burmese title
    date: z.coerce.date(),
    excerpt: z.string(),               // English summary
    excerptMy: z.string().optional(),  // Burmese summary
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    bodyMy: z.string().optional(),     // Burmese body (Markdown)
    draft: z.boolean().default(false),
  }),
});

// PROJECTS — structured to the required format: problems, data model, live viz, code & quality.
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    problems: z.array(z.string()).default([]),
    dataModelImage: z.string().optional(),   // uploaded diagram image
    dashboardUrl: z.string().optional(),     // live dashboard embed URL
    repoUrl: z.string().optional(),
    quality: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),// slugs of related projects
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
