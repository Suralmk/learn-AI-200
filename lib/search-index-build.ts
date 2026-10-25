import { getLearningPaths, getStudyGuides } from "./content";
import { extractToc } from "./toc";
import { getTopicNote, getTopicSlugsForPath } from "./topics";
import type { SearchEntry } from "./search-index";

/** Build-time index over titles and H2 headings of all study content. */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const path of getLearningPaths()) {
    entries.push({ title: path.title, href: `/study/${path.slug}`, kind: "path", section: "Learning path" });
    for (const topicSlug of getTopicSlugsForPath(path.slug)) {
      const note = getTopicNote(path.slug, topicSlug);
      if (!note) continue;
      const href = `/study/${path.slug}/${topicSlug}`;
      entries.push({ title: note.title, href, kind: "topic", section: path.title });
      for (const item of extractToc(note.content)) {
        entries.push({ title: note.title, heading: item.title, href: `${href}#${item.id}`, kind: "topic", section: path.title });
      }
    }
  }

  for (const guide of getStudyGuides()) {
    const href = `/study/${guide.slug}`;
    entries.push({ title: guide.title, href, kind: "guide", section: "Quick reference" });
    for (const item of extractToc(guide.content)) {
      entries.push({ title: guide.title, heading: item.title, href: `${href}#${item.id}`, kind: "guide", section: "Quick reference" });
    }
  }

  return entries;
}
