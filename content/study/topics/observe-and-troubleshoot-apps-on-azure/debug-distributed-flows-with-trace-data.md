---
title: Debug distributed flows with trace data
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Instrument an app with OpenTelemetry
---

## Overview

Distributed AI systems fail in pieces — the API returns 500 because a dependency timed out three hops away. **Trace data** lets you reconstruct the whole path using **`OperationId`** (the Azure name for the OTel trace ID) and find the break point.

## Exam tips

- Start from **Failures / Performance** end-to-end transaction view, or from KQL on `AppDependencies`
- Correlate with **`OperationId`** across `AppRequests`, `AppDependencies`, `AppExceptions`, `AppTraces`
- Parent succeeds + child fails → look at the failing dependency
- Duration spike without exception → latency bottleneck, not necessarily an error
- Broken traces at a boundary → missing **`traceparent`** propagation or uninstrumented service

## Debugging workflow

1. **Portal waterfall** — Application Insights → Performance or Failures → open a request → End-to-end transaction
2. **Or hunt by pattern in KQL** — e.g. failing dependency target
3. **Pivot on `OperationId`** — `union` all telemetry for that operation
4. **Find the break** — failing child, ballooning duration, or missing spans after a hop
5. **Fix instrumentation** if traces stop cold at a queue or service with no children

---

## Operation ID

> **`OperationId`** (classic: `operation_Id`) is the shared correlation ID for one end-to-end request across Application Insights tables. It maps to the OpenTelemetry **trace ID**.

```kql
AppDependencies
| where Success == false and Target == "payments-api"
| project OperationId, TimeGenerated, Name, ResultCode
```

Then reconstruct the full flow:

```kql
union AppRequests, AppDependencies, AppExceptions, AppTraces
| where OperationId in ("id1", "id2", "id3")
| order by OperationId, TimeGenerated asc
```

---

## Practical KQL patterns

### Exceptions joined to the triggering request

```kql
AppExceptions
| where TimeGenerated > ago(6h)
| join kind=inner (AppRequests | where TimeGenerated > ago(6h)) on OperationId
| project TimeGenerated, ProblemId, OuterMessage, Name, ResultCode
```

### P95 latency by operation (spot regressions)

```kql
AppRequests
| where TimeGenerated > ago(1d)
| summarize p95 = percentile(DurationMs, 95) by Name
| order by p95 desc
```

### Full trace for one operation

```kql
union AppRequests, AppDependencies, AppTraces, AppExceptions
| where OperationId == "abc123def456"
| project TimeGenerated, ItemType = type, Name, Message, DurationMs
| order by TimeGenerated asc
```

> **`union`** stacks rows from multiple tables. The special **`type`** column tells you which table each row came from — useful for a unified timeline.

---

## Common failure modes

| Symptom | Likely cause |
|---------|--------------|
| Trace ends at Service A; nothing in Service B | Missing `traceparent` or B not instrumented |
| Request OK, dependency failed | Downstream error — inspect `AppDependencies` / `AppExceptions` |
| High duration, Success true | Slow path (DB, model, cold start) — not a hard failure |
| Many `unknown_service` rows | Missing `OTEL_SERVICE_NAME` / `service.name` |
| Gaps in high-traffic apps | Aggressive sampling — increase rate temporarily while debugging |

---

## Learn more

- [Diagnose failures with Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/transaction-diagnostics)
- [Correlation in Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/correlation)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
