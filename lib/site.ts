import pkg from "@/package.json";
import { EXAM } from "./exam-outline";

export const SITE_URL = "https://azure.sura.work";

export const SITE_NAME = "AI-200 Learn";

export const DEFAULT_TITLE = `${EXAM.code} Study Guide and Practice Questions · ${SITE_NAME}`;

/** Repository URL, taken from package.json so it is never guessed. */
export const GITHUB_REPO_URL = pkg.repository.url.replace(/\.git$/, "");

export const GITHUB_BRANCH = "main";

export function githubEditUrl(repoPath: string): string {
  return `${GITHUB_REPO_URL}/edit/${GITHUB_BRANCH}/${repoPath}`;
}

export function githubBlobUrl(repoPath: string): string {
  return `${GITHUB_REPO_URL}/blob/${GITHUB_BRANCH}/${repoPath}`;
}

export const CONTRIBUTING_URL = githubBlobUrl("CONTRIBUTING.md");

export const AUTHOR = { name: "Surafel Melaku", url: "https://sura.work" } as const;

export const BUY_ME_A_COFFEE_URL = "https://www.buymeacoffee.com/suralmk";

export const CONTENT_LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

export const NOT_AFFILIATED_NOTICE =
  "Not affiliated with or endorsed by Microsoft. Azure and Microsoft Learn are trademarks of Microsoft Corporation.";

export const SITE_TAGLINE =
  "Azure AI Cloud Developer Associate exam study notes, practice questions, and mock exams";

export const SITE_DESCRIPTION =
  "Free study notes, practice questions, and mock exams for Microsoft AI-200: Developing AI Cloud Solutions on Azure. Prepare for the Azure AI Cloud Developer Associate certification with guides on containers, vector databases, Azure services, security, and the Azure SDK & CLI.";

export const SITE_KEYWORDS = [
  "AI-200",
  "AI-200 exam",
  "Microsoft AI-200",
  "Azure AI Cloud Developer",
  "Azure AI Cloud Developer Associate",
  "AI Cloud Developer",
  "Developing AI Cloud Solutions",
  "Azure AI exam",
  "Azure certification study notes",
  "AI-200 study guide",
  "AI-200 practice questions",
  "AI-200 mock exam",
  "Microsoft Azure AI certification",
  "Azure Container Apps AI",
  "Azure Cosmos DB vector search",
  "Azure AI study materials",
];
