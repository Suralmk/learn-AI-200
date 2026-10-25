/**
 * Single source of truth for the official AI-200 outline.
 * Source: https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-200
 * ("Skills measured as of October 7, 2026"). Objective titles quote
 * Microsoft's skill names exactly; everything else is ours.
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

export const SKILL_AREA_IDS = ["containers", "data-management", "azure-services", "secure-monitor"] as const;

export type SkillAreaId = (typeof SKILL_AREA_IDS)[number];

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
  /** Share of the exam in percent, [min, max]. */
  weightRange: [number, number];
  /** Display form, e.g. "20–25%". */
  weight: string;
  description: string;
  objectives: Objective[];
  pathSlugs: string[];
}

function objectives(group: string, items: [string, string][]): Objective[] {
  return items.map(([id, title]) => ({ id, title, group }));
}

const AREAS: Omit<SkillArea, "weight">[] = [
  {
    id: "containers",
    title: "Containerized solutions",
    officialTitle: "Develop containerized solutions on Azure",
    weightRange: [20, 25],
    description:
      "Container Registry, ACR Tasks, App Service containers, Container Apps, KEDA and AKS.",
    objectives: [
      ...objectives("Implement container application hosting", [
        ["acr-images", "Build, store, version, and manage container images by using Azure Container Registry"],
        ["acr-tasks", "Build and run images by using Azure Container Registry Tasks"],
        ["app-service-containers", "Deploy containers to Azure App Service, including configuring App Service to supply environment variables and secrets"],
      ]),
      ...objectives("Implement container-orchestrated solutions", [
        ["aca-deploy", "Deploy applications to Azure Container Apps, including environment configuration and revision management"],
        ["aca-keda", "Implement event-driven scaling by using Kubernetes Event‑driven Autoscaling (KEDA) in Container Apps"],
        ["aks-manifests", "Deploy and manage applications to Azure Kubernetes Service (AKS) by using manifest files"],
        ["containers-troubleshoot", "Monitor and troubleshoot solutions on AKS and Container Apps by inspecting logs, events, and end-to-end connectivity"],
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
    weightRange: [30, 35],
    description:
      "Cosmos DB for NoSQL, PostgreSQL with pgvector and Azure Managed Redis for vector search and RAG.",
    objectives: [
      ...objectives("Develop AI solutions by using Azure Cosmos DB for NoSQL", [
        ["cosmos-sdk-queries", "Connect to Azure Cosmos DB for NoSQL by using the SDK and run queries"],
        ["cosmos-ru-indexing", "Optimize query performance and Request Units (RUs) consumption by using indexing policies and consistency levels"],
        ["cosmos-vector-search", "Store and retrieve embeddings and execute vector similarity search for semantic retrieval"],
        ["cosmos-change-feed", "Implement a change feed processor to detect and handle new or updated items"],
      ]),
      ...objectives("Develop AI solutions by using Azure Database for PostgreSQL", [
        ["pg-connect-query", "Connect and query Azure Database for PostgreSQL by using SDKs"],
        ["pg-schema", "Model schemas and implement indexing strategies, including designing tables and choosing appropriate data types"],
        ["pg-indexing", "Implement indexing strategies, including optimizing query latency and reducing pgvector compute overhead"],
        ["pg-compute", "Configure compute, memory, and storage resources to support vector workloads"],
        ["pg-vector-rag", "Run vector similarity search, including storing embeddings, semantic retrieval, and implementing retrieval-augmented generation (RAG) patterns by using metadata filter"],
        ["pg-connections", "Implement connection optimization to improve throughput and minimize latency"],
      ]),
      ...objectives("Integrate Azure Managed Redis in AI solutions", [
        ["redis-data-ops", "Implement Azure Managed Redis data operations, including caching, expiration, and invalidation"],
        ["redis-vector", "Implement vector indexing to enable similarity search"],
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
    weightRange: [20, 25],
    description:
      "Service Bus, Event Grid and Azure Functions for event- and message-driven AI back ends.",
    objectives: [
      ...objectives("Develop event- and message-based AI solutions", [
        ["service-bus", "Queue and process back-end operations by using Azure Service Bus, including dead-letter queue handling, messages, topics, and subscriptions"],
        ["event-grid", "Implement event-driven workflows by using Azure Event Grid, including filters, custom events, and retries"],
      ]),
      ...objectives("Develop and implement Azure Functions", [
        ["functions-triggers-bindings", "Build serverless APIs, including implementing triggers and bindings"],
        ["functions-deploy", "Configure and deploy function apps"],
      ]),
    ],
    pathSlugs: ["integrate-backend-services-for-ai-solutions"],
  },
  {
    id: "secure-monitor",
    title: "Secure, monitor & troubleshoot",
    officialTitle: "Secure, monitor, and troubleshoot Azure solutions",
    weightRange: [20, 25],
    description:
      "Key Vault, App Configuration, OpenTelemetry tracing and KQL for secure, observable AI apps.",
    objectives: [
      ...objectives("Implement secure Azure solutions", [
        ["key-vault", "Secure secrets by using Azure Key Vault, including rotation and retrieval"],
        ["app-configuration", "Store and retrieve app configuration information by using Azure App Configuration"],
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

export const SKILL_AREAS: SkillArea[] = AREAS.map((a) => ({
  ...a,
  weight: `${a.weightRange[0]}–${a.weightRange[1]}%`,
}));

/** Upper bound of the weight axis used by the blueprint bars. */
export const WEIGHT_SCALE = 40;

export function getSkillArea(id: SkillAreaId): SkillArea {
  const area = SKILL_AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown skill area: ${id}`);
  return area;
}

/** Like getSkillArea, but tolerates non-area domains such as "sdk-cli". */
export function findSkillArea(id: string): SkillArea | undefined {
  return SKILL_AREAS.find((a) => a.id === id);
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
