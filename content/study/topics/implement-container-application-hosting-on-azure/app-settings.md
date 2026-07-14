---
title: App settings
pathSlug: implement-container-application-hosting-on-azure
moduleName: Configure app settings for Azure container environments
---
## Overview

Application settings provide configuration values to your containerized app at runtime. App Service injects them as **environment variables** when the container starts. Using app settings instead of hardcoded values lets you deploy the **same image** across environments with environment-specific config.

## Short notes (exam revision)

- App settings = name/value pairs → injected as env vars
- CLI: `az webapp config appsettings set --settings KEY=value`
- All app settings are **encrypted at rest**; decrypted only when injected
- Names: letters, numbers, underscores only
- Linux + .NET nested keys: use **double underscores** (`ConnectionStrings__DefaultConnection`), not colons

## Create or update app settings

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --settings \
    STORAGE_ACCOUNT_NAME=mystorageaccount \
    LOG_LEVEL=INFO \
    MAX_DOCUMENT_SIZE_MB=50
```

### Read in Python

```python
import os

storage_account = os.environ.get("STORAGE_ACCOUNT_NAME")
log_level = os.environ.get("LOG_LEVEL", "WARNING")
max_size = int(os.environ.get("MAX_DOCUMENT_SIZE_MB", 10))
```

## Naming rules

- Allowed characters: letters, numbers, underscores
- .NET nested config on Linux: `ConnectionStrings:DefaultConnection` → `ConnectionStrings__DefaultConnection`

## Encryption

App Service stores settings encrypted and decrypts them only when injecting into the container. This applies to **all** settings, whether sensitive or not.

## Use cases

- Same AI document-processor image for dev/stage/prod with different storage accounts and log levels
- Change `MAX_DOCUMENT_SIZE_MB` without rebuilding the container
- Avoid baking secrets or environment names into the Dockerfile

## Exam tips

- App settings ≠ rebuild — same image, different env
- Know double-underscore rule for .NET on Linux containers
- Remember encryption-at-rest for all settings

## Learn more

- [Configure app settings](https://learn.microsoft.com/en-us/azure/app-service/configure-common)
- [az webapp config appsettings](https://learn.microsoft.com/en-us/cli/azure/webapp/config/appsettings)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
