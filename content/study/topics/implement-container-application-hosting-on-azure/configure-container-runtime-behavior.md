---
title: Configure container runtime behavior
pathSlug: implement-container-application-hosting-on-azure
moduleName: Configure app settings for Azure container environments
---
## Overview

Container runtime settings control how App Service executes your container: startup, networking, file system, and health monitoring. Correct configuration means reliable starts and better behavior under load.

## Short notes (exam revision)

| Setting | Key fact |
|---------|----------|
| Startup file | `--startup-file` overrides Dockerfile **CMD** (ENTRYPOINT unchanged) |
| Port | `WEBSITES_PORT` when not on 80/8080; App Service TLS terminates; **one** HTTP port |
| Persistent storage | `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true` → `/home` persists & shared across instances |
| Always On | Keeps warm; needs **Basic+**; avoids ~20 min idle cold starts |
| Health check | Path returning 200; ping ~every minute; bad instances removed after repeated fails |

---

## Startup commands

App Service normally uses Dockerfile ENTRYPOINT/CMD. Override with a custom startup when you need runtime args, init scripts, or different default behavior.

Common scenarios:

- Pass environment-specific arguments
- Run DB migrations before starting the app
- Start multiple processes
- Override framework defaults

```bash
az webapp config set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --startup-file "gunicorn --bind=0.0.0.0:8000 --workers=4 app:application"
```

Startup command replaces **CMD**. **ENTRYPOINT** stays unless you change the image.

Shell processing:

```bash
az webapp config set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --startup-file "/bin/bash -c 'python migrate.py && gunicorn app:application'"
```

---

## Port configuration

App Service auto-routes when the container listens on **80** or **8080**. Other ports need `WEBSITES_PORT`.

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --settings WEBSITES_PORT=8000
```

- Incoming HTTPS is terminated by the platform; the container still receives HTTP
- Only **one** HTTP port is supported for a custom container

| Framework | Default port | Setting |
|-----------|--------------|---------|
| Node.js (Express) | 3000 | `WEBSITES_PORT=3000` |
| Python (Gunicorn) | 8000 | `WEBSITES_PORT=8000` |
| Java (Spring Boot) | 8080 | `WEBSITES_PORT=8080` |
| ASP.NET Core | 80 | Usually none needed |

Also bind to **`0.0.0.0`**, not localhost.

---

## Persistent storage

By default, container FS writes are **ephemeral** (lost on restart / host move).

Enable App Service storage at `/home` for Linux custom containers (off by default):

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```

With this enabled:

- `/home` survives restarts
- All scaled-out instances share `/home`
- `/home/LogFiles` holds container/app logs

Write persistent output under `/home` (for example `/home/output/`). Quota is per **plan** (shared by apps). For large/high-I/O needs, mount Azure Storage as an extra volume.

---

## Always On

After ~**20 minutes** idle, apps can unload; the next request causes a **cold start** (seconds to minutes for large images).

```bash
az webapp config set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --always-on true
```

App Service sends periodic pings to keep the app warm. Requires **Basic** tier or higher.

Recommended for:

- Production latency-sensitive apps
- Long startup / large images
- Background processes or long-lived connections

---

## Health checks

Health checks ping a path and restart/remove unhealthy instances.

```bash
az webapp config set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --generic-configurations '{"healthCheckPath": "/health"}'
```

- Return HTTP **200** when healthy
- Can check DB, dependencies, memory/disk
- Platform pings about **every minute**
- After repeated failures (default **10**), instance is removed from load balancer; prolonged failure can replace it
- Changing health check config **restarts** the app

### Simple endpoint

```python
@app.route("/health")
def health_check():
    return {"status": "healthy"}, 200
```

### Dependency-aware endpoint

```python
@app.route("/health")
def health_check():
    try:
        db.execute("SELECT 1")
        storage.list_containers()
        return {"status": "healthy"}, 200
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}, 503
```

---

## Use cases

- Gunicorn on 8000 → set `WEBSITES_PORT=8000` and bind `0.0.0.0`
- Document processor writes results to `/home/output` with storage enabled
- Production AI API enables Always On + `/health` that checks model loader readiness

## Exam tips

- `WEBSITES_PORT` vs 80/8080 auto behavior
- Storage flag exact name: `WEBSITES_ENABLE_APP_SERVICE_STORAGE`
- Always On = Basic+; idle ~20 minutes without it
- Health path changes cause restart; fail count ~10 then remove from rotation

## Learn more

- [Configure custom containers](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [Health check](https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check)
- [Configure common settings](https://learn.microsoft.com/en-us/azure/app-service/configure-common)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
