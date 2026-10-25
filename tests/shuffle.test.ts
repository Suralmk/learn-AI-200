import { describe, expect, it } from "vitest";
import { shuffleQuestionOptions } from "@/lib/utils";
import { correctIndices, type Question } from "@/lib/schemas";

const q: Question = {
  id: "m-1", domain: "containers", type: "mcq", question: "Pick two",
  options: ["right-1", "wrong-1", "right-2", "wrong-2", "wrong-3"],
  answer: [0, 2], explanation: "x",
};

describe("shuffleQuestionOptions", () => {
  it("keeps multi-select answers pointing at the same option text", () => {
    for (let i = 0; i < 50; i++) {
      const s = shuffleQuestionOptions(q);
      expect(correctIndices(s).map((k) => s.options[k]).sort()).toEqual(["right-1", "right-2"]);
    }
  });

  it("keeps single answers pointing at the same option text", () => {
    const single = { ...q, answer: 3 };
    for (let i = 0; i < 20; i++) {
      const s = shuffleQuestionOptions(single);
      expect(s.options[s.answer as number]).toBe("wrong-2");
    }
  });
});

describe("questions whose explanation names option letters", () => {
  it("keeps the original option order so 'Why C is correct' still matches", () => {
    const lettered = { ...q, answer: 2, explanation: "**Why C is correct:** … **Why A is wrong:** …" };
    for (let i = 0; i < 20; i++) {
      const s = shuffleQuestionOptions(lettered);
      expect(s.options).toEqual(lettered.options);
      expect(s.answer).toBe(2);
    }
  });

  it("still shuffles explanations that don't mention letters", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) seen.add(shuffleQuestionOptions(q).options.join("|"));
    expect(seen.size).toBeGreaterThan(1);
  });
});
