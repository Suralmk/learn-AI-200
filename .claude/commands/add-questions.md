---
description: Add practice questions for an exam objective
argument-hint: <objective-id> [count]
---

Add practice questions for objective: $ARGUMENTS

Follow CLAUDE.md, "Content rules" (question schema, `source: "generated"`, explanation rules) and the Do/Don't list.

1. Look up the objective in `lib/exam-outline.ts` and count its current questions:
   `npx tsx scripts/questions/count-objectives.ts`
2. Read the matching study pages (frontmatter `objectives` includes the id) so new questions match what the notes teach.
3. Append questions to `content/questions/generated-<areaId>.json` (create it if missing). Ids: `gen-<objectiveId>-NN`, continuing the existing numbering. Each question has `domain` = area id, `objective`, `source: "generated"`, `difficulty`, `relatedService`, and `relatedObjective` (the official title). Roughly 1 in 5 should be multi-select (`answer: [i, j]`, with "Select two." in the text).
4. Every `explanation` explains why the correct option(s) are right and why each other option is wrong.
5. **Never edit, reorder or delete the 300 original questions** (the first twelve JSON files). If an original looks wrong, list it in your report instead.
6. Run `npx vitest run tests/schemas.test.ts` and `npm run validate:content`.
7. Commit as `feat(content): add <n> questions for <objective>`, with no co-author trailers.
