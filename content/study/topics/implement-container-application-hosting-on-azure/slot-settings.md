---
title: Slot settings
pathSlug: implement-container-application-hosting-on-azure
moduleName: Configure app settings for Azure container environments
---
## Overview

Deployment **slots** let you run different app versions side-by-side in the same App Service plan. Each slot has its own hostname and configuration but shares plan compute. **Swap** promotes staging to production.

Some settings must **stay with the slot** (not move with the code on swap). Mark those as **slot settings**.

## Short notes (exam revision)

- Slot settings stay with the slot during swap
- CLI: `--slot staging --slot-settings KEY=value`
- List slot-sticky settings: query `[?slotSetting==\`true\`].name`
- Good sticky settings: `ENVIRONMENT`, env-specific API URLs, feature flags, diagnostic verbosity

## Mark settings as slot settings

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --slot staging \
  --slot-settings \
    ENVIRONMENT=staging \
    API_ENDPOINT=https://api-staging.example.com
```

## Why sticky settings matter

| Category | Example |
|----------|---------|
| Environment identifiers | `ENVIRONMENT=production` must not swap to staging |
| Env-specific endpoints | Different API or DB targets per slot |
| Feature flags | Enable experimental features only in staging |
| Diagnostics | Verbose logging in staging only |

## List slot settings

```bash
az webapp config appsettings list \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --query "[?slotSetting==\`true\`].name"
```

## Use cases

- Staging slot points at a test model endpoint; production keeps the live endpoint after swap
- Verbose `LOG_LEVEL` sticky on staging so swaps don’t make production noisy
- Blue/green style promote of an AI inference container image with env-safe settings

## Exam tips

- Swap moves **app** config that is not sticky; slot settings remain
- `--slot-settings` vs `--settings` is the critical CLI distinction
- Slots share plan resources but not sticky configuration

## Learn more

- [Set up staging environments / slots](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots)
- [Sticky settings](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots#which-settings-are-swapped)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
