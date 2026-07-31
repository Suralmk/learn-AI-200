---
title: Explore logs for errors and performance
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Analyze app telemetry with logs and metrics
---

## Overview

Once telemetry is in Application Insights, use **KQL** to hunt failures and latency. Focus on **`Success`**, **`DurationMs`**, **`ResultCode`**, and **`OperationId`** across the standard App Insights tables.

## Exam tips

- Failed requests: `AppRequests | where Success == false`
- Slow dependencies: `AppDependencies | where DurationMs > …`
- Error rate over time: `countif(Success == false)` + `bin(TimeGenerated, …)`
- Use **`percentile(DurationMs, 95)`** for P95 — better than average alone
- Join exceptions to requests on **`OperationId`**

## Key fields

| Field | Meaning |
|-------|---------|
| `TimeGenerated` | When the telemetry was ingested/recorded |
| `Success` | Whether the operation succeeded |
| `DurationMs` | Latency in milliseconds |
| `ResultCode` | HTTP/status-style result |
| `Name` | Operation or dependency name |
| `Target` | Downstream host/resource for dependencies |
| `OperationId` | End-to-end correlation ID |

---

## Find failed requests

```kql
AppRequests
| where TimeGenerated > ago(1h)
| where Success == false
| project TimeGenerated, Name, ResultCode, DurationMs, OperationId
| order by TimeGenerated desc
```

---

## Find slow dependencies

> **Dependencies** are outbound calls — databases, HTTP APIs, queues. High `DurationMs` here often explains slow API requests upstream.

```kql
AppDependencies
| where TimeGenerated > ago(1h)
| where DurationMs > 500
| summarize Calls = count(), AvgMs = avg(DurationMs), P95 = percentile(DurationMs, 95)
    by Name, Target
| order by P95 desc
```

---

## Error rate over time

```kql
AppRequests
| where TimeGenerated > ago(24h)
| summarize
    Total = count(),
    Failures = countif(Success == false)
    by bin(TimeGenerated, 1h)
| extend ErrorRate = round(100.0 * Failures / Total, 2)
| render timechart
```

---

## Exceptions with request context

```kql
AppExceptions
| where TimeGenerated > ago(6h)
| join kind=inner (
    AppRequests
    | where TimeGenerated > ago(6h)
  ) on OperationId
| project TimeGenerated, ProblemId, OuterMessage, Name, ResultCode
| order by TimeGenerated desc
```

---

## AI-specific explorations

```kql
// Requests tagged with model name via custom dimensions
AppRequests
| where TimeGenerated > ago(24h)
| extend model = tostring(customDimensions["gen_ai.model"])
| where isnotempty(model)
| summarize
    count(),
    avg(DurationMs),
    percentile(DurationMs, 95)
  by model, Name
```

```kql
// Trace messages mentioning token or embedding errors
AppTraces
| where TimeGenerated > ago(6h)
| where Message has "embedding" or Message has "token"
| project TimeGenerated, Message, SeverityLevel, OperationId
```

---

## Learn more

- [Application Insights log query examples](https://learn.microsoft.com/en-us/azure/azure-monitor/app/analytics-using)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
