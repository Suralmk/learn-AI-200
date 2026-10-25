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
