import { z } from "zod";
import { ALL_OBJECTIVES, SKILL_AREA_IDS } from "./exam-outline";

const objectiveIds = new Set(ALL_OBJECTIVES.map((o) => o.id));

export const ObjectiveIdSchema = z
  .string()
  .refine((id) => objectiveIds.has(id), (id) => ({
    message: `Unknown objective "${id}" (see lib/exam-outline.ts)`,
  }));

export const DomainIdSchema = z.enum([...SKILL_AREA_IDS, "sdk-cli"]);

export const QuestionSchema = z
  .object({
    id: z.string().min(1),
    domain: DomainIdSchema,
    type: z.enum(["mcq", "scenario"]),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    /** Index of the correct option, or several indices for multi-select. */
    answer: z.union([z.number().int(), z.array(z.number().int()).min(2)]),
    explanation: z.string().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    category: z.literal("advanced").optional(),
    relatedService: z.string().optional(),
    relatedObjective: z.string().optional(),
    /** Absent means part of the original hand-written set. */
    source: z.enum(["original", "generated"]).optional(),
    objective: ObjectiveIdSchema.optional(),
  })
  .superRefine((q, ctx) => {
    const indices = Array.isArray(q.answer) ? q.answer : [q.answer];
    for (const i of indices) {
      if (i < 0 || i >= q.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["answer"],
          message: `answer ${i} is outside options 0..${q.options.length - 1}`,
        });
      }
    }
    if (new Set(indices).size !== indices.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["answer"],
        message: "answer contains duplicates",
      });
    }
  });

export type Question = z.infer<typeof QuestionSchema>;

export { correctIndices, isMultiSelect } from "./answer";

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
}

export function parseQuestionFile(file: string, data: unknown): Question[] {
  const parsed = z.array(z.unknown()).safeParse(data);
  if (!parsed.success) throw new Error(`Invalid content in ${file}: expected an array`);

  const seen = new Set<string>();
  return parsed.data.map((raw, index) => {
    const result = QuestionSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(`Invalid content in ${file} [${index}]: ${formatIssues(result.error)}`);
    }
    if (seen.has(result.data.id)) {
      throw new Error(`Invalid content in ${file}: duplicate id ${result.data.id}`);
    }
    seen.add(result.data.id);
    return result.data;
  });
}

/** YAML turns unquoted 2026-10-25 into a Date; accept both and normalise to a string. */
const isoDate = z.preprocess(
  (v) => (v instanceof Date && !Number.isNaN(v.getTime()) ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD")
);

export const TopicFrontmatterSchema = z.object({
  title: z.string().min(1),
  pathSlug: z.string().min(1),
  moduleName: z.string().min(1),
  description: z.string().max(160).optional(),
  last_reviewed: isoDate.optional(),
  source_version: isoDate.optional(),
  tags: z.array(z.string()).optional(),
  objectives: z.array(ObjectiveIdSchema).optional(),
});

export const GuideFrontmatterSchema = z.object({
  title: z.string().min(1),
  domain: DomainIdSchema,
  description: z.string().min(1),
  order: z.number().default(99),
  last_reviewed: isoDate.optional(),
  source_version: isoDate.optional(),
  objectives: z.array(ObjectiveIdSchema).optional(),
});

export const LearningModuleSchema = z.object({
  name: z.string().min(1),
  duration: z.string().default(""),
  description: z.string().default(""),
  topics: z.array(z.string()).default([]),
});

export const LearningPathFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  certification: z.string().default("AI-200"),
  duration: z.string().default(""),
  level: z.string().default(""),
  description: z.string().default(""),
  tags: z.array(z.string()).default([]),
  filterTags: z.array(z.string()).default([]),
  skillFocus: z.enum(["ai-development", "vector-databases", "observability", "security"]),
  order: z.number().default(99),
  modules: z.array(LearningModuleSchema),
});

export function parseFrontmatter<T extends z.ZodTypeAny>(
  schema: T,
  file: string,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid frontmatter in ${file}: ${formatIssues(result.error)}`);
  }
  return result.data;
}
