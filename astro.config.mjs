import { defineConfig } from 'astro/config';
import remarkWikilink from './remark-wikilink.mjs';

// Custom domain served from GitHub Pages — root path.
export default defineConfig({
  site: 'https://nyanlynntun.com',
  // Old URLs stay alive — /work was the projects section before the rebuild.
  redirects: {
    '/work': '/projects',
    '/work/[slug]': '/projects/[slug]',
    '/work-with-me': '/about',
  },
  markdown: {
    remarkPlugins: [[remarkWikilink, { root: process.cwd() }]],
    // Dark ground, so code blocks need a dark theme to match.
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
});
