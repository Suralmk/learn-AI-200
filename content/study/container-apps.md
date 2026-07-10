---
title: Container Apps & ACR for AI Workloads
domain: containers
description: Host and deploy containerized AI applications with Azure Container Registry and Container Apps.
order: 1
---

## Overview

AI-200 expects you to package AI backends (APIs, workers, inference services) as containers and deploy them on Azure Container Apps or AKS.

## Key concepts

- **Azure Container Registry (ACR)** — private registry for Docker images
- **Azure Container Apps** — serverless container hosting with scale-to-zero
- **AKS** — full Kubernetes when you need more control
- **KEDA** — event-driven autoscaling (e.g., scale on Service Bus queue depth)

## Exam tips

- Know when to choose Container Apps vs AKS (simplicity vs control)
- Understand environment variables vs secrets for model endpoints
- KEDA scales based on external metrics, not just CPU/memory

## Azure CLI

```bash
# Create a resource group and ACR
az group create --name rg-ai200 --location eastus
az acr create --resource-group rg-ai200 --name acrailearn --sku Basic

# Build and push an image
az acr build --registry acrailearn --image ai-api:v1 .

# Create a Container Apps environment
az containerapp env create \
  --name cae-ai200 \
  --resource-group rg-ai200 \
  --location eastus

# Deploy a container app
az containerapp create \
  --name ai-api \
  --resource-group rg-ai200 \
  --environment cae-ai200 \
  --image acrailearn.azurecr.io/ai-api:v1 \
  --target-port 8000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 5
```

## Python — health check endpoint

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/embed")
async def embed(text: str):
  # Call Azure OpenAI or local model
  return {"embedding": [0.1, 0.2, 0.3]}
```

## Learn more

- [Azure Container Apps documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)
