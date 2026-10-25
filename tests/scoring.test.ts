import { describe, expect, it } from "vitest";
import { isAnswerCorrect, scaledScore, scoreSession } from "@/lib/scoring";
import type { Question } from "@/lib/schemas";

const mk = (id: string, domain: Question["domain"], answer: Question["answer"]): Question => ({
  id, domain, answer, type: "mcq", question: "q", options: ["a", "b", "c", "d"], explanation: "e",
});

describe("scoring", () => {
  it("scores single-answer questions", () => {
    expect(isAnswerCorrect(mk("1", "containers", 2), [2])).toBe(true);
    expect(isAnswerCorrect(mk("1", "containers", 2), [1])).toBe(false);
    expect(isAnswerCorrect(mk("1", "containers", 2), [])).toBe(false);
  });

  it("scores multi-select all-or-nothing, order-insensitive", () => {
    const q = mk("m", "containers", [0, 3]);
    expect(isAnswerCorrect(q, [3, 0])).toBe(true);
    expect(isAnswerCorrect(q, [0])).toBe(false);
    expect(isAnswerCorrect(q, [0, 1, 3])).toBe(false);
  });

  it("summarises a session by domain", () => {
    const qs = [mk("a", "containers", 0), mk("b", "containers", 1), mk("c", "secure-monitor", 2)];
    const s = scoreSession(qs, { a: [0], b: [0], c: [2] });
    expect(s).toMatchObject({ correct: 2, total: 3, percent: 67 });
    expect(s.byDomain).toEqual([
      { domain: "containers", correct: 1, total: 2 },
      { domain: "secure-monitor", correct: 1, total: 1 },
    ]);
    expect(s.wrongIds).toEqual(["b"]);
  });

  it("maps percent to the 1000-point scale", () => {
    expect(scaledScore(70)).toBe(700);
    expect(scaledScore(0)).toBe(0);
    expect(scaledScore(100)).toBe(1000);
  });
});
