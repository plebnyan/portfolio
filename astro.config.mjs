import { defineConfig } from 'astro/config';

// Custom domain served from GitHub Pages — root path.
export default defineConfig({
  site: 'https://nyanlynntun.com',
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
