@AGENTS.md

# AI-200 Learn: guide for Claude Code

The single source of truth for working on this repo. Human contributors: [CONTRIBUTING.md](CONTRIBUTING.md). Other AI tools: [AGENTS.md](AGENTS.md). Visual system: [DESIGN.md](DESIGN.md). Product context: [PRODUCT.md](PRODUCT.md).

## Project concept

- **What:** a free, open-source study and practice site for Microsoft **Exam AI-200: Developing AI Cloud Solutions on Azure**, which leads to **Microsoft Certified: Azure AI Cloud Developer Associate**. It has study notes, practice questions mapped to every official objective, and mock exams.
- **Verified exam facts:** 120 minutes, pass score 700/1000. Skills measured as of **October 7, 2026** (`EXAM.sourceVersion = "2026-10-07"`). Four skill areas:
  - Containers 20–25%
  - Data management 30–35%. The study guide's section heading still says 25–30%, but its at-a-glance list and change log say 30–35%.
  - Connect to services 20–25%
  - Secure/monitor 20–25%
- **27 objectives**, all in `lib/exam-outline.ts`.
- **It is a back-end exam**: containers, data services, messaging, Functions, Key Vault, App Configuration, OpenTelemetry and KQL. It is not Azure OpenAI or Foundry.
- **Live:** https://azure.sura.work (canonical). Repo: `Suralmk/learn-AI-200`. `main` deploys through the host's Git integration; there is no CI workflow in the repo.
- **Non-affiliation:** footer and README carry "Not affiliated with or endorsed by Microsoft. Azure and Microsoft Learn are trademarks of Microsoft Corporation." Never use Microsoft logos or official-sounding names (for example "Official Practice Set").
- **Open source:** code under MIT (`LICENSE`), notes and questions under CC BY 4.0 (`content/LICENSE`). The site asks for GitHub stars, "Edit this page" and contributed questions.

## What has been achieved

### 2026-10-25 overhaul

Spec: `docs/superpowers/specs/2026-10-25-ai-200-learn-overhaul-design.md`. Plan: `docs/superpowers/plans/2026-10-25-ai-200-learn-overhaul.md`.

- **Content:**
  - All **129** existing topic pages and all **8** guides rewritten into the template. Most were 140–200-word stubs.
  - **8 new topic pages**, for **137** in total:
    - Build and run images with ACR Tasks
    - Explore Container Apps environments
    - Configure health probes and rolling updates (AKS)
    - Implement a change feed processor with a lease container
    - Build serverless APIs with Azure Functions triggers and bindings
    - Configure and deploy function apps
    - Refresh configuration dynamically and use snapshots
    - Configure compute and storage for vector workloads
  - `validate:content` reports 0 errors and 0 template warnings.
  - Paraphrased source notes were cached in the git-ignored `.cache/learn/`.
- **Questions:** **376** in total, the **300 originals untouched** plus **76 generated** (`source: "generated"`, 14 of them multi-select).
  - Every one of the 27 objectives has ≥10 questions.
  - 247 originals are mapped through `content/questions/objective-map.json`; 53 stay unmapped (generic SDK/CLI, Durable Functions, Event Hubs).
- **Brand:**
  - "AI-200 Learn", in the owner-chosen "Clean product" direction.
  - Tokens in `app/globals.css`, IBM Plex Sans and Mono.
  - Logo mark made of blueprint weight bars.
  - Light and dark themes. Chart colors were validated with the dataviz palette script.
- **UI:**
  - App shell with search (Ctrl K or /) and a skill-area sidebar showing reading progress.
  - Doc pages with an on-page TOC, callouts, Mermaid diagrams, copy buttons, prev/next and "Edit on GitHub".
  - Practice by objective (`/practice/<id>`), and mock exams with a timer, a scaled score, per-area accuracy and review of wrong answers.
  - Keyboard support (1–9 or A–D, Enter, N, and arrow keys in single-answer groups).
  - Home page, study index and 404 page.
  - Microsoft logos removed.
- **SEO:**
  - `pageMetadata()` gives every page its title, a description of ≤155 characters, a canonical URL on azure.sura.work, and OG/Twitter tags.
  - Generated OG images for the site, each path or guide, each topic and each practice set.
  - JSON-LD: WebSite with SearchAction plus Course site-wide; LearningResource on topics; Quiz on practice pages; BreadcrumbList.
  - `sitemap.xml`, `robots.txt`, `humans.txt`, `/.well-known/security.txt`. The 404 page returns HTTP 404.
