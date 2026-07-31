---
title: Create workbooks for interactive analysis
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Analyze app telemetry with logs and metrics
---

## Overview

**Azure Workbooks** are interactive reports inside Azure Monitor — parameterized KQL, charts, grids, and markdown in one document. Use them when dashboards are not enough and you need guided analysis of AI app telemetry.

## Exam tips

- Workbooks support **parameters** (time range, operation name, service) that feed queries
- Combine text + queries + visualizations for runbooks
- Save to a resource group; share with RBAC
- Great for “why is RAG slow?” style investigations across requests + dependencies

## When to use

| Use a workbook | Prefer a plain dashboard / saved query |
|----------------|----------------------------------------|
| Multi-step investigation with filters | Single KPI glance |
| Shared troubleshooting runbook | Ad-hoc one-off query |
| Comparing services via parameters | Pinning one chart |

---

## Workbook

> An **Azure Workbook** is an interactive canvas of markdown, parameters, and query visualizations backed by Logs, Metrics, or Azure Resource Graph. Authors build analysis stories; operators change parameters without rewriting KQL.

Typical structure for an AI API workbook:

1. **Parameters** — time range, `service.name`, HTTP route
2. **Overview** — request volume, failure rate, P95
3. **Dependencies** — slow or failing outbound calls
4. **Exceptions** — top `ProblemId`s linked by `OperationId`
5. **Sample traces** — grid of recent failed `OperationId`s to copy into Transaction search

---

## Parameters and queries

> **Parameters** are workbook inputs (dropdowns, text, time) referenced inside queries so one workbook serves many scenarios.

Example pattern (conceptual):

```kql
AppRequests
| where TimeGenerated > ago(24h)
| where Name has "{OperationName}"   // bound to workbook parameter
| summarize
    Total = count(),
    Failures = countif(Success == false),
    P95 = percentile(DurationMs, 95)
  by bin(TimeGenerated, 1h)
```

Add a second query step that uses selected `OperationId` from a grid to show the full `union` timeline.

---

## Create a workbook (portal)

1. Azure Monitor or Application Insights → **Workbooks**
2. **Empty** / use a template
3. Add **parameters** (TimeRange, text for route/model)
4. Add **query** steps against your App Insights / workspace
5. Choose visualization (time chart, grid, tiles)
6. Save to a resource group with a clear name (`AI-200 RAG health`)

---

## Tips for AI workloads

- Parameterize **model deployment name** via `customDimensions`
- Include a step for **vector DB** dependency targets (Cosmos / PostgreSQL)
- Link markdown “what to check next” for on-call engineers
- Keep queries scoped with `ago(...)` / TimeRange to control cost

---

## Learn more

- [Azure Workbooks](https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview)
- [Workbook parameters](https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-parameters)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
