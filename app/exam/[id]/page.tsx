import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ExamSession } from "@/components/exam-session";
import { Button } from "@/components/ui/button";
import { getExam, getQuestionsForExam, EXAMS } from "@/lib/exams";

export function generateStaticParams() {
  return EXAMS.map((exam) => ({ id: exam.id }));
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getExam(id);

  if (!exam) notFound();

  const questions = getQuestionsForExam(exam);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        render={<Link href="/exam" />}
      >
        <ArrowLeft data-icon="inline-start" />
        All exams
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">{exam.title}</h1>
        <p className="text-muted-foreground">{exam.description}</p>
      </div>

      <ExamSession
        exam={exam}
        questions={questions}
        studySlug={exam.studySlug}
      />
    </div>
  );
}
