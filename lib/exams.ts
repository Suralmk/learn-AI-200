import type { DomainId } from "./domains";
import { EXAM } from "./exam-outline";
import type { Question } from "./questions";
import { getAllQuestions } from "./questions";

export interface Exam {
  id: string;
  title: string;
  description: string;
  domains: DomainId[] | "all";
  questionCount: number;
  studySlug?: string;
  category?: "advanced";
  /** Optional countdown, offered as a toggle before starting. */
  timerMinutes?: number;
}

export const EXAMS: Exam[] = [
  {
    id: "ai200-practice-60",
    title: "AI-200 scenario practice set",
    description:
      "Comprehensive scenario-based 60-question practice exam covering Containers & AKS, Cosmos DB Vector Search, Azure Managed Redis, pgvector, Azure Functions, Identity, Key Vault, and Observability.",
    domains: "all",
    questionCount: 60,
  },
  {
    id: "full",
    title: "Full AI-200 mock exam",
    description:
      "Mixed questions across all four AI-200 skill areas, sized like the real exam.",
    domains: [
      "containers",
      "data-management",
      "azure-services",
      "secure-monitor",
    ],
    questionCount: 50,
    timerMinutes: EXAM.minutes,
  },
  {
    id: "containers",
    title: "Containerized solutions",
    description:
      "Azure Container Registry, Container Apps, AKS, and KEDA for hosting AI workloads.",
    domains: ["containers"],
    questionCount: 42,
    studySlug: "container-apps",
  },
  {
    id: "rag-on-azure",
    title: "Data management for AI",
    description:
      "Cosmos DB vector search, PostgreSQL pgvector, and Managed Redis for retrieval-augmented generation.",
    domains: ["data-management"],
    questionCount: 52,
    studySlug: "cosmos-db-ai",
  },
  {
    id: "azure-services",
    title: "Azure services integration",
    description:
      "Service Bus, Event Grid, and Azure Functions for event-driven AI pipelines.",
    domains: ["azure-services"],
    questionCount: 41,
    studySlug: "service-bus-event-grid",
  },
  {
    id: "secure-monitor",
    title: "Secure, monitor and troubleshoot",
    description:
      "Key Vault, App Configuration, OpenTelemetry, and KQL for securing and observing AI solutions.",
    domains: ["secure-monitor"],
    questionCount: 42,
    studySlug: "security-keyvault",
  },
  {
    id: "sdk-cli",
    title: "Azure SDK and Azure CLI quiz",
    description:
      "CLI commands and Python SDK classes/methods for deploying, configuring, authenticating, and troubleshooting AI solutions on Azure.",
    domains: ["sdk-cli"],
    questionCount: 63,
  },
  {
    id: "advanced",
    title: "Advanced use cases and scenarios",
    description:
      "Hard scenario-based questions covering real-world AI solution design, troubleshooting, and architecture trade-offs across all domains.",
    domains: [
      "containers",
      "data-management",
      "azure-services",
      "secure-monitor",
    ],
    questionCount: 30,
    category: "advanced",
  },
];

export function getExam(id: string): Exam | null {
  return EXAMS.find((e) => e.id === id) ?? null;
}

/** Advanced exams draw only advanced questions; the rest exclude them. */
export function getQuestionsForExam(exam: Exam): Question[] {
  const advanced = exam.category === "advanced";
  return getAllQuestions().filter(
    (q) => (q.category === "advanced") === advanced && (exam.domains === "all" || exam.domains.includes(q.domain))
  );
}

export function getExamQuestionCount(exam: Exam): number {
  return Math.min(exam.questionCount, getQuestionsForExam(exam).length);
}
