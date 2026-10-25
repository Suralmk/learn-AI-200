---
description: Run the app and screenshot changed routes at 360/768/1280 in light and dark, plus the quiz flow
argument-hint: [route ...]
---

Verify the UI in a real browser. Routes: $ARGUMENTS (default: the routes touched by the current diff, plus `/` and one topic page).

Follow CLAUDE.md, "Workflow rules" → Verification. Use the `run` skill to launch and drive the app.

1. Start the dev server (`npm run dev`), or reuse one already listening on :3000, and wait for it to respond.
2. With Playwright (playwright-core plus the locally installed Chromium), for each route, width (360, 768, 1280) and theme (`colorScheme` light/dark):
   - take a screenshot and look at it
   - record console errors and page errors
   - check `document.documentElement.scrollWidth - innerWidth === 0` (no horizontal page scroll)
3. If quiz code changed, drive `/practice/<objective>` end to end with the keyboard (1–9, Enter, N), confirm the explanation, results and "Review wrong answers" appear, and that `localStorage["ai200-learn:progress:v1"]` records the attempt.
4. Fix anything wrong, re-check, then run the `impeccable:impeccable-finish-reviewer` agent on the changed area.
5. Report screenshots reviewed, issues found and fixed, and anything left.
