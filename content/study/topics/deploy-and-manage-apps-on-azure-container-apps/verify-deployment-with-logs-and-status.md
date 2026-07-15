---
title: "Verify deployment with logs and status"
pathSlug: "deploy-and-manage-apps-on-azure-container-apps"
moduleName: "Deploy a container to Container Apps"
---

## Overview

After deploying to Azure Container Apps, verify the revision is healthy using **status**, **replicas**, and **logs**. For AI APIs, confirm the app starts, binds the target port, and answers health checks.

## Key concepts

- **Revision** — immutable snapshot of app configuration + image
- **Provisioning / Running / Failed** — revision lifecycle states
- **Log stream** — live stdout/stderr from containers
- **Ingress URL** — public or internal endpoint for smoke tests

## Exam tips

- Failed pulls and crash loops show up in revision status and logs first
- Use `az containerapp revision list` and `logs show` before redeploying
- Health probes (later module) reduce false failures from slow AI startup

## Azure CLI

```bash
# App + revision status
az containerapp show \
  --name ai-api \
  --resource-group rg-ai200 \
  --query "{fqdn:properties.configuration.ingress.fqdn,latestRevision:properties.latestRevisionName,provisioningState:properties.provisioningState}"

az containerapp revision list \
  --name ai-api \
  --resource-group rg-ai200 \
  -o table

# Stream logs
az containerapp logs show \
  --name ai-api \
  --resource-group rg-ai200 \
  --follow

# Smoke test the ingress
FQDN=$(az containerapp show \
  --name ai-api \
  --resource-group rg-ai200 \
  --query properties.configuration.ingress.fqdn -o tsv)

curl -s "https://$FQDN/health"
```

## Python

```python
import urllib.request

# Quick verification helper after deploy
def check_health(base_url: str) -> None:
    with urllib.request.urlopen(f"{base_url.rstrip('/')}/health", timeout=10) as resp:
        print(resp.status, resp.read().decode())

# check_health("https://ai-api.<region>.azurecontainerapps.io")
```

## Learn more

- [Monitor Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/observe-overview)
- [Application logs in Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/logging)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
