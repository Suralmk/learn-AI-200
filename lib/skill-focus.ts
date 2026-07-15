export type SkillFocusId =
  | "ai-development"
  | "vector-databases"
  | "observability"
  | "security";

export interface SkillFocus {
  id: SkillFocusId;
  title: string;
  description: string;
  pathSlugs: string[];
}

export const SKILL_FOCUS_AREAS: SkillFocus[] = [
  {
    id: "ai-development",
    title: "AI Solution Development & Integration",
    description:
      "Build and integrate AI solutions on Azure by leveraging containerized compute, event-driven AI pipelines, and serverless functions for scalable AI deployments.",
    pathSlugs: [
      "implement-container-application-hosting-on-azure",
      "deploy-and-manage-apps-on-azure-container-apps",
      "deploy-and-monitor-applications-on-azure-kubernetes-service",
      "integrate-backend-services-for-ai-solutions",
    ],
  },
  {
    id: "vector-databases",
    title: "Vector Database Management",
    description:
      "Configure and manage vector-enabled databases on Azure for efficient storage, retrieval, and processing of large-scale AI models and datasets.",
    pathSlugs: [
      "develop-ai-solutions-with-azure-cosmos-db-for-nosql",
      "develop-ai-solutions-with-azure-database-for-postgresql",
      "enhance-ai-solutions-with-azure-managed-redis",
    ],
  },
  {
    id: "observability",
    title: "Distributed Observability & Monitoring",
    description:
      "Implement distributed observability for AI solutions, ensuring comprehensive monitoring and performance tracking across cloud-based applications and models.",
    pathSlugs: ["observe-and-troubleshoot-apps-on-azure"],
  },
  {
    id: "security",
    title: "AI Security & Secret Management",
    description:
      "Manage sensitive data and secrets for AI applications by utilizing Azure's secret management tools, ensuring secure access to AI models and resources across the development lifecycle.",
    pathSlugs: [
      "manage-application-secrets-and-configuration-for-ai-solutions",
    ],
  },
];

export function getSkillFocus(id: SkillFocusId): SkillFocus {
  const area = SKILL_FOCUS_AREAS.find((s) => s.id === id);
  if (!area) throw new Error(`Unknown skill focus: ${id}`);
  return area;
}

export function getPathsForSkillFocus(id: SkillFocusId): string[] {
  return getSkillFocus(id).pathSlugs;
}
