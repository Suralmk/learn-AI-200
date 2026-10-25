import { describe, expect, it } from "vitest";
import { keyToOption, toggleSelection } from "@/lib/quiz-keys";

describe("quiz keyboard", () => {
  it("maps 1–9 and A–I to option indices within range", () => {
    expect(keyToOption("1", 4)).toBe(0);
    expect(keyToOption("4", 4)).toBe(3);
    expect(keyToOption("5", 4)).toBeNull();
    expect(keyToOption("a", 4)).toBe(0);
    expect(keyToOption("D", 4)).toBe(3);
    expect(keyToOption("e", 4)).toBeNull();
    expect(keyToOption("n", 4)).toBeNull();
  });

  it("replaces single selections and toggles multi-select", () => {
    expect(toggleSelection([1], 2, false)).toEqual([2]);
    expect(toggleSelection([1], 2, true)).toEqual([1, 2]);
    expect(toggleSelection([1, 2], 1, true)).toEqual([2]);
  });
});
