---
title: Deploy script explained
pathSlug: implement-container-application-hosting-on-azure
moduleName: 'Project: Example — Deploying a container to Azure Container Apps'
---
## Overview

What `deploy.sh` / `deploy.ps1` runs, step by step — from resource group to a live Container App.

---

## Step 1 — Create resource group

```bash
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
```

| Flag | Meaning |
|------|---------|
| `--name` | Resource group (default: `quote-api-rg`) |
| `--location` | Azure region (default: `eastus`) |
| `--output none` | Quiet output |

**Why:** Keep ACR + Container Apps together for billing, RBAC, and easy cleanup (`az group delete`).

---

## Step 2 — Create Azure Container Registry

```bash
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true \
  --output none
```

| Flag | Meaning |
|------|---------|
| `--sku Basic` | Lowest cost SKU for learning |
| `--admin-enabled true` | Username/password so Container Apps can pull |

**Why:** Private registry near your Azure deploy for the Quote API image.

---

## Step 3 — Build and push (`az acr build`)

```bash
az acr build \
  --registry "$ACR_NAME" \
  --image "${IMAGE_NAME}:latest" \
  --file "$PROJECT_DIR/Dockerfile" \
  "$PROJECT_DIR"
```

**What it does:** Uploads source to Azure, builds in the cloud, pushes to ACR — a **Quick Task** with no local Docker required.

---

## Step 4 — Create Container Apps environment

```bash
az containerapp env create \
  --name "$CONTAINERAPPS_ENV" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none
```

**Why:** Apps must live inside an environment (shared networking/logging). One env can host many apps.

---

## Step 5 — Deploy Container App

Fetch ACR credentials:

```bash
ACR_LOGIN=$(az acr show --name "$ACR_NAME" --query loginServer -o tsv)
ACR_USER=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASS=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)
```

Create the app:

```bash
az containerapp create \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINERAPPS_ENV" \
  --image "${ACR_LOGIN}/${IMAGE_NAME}:latest" \
  --registry-server "$ACR_LOGIN" \
  --registry-username "$ACR_USER" \
  --registry-password "$ACR_PASS" \
  --target-port 8000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars APP_NAME="Quote API" ENVIRONMENT=production LOG_LEVEL=INFO \
  --output none
```

| Flag | Meaning |
|------|---------|
| `--target-port 8000` | Matches Uvicorn in the Dockerfile |
| `--ingress external` | Public HTTPS |
| `--min-replicas` / `--max-replicas` | Scale bounds |
| `--cpu` / `--memory` | Per-replica resources |
| `--env-vars` | Runtime configuration |

**Result:** Quote API live on Azure with managed HTTPS, scaling, and restarts.

## Exam / revision tips

- Environment before app  
- `--target-port` must match container listen port  
- Admin credentials used here for learning; production often prefers managed identity + `AcrPull`

## Repository

[https://github.com/Suralmk/azure-contianers](https://github.com/Suralmk/azure-contianers)
