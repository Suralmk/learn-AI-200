---
title: Configure container logs
pathSlug: implement-container-application-hosting-on-azure
moduleName: Troubleshoot container apps
---
## Overview

App Service captures output from your container's **stdout** and **stderr** streams. That output includes application logs, framework messages, and error output. Enable container logging to **persist** these logs so you can review them in the portal and Azure CLI.

## Short notes (exam revision)

- Container logging must be **enabled** — without it, you may only get limited live output
- `--docker-container-logging filesystem` stores logs on the App Service file system
- Logs land at `/home/LogFiles/` and are available via diagnostic tools (stream, Kudu)
- App Service does **not** invent your logs — write meaningful output to **stdout/stderr**
- Most logging frameworks support console handlers that App Service captures automatically

## What container logs capture

| Type | What you see |
|------|----------------|
| **Application output** | Messages your app writes to stdout |
| **Error output** | Exception traces and errors on stderr |
| **Framework logs** | Web server startup, request logs, framework diagnostics |
| **Platform messages** | App Service messages about container lifecycle events |

## Enable container logging

```bash
az webapp log config \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --docker-container-logging filesystem
```

The `filesystem` option stores logs in the App Service file system. After enabling:

- Browse persisted logs at `/home/LogFiles/` (via Kudu Debug Console)
- Stream live logs with `az webapp log tail` or portal **Log stream**

## Use cases

- **Persist crash evidence** — application threw an exception overnight; filesystem logs remain after the process died
- **Startup diagnosis** — framework and platform lifecycle messages show whether the container pulled, started, and listened successfully
- **Shared troubleshooting** — download or browse `/home/LogFiles/` and share with teammates / support
- **AI workloads** — log model load failures, missing env vars, and inference errors to stdout so App Service can capture them

## Exam tips

- Know the CLI: `az webapp log config ... --docker-container-logging filesystem`
- Remember the path: `/home/LogFiles/`
- Distinguish **configure/persist** (this topic) vs **stream live** (`az webapp log tail`)
- Apps must bind logging to console; App Service only captures stdout/stderr

## Learn more

- [Enable and configure logging for Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs)
- [Troubleshoot containers on App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
