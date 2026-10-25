import type { DomainId } from "./domains";
import { EXAM } from "./exam-outline";
import { correctIndices } from "./answer";
import type { Question } from "./schemas";

export type Answers = Record<string, number[]>;

export interface DomainScore {
  domain: DomainId;
  correct: number;
  total: number;
}

export interface SessionScore {
  correct: number;
  total: number;
  percent: number;
  byDomain: DomainScore[];
  wrongIds: string[];
}

/** All-or-nothing: the selection must equal the set of correct options. */
export function isAnswerCorrect(q: Question, selected: number[]): boolean {
  const expected = correctIndices(q);
  const given = [...new Set(selected)].sort((a, b) => a - b);
  return given.length === expected.length && given.every((v, i) => v === expected[i]);
}

export function scoreSession(questions: Question[], answers: Answers): SessionScore {
  const byDomain = new Map<DomainId, DomainScore>();
  const wrongIds: string[] = [];
  let correct = 0;

  for (const q of questions) {
    const ok = isAnswerCorrect(q, answers[q.id] ?? []);
    const entry = byDomain.get(q.domain) ?? { domain: q.domain, correct: 0, total: 0 };
    entry.total += 1;
    if (ok) {
      entry.correct += 1;
      correct += 1;
    } else {
      wrongIds.push(q.id);
    }
    byDomain.set(q.domain, entry);
  }

  const total = questions.length;
  return {
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    byDomain: [...byDomain.values()],
    wrongIds,
  };
}

/** Rough mapping onto Microsoft's 1–1000 reporting scale (700 = pass). */
export function scaledScore(percent: number): number {
  return Math.round(Math.min(100, Math.max(0, percent)) * 10);
}

/** Scaled score from the raw ratio, so a rounded 69.7% doesn't read as 700. */
export function sessionScaledScore(score: { correct: number; total: number }): number {
  return score.total === 0 ? 0 : scaledScore((score.correct / score.total) * 100);
}

export function isPassingScore(score: { correct: number; total: number }): boolean {
  return sessionScaledScore(score) >= EXAM.passScore;
}
