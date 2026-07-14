---
title: Verify the deployment
pathSlug: implement-container-application-hosting-on-azure
moduleName: Manage containers in Azure Container Apps
---
## Overview

After deploying a container, verify that the application **starts and responds**. Use the default hostname from Azure CLI, then open it in a browser or call it with `curl`. If startup fails, use the troubleshooting tools (log stream, filesystem logs, Kudu).

## Short notes (exam revision)

- Get hostname: `az webapp show ... --query defaultHostName -o tsv`
- Smoke test: browser or `curl https://<hostname>`
- Failure path: container logs / log stream / Kudu (troubleshooting module)

## Get the app URL

```bash
az webapp show \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --query defaultHostName \
  --output tsv
```

Open `https://<defaultHostName>` in a browser, or:

```bash
curl "https://$(az webapp show \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --query defaultHostName -o tsv)"
```

## If verification fails

Typical next steps:

1. Stream logs: `az webapp log tail`
2. Confirm filesystem logging is enabled
3. Check Kudu Environment and `/home/LogFiles/`
4. Revisit port (`WEBSITES_PORT`), bind address (`0.0.0.0`), image/auth

## Use cases

- Post-deploy gate in a pipeline: fail the job if `curl` doesn’t return HTTP 200
- After image tag update to `v2`, confirm the new host still serves `/health`
- Hand-off checklist: hostname works before closing the change window

## Exam tips

- Know `az webapp show --query defaultHostName`
- Verification is separate from “deploy succeeded” — always test HTTP response
- Tie failures back to the troubleshoot topics (logs, Kudu, common issues)

## Learn more

- [az webapp show](https://learn.microsoft.com/en-us/cli/azure/webapp#az-webapp-show)
- [Troubleshoot App Service diagnostics](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
