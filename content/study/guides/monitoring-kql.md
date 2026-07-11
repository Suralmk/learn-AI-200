---
title: Monitoring & KQL Troubleshooting
domain: secure-monitor
description: Observe AI workloads with OpenTelemetry, Application Insights, and KQL.
order: 8
---

## Overview

The secure/monitor domain covers end-to-end observability — tracing embedding pipelines, measuring latency, and troubleshooting failures with Kusto Query Language (KQL).

## Key concepts

- **OpenTelemetry** — distributed tracing standard (traces, metrics, logs)
- **Application Insights** — Azure's APM layer built on Log Analytics
- **KQL** — query language for logs and metrics
- **Correlation IDs** — trace requests across Functions, queues, and databases

## Exam tips

- Know basic KQL: `where`, `summarize`, `join`, `order by`
- Understand custom dimensions for AI metrics (token count, model name)
- Alert on error rate, latency percentiles, queue depth

## Azure CLI

```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --resource-group rg-ai200 \
  --workspace-name law-ai200 \
  --location eastus

# Link to Application Insights
az monitor app-insights component create \
  --app appi-ai200 \
  --location eastus \
  --resource-group rg-ai200 \
  --workspace law-ai200
```

## KQL — find slow embedding requests

```kusto
requests
| where timestamp > ago(24h)
| where name == "POST /embed"
| summarize
    count(),
    avg(duration),
    percentile(duration, 95)
    by bin(timestamp, 1h)
| order by timestamp desc
```

## Python — OpenTelemetry instrumentation

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(AzureMonitorTraceExporter(connection_string=conn_str))
)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("generate_embedding") as span:
    span.set_attribute("document.id", doc_id)
    embedding = model.embed(text)
```

## Learn more

- [Application Insights overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [KQL quick reference](https://learn.microsoft.com/en-us/azure/data-explorer/kql-quick-reference)
