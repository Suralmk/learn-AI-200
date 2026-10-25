import { describe, expect, it } from "vitest";
import { buildStudyNav, getTopicNeighbors } from "@/lib/nav";
import { getAllTopicParams } from "@/lib/topics";

describe("study navigation", () => {
  it("groups learning paths under the four skill areas", () => {
    const nav = buildStudyNav();
    expect(nav.map((a) => a.id)).toEqual(["containers", "data-management", "azure-services", "secure-monitor"]);
    expect(nav.flatMap((a) => a.paths)).toHaveLength(9);
  });

  it("lists every topic page exactly once", () => {
    const hrefs = buildStudyNav().flatMap((a) => a.paths.flatMap((p) => p.topics.map((t) => t.href)));
    const expected = getAllTopicParams().map((t) => `/study/${t.slug}/${t.topicSlug}`);
    expect([...hrefs].sort()).toEqual([...expected].sort());
  });

  it("links neighbours across the ordered topic list", () => {
    const path = buildStudyNav()[0].paths[0];
    const { prev, next } = getTopicNeighbors(path.slug, path.topics[1].href);
    expect(prev?.href).toBe(path.topics[0].href);
    expect(next?.href).toBe(path.topics[2]?.href);
  });
});
