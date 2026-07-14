---
title: Common issues and solutions
pathSlug: implement-container-application-hosting-on-azure
moduleName: Troubleshoot container apps
---
## Overview

Knowing the common container deployment failures on App Service helps you troubleshoot faster on labs and on the exam. Use a consistent loop: **symptoms → diagnose with logs/Kudu → map to likely cause → apply the fix**.

## Short notes (exam revision)

| Issue | First checks |
|-------|----------------|
| Container won't start | Log stream, image/credentials, local run with same config |
| 404 after deploy | `WEBSITES_PORT`, bind `0.0.0.0` (not localhost), routes |
| Missing env vars | App settings saved? Kudu Environment? Typo in names? |
| Slow cold starts | Image size, startup time in logs, **Always On** |

Critical settings to remember:

- **`WEBSITES_PORT`** — must match the port your container listens on
- Bind address: **`0.0.0.0`**, not `127.0.0.1` / `localhost`
- Logging: enable filesystem + use stream; verify settings in Kudu

---

## Container fails to start

### Symptoms

The application URL returns an error, and container logs show startup failures.

### Diagnosis

- Check container logs with **log stream** for application errors
- Verify the **image exists** in the registry and **pull credentials** are correct
- Confirm the container **runs locally** with the same configuration

### Common causes

- Missing environment variables required at startup
- Port mismatch between `WEBSITES_PORT` and the port the container listens on
- Application crashes during init (missing dependencies, bad startup command)

### Use case

An AI document processor image deploys but crashes immediately — stream shows a missing `AZURE_STORAGE_CONNECTION_STRING`. Fix: add the app setting, restart, re-check stream.

---

## 404 responses after deployment

### Symptoms

The container appears to start, but HTTP requests return **404 Not Found**.

### Diagnosis

- Verify `WEBSITES_PORT` matches the port the application listens on
- Confirm the app binds to **`0.0.0.0`**, not `localhost`
- Confirm the app serves the **root path** or expected routes

### Common causes

- Listening on localhost only (App Service cannot reach the process)
- Incorrect port configuration
- Routing not configured for expected paths

### Use case

A Flask/FastAPI container listens on `127.0.0.1:8000`. App Service marks the site unhealthy or returns empty/404-style failures. Fix: listen on `0.0.0.0:8000` and set `WEBSITES_PORT=8000`.

---

## Missing environment variables

### Symptoms

Logs show errors about missing configuration or undefined values.

### Diagnosis

- Verify app settings were **saved** in the portal or CLI
- Check **Environment** in Kudu to confirm injection
- If SSH output looks incomplete, trust the SCM **/Env** (Environment) view

### Common causes

- Settings not saved after editing
- Typos in setting names
- App reading variables before App Service injects them (race / bad startup order)

### Use case

Portal showed a setting in the UI draft but Save was never clicked. Kudu Environment does not list the key — after Save + restart, the variable appears and the app starts cleanly.

---

## Slow cold starts

### Symptoms

First requests after idle periods take much longer than later requests.

### Diagnosis

- Check container **image size** (`docker images`)
- Review **application startup time** in logs
- Verify **Always On** setting

### Solutions

- Enable **Always On** to keep the app warm
- Reduce image size (smaller base images, multi-stage builds)
- Defer heavy initialization (lazy-load models, warm-up after ready)

### Use case

An LLM wrapper container is 4 GB and takes 45s to load weights on first request after idle. Mitigation: smaller image, Always On on a non-free plan, and optional warm-up endpoint.

---

## Troubleshooting cheat sheet

```bash
# Persist logs
az webapp log config \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --docker-container-logging filesystem

# Live diagnose
az webapp log tail \
  --resource-group myResourceGroup \
  --name myDocumentProcessor
```

Then open Kudu:

```text
https://<app-name>.scm.azurewebsites.net
```

Check Environment + `/home/LogFiles/`.

## Exam tips

- Map each symptom to tools: **stream** (live), **filesystem logs** (persist), **Kudu** (env + files)
- Port issues almost always involve `WEBSITES_PORT` and bind interface
- Localhost bind is a classic trap question
- Always On improves cold start experience; it does not replace fixing oversized images
- “Container started but 404” ≠ “image pull failed” — different diagnosis paths

## Learn more

- [Troubleshoot HTTP errors of Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-http-502-http-503)
- [Configure custom containers](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [App Service always on](https://learn.microsoft.com/en-us/azure/app-service/configure-common)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
