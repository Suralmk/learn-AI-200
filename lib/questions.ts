import fs from "fs";
import path from "path";
import type { DomainId } from "./domains";

export type QuestionType = "mcq" | "scenario";

export interface Question {
  id: string;
  domain: DomainId;
  type: QuestionType;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QUESTIONS_DIR = path.join(process.cwd(), "content", "questions");

export function getAllQuestions(): Question[] {
  if (!fs.existsSync(QUESTIONS_DIR)) return [];

  const files = fs
    .readdirSync(QUESTIONS_DIR)
    .filter((f) => f.endsWith(".json"));

  const questions: Question[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(QUESTIONS_DIR, file), "utf-8");
    const parsed = JSON.parse(raw) as Question[];
    questions.push(...parsed);
  }

  return questions;
}

export function getQuestionsByDomain(domain: DomainId): Question[] {
  return getAllQuestions().filter((q) => q.domain === domain);
}

export function getQuestionById(id: string): Question | null {
  return getAllQuestions().find((q) => q.id === id) ?? null;
}
