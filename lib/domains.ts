export type DomainId =
  | "containers"
  | "data-management"
  | "azure-services"
  | "secure-monitor";

export interface Domain {
  id: DomainId;
  title: string;
  weight: string;
  description: string;
}

export const DOMAINS: Domain[] = [
  {
    id: "containers",
    title: "Containerized Solutions",
    weight: "20–25%",
    description:
      "Azure Container Registry, Container Apps, AKS, and KEDA for AI workloads.",
  },
  {
    id: "data-management",
    title: "Data Management for AI",
    weight: "25–30%",
    description:
      "Cosmos DB, PostgreSQL with pgvector, and Azure Managed Redis for RAG and vector search.",
  },
  {
    id: "azure-services",
    title: "Azure Services Integration",
    weight: "20–25%",
    description:
      "Service Bus, Event Grid, and Azure Functions for event-driven AI solutions.",
  },
  {
    id: "secure-monitor",
    title: "Secure, Monitor & Troubleshoot",
    weight: "20–25%",
    description:
      "Key Vault, App Configuration, OpenTelemetry, and KQL for observability.",
  },
];

export function getDomain(id: DomainId): Domain {
  const domain = DOMAINS.find((d) => d.id === id);
  if (!domain) throw new Error(`Unknown domain: ${id}`);
  return domain;
}
