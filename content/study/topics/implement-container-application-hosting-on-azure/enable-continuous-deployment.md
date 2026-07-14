---
title: Enable continuous deployment
pathSlug: implement-container-application-hosting-on-azure
moduleName: Manage containers in Azure Container Apps
---
## Overview

For automated deployments, configure App Service to pull new images automatically when you push to the registry. This pairs well with **CI/CD** pipelines and solves the “same tag not detected” problem by having the registry **webhook** trigger a restart.

## Short notes (exam revision)

- Enable with: `az webapp deployment container config --enable-cd true`
- Command returns a **webhook URL**
- Point your registry (ACR webhook on **push**) at that URL
- Best when pipelines push images and you want App Service to pick them up without a manual restart

## Enable continuous deployment

```bash
az webapp deployment container config \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --enable-cd true
```

This returns a webhook URL. Configure the container registry to call the webhook when new images are pushed.

### ACR webhook

In Azure Container Registry settings, create a **webhook** that triggers on **push** events and targets the App Service continuous deployment URL.

## Flow

1. CI builds and pushes `myregistry.azurecr.io/docprocessor:latest` (or a new tag)
2. ACR webhook fires
3. App Service restarts / pulls updated image
4. New revision of the container runs

## Use cases

- GitHub Actions pushes a new AI model-serving image; webhook rolls it to App Service
- Team always uses `latest` in a non-prod slot and relies on CD instead of manual restarts
- Platform standard: push → webhook → pull, no portal clicks after setup

## Exam tips

- Know the CLI: `az webapp deployment container config --enable-cd true`
- Output = webhook URL to configure on the registry
- ACR: webhook on **push**
- CD is the automated answer when asked how App Service learns about same-tag updates

## Learn more

- [Continuous deployment for custom containers](https://learn.microsoft.com/en-us/azure/app-service/deploy-ci-cd-custom-container)
- [ACR webhooks](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-webhook)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
