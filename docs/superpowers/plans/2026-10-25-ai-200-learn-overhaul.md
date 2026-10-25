# AI-200 Learn Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn AI-200 Learn into a complete, branded, validated, SEO-ready open-source study and practice site for Exam AI-200 at https://azure.sura.work.

**Architecture:** Keep Next.js 16 App Router + Markdown (gray-matter) + JSON questions. Add zod schemas behind the existing loaders, a static exam outline module as the single source for skill areas/weights/sub-objectives, client-only progress in localStorage, a build-time search index, and a shared component set (Shell, DocPage, QuizSession…). Content is expanded in place under the same files and URLs.

**Tech Stack:** Next.js 16.2, React 19.2, Tailwind 4, shadcn/base-ui, next-themes, react-markdown + remark-gfm, react-syntax-highlighter, zod, vitest, tsx, mermaid (lazy).

**Spec:** `docs/superpowers/specs/2026-10-25-ai-200-learn-overhaul-design.md`

## Global Constraints

- Canonical origin `https://azure.sura.work`; name `AI-200 Learn`; exam `AI-200`; `source_version: 2026-10-07`.
- Weights: containers 20–25%, data 30–35%, connect 20–25%, secure/monitor 20–25%.
- The 300 original questions are never edited, reordered or renumbered; new questions go in new files with `source: "generated"`.
- No Microsoft text copied verbatim beyond short skill names; cite Learn URLs.
- Footer + README: "Not affiliated with or endorsed by Microsoft. Azure and Microsoft Learn are trademarks of Microsoft Corporation."
- GitHub URL comes from `package.json` `repository.url` only.
- Commits: author suralmk, conventional messages, **no co-author trailers**. Push to `main` only with build, lint, typecheck, test green and browser-checked.
- Read `node_modules/next/dist/docs/` before using Next APIs (Next 16 differs from training data).
- Charts/stat tiles/progress visuals follow the `dataviz` skill; UI follows `impeccable`.
- AA contrast, visible focus, reduced motion respected; no horizontal page scroll at 360px.

## Review Focus

1. Shuffled options on a multi-select question must still score correctly → scoring test with `answer: [0,2]` after shuffle.
2. localStorage unavailable (private mode / throws) → progress functions return empty state, never crash render.
3. A question whose markdown contains code fences or tables renders inside an option button without breaking layout at 360px → visual check in Task 11.
4. Content with a `# H1` in the body or a fence without a language → `validate:content` fails with file + line.
5. Keyboard shortcuts must not fire while typing in the search box → QuizSession key handler ignores events from inputs.

---

## Phase 1 — Foundation

### Task 1: Tooling, site constants, exam outline

**Files:** Modify `package.json`, `lib/site.ts`, `lib/domains.ts`. Create `lib/exam-outline.ts`, `vitest.config.ts`, `tests/exam-outline.test.ts`.

**Interfaces — Produces:**
- `SITE_URL = "https://azure.sura.work"`, `SITE_NAME = "AI-200 Learn"`, `GITHUB_REPO_URL: string` (from package.json repository), `githubEditUrl(repoPath: string): string`.
- `exam-outline.ts`: `type SkillAreaId = "containers" | "data-management" | "azure-services" | "secure-monitor"`; `SKILL_AREAS: { id, title, officialTitle, weight, objectives: { id, title, group }[], pathSlugs: string[] }[]`; `getObjective(id)`, `getAreaForPath(pathSlug)`; `EXAM = { code: "AI-200", title: "Developing AI Cloud Solutions on Azure", cert: "Microsoft Certified: Azure AI Cloud Developer Associate", sourceVersion: "2026-10-07", minutes: 120, passScore: 700, studyGuideUrl }`.

- [ ] Add deps `zod`, dev deps `vitest`, `tsx`, `@vitejs/plugin-react` (if needed), scripts `typecheck: tsc --noEmit`, `test: vitest run`, `validate:content: tsx scripts/validate-content.ts`, `repository` field.
- [ ] Test: 4 areas, 27 objectives total, every learning path slug assigned to exactly one area, weights as in Global Constraints.
- [ ] Implement; `DOMAINS` weights derive from `SKILL_AREAS`; `sdk-cli` stays as cross-cutting domain.
- [ ] `npm test` passes; commit `feat: add exam outline and site constants`.

