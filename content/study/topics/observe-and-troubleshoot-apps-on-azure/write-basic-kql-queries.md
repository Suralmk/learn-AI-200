---
title: Write basic KQL queries
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Analyze app telemetry with logs and metrics
---

## Overview

**KQL** (Kusto Query Language) is how you query Log Analytics and Application Insights. Queries are **pipelines**: start with a table, then pipe (`|`) rows through operators that filter, reshape, aggregate, and sort.

```kql
TableName
| operator1
| operator2
| operator3
```

## Exam tips

- Know **`where`**, **`project`/`extend`**, **`summarize`**, **`order by`**, **`join`**, **`union`**, **`top`**
- Prefer **`has`** (term match, indexed) over **`contains`** (substring, slower)
- `summarize` + **`bin(TimeGenerated, …)`** for time charts
- **`countif()`** for error rates without a second query
- Workspace-based names: `AppRequests`, `AppDependencies`, … (classic: `requests`, `dependencies`)
- `render timechart` works in the portal UI only

## Pipeline mental model

> Each `|` takes the previous result set and transforms it. Order matters — filter early, aggregate later, sort last.

---

## Core operators

### `where` — filter rows

```kql
AppRequests
| where TimeGenerated > ago(1h)
| where Success == false
```

| Operator inside `where` | Meaning |
|-------------------------|---------|
| `==` `!=` `>` `<` | Comparisons |
| `and` / `or` | Combine conditions |
| `in ("a","b")` | Membership |
| `has` | Whole-term match (fast) |
| `contains` | Substring match (slower) |
| `startswith` | Prefix match |

```kql
AppTraces
| where Message has "timeout"        // preferred
| where Message contains "time"      // broader, slower
```

### `project` / `extend` — columns

> **`project`** selects/reshapes columns (drops the rest). **`extend`** adds columns while keeping existing ones.

```kql
AppRequests
| project TimeGenerated, Name, ResultCode, DurationMs, OperationId

AppRequests
| extend IsSlow = DurationMs > 1000
| where IsSlow == true
```

Related: `project-away`, `project-rename`.

### `summarize` — aggregation (GROUP BY)

```kql
AppDependencies
| where TimeGenerated > ago(1h)
| summarize count(), avg(DurationMs), max(DurationMs) by Target
```

Common aggs: `count()`, `sum()`, `avg()`, `min()`, `max()`, `percentile(col, N)`, `dcount()`, `countif()`, `make_list()`, `make_set()`.

```kql
AppRequests
| where TimeGenerated > ago(1d)
| summarize
    Total = count(),
    Failures = countif(Success == false),
    P95 = percentile(DurationMs, 95)
  by Name
| order by P95 desc
```

Time buckets:

```kql
AppRequests
| summarize RequestCount = count() by bin(TimeGenerated, 5m)
| render timechart
```

### `order by` / `top` / `take`

| Operator | Use |
|----------|-----|
| `order by Col desc` | Sort |
| `top N by Col desc` | Sort + limit (preferred for “top N”) |
| `take N` / `limit N` | Cap rows, **no** sort guarantee |

```kql
AppRequests
| top 10 by DurationMs desc
```

### `join` — combine on a key

```kql
AppExceptions
| where TimeGenerated > ago(6h)
| join kind=inner (
    AppRequests
    | where TimeGenerated > ago(6h)
  ) on OperationId
| project TimeGenerated, ProblemId, OuterMessage, RequestName = Name, ResultCode
```

Kinds: `inner`, `leftouter`, `fullouter` (specify explicitly — defaults can surprise you).

### `union` — stack tables

```kql
union AppRequests, AppDependencies, AppExceptions, AppTraces
| where OperationId == "abc123"
| project TimeGenerated, ItemType = type, Name, Message
| order by TimeGenerated asc
```

### `let` — variables / subqueries

```kql
let threshold = 1000;
let startTime = ago(2h);
AppDependencies
| where TimeGenerated > startTime
| where DurationMs > threshold
```

```kql
let SlowOps =
    AppDependencies
    | where DurationMs > 2000
    | distinct OperationId;
AppRequests
| where OperationId in (SlowOps)
```

### `render` — portal charts

```kql
AppRequests
| summarize FailureRate = 100.0 * countif(Success == false) / count()
    by bin(TimeGenerated, 1h)
| render timechart
```

---

## Worked example

**Scenario:** Top 5 dependency targets causing failures in 24h, for operations that also had an exception.

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

---

## Quick reference

| Operator | Purpose |
|----------|---------|
| `where` | Filter rows |
| `project` / `extend` | Select / add columns |
| `project-away` / `project-rename` | Drop / rename |
| `summarize` | Aggregate (group by) |
| `order by` / `sort by` | Sort |
| `top` | Sort + limit |
| `take` / `limit` | Cap rows |
| `join` | Combine on key |
| `union` | Stack tables |
| `render` | Chart in portal |
| `let` | Variables / named queries |
| `distinct` | Unique values |

---

## Learn more

- [KQL quick reference](https://learn.microsoft.com/en-us/azure/data-explorer/kql-quick-reference)
- [KQL tutorial](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/tutorial)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
