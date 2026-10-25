export interface SearchEntry {
  title: string;
  heading?: string;
  href: string;
  kind: "path" | "topic" | "guide" | "practice";
  /** Group label shown in results, e.g. the learning path title. */
  section: string;
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

/** Client-safe search over a prebuilt index: every word must match. */
export function searchEntries(index: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of index) {
    const title = normalize(entry.title);
    const heading = normalize(entry.heading ?? "");
    const section = normalize(entry.section);
    let score = 0;
    let all = true;
    for (const w of words) {
      if (title.includes(w)) score += title.startsWith(w) ? 12 : 10;
      else if (heading.includes(w)) score += 5;
      else if (section.includes(w)) score += 1;
      else {
        all = false;
        break;
      }
    }
    if (!all) continue;
    if (!entry.heading) score += 2; // prefer the page itself over one of its sections
    scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map((s) => s.entry);
}