### Task 2: Schemas and validated loaders

**Files:** Create `lib/schemas.ts`, `tests/schemas.test.ts`. Modify `lib/content.ts`, `lib/topics.ts`, `lib/questions.ts`.

**Interfaces — Produces:** `QuestionSchema` (answer `number | number[]`, optional `source`, `objective`), `type Question = z.infer<…>`; `TopicFrontmatterSchema` (`title, pathSlug, moduleName, description?, last_reviewed?, source_version?, tags?, objectives?`); `LearningPathSchema`, `GuideSchema`; `correctIndices(q): number[]`; `getObjectiveForQuestion(q): string | undefined` (uses `objective` or `content/questions/objective-map.json`); `getQuestionsForObjective(id)`.

- [ ] Tests: all existing JSON parses; a question with `answer: 9` out of range fails; multi-select `[0,2]` passes; duplicate ids across files fail.
- [ ] Loaders parse with schemas and throw `Invalid content in <file>: <zod issue>`.
- [ ] Commit `feat: validate content with zod schemas`.

### Task 3: Scoring, progress, search index

**Files:** Create `lib/scoring.ts`, `lib/progress.ts`, `lib/search-index.ts` + tests. Modify `lib/utils.ts` (`shuffleQuestionOptions` handles `number[]`).

**Interfaces — Produces:**
- `isAnswerCorrect(q, selected: number[]): boolean` (all-or-nothing), `scoreSession(qs, answers: Record<string, number[]>) → { correct, total, percent, byArea: {areaId, correct, total}[] }`, `scaledScore(percent) → number` (0–1000).
- `progress.ts`: `loadProgress(storage?) → Progress`, `markVisited(href)`, `recordAttempt(setId, correct, total)`, `subscribe`; key `ai200-learn:progress:v1`; all wrapped in try/catch.
- `buildSearchIndex() → SearchEntry[]` (`{ title, heading?, href, area, kind }`), `searchEntries(index, query, limit=8)`.
- [ ] Tests for Review Focus 1 and 2; search ranks title match above heading match.
- [ ] Commit `feat: add scoring, local progress and search index`.

### Task 4: validate:content script

**Files:** Create `scripts/validate-content.ts`, `tests/validate-content.test.ts`.
- [ ] Hard errors: schema failure, `# ` H1 in body, fence without language, internal `/study/...` link that doesn't resolve, duplicate question ids. Warnings: topic below template (missing required H2s or <300 words). Exit 1 on errors.
- [ ] Fix any existing hard errors in content (fence languages) without changing meaning. Commit `chore: add content validation`.

## Phase 2 — Brand & UI

