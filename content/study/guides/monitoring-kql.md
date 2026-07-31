---
title: Monitoring & KQL Troubleshooting
domain: secure-monitor
description: >-
  Observe AI workloads with OpenTelemetry, Application Insights, Log Analytics,
  and KQL — traces, tables, queries, dashboards, workbooks, and alerts.
order: 8
---

## Overview

The **secure / monitor** domain’s observability half is end-to-end visibility into distributed AI apps: instrument with **OpenTelemetry**, export to **Azure Monitor Application Insights**, store in a **Log Analytics workspace**, and analyze with **KQL**, dashboards, workbooks, and alerts.

```text
App (OTel SDK) → Azure Monitor exporter → Application Insights
      → Log Analytics tables → KQL / dashboards / alerts
```

Deep study notes live in the learning path **Observe and troubleshoot apps on Azure**.

## Definitions

| Term | Definition |
|------|------------|
| **OpenTelemetry** | Vendor-neutral API/SDK for traces, metrics, and logs |
| **Azure Monitor** | Azure’s observability platform (metrics, logs, alerts, workbooks) |
| **Application Insights** | APM product for app requests, dependencies, exceptions, traces |
| **Log Analytics workspace** | Shared log store queried with KQL |
| **KQL** | Kusto Query Language — pipeline queries over tables |
| **OperationId** | Correlation ID for one end-to-end request (OTel trace ID) |
| **Custom dimensions** | Dynamic properties from span attributes / properties |
| **Workbook** | Interactive parameterized analysis report |
| **Action group** | Notification destinations for alert rules |

## Exam tips

- Distro package (`azure-monitor-opentelemetry`) configures exporter + auto-instrumentation quickly
- Map spans → `AppRequests` / `AppDependencies`; attributes → `customDimensions`
- Tables like `AppExceptions` are **pre-created** — you do not define them
- Core KQL: `where`, `project`/`extend`, `summarize`, `join`, `union`, `top`, `let`
- Prefer `has` over `contains`; use `percentile` and `countif` for latency and error rate
- Debug with `OperationId` across a `union` of App* tables
- Alert on error rate, P95 latency, and dependency failures via metric or log search rules

## Vocabulary (OTel → Azure)

| OpenTelemetry | Application Insights |
|---------------|----------------------|
| Trace | Operation (`OperationId`) |
| Span | Request / dependency / trace row |
| Attributes | `customDimensions` |
| Context propagation | Distributed tracing (`traceparent`) |

## Standard tables

| Table | Contents |
|-------|----------|
| `AppRequests` | Incoming requests |
| `AppDependencies` | Outbound HTTP / DB / queue calls |
| `AppTraces` | Log messages |
| `AppExceptions` | Exceptions |
| `AppMetrics` | Metrics |

Classic aliases (`requests`, `dependencies`, `traces`, `exceptions`) still appear in older docs.

## Azure CLI — create workspace + App Insights

```bash
az monitor log-analytics workspace create \
  --resource-group rg-ai200 \
  --workspace-name law-ai200 \
  --location eastus

az monitor app-insights component create \
  --app appi-ai200 \
  --location eastus \
  --resource-group rg-ai200 \
  --workspace law-ai200
```

## Python — quick instrumentation

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(connection_string="...")  # or APPLICATIONINSIGHTS_CONNECTION_STRING
tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("generate_embedding") as span:
    span.set_attribute("gen_ai.model", "text-embedding-3-large")
    embedding = model.embed(text)
```

## KQL — failed requests and P95

```kql
AppRequests
| where TimeGenerated > ago(24h)
| where Name has "embed"
| summarize
    count(),
    avg(DurationMs),
    percentile(DurationMs, 95)
  by bin(TimeGenerated, 1h)
| order by TimeGenerated desc
```

## KQL — full trace for one operation

```kql
union AppRequests, AppDependencies, AppTraces, AppExceptions
| where OperationId == "abc123def456"
| project TimeGenerated, ItemType = type, Name, Message, DurationMs
| order by TimeGenerated asc
```

## Related study path topics

- Explore OpenTelemetry and its role in observability
- Add the OpenTelemetry SDK to an application
- Configure spans and traces
- Export telemetry to Azure Monitor
- Debug distributed flows with trace data
- Write basic KQL queries
- Explore logs for errors and performance
- Build dashboards for app telemetry
- Create workbooks for interactive analysis
- Set alerts for app failures and anomalies

## Learn more

- [Application Insights overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [OpenTelemetry on Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-overview)
- [KQL quick reference](https://learn.microsoft.com/en-us/azure/data-explorer/kql-quick-reference)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
