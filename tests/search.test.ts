import { describe, expect, it } from "vitest";
import { searchEntries, type SearchEntry } from "@/lib/search-index";
import { buildSearchIndex } from "@/lib/search-index-build";

describe("search index", () => {
  it("indexes topics, paths and guides with headings", () => {
    const index = buildSearchIndex();
    expect(index.some((e) => e.kind === "path")).toBe(true);
    expect(index.some((e) => e.kind === "topic" && e.heading)).toBe(true);
    expect(index.every((e) => e.href.startsWith("/"))).toBe(true);
  });

  it("ranks title matches above heading matches", () => {
    const index: SearchEntry[] = [
      { title: "Monitor logs", heading: "KEDA scalers", href: "/a#keda", kind: "topic", section: "x" },
      { title: "KEDA scaling", href: "/b", kind: "topic", section: "x" },
    ];
    expect(searchEntries(index, "keda")[0].href).toBe("/b");
  });

  it("matches every word, case-insensitively", () => {
    const index: SearchEntry[] = [
      { title: "Cosmos DB vector search", href: "/c", kind: "topic", section: "x" },
      { title: "Cosmos DB change feed", href: "/d", kind: "topic", section: "x" },
    ];
    expect(searchEntries(index, "COSMOS vector").map((e) => e.href)).toEqual(["/c"]);
    expect(searchEntries(index, "  ")).toEqual([]);
  });
});
