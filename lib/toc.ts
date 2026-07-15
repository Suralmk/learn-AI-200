import { slugify } from "./slugify";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

/**
 * Extract h2 headings for a table of contents, skipping "Table of contents".
 * IDs match MarkdownContent (slugify over all h2/h3 in document order).
 */
export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();

  for (const line of content.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const title = match[2].replace(/#+$/, "").trim();
    if (/^table of contents$/i.test(title)) continue;

    let id = slugify(title);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    // Only list top-level sections in the sticky TOC
    if (level === 2) {
      items.push({ id, title, level });
    }
  }

  return items;
}

/** Remove the markdown "Table of contents" section from content. */
export function stripTocSection(content: string): string {
  return content
    .replace(/^##\s+Table of contents[\s\S]*?(?=^##\s)/im, "")
    .replace(/\n{3,}/g, "\n\n");
}
