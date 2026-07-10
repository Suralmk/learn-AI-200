---
title: Azure Functions for Serverless AI
domain: azure-services
description: Trigger AI processing with HTTP, queues, blobs, and Event Grid in Azure Functions.
order: 6
---

## Overview

Azure Functions let you run serverless AI workers — embedding pipelines, webhook handlers, and lightweight APIs — without managing infrastructure.

## Key concepts

- **Triggers** — HTTP, Service Bus, Blob, Event Grid, Timer
- **Bindings** — input/output connections (Cosmos DB, Storage, Service Bus)
- **Durable Functions** — orchestrate multi-step AI workflows (optional advanced)
- **Managed identity** — authenticate to Key Vault, Storage, Cosmos without secrets in code

## Exam tips

- Match trigger type to scenario (blob upload → Blob trigger; API → HTTP)
- Know consumption vs premium plans for cold start / VNet needs
- Use `AzureWebJobsStorage` and connection strings vs managed identity

## Azure CLI

```bash
# Create storage account (required for Functions)
az storage account create \
  --name stai200funcs \
  --resource-group rg-ai200 \
  --location eastus \
  --sku Standard_LRS

# Create Function App (Python)
az functionapp create \
  --name func-ai200 \
  --resource-group rg-ai200 \
  --storage-account stai200funcs \
  --consumption-plan-location eastus \
  --runtime python \
  --functions-version 4 \
  --os-type Linux
```

## Python — Service Bus triggered embedding function

```python
import azure.functions as func
import json
import logging

app = func.FunctionApp()

@app.service_bus_queue_trigger(
    arg_name="msg",
    queue_name="embed-jobs",
    connection="ServiceBusConnection",
)
def process_embedding(msg: func.ServiceBusMessage):
    payload = json.loads(msg.get_body().decode("utf-8"))
    doc_id = payload["documentId"]
    logging.info("Processing document %s", doc_id)
    # Fetch blob, generate embedding, store in Cosmos DB
```

## Learn more

- [Azure Functions Python developer guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-python)
- [Azure Functions triggers and bindings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings)
