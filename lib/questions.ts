import fs from "fs";
import path from "path";
import { parseQuestionFile, type Question } from "./schemas";

export type { Question } from "./schemas";

const QUESTIONS_DIR = path.join(process.cwd(), "content", "questions");
/** Maps original question ids to objectives without editing the originals. */
const OBJECTIVE_MAP_FILE = "objective-map.json";

let cache: Question[] | null = null;

export function readObjectiveMap(): Record<string, string> {
  const file = path.join(QUESTIONS_DIR, OBJECTIVE_MAP_FILE);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : {};
}

/** All questions, validated, with `objective` filled in from the sidecar map. */
export function getAllQuestions(): Question[] {
  if (cache) return cache;
  if (!fs.existsSync(QUESTIONS_DIR)) return [];

  const objectiveMap = readObjectiveMap();
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
      const objective = q.objective ?? objectiveMap[q.id];
      questions.push(objective ? { ...q, objective } : q);
    }
  }

  cache = questions;
  return questions;
}

export function getQuestionsForObjective(objectiveId: string): Question[] {
  return getAllQuestions().filter((q) => q.objective === objectiveId);
}
