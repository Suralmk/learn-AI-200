---
title: Diagnostic console (Kudu)
pathSlug: implement-container-application-hosting-on-azure
moduleName: Troubleshoot container apps
---
## Overview

**Kudu** (the **SCM site**) is the advanced diagnostic console for App Service. It exposes app configuration views, log files in mounted storage, and diagnostic endpoints. Access it at:

```text
https://<app-name>.scm.azurewebsites.net
```

The SCM site runs as a **separate site** for your app and requires authentication with credentials that can manage the web app.

## Short notes (exam revision)

- URL pattern: `https://<app-name>.scm.azurewebsites.net`
- Not the same process/environment as your app container
- Great for: **Environment** page (env vars), **Debug console** (browse `/home`), **Diagnostic dump** (ZIP)
- Logs often at `/home/LogFiles/`
- Limitation: cannot browse the **full container filesystem** or inspect **running processes** inside the app container from Kudu alone
- For in-container inspection: enable **SSH** in the image (when supported)

## Key Kudu features for container troubleshooting

### Environment variables

The **Environment** page lists all environment variables available to your container. Use it to:

- Confirm **app settings** were applied correctly
- See **system-provided** App Service variables
- Cross-check names/values when the app complains about missing config

### File system browser (Debug console)

Browse mounted storage paths such as `/home`:

- Log files at `/home/LogFiles/`
- Any content your app writes under `/home`

### Diagnostic dump

Download a **ZIP** containing log files, configuration, and diagnostic information. Useful for:

- Offline analysis
- Sharing with Microsoft Support or teammates

## Limitations (know for the exam)

| You can do in Kudu | You cannot do in Kudu alone |
|--------------------|-----------------------------|
| View environment variables | Browse the full app container filesystem |
| Browse `/home` mounted storage | Inspect processes inside the running app container |
| Download a diagnostic dump | Replace SSH for deep in-container debugging |

If shell output (for example via SSH) looks incomplete for env vars, verify settings with the SCM **Environment /Env** view.

## Use cases

- **Missing app setting suspicion** — open Environment and confirm `WEBSITES_PORT`, connection strings, and custom keys are present
- **Find persisted crash logs** — Debug console → `/home/LogFiles/` after enabling filesystem logging
- **Support escalation** — generate a diagnostic dump ZIP and attach it to a ticket
- **Config vs container confusion** — remember SCM ≠ app container when files under `/app` or `/usr` are missing from Kudu

## Exam tips

- Memorize SCM URL: `https://<app-name>.scm.azurewebsites.net`
- Kudu verifies **injected** settings; it does not mean you are inside the app container
- Pair with log stream for live output and filesystem logging for persistence
- SSH = in-container; Kudu = SCM side diagnostics

## Learn more

- [Kudu wiki / App Service diagnostics](https://github.com/projectkudu/kudu/wiki)
- [Access Kudu for App Service](https://learn.microsoft.com/en-us/azure/app-service/resources-kudu)
- [Troubleshoot diagnostic logs](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
