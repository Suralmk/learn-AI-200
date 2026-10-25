import type { DomainScore } from "./scoring";

/** Browser-only study progress. Never required for the page to render. */
export interface Progress {
  visited: Record<string, number>;
  sets: Record<
    string,
    { attempts: number; bestPercent: number; lastPercent: number; lastAt: number }
  >;
  domains: Record<string, { correct: number; total: number }>;
}

export const PROGRESS_KEY = "ai200-learn:progress:v1";

export function emptyProgress(): Progress {
  return { visited: {}, sets: {}, domains: {} };
}

type StorageGetter = () => Storage | undefined;

const browserStorage: StorageGetter = () =>
  typeof window === "undefined" ? undefined : window.localStorage;

export function createProgressStore(getStorage: StorageGetter = browserStorage) {
  const listeners = new Set<() => void>();
  let snapshot: Progress | null = null;

  function read(): Progress {
    try {
      const raw = getStorage()?.getItem(PROGRESS_KEY);
      if (!raw) return emptyProgress();
      const parsed = JSON.parse(raw) as Partial<Progress>;
      return { ...emptyProgress(), ...parsed };
    } catch {
      return emptyProgress();
    }
  }

  function write(next: Progress) {
    snapshot = next;
    try {
      getStorage()?.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch {
      // Private mode or quota: keep the in-memory snapshot only.
    }
    listeners.forEach((l) => l());
  }

  function load(): Progress {
    if (!snapshot) snapshot = read();
    return snapshot;
  }

  return {
    load,
    markVisited(href: string) {
      const p = load();
      if (p.visited[href]) return;
      write({ ...p, visited: { ...p.visited, [href]: Date.now() } });
    },
    recordAttempt(
      setId: string,
      result: { correct: number; total: number; byDomain: DomainScore[] }
    ) {
      const p = load();
      const percent = result.total ? Math.round((result.correct / result.total) * 100) : 0;
      const prev = p.sets[setId];
      const domains = { ...p.domains };
      for (const d of result.byDomain) {
        const cur = domains[d.domain] ?? { correct: 0, total: 0 };
        domains[d.domain] = { correct: cur.correct + d.correct, total: cur.total + d.total };
      }
      write({
        ...p,
        domains,
        sets: {
          ...p.sets,
          [setId]: {
            attempts: (prev?.attempts ?? 0) + 1,
            bestPercent: Math.max(prev?.bestPercent ?? 0, percent),
            lastPercent: percent,
            lastAt: Date.now(),
          },
        },
      });
    },
    reset() {
      write(emptyProgress());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type ProgressStore = ReturnType<typeof createProgressStore>;

/** Shared browser store; use through `useProgress()`. */
export const progressStore = createProgressStore();
