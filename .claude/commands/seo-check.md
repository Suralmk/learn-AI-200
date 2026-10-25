---
description: Check titles, descriptions, canonicals, OG images and JSON-LD across the built site
argument-hint: [route ...]
---

Run an SEO check. Routes: $ARGUMENTS (default: /, /study, one learning path, one topic, /questions, one /practice set, /exam/full).

The rules are in CLAUDE.md, "SEO rules".

1. `npm run build`, then `npx next start -p 3100` in the background, and wait for the port.
2. For each route, fetch the HTML (`curl -s`) and check:
   - `<title>` follows `<Title> · AI-200 Study Guide · AI-200 Learn` (practice and exam pages use their own suffix)
   - meta description is present, unique, and ≤155 chars
   - `<link rel="canonical">` is absolute on `https://azure.sura.work`
   - `og:title`, `og:description`, `og:image` (route OG image returns 200 and image/png), and `twitter:card`
   - JSON-LD parses, with the expected `@type` (WebSite + Course site-wide; LearningResource + BreadcrumbList on topics; Quiz on practice pages)
   - exactly one `<h1>`; `<html lang="en">`
3. Check `/sitemap.xml` (every topic URL present, on the canonical origin), `/robots.txt`, and that an unknown URL returns HTTP 404.
4. Report a table: route → pass/fail per check. Fix failures in `lib/seo.ts`, `components/seo/json-ld.tsx` or the route's `generateMetadata`.
5. Stop the server when done.
