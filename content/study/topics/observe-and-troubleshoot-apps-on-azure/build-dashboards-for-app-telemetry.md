---
title: Build dashboards for app telemetry
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Analyze app telemetry with logs and metrics
---

## Overview

**Dashboards** give at-a-glance health for AI services — request rate, failure rate, P95 latency, dependency health. In Azure you typically pin charts from **Azure Monitor metrics**, **Log Analytics / App Insights queries**, or workbook tiles onto a shared dashboard.

## Exam tips

- Dashboards are for **ops visibility**; workbooks are for **interactive investigation**
- Pin from Metrics, Logs (`render`), Application Insights overview blades
- Share dashboards with the team; use consistent time ranges
- Track AI-relevant signals: error rate, P95 latency, dependency failures, queue depth (via metrics/KQL)

## When to use dashboards vs workbooks

| Dashboards | Workbooks |
|------------|-----------|
| Always-on status for a service | Guided troubleshooting / deep analysis |
| Shared team wall / ops overview | Parameters, drill-downs, multi-step stories |
| Few key tiles | Many linked queries and visuals |

---

## Dashboard

> An **Azure dashboard** is a customizable portal page that pins tiles from metrics, logs, resource blades, and markdown. Use it as the “front door” for service health.

Typical AI app tiles:

| Tile | Source idea |
|------|-------------|
| Request rate | App Insights / metrics or KQL `summarize count() by bin(...)` |
| Failure rate | `countif(Success == false) / count()` |
| P95 latency | `percentile(DurationMs, 95)` |
| Top failing dependencies | `AppDependencies` summarize by `Target` |
| Exception count | `AppExceptions` count over time |

---

## Build from a Log Analytics query

1. Open Application Insights → **Logs**
2. Run a query ending with `| render timechart` (or barchart)
3. Pin to dashboard (**Pin to dashboard**)
4. Resize/arrange tiles; set auto-refresh if available

```kql
AppRequests
| where TimeGenerated > ago(24h)
| summarize
    Requests = count(),
    Failures = countif(Success == false)
    by bin(TimeGenerated, 1h)
| extend FailureRate = round(100.0 * Failures / Requests, 2)
| render timechart
```

---

## Metrics vs logs tiles

| Metrics explorer | Log-based tiles |
|------------------|-----------------|
| Near-real-time platform metrics | Rich App Insights tables & custom dimensions |
| Simple charts, less flexible | Full KQL power |
| Good for CPU, request rate (standard metrics) | Good for AI custom attributes, joins, percentiles |

---

## Design tips

- One dashboard per **service or pipeline stage** (ingest, embed, serve)
- Put **failures and latency** above vanity traffic charts
- Label tiles with the **service.name** / resource they cover
- Avoid overcrowding — 6–10 clear tiles beat 30 noisy ones

---

## Learn more

- [Create Azure dashboards](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-dashboards)
- [Pin Log Analytics charts](https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/tutorial-logs-dashboards)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
