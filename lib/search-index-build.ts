import { getStudyGuides } from "./content";
import { buildStudyNav } from "./nav";
import type { SearchEntry } from "./search-index";
import { pageToc } from "./toc";
import { getAllTopicNotes } from "./topics";

/** Build-time index over titles and H2 headings of all study content, in reading order. */
export function buildSearchIndex(): SearchEntry[] {
  const notes = new Map(getAllTopicNotes().map((n) => [n.href, n]));
  const page = (title: string, href: string, section: string, content: string): SearchEntry[] => [
    { title, href, section },
    ...pageToc(content).map((h) => ({ title, heading: h.title, href: `${href}#${h.id}`, section })),
  ];

  return [
    ...buildStudyNav().flatMap((area) =>
      area.paths.flatMap((path) => [
        { title: path.title, href: path.href, section: "Learning path" },
        ...path.topics.flatMap((t) => page(t.title, t.href, path.title, notes.get(t.href)?.content ?? "")),
      ])
    ),
    ...getStudyGuides().flatMap((g) => page(g.title, `/study/${g.slug}`, "Quick reference", g.content)),
  ];
}