- **Quality:**
  - zod-validated content.
  - 46 Vitest tests in 13 files.
  - Lint, typecheck and build are clean.
- **Local Lighthouse (production build, mobile, simulated throttling)**, taken on unloaded runs with benchmark index ≈2000. Under load the same pages scored 55–65; see Open items.

  | Page | Performance | Accessibility | Best practices | SEO |
  |---|---|---|---|---|
  | Home | 95 | 100 | 100 | 100 |
  | Topic page | 92 | 100 | 100 | 100 |
  | Practice page | 92 | 100 | 100 | 100 |

## Architecture map

```text
app/                        Routes (App Router, all statically generated)
  page.tsx                  Home
  study/                    layout (sidebar), index, [slug] (learning path or guide), [slug]/[topicSlug] (topic)
  practice/[objective]/     Practice set per objective (+ opengraph-image)
  questions/                Practice hub (objectives by area)
  exam/, exam/[id]/         Mock exams; exam/[id]/questions.json serves the pool (fetched on Start)
  search/, search-index.json/  Search page; build-time index JSON
  sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx, layout.tsx, globals.css
components/
  shell/                    TopBar, Search, Sidebar, Footer, GithubStarButton/GithubLink, SearchResults
  doc/                      DocPage, Breadcrumbs, TocPanel, Callout, ComparisonTable, Mermaid, PrevNext, PathProgress, VisitTracker
  quiz/                     QuizSession, QuestionCard, OptionButton, ScoreSummary, Countdown, SetBest
  seo/json-ld.tsx           SiteJsonLd, TopicJsonLd, QuizJsonLd, BreadcrumbJsonLd
  viz.tsx                   Meter, BlueprintBars, StatTile, AccuracyBars
  markdown-content.tsx, code-block.tsx, copy-button.tsx, star-prompt.tsx, logo.tsx, theme-toggle.tsx, ui/button.tsx
content/study/              learning-paths/*.md (frontmatter only), topics/<path>/*.md, guides/*.md
content/questions/          12 original JSON files (read-only), generated-*.json, objective-map.json
lib/                        exam-outline, site, schemas (zod), answer, content, topics, questions, exams, nav,
                            toc, scoring, progress (+use-progress), search-index(+build), seo, og, remark-alerts,
                            quiz-keys, prism-theme, validate-content, domains, utils
scripts/                    validate-content.ts, questions/count-objectives.ts
tests/                      Vitest unit tests
docs/                       content-template.md, superpowers/ (spec, plan), images/
```

**Content pipeline:** Markdown/JSON → `gray-matter` → zod schema (`lib/schemas.ts`) → cached loader (`lib/content.ts`, `lib/topics.ts`, `lib/questions.ts`) → nav/search/sitemap/routes. A schema error throws, so `npm run build` and `validate:content` fail on broken content. `lib/exam-outline.ts` is the only place the areas, weights and objectives are defined.

## Component catalogue

Use these; don't re-implement them.

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `TopBar` | Logo, main nav, search, star, theme, mobile menu | `star` | root layout |
| `Search` | Ctrl K dialog over `/search-index.json` | `className` | TopBar |
| `Sidebar` | Skill areas → paths → topics, read marks, path meters | `nav` | study layout |
| `Footer` | Links, non-affiliation notice, licenses | none | root layout |
| `DocPage` | Breadcrumbs, H1, lead, objective pills, body, TOC, edit link, prev/next, visit tracking | `href, title, content, crumbs, repoPath, objectives, …` | topic and guide pages |
| `Breadcrumbs` | Visible trail and BreadcrumbList JSON-LD from one list | `crumbs, currentPath` | all detail pages |
| `MarkdownContent` | Markdown with callouts, tables, Mermaid, code, internal Links | `content, variant: "doc" \| "compact"` | DocPage, quiz |
| `Callout` | `> [!TIP]`, `> [!NOTE]`, `> [!WARNING]` (shown as "Exam trap") | `kind` | via remark-alerts |
| `CodeBlock` / `CopyButton` | Highlighted on the server (hook-free) plus a client copy island | `code, language` | MarkdownContent |
| `ComparisonTable` | Tables scroll inside their own frame | children | MarkdownContent |
| `Mermaid` | Lazy, theme-aware diagrams, rendered when near the viewport | `code` | MarkdownContent |
| `QuizSession` | Intro → run → results → review. Feedback per question or at the end, timer, keyboard, progress | `setId, questions \| questionsUrl, count, defaultFeedback, timerMinutes, showAreas` | practice, exam |
| `QuestionCard` / `OptionButton` | Memoized question with radio/checkbox semantics and roving tabindex | `question, selected, revealed, onSelect` | QuizSession |
| `ScoreSummary` | Scaled score vs 700, stat tiles, accuracy bars | `score, showAreas` | QuizSession |
| `Countdown` | Self-ticking timer that reads the clock | `endsAt, onExpire` | QuizSession |
| `Meter`, `BlueprintBars`, `StatTile`, `AccuracyBars` | Data visuals (dataviz rules) | see `components/viz.tsx` | sidebar, home, results |
| `StarPrompt` | "If this helped, star the repo" (the card variant is dismissible) | `variant` | home, study index |
| `GithubStarButton`, `GithubLink` | Repo links from `GITHUB_REPO_URL` | `label` | TopBar, footer |
| `Button` | shadcn/base-ui button. Use `render={<Link/>}` for links that look like buttons | `variant, size` | everywhere |

