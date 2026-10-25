# Product

<!-- impeccable:product-schema 1 -->

> Written 2026-10-25 from the owner's brief and the brainstorming conversation. The owner asked not to be interviewed further, so facts marked *(inferred)* come from the repository and brief rather than a direct answer.

## Platform

web

## Users

- **Primary:** developers preparing for Microsoft **Exam AI-200: Developing AI Cloud Solutions on Azure** (Azure AI Cloud Developer Associate). They have back-end experience and study in short sessions around work, often on a laptop, with some phone reading in between *(inferred)*. Their jobs are to learn each official objective, check what they know with practice questions, and sit a mock exam before booking the real one.
- **Secondary:** contributors who fix notes or add questions on GitHub.

## Product Purpose

A free, open-source study companion organized exactly around the official AI-200 skills outline (version of October 7, 2026). It provides study notes per topic, practice questions per objective, and mock exams with per-area scoring. Success means a candidate can study from start to finish without jumping between scattered sources, and people star or contribute to the repository.

## Positioning

Unlike Microsoft Learn (official but spread across many modules) and paid question banks, AI-200 Learn maps every page and question to the 27 official sub-objectives and their exam weights. It is free, open source (MIT code, CC BY 4.0 content), and invites corrections.

## Operating Context

- Live at https://azure.sura.work. Repository: `Suralmk/learn-AI-200` on GitHub (main deploys).
- Study notes are Markdown in `content/study/`; questions are JSON in `content/questions/`.
- Progress lives only in the visitor's browser (localStorage). There are no accounts and no backend.
- Google Analytics (react-ga4) is in use.

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind 4, shadcn/base-ui, statically generated pages.
- 9 learning paths, about 130 topic pages, 8 quick-reference guides, 300 original questions plus generated ones (tagged `source: "generated"`).
- The 300 original questions must never be edited, reordered or renumbered.
- Terminology: "skill area" (the 4 official areas), "objective" (the 27 sub-objectives), "learning path", "topic", "practice set", "mock exam".

## Brand Commitments

- Name: **AI-200 Learn** (owner chose to keep it).
- Must read as independent from Microsoft. Footer and README carry: "Not affiliated with or endorsed by Microsoft. Azure and Microsoft Learn are trademarks of Microsoft Corporation." Don't use Microsoft logos as brand marks.
- Owner chose the "Clean product" direction: today's look made sharper, Azure-family blue `#0177d1` kept as primary.
- Open-source prompts are wanted: Star on GitHub, Edit this page, Contribute a question.

## Evidence on Hand

- Real content: the study notes and questions in `content/`.
- No testimonials, user counts, pass rates or endorsements exist. Never invent them.

## Product Principles

1. **The official outline is the map.** Every page, question and score ties back to a skill area and objective with its weight.
2. **Study, then prove it.** Each topic leads to a practice set, and each practice set leads back to the notes.
3. **Accurate over impressive.** Exact service names, real CLI flags, cited sources.
4. **Open by default.** Make it easy to fix, extend and share.

## Accessibility & Inclusion

WCAG 2.2 AA (owner's brief): contrast, visible focus, skip link, keyboard-operable quiz, reduced motion respected, usable from 360px wide.
