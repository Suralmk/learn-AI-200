import { EXAMS, getExam, getQuestionsForExam } from "@/lib/exams";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return EXAMS.map((exam) => ({ id: exam.id }));
}

/** The exam's question pool, fetched when a session starts so it isn't inlined in the page. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const exam = getExam((await params).id);
  return exam ? Response.json(getQuestionsForExam(exam)) : new Response("Not found", { status: 404 });
}
