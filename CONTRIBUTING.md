# Contributing to AI-200 Learn

Thanks for helping other candidates prepare for Exam AI-200. Fixes to notes, new practice questions, and UI improvements are all welcome.

If you use an AI coding agent, point it at [CLAUDE.md](CLAUDE.md) (or [AGENTS.md](AGENTS.md) for other tools). They hold the project rules and the component catalogue.

## Set up

Requires Node.js 20 or later.

```bash
git clone https://github.com/Suralmk/learn-AI-200.git
cd learn-AI-200
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also validates content through the loaders) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run validate:content` | Checks frontmatter, question schema, headings, code fences and internal links. Add `-- --verbose` to list template warnings |
| `npm test` | Vitest unit tests (schemas, scoring, search, navigation, validation) |

## Branches and commits

- Branch from `main`: `content/<topic>`, `questions/<objective>`, `fix/<thing>`, `feat/<thing>`.
- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`. Content changes use `docs(content): …`.
- Keep pull requests focused: one learning path or one feature at a time.

## Editing study notes

Notes live in `content/study/`:

- `learning-paths/<path>.md`: frontmatter only (modules and their topic titles). A topic file's name must equal the slug of its title in `modules[].topics`.
- `topics/<path>/<topic>.md`: one page per topic.
- `guides/<guide>.md`: quick-reference guides per skill area.

Every topic page follows the template in [docs/content-template.md](docs/content-template.md): What this covers → Key concepts → How it works → Hands-on → Exam traps → Quick review → Practice → Official references. Required frontmatter:

```yaml
title: Configure scale rules
pathSlug: deploy-and-manage-apps-on-azure-container-apps
moduleName: Scale container apps
description: Up to 155 characters, written for search results.
last_reviewed: 2026-10-25
source_version: 2026-10-07   # date of the official "skills measured" used
tags: [Container Apps, KEDA]
objectives: [aca-keda]        # ids from lib/exam-outline.ts
```

Rules:

- **Paraphrase, don't copy.** Quote Microsoft only for short skill names. Link every source under "Official references".
- **Be exact.** Real CLI flags, SDK class names, defaults and limits. If Microsoft Learn itself is wrong, say so on the page and show the correct behavior.
- No `#` H1 in the body (the page renders the title), every code fence has a language, and internal links use `/study/...` paths that exist.
- Callouts use GitHub alert syntax: `> [!TIP]`, `> [!NOTE]`, and `> [!WARNING]` (rendered as "Exam trap").
- Diagrams use ```` ```mermaid ```` blocks.

## Adding practice questions

Questions are JSON arrays in `content/questions/`. The schema is in `lib/schemas.ts`:

```json
{
  "id": "gen-aca-keda-12",
  "domain": "containers",
  "type": "scenario",
  "question": "… Select two.",
  "options": ["…", "…", "…", "…", "…"],
  "answer": [1, 3],
  "explanation": "Why each correct option is right, and why each other option is wrong.",
  "difficulty": "Medium",
  "relatedService": "Azure Container Apps",
  "objective": "aca-keda",
  "source": "generated"
}
```

- `answer` is an index (single answer) or an array of 2+ indices (multi-select; say "Select two." in the question).
- The explanation must cover **every** option.
- Add new questions to a `generated-<area>.json` file or a new file. **Never edit, reorder or renumber the 300 original questions** in the first twelve files. To report a wrong original, open a [content error issue](https://github.com/Suralmk/learn-AI-200/issues/new/choose); maintainers decide on changes to originals.
- Originals are linked to objectives through `content/questions/objective-map.json`.
- **No exam dumps.** Don't submit questions copied from the real exam, paid question banks or brain-dump sites.

## Pull request checklist

- [ ] `npm run validate:content`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass
- [ ] UI changes checked at 360, 768 and 1280 px in light and dark mode
- [ ] Sources linked, nothing copied verbatim
- [ ] Original questions untouched

## Code of conduct

Everyone taking part agrees to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Licensing

By contributing you agree that code is released under the [MIT License](LICENSE) and notes and questions under [CC BY 4.0](content/LICENSE).