### Task 5: Tokens, fonts, logo, favicons
- [ ] `frontend-design` refinement → tokens in `app/globals.css` (primary #0177d1, coral accent, slate neutrals, success/danger/warning, chart-1..5, radius 0.625rem), light + `.dark`, AA verified. One sans + one mono via `next/font`. `Logo` without "AZURE" label; `app/icon.svg`, `app/apple-icon.png`.
- [ ] Commit `feat(ui): establish AI-200 Learn brand tokens`.

### Task 6: Shell
**Files:** `components/shell/{top-bar,sidebar,search,github-link,footer,skip-link}.tsx`, `app/layout.tsx`.
- [ ] Skip link; TopBar (logo, nav Study/Practice/Mock exams, Search ⌘K dialog, ThemeToggle, Star on GitHub); Sidebar on `/study/**` grouped by `SKILL_AREAS` → paths → topics with `ProgressBadge`; Footer with non-affiliation notice + licenses + Contribute.
- [ ] Commit `feat(ui): app shell with search and skill-area sidebar`.

### Task 7: Doc page
**Files:** `components/doc/{doc-page,toc-panel,callout,comparison-table,mermaid,prev-next,edit-on-github}.tsx`, `components/markdown-content.tsx`, `components/code-block.tsx`, study routes.
- [ ] Callouts from GFM alerts `> [!TIP]`, `> [!NOTE]`, `> [!WARNING]` (rendered as "Exam trap"); tables wrapped in own scroll container; ```mermaid lazy-rendered client-side, theme-aware; ~70ch measure; prev/next across the path; "Edit this page on GitHub"; `markVisited`.
- [ ] Commit `feat(ui): doc page layout, callouts and diagrams`.

### Task 8: Practice flow
**Files:** `components/quiz/{quiz-session,question-card,option-button,score-summary,progress-badge}.tsx`; replace `exam-session.tsx`, `exam-results.tsx`, `question-card.tsx`; routes `/questions`, `/exam/[id]`, new `/practice/[objective]`.
- [ ] Modes `practice` (immediate) / `exam` (end-of-set, optional timer). Multi-select with "Select N". Keys 1–9/A–D, Enter, N (ignored inside inputs). Review wrong answers. ScoreSummary with stat tiles + per-area bars via `dataviz`. `recordAttempt`. Confetti only if not reduced-motion.
- [ ] Commit `feat(ui): rebuilt practice and mock exam flow`.

### Task 9: Home, study index, 404, star prompt
- [ ] Home: hero, 4 skill areas with weights + progress, start CTAs, star CTA. `/study` grouped by area. `not-found.tsx` with search + links. Dismissible `StarPrompt`.
- [ ] Verify with `run` at 360/768/1280 light+dark; `impeccable-finish-reviewer`; fix. Commit + push.

## Phase 3 — Content

### Task 10: Inventory, sources, coverage map
- [ ] `scripts/content-inventory.ts` → `docs/content-inventory.md` (status per page, objectives covered). Fetch study guide + learning path/module pages sequentially (≥1s delay) to `.cache/learn/`.
- [ ] Write `objective-map.json` for originals (classification by service/keywords, reviewed).

### Task 11: Rewrite topic pages per learning path (9 batches) + guides
- [ ] Each page to template (§9 of spec), frontmatter `description`, `last_reviewed: 2026-10-25`, `source_version: 2026-10-07`, `objectives: [...]`. Preserve all existing facts/snippets. Add pages for uncovered objectives (App Service containers, Functions, App Configuration, etc.). `validate:content` clean per batch. Commit per batch `docs(content): ...`.

### Task 12: Generated questions
- [ ] For each objective with <10 questions, add to `content/questions/generated-<area>.json` (`source: "generated"`, `objective`, explanations covering every distractor; multi-select where natural). Commit `feat(content): add generated practice questions`.

## Phase 4 — SEO & performance

### Task 13: Metadata, OG, JSON-LD, sitemap
- [ ] `lib/seo.ts` `pageMetadata({ title, description, path, ogTitle })` → title `<Topic> · AI-200 Study Guide · AI-200 Learn`, description ≤155 chars (test), canonical. Per-route `opengraph-image.tsx` for topics/paths. JSON-LD: `WebSite`+`SearchAction` (`/search?q=`), `LearningResource` on topics, `Quiz` on practice, `BreadcrumbList`. `/search` page. robots/sitemap on new origin, `humans.txt`, `.well-known/security.txt`.
- [ ] Lighthouse home + topic ≥95; lazy mermaid/highlighter, quiz code-split. Commit + push.

## Phase 5 — Docs & agent instructions

### Task 14: Project docs
- [ ] README, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE (MIT), `content/LICENSE` (CC BY 4.0), `.github/ISSUE_TEMPLATE/{bug,content-error,new-question}.yml`, PR template, DESIGN.md (impeccable-documenter).

### Task 15: Agent instructions
- [ ] CLAUDE.md (real numbers), AGENTS.md (keep Next warning), `.claude/settings.json`, `.claude/commands/{add-topic,add-questions,seo-check,verify-ui}.md`.
- [ ] code-review → simplify → build/lint/typecheck/test → commit → push → verify live with Chrome.
