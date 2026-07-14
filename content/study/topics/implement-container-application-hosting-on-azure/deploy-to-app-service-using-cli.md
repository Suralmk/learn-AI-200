---
title: Deploy to App Service using CLI
pathSlug: implement-container-application-hosting-on-azure
moduleName: Deploy containers to Azure App Service
---
## Overview

Deploy a container to App Service from the command line when you need a **repeatable** workflow for scripts or CI pipelines. This approach assumes your image already exists in **Azure Container Registry** and App Service already has permission to pull it (often via **managed identity** + **`AcrPull`**, commonly granted by a platform team).

## Short notes (exam revision)

- Primary command: `az webapp create` with `--container-image-name`
- Creates the web app **and** sets the container image in one step
- Requires existing **resource group** and **App Service plan** in the examples
- Use full ACR image: `myregistry.azurecr.io/<image>:<tag>` for deterministic deploys
- Prefer an explicit **tag** (for example `v1`) over a floating `latest` for reproducibility

## Create the web app

```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myDocumentProcessor \
  --container-image-name myregistry.azurecr.io/docprocessor:v1
```

`az webapp create` creates the web app and configures the container image together. Use your ACR login server and image name, including a tag, so the deployment is deterministic.

## Prerequisites to remember

| Requirement | Why it matters |
|-------------|----------------|
| Image already in ACR | CLI deploy pulls an existing tag; it does not build the image |
| Pull permission | Managed identity + `AcrPull` (or admin credentials) must already work |
| Plan + RG exist | Example assumes `--plan` and resource group are already created |

## Use cases

- Paste the same create command into a release pipeline for an AI document processor API
- Redeploy a known good tag (`docprocessor:v1`) without using the portal
- Hand off a scripted deploy while platform owners manage identity/role assignments

## Exam tips

- Key flag: `--container-image-name` with full ACR path + tag
- CLI path pairs with **ACR authentication options** (identity/`AcrPull` assumed ready)
- Don’t confuse this with Container Apps YAML deploys — this is **App Service** `az webapp create`

## Learn more

- [az webapp create](https://learn.microsoft.com/en-us/cli/azure/webapp#az-webapp-create)
- [Deploy a custom container](https://learn.microsoft.com/en-us/azure/app-service/tutorial-custom-container)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
