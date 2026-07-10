import { ExamSession } from "@/components/exam-session";
import { getAllQuestions } from "@/lib/questions";

export default function ExamPage() {
  const questions = getAllQuestions();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Mock exam</h1>
        <p className="text-muted-foreground">
          Simulate the AI-200 exam with a random set of questions across all
          domains. Review your score by domain when finished.
        </p>
      </div>

      <ExamSession questions={questions} />
    </div>
  );
}
