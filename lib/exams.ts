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
  category?: "advanced";
}

export const EXAMS: Exam[] = [
  {
    id: "ai200-practice-60",
    title: "Microsoft AI-200 Official Practice Set",
    description:
      "Comprehensive scenario-based 60-question practice exam covering Containers & AKS, Cosmos DB Vector Search, Azure Managed Redis, pgvector, Azure Functions, Identity, Key Vault, and Observability.",
    domains: "all",
    questionCount: 60,
  },
  {
    id: "full",
    title: "Full AI-200 Mock Exam",
    description:
      "Mixed questions across all AI-200 exam domains — simulate the full certification test.",
    domains: [
      "containers",
      "data-management",
      "azure-services",
      "secure-monitor",
    ],
    questionCount: 50,
  },
  {
    id: "containers",
    title: "Containerized Solutions",
    description:
      "Azure Container Registry, Container Apps, AKS, and KEDA for hosting AI workloads.",
    domains: ["containers"],
    questionCount: 42,
    studySlug: "container-apps",
  },
  {
    id: "rag-on-azure",
    title: "Data Management for AI",
    description:
      "Cosmos DB vector search, PostgreSQL pgvector, and Managed Redis for retrieval-augmented generation.",
    domains: ["data-management"],
    questionCount: 52,
    studySlug: "cosmos-db-ai",
  },
  {
    id: "azure-services",
    title: "Azure Services Integration",
    description:
      "Service Bus, Event Grid, and Azure Functions for event-driven AI pipelines.",
    domains: ["azure-services"],
    questionCount: 41,
    studySlug: "service-bus-event-grid",
  },
  {
    id: "secure-monitor",
    title: "Secure, Monitor & Troubleshoot",
    description:
      "Key Vault, App Configuration, OpenTelemetry, and KQL for securing and observing AI solutions.",
    domains: ["secure-monitor"],
    questionCount: 42,
    studySlug: "security-keyvault",
  },
  {
    id: "sdk-cli",
    title: "Azure SDK and Azure CLI Quiz",
    description:
      "CLI commands and Python SDK classes/methods for deploying, configuring, authenticating, and troubleshooting AI solutions on Azure.",
    domains: ["sdk-cli"],
    questionCount: 63,
  },
  {
    id: "advanced",
    title: "Advanced Use Cases & Scenarios",
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

export function getQuestionsForExam(exam: Exam): Question[] {
  const all = getAllQuestions();

  if (exam.category === "advanced") {
    return all.filter(
      (q) =>
        q.category === "advanced" &&
        (exam.domains === "all" || exam.domains.includes(q.domain))
    );
  }

  if (exam.domains === "all") {
    return all.filter((q) => q.category !== "advanced");
  }

  return all.filter(
    (q) => exam.domains.includes(q.domain) && q.category !== "advanced"
  );
}

export function getExamQuestionCount(exam: Exam): number {
  const available = getQuestionsForExam(exam).length;
  return Math.min(exam.questionCount, available);
}
