---
title: Exercise - Instrument an app with the OpenTelemetry SDK
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Instrument an app with OpenTelemetry
---

## Overview

This exercise walks through instrumenting a small Python AI-style API, exporting traces to Application Insights, and verifying spans in the portal and with KQL.

## Goals

- Create (or reuse) a Log Analytics workspace + Application Insights resource
- Install and configure the Azure Monitor OpenTelemetry distro
- Add a custom span with attributes for an “embedding” step
- Confirm telemetry in `AppRequests` / `AppDependencies` / custom dimensions

## Prerequisites

- Azure CLI logged in (`az login`)
- Python 3.10+
- Resource group (e.g. `rg-ai200`)

---

## Steps

### 1. Create monitoring resources

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

az monitor app-insights component show \
  --app appi-ai200 \
  --resource-group rg-ai200 \
  --query connectionString -o tsv
```

Save the connection string.

### 2. Install packages

```bash
pip install azure-monitor-opentelemetry flask
```

### 3. Instrument a minimal app

```python
import os
from flask import Flask, jsonify
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

os.environ.setdefault("OTEL_SERVICE_NAME", "ai200-demo-api")
configure_azure_monitor(
    connection_string=os.environ["APPLICATIONINSIGHTS_CONNECTION_STRING"],
)

app = Flask(__name__)
tracer = trace.get_tracer(__name__)

@app.get("/embed")
def embed():
    with tracer.start_as_current_span("generate_embedding") as span:
        span.set_attribute("gen_ai.model", "text-embedding-3-large")
        span.set_attribute("documents.count", 1)
        # pretend work
        vector = [0.1, 0.2, 0.3]
        return jsonify({"dims": len(vector)})

if __name__ == "__main__":
    app.run(port=8080)
```

### 4. Generate traffic

```bash
export APPLICATIONINSIGHTS_CONNECTION_STRING="..."
python app.py
# in another shell
curl http://127.0.0.1:8080/embed
```

Wait 1–2 minutes for ingestion.

### 5. Verify in KQL

Application Insights → Logs:

```kql
AppRequests
| where TimeGenerated > ago(15m)
| where Name has "embed"
| project TimeGenerated, Name, Success, DurationMs, OperationId

AppDependencies
| where TimeGenerated > ago(15m)
| take 20
```

Or open **Transaction search** / **Performance** and find the `generate_embedding` span with attributes.

---

## Checklist

- [ ] Connection string set; `OTEL_SERVICE_NAME` is not `unknown_service`
- [ ] Request appears in `AppRequests`
- [ ] Custom attributes visible under `customDimensions`
- [ ] You can copy `OperationId` and reconstruct the operation with `union`

## Learn more

- [Enable Azure Monitor OpenTelemetry](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=python)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
