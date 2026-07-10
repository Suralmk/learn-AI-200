import { getAllQuestions } from "@/lib/questions";
import QuestionsClient from "./questions-client";

export default function QuestionsPage() {
  const questions = getAllQuestions();
  return <QuestionsClient questions={questions} />;
}
