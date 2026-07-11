import type { DomainId } from "./domains";
import type { Question } from "./questions";
import { getAllQuestions } from "./questions";

export interface Exam {
  id: string;
  title: string;
  description: string;
  domains: DomainId[] | "all";
  questionCount: number;
  studySlug?: string;
}

export const EXAMS: Exam[] = [
  {
    id: "full",
    title: "Full AI-200 Mock Exam",
    description:
      "Random questions across all four exam domains — simulate the full certification test.",
    domains: "all",
    questionCount: 20,
  },
  {
    id: "containers",
    title: "Containerized Solutions",
    description:
      "Azure Container Registry, Container Apps, AKS, and KEDA for hosting AI workloads.",
    domains: ["containers"],
    questionCount: 10,
    studySlug: "container-apps",
  },
  {
    id: "rag-on-azure",
    title: "RAG on Azure",
    description:
      "Cosmos DB vector search, PostgreSQL pgvector, and Managed Redis for retrieval-augmented generation.",
    domains: ["data-management"],
    questionCount: 10,
    studySlug: "cosmos-db-ai",
  },
  {
    id: "azure-services",
    title: "Azure Services Integration",
    description:
      "Service Bus, Event Grid, and Azure Functions for event-driven AI pipelines.",
    domains: ["azure-services"],
    questionCount: 10,
    studySlug: "service-bus-event-grid",
  },
  {
    id: "secure-monitor",
    title: "Secure, Monitor & Troubleshoot",
    description:
      "Key Vault, App Configuration, OpenTelemetry, and KQL for securing and observing AI solutions.",
    domains: ["secure-monitor"],
    questionCount: 10,
    studySlug: "security-keyvault",
  },
];

export function getExam(id: string): Exam | null {
  return EXAMS.find((e) => e.id === id) ?? null;
}

export function getQuestionsForExam(exam: Exam): Question[] {
  const all = getAllQuestions();
  if (exam.domains === "all") return all;
  return all.filter((q) => exam.domains.includes(q.domain));
}

export function getExamQuestionCount(exam: Exam): number {
  const available = getQuestionsForExam(exam).length;
  return Math.min(exam.questionCount, available);
}
