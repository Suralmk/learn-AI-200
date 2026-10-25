<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI-200 Learn: agent guide

Short, tool-agnostic rules for AI agents working in this repo. The full guide (architecture, component catalogue, brand, SEO, workflow) is in [CLAUDE.md](CLAUDE.md). Human contributors should read [CONTRIBUTING.md](CONTRIBUTING.md).

## What this is

A free, open-source study site for Microsoft **Exam AI-200: Developing AI Cloud Solutions on Azure** (Azure AI Cloud Developer Associate), live at https://azure.sura.work. It has Markdown study notes, JSON practice questions mapped to the 27 official objectives, and mock exams. Next.js 16 App Router, Tailwind 4, statically generated. There is no backend; progress lives in localStorage.

## Commands

```bash
npm run dev               # dev server
npm run build             # production build (fails on invalid content)
npm run lint && npm run typecheck && npm test
npm run validate:content  # add -- --verbose for template warnings
```

## Rules

- `lib/exam-outline.ts` is the single source for skill areas, weights and objectives. Don't hardcode them elsewhere.
- **Never edit, reorder or renumber the 300 original questions** (the first twelve JSON files in `content/questions/`). New questions go in `generated-*.json` with `source: "generated"` and an `objective`.
- Study pages follow `docs/content-template.md`. Paraphrase Microsoft Learn; never copy beyond short skill names; cite sources.
- Use the shared components (`components/shell`, `components/doc`, `components/quiz`, `components/viz.tsx`). Don't re-implement them.
- Colors, type and radius come from tokens in `app/globals.css`. No raw hex in components except OG images.
- Never hardcode the GitHub URL. Use `GITHUB_REPO_URL` from `lib/site.ts`, which reads `package.json`.
- Keep the non-affiliation notice ("Not affiliated with or endorsed by Microsoft…") in the footer and README. Don't use Microsoft logos.
- Canonical origin is https://azure.sura.work. Page metadata goes through `pageMetadata()` in `lib/seo.ts`.
- Before committing, run lint, typecheck, tests, `validate:content` and the build, and check UI changes in a browser at 360/768/1280 px in light and dark.
- Commits use Conventional Commits under the repo's configured author, with no co-author trailers.
