import { describe, expect, it } from "vitest";
import { EXAM, SKILL_AREAS, getAreaForPath, getObjective } from "@/lib/exam-outline";
import { getLearningPaths } from "@/lib/content";

describe("exam outline", () => {
  it("matches the October 7, 2026 skills measured", () => {
    expect(EXAM.code).toBe("AI-200");
    expect(EXAM.sourceVersion).toBe("2026-10-07");
    expect(SKILL_AREAS.map((a) => [a.id, a.weight])).toEqual([
      ["containers", "20–25%"],
      ["data-management", "30–35%"],
      ["azure-services", "20–25%"],
      ["secure-monitor", "20–25%"],
    ]);
  });

  it("lists 27 sub-objectives with unique ids", () => {
    const ids = SKILL_AREAS.flatMap((a) => a.objectives.map((o) => o.id));
    expect(ids).toHaveLength(27);
    expect(new Set(ids).size).toBe(27);
    expect(getObjective(ids[0])?.id).toBe(ids[0]);
  });

  it("assigns every learning path to exactly one skill area", () => {
    for (const path of getLearningPaths()) {
      const owners = SKILL_AREAS.filter((a) => a.pathSlugs.includes(path.slug));
      expect(owners, path.slug).toHaveLength(1);
      expect(getAreaForPath(path.slug)?.id).toBe(owners[0].id);
    }
  });
});
