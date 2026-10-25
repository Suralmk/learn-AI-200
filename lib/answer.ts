// Zod-free answer helpers, safe to import from client components.
import type { Question } from "./schemas";

export function correctIndices(q: Pick<Question, "answer">): number[] {
  return Array.isArray(q.answer) ? [...q.answer].sort((a, b) => a - b) : [q.answer];
}

export function isMultiSelect(q: Pick<Question, "answer">): boolean {
  return Array.isArray(q.answer);
}
