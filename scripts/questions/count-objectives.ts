// Prints original / generated / total questions per objective.
// Run: npx tsx scripts/questions/count-objectives.ts
import { ALL_OBJECTIVES } from "../../lib/exam-outline";
import { getAllQuestions } from "../../lib/questions";

const questions = getAllQuestions();
const rows = ALL_OBJECTIVES.map((o) => {
  const set = questions.filter((q) => q.objective === o.id);
  const generated = set.filter((q) => q.source === "generated").length;
  return { objective: o.id, original: set.length - generated, generated, total: set.length };
});

console.table(rows);
const unmapped = questions.filter((q) => !q.objective).length;
console.log(`${questions.length} questions, ${unmapped} without an objective, ${rows.filter((r) => r.total < 10).length} objectives under 10.`);
