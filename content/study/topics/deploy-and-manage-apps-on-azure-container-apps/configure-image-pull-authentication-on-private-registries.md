---
title: "Configure image pull authentication on private registries"
pathSlug: "deploy-and-manage-apps-on-azure-container-apps"
moduleName: "Deploy a container to Container Apps"
---

## Overview

Azure Container Apps must authenticate to **private registries** (commonly **Azure Container Registry**) before it can pull your AI workload images. Choose admin credentials, registry credentials secrets, or (preferred) **managed identity**.

## Key concepts

- **ACR** — private Docker registry for your images
- **Registry credentials** — username/password or identity-based pull
- **Managed identity** — AcrPull role on the Container App / environment
- **Image reference** — `myacr.azurecr.io/ai-api:v1`

## Exam tips

- Prefer managed identity over ACR admin user for production
- Know how to grant `AcrPull` to the Container App’s identity
- Image pull failures usually show as revision stuck in *Provisioning* / *Failed*

## Azure CLI

```bash
# Create ACR and build/push an image
az acr create --resource-group rg-ai200 --name acrailearn --sku Basic
az acr build --registry acrailearn --image ai-api:v1 .

# Enable system-assigned identity on the container app
az containerapp identity assign \
  --name ai-api \
  --resource-group rg-ai200 \
  --system-assigned

# Grant AcrPull to the app identity
PRINCIPAL_ID=$(az containerapp show \
  --name ai-api \
  --resource-group rg-ai200 \
  --query identity.principalId -o tsv)

az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role AcrPull \
  --scope $(az acr show --name acrailearn --query id -o tsv)

# Point the app at the private image
az containerapp update \
  --name ai-api \
  --resource-group rg-ai200 \
  --image acrailearn.azurecr.io/ai-api:v1
```

## Python

```python
# No auth code in the app for image pull — pull auth is infrastructure.
# Ensure your CI builds tag and push private images that ACA can pull:

# docker build -t acrailearn.azurecr.io/ai-api:v1 .
# az acr login --name acrailearn
# docker push acrailearn.azurecr.io/ai-api:v1
```

## Learn more

- [Azure Container Registry authentication](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication)
- [Container Apps managed identities](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
