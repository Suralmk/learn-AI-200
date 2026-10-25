import { slugify } from "./slugify";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

/**
 * Heading id generator shared with MarkdownContent: slugified text, with
 * "-2", "-3"… for repeats across all h2/h3 in document order.
 */
export function createIdFactory() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count > 0 ? `${base}-${count + 1}` : base;
  };
}

/** Heading source → the text MarkdownContent renders (drops inline markup). */
function plainText(markdown: string): string {
  return markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

/** "On this page" items for a Markdown body: h2 headings, ids as rendered. */
export function pageToc(content: string): TocItem[] {
  return extractToc(stripTocSection(content));
}

/** Extract h2 headings for a table of contents, skipping "Table of contents". */
function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const nextId = createIdFactory();

  let fence: string | null = null;

  for (const line of content.split("\n")) {
    // Skip fenced code: "## " there is a comment, not a heading, and counting
    // it would shift the duplicate-id suffixes MarkdownContent assigns.
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (fence === null) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const title = plainText(match[2].replace(/#+$/, ""));
    if (/^table of contents$/i.test(title)) continue;
    const id = nextId(title);

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
