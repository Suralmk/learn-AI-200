---
title: Set alerts for app failures and anomalies
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Analyze app telemetry with logs and metrics
---

## Overview

**Alerts** notify you when AI apps break or degrade — error spikes, slow dependencies, exception surges — before users flood support. Azure Monitor alert rules evaluate **metrics** or **log (KQL) queries** and fire actions (email, Teams, webhook, ITSM).

## Exam tips

- Know **metric alerts** vs **log search alerts** (KQL-based)
- Alert on **error rate**, **latency percentiles**, **dependency failures**, **exception count**
- Attach an **action group** (who/what gets notified)
- Set severity and sensible thresholds to avoid alert fatigue
- Log alerts can use the same KQL you wrote for exploration

## Alert types

| Type | Definition | Best for |
|------|------------|----------|
| **Metric alert** | Threshold on a platform/App Insights metric | Request rate, availability, standard latency metrics |
| **Log search alert** | Scheduled KQL; fires when result meets condition | Custom dimensions, complex joins, AI-specific signals |
| **Activity log alert** | Control-plane events | Resource deletions, role changes (ops, not APM) |

> An **action group** is a reusable notification destination list (email, SMS, webhook, Logic App, etc.) referenced by alert rules.

---

## What to alert on for AI apps

| Signal | Example condition |
|--------|-------------------|
| Failed requests | Failures > N in 5 minutes |
| Error rate | Failures / Total > 5% |
| P95 latency | P95 DurationMs > 2000 |
| Dependency failures | `AppDependencies` Success == false for Target X |
| Exceptions | `AppExceptions` count spike |
| Queue backlog | Metric / custom for Service Bus depth (if monitored) |

---

## Example log search alert query

```kql
AppRequests
| where TimeGenerated > ago(5m)
| summarize
    Total = count(),
    Failures = countif(Success == false)
| extend ErrorRate = tostring(round(100.0 * Failures / Total, 2))
| where Failures > 10 or todouble(ErrorRate) > 5
```

Configure the alert rule to run every 5 minutes, look back 5 minutes, and fire when the query returns rows (or meets the numeric threshold you configure).

Slow dependency example:

```kql
AppDependencies
| where TimeGenerated > ago(5m)
| where Success == false or DurationMs > 2000
| summarize FailedOrSlow = count() by Target
| where FailedOrSlow > 5
```

---

## Create resources (CLI sketch)

```bash
# Action group (email example — adjust receivers)
az monitor action-group create \
  --resource-group rg-ai200 \
  --name ag-ai200-ops \
  --short-name ai200ops

# Prefer portal or ARM/Bicep for full log alert rule JSON;
# pattern: scope = App Insights / workspace, condition = scheduled query, actions = action group
```

Portal path: Application Insights / Monitor → **Alerts** → **Create** → **Alert rule** → select signal (metric or custom log search) → set threshold → select action group → name and create.

---

## Alert hygiene

- Start with **Severity 2/3** for latency; reserve Sev 1 for total outage
- Suppress or widen windows during known deploys
- Include deep links / `OperationId` samples in alert payloads when possible
- Review noisy rules monthly — tune thresholds

---

## Learn more

- [Azure Monitor alerts](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview)
- [Log search alert rules](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types#log-alerts)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
