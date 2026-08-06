// A translation is just another markdown file sitting next to the original:
//
//   src/content/blog/medallion-lakehouse.md      ← English
//   src/content/blog/medallion-lakehouse-my.md   ← Burmese
//
// The suffix is `-my`, not `.my`: Astro strips dots when it derives a slug from
// a filename, so `foo.my.md` would collapse to the slug `foomy`.
//
// Both are real markdown, so both get full editing and preview in Obsidian and
// both run through the same remark pipeline — wiki-links, code highlighting and
// headings work identically in either language.

export const TRANSLATION_SUFFIX = '-my';

export const isTranslation = (slug: string) => slug.endsWith(TRANSLATION_SUFFIX);

export const baseSlug = (slug: string) =>
  isTranslation(slug) ? slug.slice(0, -TRANSLATION_SUFFIX.length) : slug;

export const translationSlug = (slug: string) => `${slug}${TRANSLATION_SUFFIX}`;

/** Drop translation files from any listing — they're reached via the toggle. */
export const originalsOnly = <T extends { slug: string }>(entries: T[]) =>
  entries.filter((e) => !isTranslation(e.slug));