**Theming:** CSS variables in `app/globals.css` for `:root` (light) and `.dark` (navy). next-themes sets the class. Don't use raw hex in components; `lib/og.tsx` is the one exception, because OG images can't read CSS variables.

## Content rules

- **Template:** every topic page follows [docs/content-template.md](docs/content-template.md), with these H2s in order:
  1. What this covers
  2. Key concepts
  3. How it works
  4. Hands-on
  5. Exam traps
  6. Quick review
  7. Practice
  8. Official references
- No `#` H1 in the body. Every code fence has a language.
- **Frontmatter:** `title`, `pathSlug`, `moduleName`, `description` (≤155 chars, unique), `last_reviewed`, `source_version`, `tags`, `objectives`. Guides use `domain` and `order` instead of `pathSlug`/`moduleName`.
- **New topic:** the filename must equal `slugify(title)`, and the title must be listed under a module in the learning-path file. Otherwise it is appended after the module topics.
- **Sources:** paraphrase Microsoft Learn and never copy beyond short skill names. Link the exact modules and docs under "Official references". If Learn is wrong, say so and show the correct behavior. Several pages already do this.
- **Questions:**
  - Schema is in `lib/schemas.ts`. `answer` is a number, or `number[]` for multi-select ("Select two." in the text).
  - New questions carry `objective` and `source: "generated"` and live in `generated-<area>.json`.
  - Every explanation addresses every option.
  - Minimum **10 per objective**. Check with `npx tsx scripts/questions/count-objectives.ts`.

## Brand and design rules

- **Color:**
  - Primary `#0177d1` (dark `#3b9cff`).
  - Coral `#f0643a` only for exam traps and small highlights; text uses `--coral-ink`.
  - Green means correct, crimson incorrect, amber warning. All three ship with an icon and text.
  - Slate neutrals; navy dark mode `#0a1220`.
- **Type:** IBM Plex Sans (400/500/600) and IBM Plex Mono (400, not preloaded). 1.25 scale from 16px. Body ≥16px, UI text ≥11px, reading measure 70ch.
- **Radius:** 6px controls, 10px panels and options, pills only for tags and status.
- **Signature:** blueprint weight bars. Lists are rows with hairline dividers, not card grids. No eyebrow labels, no "→" tails on links.
- **Accessibility:** AA contrast (use `text-primary-strong` on `bg-primary-soft`), visible 2px focus outline, skip link, reduced motion respected (confetti included), no horizontal scroll from 360px.
- Full system: [DESIGN.md](DESIGN.md).

## SEO rules

- **Titles** go through `pageMetadata()` in `lib/seo.ts`:
  - Study pages: `<Title> · AI-200 Study Guide · AI-200 Learn`
  - Practice pages: `Practice: <objective> · AI-200 Practice Questions · AI-200 Learn`
  - Exam pages use their own suffix.
