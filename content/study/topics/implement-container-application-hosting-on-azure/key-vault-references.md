---
title: Key Vault references
pathSlug: implement-container-application-hosting-on-azure
moduleName: Configure app settings for Azure container environments
---
## Overview

For secrets that need centralized management, audit trails, or rotation, App Service can **reference Azure Key Vault**. The app still reads normal environment variables — no code changes required.

## Short notes (exam revision)

- Syntax: `@Microsoft.KeyVault(SecretUri=https://.../secrets/name)`
- App reads `API_KEY` as a normal env var after resolution
- Requires: **managed identity** on the web app + identity **permission to read secrets**
- No version in URI → latest version
- Secret rotation: App Service refreshes within **24 hours**; an app restart forces immediate refetch

## Set a Key Vault reference

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --settings \
    API_KEY="@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/api-key)"
```

App Service resolves the reference and injects the secret as `API_KEY`.

## Requirements

1. Managed identity enabled on the web app
2. Identity granted access to read secrets from Key Vault
3. Key Vault reference syntax in the app setting value

## Rotation behavior

- Unversioned secret URI → always latest version
- Background refresh of resolved values within **24 hours** after rotation
- Configuration change that **restarts** the app → immediate refetch

## Use cases

- Store OpenAI / third-party API keys in Key Vault; app only sees `API_KEY`
- Rotate storage keys without rebuilding or redeploying the container image
- Meet audit requirements where secret access must be centralized

## Exam tips

- Memorize `@Microsoft.KeyVault(SecretUri=...)`
- Identity + Key Vault access policy/RBAC is mandatory
- 24-hour refresh vs restart = immediate refetch

## Learn more

- [Use Key Vault references in App Service](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references)
- [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
