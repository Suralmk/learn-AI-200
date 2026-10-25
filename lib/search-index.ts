export interface SearchEntry {
  title: string;
  heading?: string;
  href: string;
  /** Group label shown in results, e.g. the learning path title. */
  section: string;
}

let indexPromise: Promise<SearchEntry[]> | null = null;

/** Fetches /search-index.json once per page load; a failed fetch is retried next time. */
export function loadSearchIndex(): Promise<SearchEntry[]> {
  indexPromise ??= fetch("/search-index.json")
    .then((r) => {
      if (!r.ok) throw new Error(`search index: ${r.status}`);
      return r.json() as Promise<SearchEntry[]>;
    })
    .catch(() => {
      indexPromise = null;
      return [];
    });
  return indexPromise;
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

type Normalized = { entry: SearchEntry; title: string; heading: string; section: string };
const normalizedIndexes = new WeakMap<SearchEntry[], Normalized[]>();

/** Lower-cased, accent-free copies of each entry's fields, computed once per index. */
function normalized(index: SearchEntry[]): Normalized[] {
  let rows = normalizedIndexes.get(index);
  if (!rows) {
    rows = index.map((entry) => ({
      entry,
      title: normalize(entry.title),
      heading: normalize(entry.heading ?? ""),
      section: normalize(entry.section),
    }));
    normalizedIndexes.set(index, rows);
  }
  return rows;
}

/** Client-safe search over a prebuilt index: every word must match. */
export function searchEntries(index: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const { entry, title, heading, section } of normalized(index)) {
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