- **Descriptions** are ≤155 chars (`clampDescription`) and unique per page.
- **Canonical:** absolute URL on `https://azure.sura.work` (`SITE_URL`). URLs keep the `/study/<path>/<topic>` scheme. Don't change URLs without 308 redirects.
- **JSON-LD:** WebSite + SearchAction and Course (layout); LearningResource (topics); Quiz (practice); BreadcrumbList via `<Breadcrumbs>`.
- **Keywords:** use "AI-200", "AI-200 study guide" and "practice questions", plus the real exam services (Container Apps, AKS, KEDA, ACR, Cosmos DB vector search, pgvector, Azure Managed Redis, Service Bus, Event Grid, Azure Functions, Key Vault, App Configuration, OpenTelemetry, KQL) in H1/H2s and descriptions. Don't target Azure OpenAI or Foundry keywords; they aren't on this exam.
- **Every new page** must pass `validate:content` and have a title, description and OG image. Route-level `opengraph-image.tsx` uses `renderOgImage()`.

## Workflow rules

- **Skills, by job:**
  - `superpowers:brainstorming` first for new features
  - `frontend-design:frontend-design` for visual direction
  - `impeccable:impeccable` to build and polish UI
  - `impeccable:impeccable-finish-reviewer` to review a finished area
  - `impeccable:impeccable-documenter` for DESIGN.md
  - `dataviz` for every chart, meter or stat tile
  - `run` to verify in a browser
  - `claude-in-chrome` for the live site
  - `superpowers:systematic-debugging` for failures
  - `code-review`, then `simplify`, before every commit
- **Scripts:** `dev`, `build`, `lint`, `typecheck`, `validate:content` (`-- --verbose`), `test`.
- **Verification:** run the app and screenshot changed routes at 360, 768 and 1280 px in light and dark. Check console errors and horizontal overflow. Drive the quiz flow if quiz code changed. `/verify-ui` automates this.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs(content):`, `refactor:`, `chore:`). Author **suralmk** (the repo's configured user). **No `Co-Authored-By` or other co-author trailers.** Push to `main` only with lint, typecheck, tests, `validate:content` and build green.
- **Project commands:** `/add-topic`, `/add-questions`, `/seo-check`, `/verify-ui` (in `.claude/commands/`).

## Do / Don't

- **Do** add exam facts to `lib/exam-outline.ts` and derive everything else from it, including counts in copy.
- **Do** use `GITHUB_REPO_URL`, `githubEditUrl`, `githubBlobUrl` and `CONTRIBUTING_URL` from `lib/site.ts`.
- **Do** keep heavy client work lazy: Mermaid is lazy, exam pools are fetched on Start, and Google Analytics loads on first interaction.
- **Don't** edit, reword, reorder or renumber the 300 original questions. `.claude/settings.json` denies edits to those files. Report suspected errors instead.
- **Don't** hardcode the GitHub URL, site name, author, license URL or exam numbers.
- **Don't** copy Microsoft text verbatim, or imply Microsoft endorsement.
- **Don't** hand-style charts outside `components/viz.tsx` and the dataviz rules.
- **Don't** add a backend for progress. It lives in `localStorage` (`ai200-learn:progress:v1`: `visited`, `sets[setId] = {attempts, bestPercent}`).

## Open items and roadmap

- **Possibly wrong original questions.** Not edited, by rule; a maintainer should decide on each:
  - cont-001: the KEDA scaler type is `azure-servicebus`
  - practice-024: `ORDER BY VectorDistance` doesn't need `ASC`
  - practice-001: the build-stage base doesn't shrink the final image
  - practice-037: HNSW uses more memory than FLAT
  - data-103: indexing doesn't change point-read RU cost
  - svc-010: the Standard tier message limit is 256 KB
  - sdk-050: two options are correct
  - Outdated premises: cont-005, practice-034, cont-121, practice-028
- **Performance:**
  - Confirm Lighthouse ≥95 on the live site; local runs under CPU load scored 55–65.
  - Remaining levers:
    - pre-render quiz Markdown to HTML at build time, so react-markdown and Prism leave the quiz bundle
    - make the sidebar's large link list server-rendered
    - lazy-load the search dialog
- **Analytics:** Google Analytics loads on first interaction, so visits with no interaction aren't counted.
- **Missing content:** Learn modules not yet covered are Durable Functions (backend path) and Container Apps dynamic sessions.
- **Content structure:** the "Troubleshoot container apps" module in `implement-container-application-hosting-on-azure` mixes App Service topics.
- **Design ideas** from the finish review (not done):
  - a one-row blueprint bar on area headers and on the phone hero
  - a tighter home hero bottom padding
- **Infrastructure:** add a CI workflow (lint, typecheck, test, validate:content, build) on pull requests.
