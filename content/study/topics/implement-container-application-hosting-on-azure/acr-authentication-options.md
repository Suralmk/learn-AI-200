---
title: ACR authentication options
pathSlug: implement-container-application-hosting-on-azure
moduleName: Deploy containers to Azure App Service
---
## Overview

Azure Container Registry supports two authentication methods when deploying to App Service: **managed identity** or **admin credentials**. Choose based on security requirements and who owns permission setup (app team vs platform team).

## Short notes (exam revision)

| Method | Best for | Trade-off |
|--------|----------|-----------|
| **Managed identity** | Production | Needs `AcrPull` role assignment; no stored registry password |
| **Admin credentials** | Dev / quick start | Simpler setup; credentials in App Service config; manual rotation |

- Managed identity is the **recommended** production approach
- Two identity types: **system-assigned** vs **user-assigned**
- Admin path: `az acr update --name myregistry --admin-enabled true`

## Managed identity authentication

App Service authenticates to ACR using an Azure identity instead of stored credentials. That removes password rotation concerns and improves security auditing.

### System-assigned managed identity

- Tied to the **web app lifecycle**
- Azure creates it when you enable it on the web app
- Azure deletes it when you delete the app
- Simpler when **only this web app** needs the identity

### User-assigned managed identity

- Exists **independently** of the web app
- You create it as a separate Azure resource
- Assign it to **one or more** web apps
- Better when multiple apps share registry access, or you configure permissions **before** creating the web app

### Role requirement

The identity must have the **`AcrPull`** role on the registry (often applied by a platform team).

## Admin credentials authentication

Admin credentials use a username and password stored on the ACR.

- Simpler for **development** — no role assignments required
- Credentials are stored in App Service configuration
- Requires **manual rotation** if compromised

Enable the admin user:

```bash
az acr update --name myregistry --admin-enabled true
```

## Use cases

- **Production AI API** — system- or user-assigned identity + `AcrPull`, never enable admin
- **Shared ACR across several web apps** — user-assigned MI assigned to each app
- **Local workshop / lab** — temporary admin credentials for fastest first deploy

## Exam tips

- Prefer **managed identity** on exam scenarios that mention production / least privilege
- System-assigned = lifecycle-bound; user-assigned = reusable across apps
- Admin auth requires **admin-enabled** on ACR
- Know that identity still needs **`AcrPull`** — enabling MI alone is not enough

## Learn more

- [Authenticate with managed identity to ACR](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication-managed-identity)
- [ACR admin user](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication)
- [Configure App Service to pull from ACR](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
