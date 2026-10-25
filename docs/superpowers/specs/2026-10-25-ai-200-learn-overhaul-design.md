# AI-200 Learn overhaul — design

Date: 2026-10-25 · Owner: suralmk · Repo: `Suralmk/learn-AI-200` (branch `main`)

## 1. Intent

AI-200 Learn is an open-source, free study and practice site for Microsoft **Exam AI-200: Developing AI Cloud Solutions on Azure**, which leads to **Microsoft Certified: Azure AI Cloud Developer Associate**. It lives at **https://azure.sura.work**.

Today the content is thin (most topic pages are 140–200 words), the UI is close to stock shadcn, components are duplicated, SEO points at the wrong domain, and there are no contributor docs or license. The goal is a site a candidate can study from end to end, that looks like a real product, ranks for "AI-200" searches, and invites contributions and GitHub stars.

**Success looks like:** every topic page meets the content template; every official sub-objective has study coverage and ≥10 practice questions; a coherent brand in light and dark; Lighthouse ≥95 (performance, accessibility, SEO, best practices) on home and a topic page; README/CONTRIBUTING/CLAUDE.md that let a newcomer (human or AI agent) contribute without asking.

## 2. Verified facts (checked 2026-10-25)

- Certification page: https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/ — exam code **AI-200**, 120 minutes, pass mark 700. The repo's "AI-200" is correct; no rename needed.
- Study guide: https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-200 — **skills measured as of October 7, 2026** (`source_version: 2026-10-07`).
- Skill areas and weights (current version):
  1. Develop containerized solutions on Azure — **20–25%**
  2. Develop AI solutions by using Azure data management services — **30–35%** (the study guide's section heading still says 25–30%, but "Skills at a glance" says 30–35% and the change log says the weight *increased*; use 30–35% and mention the discrepancy in a code comment next to the value)
  3. Connect to and consume Azure services — **20–25%**
  4. Secure, monitor, troubleshoot Azure solutions — **20–25%**
- Sub-objectives per area: see the study guide's "Skills measured" section; they include **App Service container deployment, Azure Functions (triggers/bindings, deploy), and Azure App Configuration**, which must be checked for coverage in the inventory.
- **The exam is back-end focused.** It does not cover Azure AI Foundry, Azure OpenAI, AI Search, Language, Vision, Speech, Document Intelligence or prompt flow. Do not target those keywords (an earlier brief listed them; it was wrong for this exam).

## 3. Decisions made with the owner

| Topic | Decision |
|---|---|
| App name | **AI-200 Learn** everywhere (wordmark "AI-200 **Learn**", *Learn* in blue). `lib/site.ts` currently says "Learn AI-200" — change it. |
| Canonical domain | **https://azure.sura.work**. `lib/site.ts` currently has `ai-200.sura.work` — change it; every canonical, sitemap entry and OG URL uses azure.sura.work. |
| License | **MIT for code** (`LICENSE`), **CC BY 4.0 for study notes and questions** (`content/LICENSE`, CC BY 4.0 text). README explains the split. |
| Brand direction | **"Clean product"**: today's look, sharpened (details §6). Owner confirmed the playback. |
| Order of work | 1 Foundation → 2 Brand & UI → 3 Content → 4 SEO & performance → 5 Project docs & agent instructions. Each phase is committed and browser-verified before the next. |
| Progress storage | None exists today. Add client-side only (`localStorage`), no backend. |
| Content volume | Content phase may span several sessions; CLAUDE.md records exactly where it stopped. |
| Commits | Author `suralmk` (already the configured git user). **No `Co-Authored-By` or other co-author trailers.** Conventional messages, focused per area. Push to `origin/main` (owner asked for push; no CI config exists in repo — hosting appears to build from `main` via Git integration). |

## 4. Non-goals and anti-goals

- **Non-goals:** a backend, accounts, server-side progress; other certifications (but nothing should block adding one later); rewriting the stack (stay on Next.js 16 App Router, Tailwind 4, shadcn/base-ui, Markdown + gray-matter, JSON questions).
- **Anti-goals (failure even if it "works"):**
  - Deleting, rewording or renumbering any of the **300 existing questions** (ids, `answer` index and text must be byte-stable apart from obvious typo fixes).
  - Copying Microsoft Learn text verbatim beyond short quoted skill names.
  - Looking like or implying Microsoft affiliation. Footer and README must carry: *"Not affiliated with or endorsed by Microsoft. Azure and Microsoft Learn are trademarks of Microsoft Corporation."* Drop the small "AZURE" label from the current wordmark.
  - Hardcoding a guessed GitHub URL — derive from `package.json` `repository` (add it, from `git remote`: `https://github.com/Suralmk/learn-AI-200`).
  - Claiming work in CLAUDE.md/README that wasn't actually done.

## 5. Current state (for the builder)

- Next.js **16.2.10** — `AGENTS.md` warns this version has breaking changes; read `node_modules/next/dist/docs/` before writing Next code.
- Routes: `/`, `/study`, `/study/[slug]` (learning path), `/study/[slug]/[topicSlug]` (topic), `/questions`, `/exam`, `/exam/[id]`, plus `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, `twitter-image.tsx`.
- Content: `content/study/learning-paths/*.md` (9 files, frontmatter-only: modules, description, tags, `skillFocus`, `order`), `content/study/topics/<path>/<topic>.md` (~120 topic files, mostly 140–200 words), `content/study/guides/*.md` (8 longer guides). Questions: `content/questions/*.json` — 12 files, **300 questions**, schema in `lib/questions.ts` (`id, domain, type: mcq|scenario, question, options[], answer: number, explanation, difficulty?, category?, relatedService?, relatedObjective?`). Single-answer only today.
- `lib/domains.ts` defines **5** domains (`containers, data-management, azure-services, secure-monitor, sdk-cli`) with weights that are partly out of date. `sdk-cli` is not an official skill area.
- Generator scripts `scripts/generate-*.mjs` produced some content/questions.
- Existing components: header, footer, logo, theme toggle (next-themes), code-block (react-syntax-highlighter), markdown-content (react-markdown + remark-gfm), study-toc, question-card, exam-session, exam-results, json-ld, google-analytics (react-ga4). No tests, no CI, no LICENSE, no `.github/`.

## 6. Brand ("Clean product")

- Primary blue **#0177d1** (keep). One accent: **coral** (used for exam traps, highlights, secondary chart series). Cool slate neutrals. Status: green = correct, red = incorrect, amber = warning. All text/UI pairs meet **WCAG 2.2 AA** in light and dark.
- One sans for body and headings, one monospace for code; one type scale; body ≥16px; UI text ≥11px; reading measure ~70ch.
- Radius ~10px on cards, 999px on pills; soft borders over heavy shadows; one spacing scale.
- Mark: rounded-square "A2" icon (favicon set: `icon.svg`, 32px ICO, apple-touch 180px) + wordmark component.
- **All tokens in `app/globals.css`** (CSS variables, light + `.dark`), replacing the current grey shadcn defaults, including `--chart-1..5`.
- Mockup of the chosen direction: `.superpowers/brainstorm/*/content/brand-direction.html`, card C.

## 7. Phase 1 — Foundation

- **Typed schemas with zod** for study frontmatter (learning path, topic, guide) and questions; build fails on invalid content. One content loader (`lib/content.ts`) and one question loader (`lib/questions.ts`).
- **Question schema extension (backward compatible):** `answer` may be `number` (existing) **or** `number[]` (multi-select). Add optional `source: "original" | "generated"` (absent = original), optional `topic` (topic slug for per-topic sets). Existing JSON stays valid untouched; if any data migration is needed, ship it as a script under `scripts/` and keep old content loading.
- **Domains:** align to the 4 official areas with current weights. `sdk-cli` questions keep their `domain` value in JSON (no edits to originals); map `sdk-cli` to a cross-cutting "SDK & CLI" practice set in the UI and in loaders.
- Shared components: `Shell`, `Sidebar`, `TopBar`, `Search`, `TocPanel`, `DocPage`, `Callout` (Tip / Exam trap / Note), `CodeBlock`, `ComparisonTable`, `QuestionCard`, `OptionButton`, `QuizSession`, `ScoreSummary`, `ProgressBadge`, `StarPrompt`, `GithubLink`, `Footer`, `Seo`. Pages become content + composition.
- npm scripts: `dev, build, lint, typecheck, validate:content, test`. Tests (Vitest): content validation, question schema, quiz scoring, search index.
- Add `.superpowers/` and `.cache/` to `.gitignore`.

## 8. Phase 2 — Brand & UI

- Shell: sidebar grouped by the 4 official skill areas with per-topic progress; top bar with client-side search (titles + headings, index built at build time), theme toggle, "Star on GitHub" button + GitHub link.
- Doc page: ~70ch measure, right-hand "On this page" TOC, prev/next topic, copy button on code blocks, callouts, comparison tables that scroll inside their own container on mobile (never the page), Mermaid diagrams (lazy-loaded).
- Practice flow: clear option states, multi-select, immediate vs end-of-set feedback mode, explanation panel, per-topic + overall score summary, "review wrong answers", keyboard (1–9 / A–D select, Enter submit, N next). Keep existing scoring behaviour. Charts/stat tiles/progress rings via the `dataviz` skill only.
- Open-source prompts: dismissible "If this helped, star the repo ⭐" card; "Edit this page on GitHub" on every doc page; "Contribute a question" → CONTRIBUTING.md.
- Accessibility: AA contrast, visible focus, skip link, ARIA on quiz controls, `prefers-reduced-motion` respected (including existing canvas-confetti). Responsive at 360/768/1024/1280/1440.
- Skills: `frontend-design` for the direction refinement, `impeccable` to implement/polish, `impeccable-finish-reviewer` per area, `run` to verify in a browser (screenshots at 360/768/1280, light + dark, console clean), `claude-in-chrome` for live-site before/after.

## 9. Phase 3 — Content

- **Inventory** every page: complete / partial / empty, against the template. Learning-path pages are frontmatter-driven and count as complete if they render module lists; topic pages under the template are partial.
- **Coverage map:** every study-guide sub-objective → at least one topic page. Gaps to check first: App Service container deployment, Azure Functions, Azure App Configuration, Event Grid filters/retries, Cosmos DB change feed.
- **Topic template** (frontmatter `last_reviewed`, `source_version: 2026-10-07`, tags):
  What this covers + exam weight + skills measured (short quotes) → Key concepts → How it works (Mermaid where useful) → Hands-on (portal steps, CLI, Python; C# only where the official module shows it) → Exam traps / "which service when" tables → Quick review (5–8 facts) → Practice link → Official references (exact Microsoft Learn module URLs).
- Existing complete content is restructured into the template **without losing any of it**.
- Sources: study guide + linked learning paths/modules on Microsoft Learn; fetch sequentially with a delay, respect robots.txt, cache under git-ignored `.cache/`. Paraphrase and cite.
- **Questions:** ≥10 per topic set; new ones tagged `source: "generated"`, in new files (never appended into original files); explanations say why the right answer is right and why each distractor is wrong; multi-select and case-study style where the exam uses them. No exam dumps.
- Quality: one H1, hierarchical headings, every code block has a language, every internal link resolves (checked by `validate:content`).

## 10. Phase 4 — SEO & performance

- Title pattern: `<Topic> · AI-200 Study Guide · AI-200 Learn`; per-page meta description ≤155 chars; canonical on azure.sura.work; OG + Twitter cards with a generated OG image per page; `robots.txt`, `sitemap.xml`, `lang`.
- JSON-LD: `LearningResource`/`Course` on topics, `Quiz` on practice pages, `BreadcrumbList`, `WebSite` + `SearchAction`.
- Keywords: "AI-200", "AI-200 study guide", "AI-200 practice questions", "Azure AI Cloud Developer Associate", and the real exam services (Container Apps, AKS, KEDA, ACR, Cosmos DB vector search, PostgreSQL pgvector, Azure Managed Redis, Service Bus, Event Grid, Azure Functions, Key Vault, App Configuration, OpenTelemetry, KQL).
- **URL change:** spec target is `/topics/<skill-area>/<topic-slug>`; current URLs are `/study/<path>/<topic>`. If URLs change, add permanent (308) redirects from every old URL so existing rankings carry over.
- Static generation for every doc page; quiz code-split; Mermaid and syntax highlighter lazy-loaded; fonts via `next/font`; Lighthouse ≥95 on home + one topic page. 404 returns HTTP 404.
- Keep Google Analytics (react-ga4) working.

## 11. Phase 5 — Project docs & agent instructions

- README (rewrite), CONTRIBUTING.md, CODE_OF_CONDUCT.md (Contributor Covenant), LICENSE (MIT) + `content/LICENSE` (CC BY 4.0), `.github/` issue templates (bug, content error, new question) + PR template, DESIGN.md via `impeccable-documenter`.
- `CLAUDE.md` (<300 lines): concept, dated achievements with real numbers, architecture map, component catalogue, content rules, brand rules, SEO rules, workflow rules (skills per job, scripts, verification, commits, author suralmk, no co-author trailers), do/don't, open items. **Keep the existing `@AGENTS.md` include and the Next.js 16 warning.**
- `AGENTS.md`: keep the Next.js warning at the top, add a short tool-agnostic summary, link to CLAUDE.md.
- `.claude/settings.json` with permission defaults and project commands `/add-topic`, `/add-questions`, `/seo-check`, `/verify-ui`, each pointing back to CLAUDE.md sections.
- After deploy: open azure.sura.work in Chrome, confirm changes live, OG/JSON-LD render, console clean.

## 12. Left to the builder

Font choice within "crisp sans + mono", exact coral and neutral values (subject to AA), search library (or hand-rolled index), Mermaid integration approach, test runner details, component prop shapes, file layout of new question files, how the brand mockup's details are refined during implementation.
