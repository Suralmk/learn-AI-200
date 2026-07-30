import type { Metadata } from "next";
import { getAllQuestions } from "@/lib/questions";
import QuestionsClient from "./questions-client";

export const metadata: Metadata = {
  title: "AI-200 Practice Questions",
  description:
    "Practice Microsoft AI-200 exam questions for Azure AI Cloud Developer Associate — MCQs and scenarios across containers, data, Azure services, security, and Azure SDK & CLI.",
  alternates: { canonical: "/questions" },
};

export default function QuestionsPage() {
  const questions = getAllQuestions();
  return <QuestionsClient questions={questions} />;
}
