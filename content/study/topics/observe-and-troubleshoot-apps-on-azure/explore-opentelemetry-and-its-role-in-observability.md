---
title: Explore OpenTelemetry and its role in observability
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Instrument an app with OpenTelemetry
---

## Overview

**Observability** means you can explain *what* your AI app is doing, *where* time is spent, and *why* a request failed — across services, queues, and databases. For AI-200, that starts with **OpenTelemetry** instrumentation and ends in **Azure Monitor Application Insights**, queried with **KQL**.

```text
Your App (OpenTelemetry SDK)
      │  spans / traces / metrics / logs
      ▼
Azure Monitor Exporter
      │
      ▼
Application Insights (ingestion)
      │  stored as tables
      ▼
Log Analytics Workspace  →  queried with KQL
```

## Exam tips

- OpenTelemetry is **vendor-neutral** — same code can export to Azure Monitor, Datadog, Jaeger, etc.
- **Application Insights** is the APM layer of Azure Monitor; data lives in a **Log Analytics workspace**
- Map OTel terms to Azure: Trace → `operation_Id`, Span → request/dependency row, attributes → custom dimensions
- Know the three signals: **traces**, **metrics**, and **logs**
- Distributed tracing only works when **trace context** (`traceparent`) propagates across every hop

## When to use vs when not to use

| Use OpenTelemetry + App Insights | Prefer something else |
|----------------------------------|------------------------|
| Multi-service AI pipelines (API → queue → worker → DB) | Single-machine scripts with no ops needs |
| Debugging latency across Functions, ACA, Cosmos DB | One-off local profiling only |
| Exam scenarios asking for correlation / end-to-end traces | Pure infrastructure metrics (VM CPU) without app context |

---

## OpenTelemetry

> **OpenTelemetry (OTel)** is a vendor-neutral standard (API + SDK) for generating telemetry — **traces**, **metrics**, and **logs**. It is not Azure-specific. You instrument once and choose an exporter for the backend you want.

OpenTelemetry gives you:

- A consistent API across languages (Python, .NET, Java, Node, Go)
- Auto-instrumentation for common libraries (HTTP clients, frameworks, DB drivers)
- Manual spans for AI-specific work (embedding generation, RAG retrieval, model calls)

**Use case:** An inference API calls Cosmos DB for vector search, then Azure OpenAI. OTel spans show which hop is slow.

---

## Azure Monitor and Application Insights

> **Azure Monitor** is Azure’s umbrella observability platform (metrics, logs, alerts, workbooks). **Application Insights** is the application performance monitoring (APM) part — where your traces and spans land for apps.

Under the hood, Application Insights data is stored in a **Log Analytics workspace**. You explore it in the portal UI (Failures, Performance, Transaction search) or by writing **KQL** in the Logs blade.

| Concept | Definition |
|---------|------------|
| **Azure Monitor** | Platform-wide observability: metrics, logs, alerts, dashboards |
| **Application Insights** | App-focused APM (requests, dependencies, exceptions, traces) |
| **Log Analytics workspace** | Shared log store that App Insights and many Azure resources write into |
| **KQL** | Kusto Query Language — query language for Log Analytics / App Insights |

---

## Vocabulary mapping (OTel → Azure)

| OpenTelemetry | Azure Monitor / App Insights |
|---------------|------------------------------|
| Trace | Operation (grouped by `operation_Id` / `OperationId`) |
| Span | Row in `AppRequests`, `AppDependencies`, `AppTraces`, etc. |
| Span attributes | Custom dimensions (`customDimensions`) |
| Trace context propagation | Distributed tracing / correlation |
| Sampler | Sampling (adaptive or ratio-based) to control cost |

---

## The three pillars

> **Traces** record the path of a single request through services. **Metrics** are numeric aggregations over time (latency, error rate, token count). **Logs** are free-form messages for detail.

For AI solutions, combine all three:

- Traces → find which dependency failed in a RAG pipeline
- Metrics → alert when P95 embedding latency rises
- Logs → capture model name, document ID, or prompt hash as context

---

## Learn more

- [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/)
- [Application Insights overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
