import type { Metadata } from "next";
import { EXAMS, getExamQuestionCount } from "@/lib/exams";
import ExamListClient from "./exam-list-client";

export const metadata: Metadata = {
  title: "AI-200 Mock Exams & Practice Tests",
  description:
    "Take free Microsoft AI-200 mock exams and topic practice tests for the Azure AI Cloud Developer Associate certification. Full exam plus domain-focused quizzes.",
  alternates: { canonical: "/exam" },
};

export default function ExamPage() {
  const exams = EXAMS.map((exam) => ({
    ...exam,
    availableQuestions: getExamQuestionCount(exam),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">
          AI-200 Mock Exams & Practice Tests
        </h1>
        <p className="text-muted-foreground">
          Choose a topic-focused exam or take the full Microsoft AI-200 mock
          test for Azure AI Cloud Developer Associate. Each exam can be
          completed separately with its own score.
        </p>
      </div>

      <ExamListClient exams={exams} />
    </div>
  );
}
