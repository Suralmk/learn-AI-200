---
title: Bulk editing
pathSlug: implement-container-application-hosting-on-azure
moduleName: Configure app settings for Azure container environments
---
## Overview

When configuring many settings, bulk edit is faster than one-by-one commands. Export settings as JSON, edit, then import.

## Short notes (exam revision)

- Export: `az webapp config appsettings list --output json > settings.json`
- Import file with `@` prefix: `--settings @settings.json`
- Portal: **Environment variables** → **Advanced edit** (JSON)

## Export current settings

```bash
az webapp config appsettings list \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --output json > settings.json
```

Exported shape:

```json
[
  {
    "name": "STORAGE_ACCOUNT_NAME",
    "value": "mystorageaccount",
    "slotSetting": false
  },
  {
    "name": "LOG_LEVEL",
    "value": "INFO",
    "slotSetting": false
  }
]
```

## Import updated settings

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --settings @settings.json
```

## Portal

Azure portal → app → **Environment variables** → **Advanced edit** for JSON bulk modifications.

## Use cases

- Clone prod settings into a staging app (edit values, import)
- Add twenty feature flags in one pass for an AI orchestration service
- Keep a checked-in `settings.dev.json` template for labs (no secrets)

## Exam tips

- Know `@settings.json` file syntax for CLI
- `slotSetting` in JSON ties to deployment-slot behavior

## Learn more

- [Configure app settings](https://learn.microsoft.com/en-us/azure/app-service/configure-common)
- [az webapp config appsettings](https://learn.microsoft.com/en-us/cli/azure/webapp/config/appsettings)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
