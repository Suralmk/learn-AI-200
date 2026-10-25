import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizSession } from "@/components/quiz/quiz-session";
import { Breadcrumbs } from "@/components/doc/breadcrumbs";
import { QuizJsonLd } from "@/components/seo/json-ld";
import { ALL_OBJECTIVES, EXAM, getObjective, getSkillArea } from "@/lib/exam-outline";
import { getQuestionsForObjective } from "@/lib/questions";
import { correctIndices } from "@/lib/answer";
import { clampDescription, pageMetadata } from "@/lib/seo";
import { getTopicNotesForObjective } from "@/lib/topics";

type Props = { params: Promise<{ objective: string }> };

export function generateStaticParams() {
  return ALL_OBJECTIVES.map((o) => ({ objective: o.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { objective } = await params;
  const o = getObjective(objective);
  if (!o) return {};
  const n = getQuestionsForObjective(objective).length;
  return pageMetadata({
    title: `Practice: ${clampDescription(o.title, 64)}`,
    suffix: `${EXAM.code} Practice Questions`,
    description: `${n} free ${EXAM.code} practice questions with explanations for "${o.title}".`,
    path: `/practice/${objective}`,
  });
}

export default async function PracticeObjectivePage({ params }: Props) {
  const { objective } = await params;
  const o = getObjective(objective);
  if (!o) notFound();
  const area = getSkillArea(o.areaId);
  const questions = getQuestionsForObjective(objective);
  const notes = getTopicNotesForObjective(objective).slice(0, 6);
  const path = `/practice/${objective}`;

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-8 lg:py-12">

      <QuizJsonLd
        name={`${EXAM.code} practice: ${o.title}`}
        path={path}
        about={o.title}
        questions={questions.slice(0, 10).map((q) => ({ question: q.question, options: q.options, correct: correctIndices(q), explanation: q.explanation }))}
      />
      <Breadcrumbs
        crumbs={[{ label: "Practice", href: "/questions" }, { label: area.title, href: `/questions#area-${area.id}` }, { label: o.group }]}
        currentPath={path}
      />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <header className="mb-10 max-w-[70ch]">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{o.title}</h1>
            <p className="mt-4 text-muted-foreground">
              {questions.length} questions in the {area.title} area, which is {area.weight} of the exam.
            </p>
          </header>
          <QuizSession setId={`objective:${objective}`} questions={questions} backHref="/questions" backLabel="All practice sets" />
        </div>
        {notes.length > 0 && (
          <aside aria-labelledby="notes-heading" className="lg:pt-24">
            <h2 id="notes-heading" className="text-sm font-semibold text-foreground">Study notes for this objective</h2>
            <ul className="mt-3 space-y-1">
              {notes.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="block rounded-md py-1.5 text-sm text-muted-foreground hover:text-primary">
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
