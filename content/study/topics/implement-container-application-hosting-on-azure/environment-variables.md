---
title: Environment variables
pathSlug: implement-container-application-hosting-on-azure
moduleName: 'Project: Example — Deploying a container to Azure Container Apps'
---
## Setup

Copy the template and edit values:

```bash
cp .env.example .env
```

---

## Application

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `Quote API` | Application name |
| `APP_VERSION` | `1.0.0` | Version string |
| `ENVIRONMENT` | `development` | Environment label (`development`, `production`) |
| `LOG_LEVEL` | `INFO` | Log level (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `HOST` | `0.0.0.0` | Server bind address |
| `PORT` | `8000` | Server port |

## Azure deploy (`deploy.sh` / `deploy.ps1`)

| Variable | Default | Description |
|----------|---------|-------------|
| `RESOURCE_GROUP` | `quote-api-rg` | Azure resource group |
| `LOCATION` | `eastus` | Azure region |
| `ACR_NAME` | `quoteapiacr` | Container registry name (must be globally unique) |
| `CONTAINERAPPS_ENV` | `quote-api-env` | Container Apps environment |
| `CONTAINER_APP` | `quote-api` | Container App name |
| `IMAGE_NAME` | `quote-api` | Docker image name |

## GitHub Actions (repository secrets)

| Variable | Description |
|----------|-------------|
| `AZURE_CREDENTIALS` | Service principal JSON for `azure/login@v2` |
| `AZURE_RESOURCE_GROUP` | Resource group used in the workflow |

## Short notes

- Bind `HOST=0.0.0.0` so Azure can reach the process  
- `PORT=8000` must match Container Apps `--target-port`  
- Override `ACR_NAME` when the default name is already taken  

## Repository

[https://github.com/Suralmk/azure-contianers](https://github.com/Suralmk/azure-contianers)
