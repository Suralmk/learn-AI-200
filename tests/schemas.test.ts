import { describe, expect, it } from "vitest";
import { QuestionSchema, correctIndices, parseQuestionFile } from "@/lib/schemas";
import { getAllQuestions, getObjectiveForQuestion } from "@/lib/questions";

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

  it("resolves objectives from the question or the sidecar map", () => {
    const q = QuestionSchema.parse({ ...base, answer: 0, objective: "acr-tasks" });
    expect(getObjectiveForQuestion(q)).toBe("acr-tasks");
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
