# Study page template

Every topic page under `content/study/topics/<learning-path>/<topic>.md` and every guide under `content/study/guides/` follows this template. `npm run validate:content` checks the hard rules and warns about missing sections.

## Frontmatter

```yaml
---
title: Configure KEDA scale rules in Azure Container Apps   # keep the existing title unless it is wrong
pathSlug: deploy-and-manage-apps-on-azure-container-apps     # topics only, unchanged
moduleName: Scale container apps                             # topics only, unchanged
description: >-                                              # ≤155 chars, unique, written for search results
  How KEDA scale rules work in Azure Container Apps for the AI-200 exam: HTTP, queue and custom scalers, min/max replicas and scale to zero.
last_reviewed: 2026-10-25
source_version: 2026-10-07                                    # skills-measured date of the outline used
tags: [Container Apps, KEDA]
objectives: [aca-keda]                                        # ids from lib/exam-outline.ts
---
```

Guides keep their `domain` and `order` fields and add `last_reviewed`, `source_version` and `objectives`.

## Body (H2 sections, in this order, exact names)

The page renders the title as the H1, so the body **never** contains a `# ` heading.

1. `## What this covers`: one paragraph in plain words. Then `**Exam weight:** <area> (<weight>)`. Then `**Skills measured**` followed by bullets that quote the official skill names exactly (short quotes only).
2. `## Key concepts`: explanations in your own words. Use exact Azure service and SKU names. Use `###` sub-headings when there are several concepts.
3. `## How it works`: architecture and flow. Add a ```` ```mermaid ```` diagram (`flowchart LR` or `sequenceDiagram`) where it helps. Keep diagrams small (≤10 nodes).
4. `## Hands-on`: `### Azure portal` (numbered steps), `### Azure CLI` (```` ```bash ````), `### Python` (```` ```python ````, azure-* SDKs). Add `### C#` only where the official module shows C#. Snippets are short, runnable, and use placeholders such as `<resource-group>`. Use `DefaultAzureCredential` and managed identity over keys unless the point is keys.
5. `## Exam traps`: a "which service/option when" comparison table, plus callouts:
   - `> [!WARNING]` followed by `> **Exam trap:** …` for traps
   - `> [!TIP]` for memory aids
   - `> [!NOTE]` for side facts
6. `## Quick review`: 5–8 one-line recall facts as bullets.
7. `## Practice`: one line linking to the practice set for each objective, e.g. `[Practice: KEDA scaling questions](/practice/aca-keda)`.
8. `## Official references`: bullet links to the exact Microsoft Learn modules and docs used.

## Rules

- **Never copy Microsoft text verbatim** beyond short skill names. Paraphrase, synthesize and cite.
- **Keep everything already on the page**: existing facts, snippets, tables, use cases and repository links. Move them into the right section and fix them only if they are wrong.
- Every code fence has a language (`bash`, `python`, `csharp`, `json`, `yaml`, `kql`, `sql`, `dockerfile`, `powershell`, `text`, `mermaid`).
- Internal links use site paths (`/study/<path>/<topic>`) and must resolve.
- Headings are hierarchical: H2 for sections, H3 inside them, no skipped levels.
- Aim for 600–1,200 words. Depth beats padding: concrete limits, defaults, CLI flags and failure modes are what the exam tests.
- AI-200 is a back-end exam (containers, data, messaging, Functions, Key Vault, App Configuration, OpenTelemetry, KQL). Don't drift into Azure OpenAI or Foundry content except as the consumer of these services.
