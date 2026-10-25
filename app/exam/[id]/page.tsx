import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizSession } from "@/components/quiz/quiz-session";
import { Breadcrumbs } from "@/components/doc/breadcrumbs";
import { EXAM } from "@/lib/exam-outline";
import { EXAMS, getExam, getExamQuestionCount } from "@/lib/exams";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return EXAMS.map((exam) => ({ id: exam.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const exam = getExam(id);
  if (!exam) return {};
  return pageMetadata({ title: exam.title, suffix: `${EXAM.code} Practice Test`, description: exam.description, path: `/exam/${id}` });
}

export default async function ExamDetailPage({ params }: Props) {
  const { id } = await params;
  const exam = getExam(id);
  if (!exam) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 lg:py-12">

      <Breadcrumbs crumbs={[{ label: "Mock exams", href: "/exam" }, { label: exam.title }]} currentPath={`/exam/${id}`} />
      <header className="mb-10 max-w-[62ch]">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{exam.title}</h1>
        <p className="mt-3 text-muted-foreground">{exam.description}</p>
      </header>
      <QuizSession
        setId={`exam:${exam.id}`}
        questionsUrl={`/exam/${exam.id}/questions.json`}
        count={getExamQuestionCount(exam)}
        defaultFeedback="end"
        timerMinutes={exam.timerMinutes}
        showAreas={exam.domains === "all" || exam.domains.length > 1}
        backHref="/exam"
        backLabel="All mock exams"
      />
    </div>
  );
}
