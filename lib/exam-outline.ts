/**
 * Single source of truth for the official AI-200 outline.
 * Source: https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-200
 * ("Skills measured as of October 7, 2026"). Objective titles are short
 * quotations of Microsoft's skill names; everything else is ours.
 */

export const EXAM = {
  code: "AI-200",
  title: "Developing AI Cloud Solutions on Azure",
  certification: "Microsoft Certified: Azure AI Cloud Developer Associate",
  sourceVersion: "2026-10-07",
  minutes: 120,
  passScore: 700,
  certificationUrl:
    "https://learn.microsoft.com/credentials/certifications/azure-ai-cloud-developer-associate/",
  studyGuideUrl:
    "https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-200",
} as const;

export type SkillAreaId =
  | "containers"
  | "data-management"
  | "azure-services"
  | "secure-monitor";

export interface Objective {
  id: string;
  title: string;
  group: string;
}

export interface SkillArea {
  id: SkillAreaId;
  /** Short label used in navigation */
  title: string;
  officialTitle: string;
  weight: string;
  description: string;
  objectives: Objective[];
  pathSlugs: string[];
}

function objectives(group: string, items: [string, string][]): Objective[] {
  return items.map(([id, title]) => ({ id, title, group }));
}

export const SKILL_AREAS: SkillArea[] = [
  {
    id: "containers",
    title: "Containerized solutions",
    officialTitle: "Develop containerized solutions on Azure",
    weight: "20–25%",
    description:
      "Container Registry, ACR Tasks, App Service containers, Container Apps, KEDA and AKS.",
    objectives: [
      ...objectives("Implement container application hosting", [
        ["acr-images", "Build, store, version, and manage container images by using Azure Container Registry"],
        ["acr-tasks", "Build and run images by using Azure Container Registry Tasks"],
        ["app-service-containers", "Deploy containers to Azure App Service, including environment variables and secrets"],
      ]),
      ...objectives("Implement container-orchestrated solutions", [
        ["aca-deploy", "Deploy applications to Azure Container Apps, including environment configuration and revision management"],
        ["aca-keda", "Implement event-driven scaling by using KEDA in Container Apps"],
        ["aks-manifests", "Deploy and manage applications to AKS by using manifest files"],
        ["containers-troubleshoot", "Monitor and troubleshoot solutions on AKS and Container Apps"],
      ]),
    ],
    pathSlugs: [
      "implement-container-application-hosting-on-azure",
      "deploy-and-manage-apps-on-azure-container-apps",
      "deploy-and-monitor-applications-on-azure-kubernetes-service",
    ],
  },
  {
    id: "data-management",
    title: "Data management for AI",
    officialTitle: "Develop AI solutions by using Azure data management services",
    // "Skills at a glance" says 30–35% and the change log says the weight
    // increased; the section heading in the guide still reads 25–30%.
    weight: "30–35%",
    description:
      "Cosmos DB for NoSQL, PostgreSQL with pgvector and Azure Managed Redis for vector search and RAG.",
    objectives: [
      ...objectives("Develop AI solutions by using Azure Cosmos DB for NoSQL", [
        ["cosmos-sdk-queries", "Connect to Azure Cosmos DB for NoSQL by using the SDK and run queries"],
        ["cosmos-ru-indexing", "Optimize query performance and RU consumption with indexing policies and consistency levels"],
        ["cosmos-vector-search", "Store and retrieve embeddings and execute vector similarity search"],
        ["cosmos-change-feed", "Implement a change feed processor to detect and handle new or updated items"],
      ]),
      ...objectives("Develop AI solutions by using Azure Database for PostgreSQL", [
        ["pg-connect-query", "Connect and query Azure Database for PostgreSQL by using SDKs"],
        ["pg-schema", "Model schemas and choose appropriate data types"],
        ["pg-indexing", "Implement indexing strategies to optimize latency and reduce pgvector compute overhead"],
        ["pg-compute", "Configure compute, memory, and storage resources for vector workloads"],
        ["pg-vector-rag", "Run vector similarity search and RAG patterns with metadata filters"],
        ["pg-connections", "Implement connection optimization to improve throughput and minimize latency"],
      ]),
      ...objectives("Integrate Azure Managed Redis in AI solutions", [
        ["redis-data-ops", "Implement Azure Managed Redis caching, expiration, and invalidation"],
        ["redis-vector", "Implement vector indexing in Azure Managed Redis for similarity search"],
      ]),
    ],
    pathSlugs: [
      "develop-ai-solutions-with-azure-cosmos-db-for-nosql",
      "develop-ai-solutions-with-azure-database-for-postgresql",
      "enhance-ai-solutions-with-azure-managed-redis",
    ],
  },
  {
    id: "azure-services",
    title: "Connect to Azure services",
    officialTitle: "Connect to and consume Azure services",
    weight: "20–25%",
    description:
      "Service Bus, Event Grid and Azure Functions for event- and message-driven AI back ends.",
    objectives: [
      ...objectives("Develop event- and message-based AI solutions", [
        ["service-bus", "Queue and process back-end operations by using Azure Service Bus, including dead-letter queues, topics, and subscriptions"],
        ["event-grid", "Implement event-driven workflows by using Azure Event Grid, including filters, custom events, and retries"],
      ]),
      ...objectives("Develop and implement Azure Functions", [
        ["functions-triggers-bindings", "Build serverless APIs, including triggers and bindings"],
        ["functions-deploy", "Configure and deploy function apps"],
      ]),
    ],
    pathSlugs: ["integrate-backend-services-for-ai-solutions"],
  },
  {
    id: "secure-monitor",
    title: "Secure, monitor & troubleshoot",
    officialTitle: "Secure, monitor, and troubleshoot Azure solutions",
    weight: "20–25%",
    description:
      "Key Vault, App Configuration, OpenTelemetry tracing and KQL for secure, observable AI apps.",
    objectives: [
      ...objectives("Implement secure Azure solutions", [
        ["key-vault", "Secure secrets by using Azure Key Vault, including rotation and retrieval"],
        ["app-configuration", "Store and retrieve configuration by using Azure App Configuration"],
      ]),
      ...objectives("Monitor and troubleshoot Azure solutions", [
        ["opentelemetry", "Trace distributed systems by using OpenTelemetry SDKs"],
        ["kql", "Write KQL queries to analyze logs and metrics"],
      ]),
    ],
    pathSlugs: [
      "manage-application-secrets-and-configuration-for-ai-solutions",
      "observe-and-troubleshoot-apps-on-azure",
    ],
  },
];

export function getSkillArea(id: SkillAreaId): SkillArea {
  const area = SKILL_AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown skill area: ${id}`);
  return area;
}

export function getAreaForPath(pathSlug: string): SkillArea | undefined {
  return SKILL_AREAS.find((a) => a.pathSlugs.includes(pathSlug));
}

export function getObjective(
  id: string
): (Objective & { areaId: SkillAreaId }) | undefined {
  for (const area of SKILL_AREAS) {
    const objective = area.objectives.find((o) => o.id === id);
    if (objective) return { ...objective, areaId: area.id };
  }
  return undefined;
}

export const ALL_OBJECTIVES = SKILL_AREAS.flatMap((a) =>
  a.objectives.map((o) => ({ ...o, areaId: a.id }))
);
