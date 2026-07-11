import { EXAMS, getExamQuestionCount } from "@/lib/exams";
import ExamListClient from "./exam-list-client";

export default function ExamPage() {
  const exams = EXAMS.map((exam) => ({
    ...exam,
    availableQuestions: getExamQuestionCount(exam),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Practice exams</h1>
        <p className="text-muted-foreground">
          Choose a topic-focused exam or take the full mock test. Each exam can
          be completed separately with its own score.
        </p>
      </div>

      <ExamListClient exams={exams} />
    </div>
  );
}
