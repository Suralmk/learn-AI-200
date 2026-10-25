---
description: Add a new study topic page to a learning path, following the content template
argument-hint: <learning-path-slug> "<Topic title>"
---

Add a study topic page: $ARGUMENTS

Follow the rules in CLAUDE.md, sections "Content rules" and "Workflow rules". The page template and frontmatter are in docs/content-template.md.

1. Read `lib/exam-outline.ts` and pick the objective id(s) the topic covers.
2. Read the learning-path file `content/study/learning-paths/<path>.md` and choose the module. Add the title to that module's `topics:` list. The new file name must equal the slugified title (lowercase, non-alphanumerics → `-`).
3. Fetch the relevant Microsoft Learn module/unit and Azure docs pages (WebFetch, one at a time). Save paraphrased notes and URLs under `.cache/learn/<path>/`.
4. Write `content/study/topics/<path>/<slug>.md` with all eight template sections, `description` ≤155 chars, `last_reviewed` (today), `source_version` (current skills-measured date from `EXAM.sourceVersion`), `tags` and `objectives`. Paraphrase. Never copy Microsoft text beyond short skill names.
5. Run `npm run validate:content -- --verbose` and fix every error or warning for the new file.
6. Run `npm test`, then check the page in the browser (see /verify-ui).
7. Commit as `docs(content): add <topic>`. Use the configured git author and add no co-author trailers.
