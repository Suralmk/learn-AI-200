---
title: Stream container logs
pathSlug: implement-container-application-hosting-on-azure
moduleName: Troubleshoot container apps
---
## Overview

The **log stream** provides real-time access to container output. Use it to debug startup issues, monitor live traffic, and observe application behavior during testing. Streaming is for **live** visibility; enable container logging (filesystem) when you also need **persisted** history.

## Short notes (exam revision)

- CLI command: `az webapp log tail`
- Portal path: Web App → **Monitoring** → **Log stream**
- Shows the same real-time output in browser or terminal
- Press **Ctrl+C** to stop streaming in the CLI
- Scaled-out apps: stream shows output from **all instances**; each line includes an **instance identifier**
- Best for: startup failures, live debugging, short test sessions — not long-term retention alone

## Stream logs with Azure CLI

```bash
az webapp log tail \
  --resource-group myResourceGroup \
  --name myDocumentProcessor
```

The log stream displays new entries as they appear. Stop with `Ctrl+C`.

## Stream logs in the Azure portal

1. Open your web app in the Azure portal
2. Under **Monitoring**, select **Log stream**
3. Watch the same real-time container output in the browser viewer

## Multi-instance tip

When the app is scaled out, log stream includes lines from every instance. Use the **instance identifier** on each line to correlate which replica produced a message.

## Use cases

- **Container won't start** — watch pull/start errors as they happen after a redeploy
- **Validate a fix live** — hit an API endpoint and confirm expected log lines appear immediately
- **Traffic spikes during a demo/test** — observe request and error output across instances
- **Port / bind mistakes** — see platform vs app messages when the site returns errors after deploy

## Exam tips

- Associate **Log stream** ↔ `az webapp log tail`
- Know it is **real-time**, not a full historical archive
- Scaled-out = all instances; lines are tagged with instance id
- Enable filesystem logging first if you need to keep logs after the stream session ends

## Related

- Configure container logs (`az webapp log config` + `/home/LogFiles/`)
- Diagnostic console (Kudu) for browsing persisted files and env vars

## Learn more

- [Stream logs](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs#stream-logs)
- [az webapp log](https://learn.microsoft.com/en-us/cli/azure/webapp/log)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
