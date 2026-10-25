import fs from "fs";
import path from "path";
import type { DomainId } from "./domains";
import { parseQuestionFile, type Question } from "./schemas";

export type { Question } from "./schemas";
export type QuestionType = Question["type"];
export type Difficulty = NonNullable<Question["difficulty"]>;
export type QuestionCategory = NonNullable<Question["category"]>;

const QUESTIONS_DIR = path.join(process.cwd(), "content", "questions");
/** Maps original question ids to objectives without editing the originals. */
const OBJECTIVE_MAP_FILE = "objective-map.json";

let cache: Question[] | null = null;
let objectiveMap: Record<string, string> | null = null;

export function getAllQuestions(): Question[] {
  if (cache) return cache;
  if (!fs.existsSync(QUESTIONS_DIR)) return [];

  const files = fs
    .readdirSync(QUESTIONS_DIR)
    .filter((f) => f.endsWith(".json") && f !== OBJECTIVE_MAP_FILE)
    .sort();

  const questions: Question[] = [];
  const owner = new Map<string, string>();

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), "utf-8"));
    for (const q of parseQuestionFile(file, raw)) {
      const previous = owner.get(q.id);
      if (previous) {
        throw new Error(`Invalid content: duplicate id ${q.id} in ${previous} and ${file}`);
      }
      owner.set(q.id, file);
      questions.push(q);
    }
  }

  cache = questions;
  return questions;
}

function getObjectiveMap(): Record<string, string> {
  if (objectiveMap) return objectiveMap;
  const file = path.join(QUESTIONS_DIR, OBJECTIVE_MAP_FILE);
  objectiveMap = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : {};
  return objectiveMap!;
}

export function getObjectiveForQuestion(q: Question): string | undefined {
  return q.objective ?? getObjectiveMap()[q.id];
}

export function getQuestionsForObjective(objectiveId: string): Question[] {
  return getAllQuestions().filter((q) => getObjectiveForQuestion(q) === objectiveId);
}

export function getQuestionsByDomain(domain: DomainId): Question[] {
  return getAllQuestions().filter((q) => q.domain === domain);
}

export function getQuestionById(id: string): Question | null {
  return getAllQuestions().find((q) => q.id === id) ?? null;
}
