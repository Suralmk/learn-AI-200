import { SKILL_AREAS, type SkillAreaId } from "./exam-outline";

/** Question domains: the four skill areas plus the cross-cutting SDK/CLI set. */
export type DomainId = SkillAreaId | "sdk-cli";

export const DOMAIN_TITLES: Record<DomainId, string> = {
  ...(Object.fromEntries(SKILL_AREAS.map((a) => [a.id, a.title])) as Record<SkillAreaId, string>),
  "sdk-cli": "Azure SDK and CLI",
};
