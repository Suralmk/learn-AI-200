import { describe, expect, it } from "vitest";
import { createProgressStore, emptyProgress } from "@/lib/progress";

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
  };
}

const throwing = {
  getItem() { throw new Error("denied"); },
  setItem() { throw new Error("denied"); },
} as unknown as Storage;

describe("progress store", () => {
  it("records visits and attempts", () => {
    const store = createProgressStore(() => memoryStorage());
    store.markVisited("/study/a/b");
    store.recordAttempt("exam:full", 70);
    store.recordAttempt("exam:full", 50);
    const p = store.load();
    expect(p.visited["/study/a/b"]).toBeTypeOf("number");
    expect(p.sets["exam:full"]).toEqual({ attempts: 2, bestPercent: 70 });
  });

  it("survives storage that throws", () => {
    const store = createProgressStore(() => throwing);
    expect(() => store.markVisited("/x")).not.toThrow();
    // Keeps the visit in memory for this page session…
    expect(store.load().visited["/x"]).toBeTypeOf("number");
    // …and a fresh store starts empty instead of crashing.
    expect(createProgressStore(() => throwing).load()).toEqual(emptyProgress());
  });

  it("survives a missing storage (server render)", () => {
    const store = createProgressStore(() => undefined);
    expect(store.load()).toEqual(emptyProgress());
  });

  it("replaces null or non-object fields with empty ones", () => {
    const s = memoryStorage();
    s.setItem("ai200-learn:progress:v1", JSON.stringify({ visited: null, sets: [1, 2] }));
    expect(createProgressStore(() => s).load()).toEqual(emptyProgress());
  });

  it("ignores corrupted JSON", () => {
    const s = memoryStorage();
    s.setItem("ai200-learn:progress:v1", "{not json");
    expect(createProgressStore(() => s).load()).toEqual(emptyProgress());
  });
});
