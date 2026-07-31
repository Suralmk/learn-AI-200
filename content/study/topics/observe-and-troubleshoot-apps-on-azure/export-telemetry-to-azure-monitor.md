---
title: Export telemetry to Azure Monitor
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Instrument an app with OpenTelemetry
---

## Overview

Once spans exist, an **exporter** sends them to Azure. With Application Insights, telemetry lands in **pre-created tables** in your Log Analytics workspace — you do not create `AppRequests` or `AppDependencies` yourself.

## Exam tips

- Prefer **connection string** over instrumentation key alone
- Incoming server spans → **`AppRequests`**; outbound calls → **`AppDependencies`**
- Logs → `AppTraces`; exceptions → `AppExceptions`; metrics → `AppMetrics`
- Tables are **created by Azure** when you provision App Insights / workspace
- Span attributes appear under **`customDimensions`** — no new table required
- Classic table names (`requests`, `dependencies`) still appear in older docs — same data as `App*` views

## When data lands where

| Telemetry | Table (workspace-based) | Classic alias |
|-----------|-------------------------|---------------|
| Incoming requests | `AppRequests` | `requests` |
| Outgoing calls (HTTP, DB, queue) | `AppDependencies` | `dependencies` |
| Log messages | `AppTraces` | `traces` |
| Exceptions | `AppExceptions` | `exceptions` |
| Metrics | `AppMetrics` | — |
| Perf counters | `AppPerformanceCounters` | — |
| Availability tests | `AppAvailabilityResults` | — |
| Browser timings / page views | `AppBrowserTimings` / `AppPageViews` | `pageViews` |

---

## Azure Monitor exporter

> The **Azure Monitor Trace Exporter** (or the distro that wraps it) batches spans and sends them to Application Insights ingestion. `BatchSpanProcessor` handles batching, retries, and buffering on transient failure.

Configure with a connection string:

```text
InstrumentationKey=xxxx;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/
```

```python
from azure.monitor.opentelemetry import configure_azure_monitor
import os

configure_azure_monitor(
    connection_string=os.environ["APPLICATIONINSIGHTS_CONNECTION_STRING"],
)
```

---

## Are App* tables pre-created?

> Yes. When you create an **Application Insights** resource backed by a **Log Analytics workspace**, Azure provisions a fixed schema of tables. Your exporter only writes rows — there is no `CREATE TABLE` step for standard App Insights telemetry.

What you *can* create:

| You create | You do not create |
|------------|-------------------|
| Custom log tables (`*_CL`) via Data Collection / ingestion APIs | `AppRequests`, `AppDependencies`, `AppTraces`, … |
| Custom dimensions via `span.set_attribute` | New columns as physical schema for every attribute |
| Saved queries / functions (reusable KQL) | The base App Insights schema |

Confirm in the portal: Application Insights → **Logs** — the left schema pane lists tables even before you write a query.

---

## Custom dimensions

> **Custom dimensions** are dynamic properties on telemetry rows. OTel span attributes map here and are queried as `customDimensions["key"]` or `customDimensions.key` in KQL.

```python
span.set_attribute("gen_ai.model", deployment_name)
span.set_attribute("rag.top_k", 5)
```

```kql
AppRequests
| where TimeGenerated > ago(1h)
| extend model = tostring(customDimensions["gen_ai.model"])
| summarize count() by model
```

---

## Service naming

Without a clear **`service.name`**, every app shows as `unknown_service`. Set it via:

```bash
export OTEL_SERVICE_NAME="embedding-worker"
```

Or Resource configuration in code. This is critical when multiple AI microservices share one App Insights resource.

---

## Provision resources (CLI)

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

---

## Learn more

- [OpenTelemetry with Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-overview)
- [Application Insights data model](https://learn.microsoft.com/en-us/azure/azure-monitor/app/data-model)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
