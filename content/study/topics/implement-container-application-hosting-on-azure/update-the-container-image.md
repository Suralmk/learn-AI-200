---
title: Update the container image
pathSlug: implement-container-application-hosting-on-azure
moduleName: Manage containers in Azure Container Apps
---
## Overview

To release a new version with a **different tag**, update the configured image tag with the CLI. App Service **restarts** the web app automatically and pulls the new image on each instance.

## Short notes (exam revision)

- Change tag → `az webapp config container set --container-image-name ...`
- New/different tag = App Service restarts and pulls automatically
- Same tag (`latest`) overwritten = App Service does **not** detect the change by itself
- To pick up same-tag updates: **manual restart** or **continuous deployment** webhook
- On restart, `docker pull` runs and pulls **only changed layers**

## Update with a new tag

```bash
az webapp config container set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --container-image-name myregistry.azurecr.io/docprocessor:v2
```

App Service restarts and pulls `docprocessor:v2` on every instance.

## Same-tag updates (for example `latest`)

If you push a new image to the **same tag**, App Service does not detect the change automatically. Behavior on restart:

- Runs `docker pull`
- Pulls only changed layers
- Uses cached layers when nothing changed

To get the new bits for the same tag:

1. Restart the web app manually, or
2. Enable continuous deployment so a registry webhook triggers the restart

## Use cases

- Promote AI API `docprocessor:v1` → `docprocessor:v2` with a deterministic tag bump
- Hotfix pushed to `latest` during a lab — know you must restart or CD, not just push
- Rollout script that only changes `--container-image-name` and relies on automatic restart

## Exam tips

- Different tag → `config container set` is enough (auto restart)
- Same tag → not auto-detected; restart or CD required
- Prefer versioned tags for reliable, exam-safe deployments

## Learn more

- [Update a custom container](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [az webapp config container](https://learn.microsoft.com/en-us/cli/azure/webapp/config/container)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
