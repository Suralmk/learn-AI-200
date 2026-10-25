import { describe, expect, it } from "vitest";
import { QuestionSchema, correctIndices, parseQuestionFile } from "@/lib/schemas";
import { getAllQuestions } from "@/lib/questions";

const base = {
  id: "t-1",
  domain: "containers",
  type: "mcq",
  question: "Q?",
  options: ["a", "b", "c", "d"],
  explanation: "because",
};

describe("question schema", () => {
  it("loads all 300 original questions", () => {
    expect(getAllQuestions().filter((q) => q.source !== "generated").length).toBe(300);
  });

  it("rejects an answer index outside the options", () => {
    expect(QuestionSchema.safeParse({ ...base, answer: 9 }).success).toBe(false);
  });

  it("accepts multi-select answers", () => {
    const q = QuestionSchema.parse({ ...base, answer: [0, 2] });
    expect(correctIndices(q)).toEqual([0, 2]);
    expect(correctIndices({ ...q, answer: 1 })).toEqual([1]);
  });

  it("rejects duplicate ids within a file", () => {
    expect(() =>
      parseQuestionFile("x.json", [
        { ...base, answer: 0 },
        { ...base, answer: 1 },
      ])
    ).toThrow(/duplicate id t-1/i);
  });

  it("rejects an unknown objective", () => {
    expect(QuestionSchema.safeParse({ ...base, answer: 0, objective: "nope" }).success).toBe(false);
  });

  it("fills objectives for originals from the sidecar map", () => {
    const q = getAllQuestions().find((x) => x.id === "cont-001");
    expect(q?.objective).toBeTruthy();
    expect(q?.source).toBeUndefined();
  });
});

import { getLearningPaths, getStudyGuides } from "@/lib/content";
import { getAllTopicParams, getTopicNote } from "@/lib/topics";

describe("study content", () => {
  it("parses every learning path, guide and topic", () => {
    expect(getLearningPaths()).toHaveLength(9);
    expect(getStudyGuides().length).toBeGreaterThanOrEqual(8);
    for (const { slug, topicSlug } of getAllTopicParams()) {
      expect(getTopicNote(slug, topicSlug)?.title, `${slug}/${topicSlug}`).toBeTruthy();
    }
  });
});

import { TopicFrontmatterSchema } from "@/lib/schemas";

describe("topic frontmatter", () => {
  it("accepts unquoted YAML dates (parsed as Date) and normalises them", () => {
    const fm = TopicFrontmatterSchema.parse({
      title: "t", pathSlug: "p", moduleName: "m",
      last_reviewed: new Date("2026-10-25T00:00:00Z"),
      source_version: "2026-10-07",
    });
    expect(fm.last_reviewed).toBe("2026-10-25");
    expect(fm.source_version).toBe("2026-10-07");
  });
});
