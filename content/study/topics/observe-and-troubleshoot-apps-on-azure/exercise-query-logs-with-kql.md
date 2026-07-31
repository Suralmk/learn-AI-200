---
title: Exercise - Query logs with KQL
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Analyze app telemetry with logs and metrics
---

## Overview

Practice the KQL patterns used on the AI-200 exam: filter failures, aggregate latency, correlate with `OperationId`, and chart error rate.

## Goals

- Query `AppRequests` and `AppDependencies`
- Compute failure rate and P95 latency
- Reconstruct a distributed operation with `union`
- Pin or save at least one useful query

## Prerequisites

- Application Insights resource with recent telemetry (from the OpenTelemetry exercise or any instrumented app)
- Access to the **Logs** blade

---

## Exercises

### 1. Failed requests in the last hour

```kql
AppRequests
| where TimeGenerated > ago(1h)
| where Success == false
| project TimeGenerated, Name, ResultCode, DurationMs, OperationId
| order by TimeGenerated desc
```

**Check:** You can explain each projected column.

### 2. Slow dependencies

```kql
AppDependencies
| where TimeGenerated > ago(1h)
| where DurationMs > 500
| summarize count(), avg(DurationMs) by Name, Target
| order by avg_DurationMs desc
```

**Check:** Identify the slowest `Target`.

### 3. Error rate chart

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

**Check:** Chart renders in the portal.

### 4. Correlate one operation

Copy an `OperationId` from exercise 1, then:

```kql
let op = "PASTE_OPERATION_ID";
union AppRequests, AppDependencies, AppTraces, AppExceptions
| where OperationId == op
| project TimeGenerated, ItemType = type, Name, Message, DurationMs, Success
| order by TimeGenerated asc
```

**Check:** You see a chronological timeline across tables.

### 5. Top failing dependency targets with exceptions

```kql
let FailingOps =
    AppExceptions
    | where TimeGenerated > ago(24h)
    | distinct OperationId;
AppDependencies
| where TimeGenerated > ago(24h)
| where OperationId in (FailingOps)
| summarize
    Total = count(),
    Failures = countif(Success == false),
    P95Latency = percentile(DurationMs, 95)
  by Target
| extend FailureRatePct = round(100.0 * Failures / Total, 1)
| top 5 by FailureRatePct desc
```

**Check:** You can walk through each pipeline stage (`let` → filter → `summarize` → `extend` → `top`).

---

## Stretch goals

- Save the error-rate query as a **function** or workbook step
- Pin the timechart to a **dashboard**
- Create a **log search alert** that fires when Failures > 10 in 5 minutes

## Checklist

- [ ] Used `where`, `summarize`, `extend`, `order by` / `top`
- [ ] Used `union` + `OperationId` correlation
- [ ] Distinguished classic vs `App*` table names if docs differed

## Learn more

- [KQL quick reference](https://learn.microsoft.com/en-us/azure/data-explorer/kql-quick-reference)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
