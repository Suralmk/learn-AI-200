import { describe, expect, it } from "vitest";
import { clampDescription, pageMetadata } from "@/lib/seo";

describe("seo", () => {
  it("builds the topic title pattern and canonical", () => {
    const m = pageMetadata({ title: "KEDA scale rules", description: "x", path: "/study/a/b" });
    expect(m.title).toEqual({ absolute: "KEDA scale rules · AI-200 Study Guide · AI-200 Learn" });
    expect(m.alternates?.canonical).toBe("https://azure.sura.work/study/a/b");
    expect(m.openGraph?.url).toBe("https://azure.sura.work/study/a/b");
  });

  it("clamps descriptions to 155 characters on a word boundary", () => {
    const long = "word ".repeat(60).trim();
    const d = clampDescription(long);
    expect(d.length).toBeLessThanOrEqual(155);
    expect(d.endsWith("…")).toBe(true);
    expect(d).not.toMatch(/\s…$/);
    expect(clampDescription("short one")).toBe("short one");
  });
});
