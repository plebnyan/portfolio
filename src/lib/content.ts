// What counts as publishable.
//
// Writing in Obsidian means half-formed notes appear in the content folders all
// the time — a blank "Untitled.md", a stub with no frontmatter yet. Those must
// never break the build, and must never accidentally go live either. So the
// schema tolerates a missing title, and anything without one is treated as a
// draft: it builds, it just doesn't publish.

export const isPublished = ({ data }: { data: { draft?: boolean; title?: string } }) =>
  !data.draft && !!data.title?.trim();
