---
title: Add the OpenTelemetry SDK to an application
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Instrument an app with OpenTelemetry
---

## Overview

Adding the **OpenTelemetry SDK** wires your app so telemetry can be collected and exported. On Azure, the preferred path is the **Azure Monitor OpenTelemetry distro** — one call that configures the tracer provider, exporter, and common auto-instrumentation.

## Exam tips

- Prefer **`azure-monitor-opentelemetry`** (Python distro) or **`Azure.Monitor.OpenTelemetry.AspNetCore`** (.NET) over hand-wiring every piece
- Use a **connection string** (`APPLICATIONINSIGHTS_CONNECTION_STRING`), not the legacy instrumentation key alone
- Distro enables auto-instrumentation for common libraries (Flask/Django, `requests`, DB drivers)
- Always set **`service.name`** (`OTEL_SERVICE_NAME`) so apps are distinguishable in App Insights
- Package APIs change — know the *pattern* (configure → provider → exporter → tracer), not only one package version

## When to use distro vs manual setup

| Use the Azure Monitor distro | Use manual TracerProvider setup |
|------------------------------|----------------------------------|
| Standard web APIs and workers on Azure | Fine-grained control of processors/samplers |
| Fast exam / production bootstrap | Custom exporters or multi-backend export |
| Want auto-instrumentation with little code | Learning the raw OTel pipeline pieces |

---

## Azure Monitor OpenTelemetry distro

> The **Azure Monitor OpenTelemetry distro** is a Microsoft package that configures OpenTelemetry for Azure Monitor in one step: TracerProvider, Azure Monitor exporter, and auto-instrumentation for popular libraries.

### Python

```bash
pip install azure-monitor-opentelemetry
```

```python
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor(
    connection_string="InstrumentationKey=...;IngestionEndpoint=...",
)
```

That single call is enough for many apps — HTTP frameworks and outbound clients start emitting spans without extra code.

### .NET (ASP.NET Core)

```csharp
builder.Services.AddOpenTelemetry()
    .UseAzureMonitor(o => o.ConnectionString = "InstrumentationKey=...");
```

---

## Manual SDK configuration

> A **TracerProvider** owns how spans are created and processed. A **SpanProcessor** (usually `BatchSpanProcessor`) batches spans and sends them through an **exporter**.

Use manual setup when you need custom sampling, multiple exporters, or to understand the pipeline for the exam.

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

provider = TracerProvider()
exporter = AzureMonitorTraceExporter(connection_string="...")
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)
```

| Component | Role |
|-----------|------|
| **TracerProvider** | Global factory for tracers / span creation |
| **BatchSpanProcessor** | Batches spans; handles retries on transient failure |
| **AzureMonitorTraceExporter** | Sends spans to Application Insights ingestion |
| **Tracer** | Creates named spans in your code |

---

## Connection string and environment

> Prefer the **Application Insights connection string** over the older instrumentation-key-only setting. It includes both the key and the regional ingestion endpoint.

```text
InstrumentationKey=xxxx;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/
```

Set via:

- `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable (recommended for containers / App Service)
- Explicit argument to `configure_azure_monitor(...)` or the exporter

**Practical gotcha:** Set `OTEL_SERVICE_NAME` (or a Resource with `service.name`). Without it, everything appears as `unknown_service` and you cannot tell AI services apart.

```bash
export APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=...;IngestionEndpoint=..."
export OTEL_SERVICE_NAME="rag-api"
```

---

## Learn more

- [Azure Monitor OpenTelemetry for Python](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=python)
- [Connection strings](https://learn.microsoft.com/en-us/azure/azure-monitor/app/connection-strings)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
