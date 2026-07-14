---
title: Commands reference
pathSlug: implement-container-application-hosting-on-azure
moduleName: 'Project: Example — Deploying a container to Azure Container Apps'
---
## Local

| Command | Description |
|---------|-------------|
| `uvicorn app.main:app --reload --port 8000` | Run API locally |
| `docker compose up --build` | Run with Docker Compose |
| `docker build -t quote-api:local .` | Build image locally |
| `python -m flake8 app/` | Lint code |

## Azure — login and resources

| Command | Description |
|---------|-------------|
| `az login` | Sign in to Azure |
| `az account set -s "Subscription Name"` | Select subscription |
| `az group create -n quote-api-rg -l eastus` | Create resource group |
| `az group delete -n quote-api-rg --yes` | Delete resource group |

## Azure — Container Registry

| Command | Description |
|---------|-------------|
| `az acr create -g quote-api-rg -n quoteapiacr --sku Basic --admin-enabled true` | Create ACR |
| `az acr login -n quoteapiacr` | Log Docker into ACR |
| `az acr build -r quoteapiacr -t quote-api:latest .` | Quick build and push |
| `az acr build -r quoteapiacr -f acr-task.yaml .` | Multi-step build (lint + push) |
| `az acr repository list -n quoteapiacr -o table` | List repositories |
| `az acr repository show-tags -n quoteapiacr --repository quote-api` | List image tags |

## Azure — ACR Tasks

| Command | Description |
|---------|-------------|
| `az acr task create -n quote-api-build -r quoteapiacr -f acr-task.yaml --context .` | Create a task |
| `az acr task run -n quote-api-build -r quoteapiacr` | Run task manually |
| `az acr task list -r quoteapiacr -o table` | List all tasks |
| `az acr task logs -r quoteapiacr --run-id <id>` | View build logs |
| `az acr task delete -n quote-api-build -r quoteapiacr --yes` | Delete a task |

### GitHub-triggered task

```bash
az acr task create \
  -n quote-api-github-build \
  -r quoteapiacr \
  -f acr-task.yaml \
  --context https://github.com/YOUR-ORG/YOUR-REPO.git#main \
  --git-access-token YOUR_GITHUB_PAT \
  --commit-trigger-enabled true \
  --branch main
```

### Scheduled task (nightly 2 AM UTC)

```bash
az acr task create \
  -n quote-api-nightly \
  -r quoteapiacr \
  -f acr-task.yaml \
  --context . \
  --schedule "0 2 * * *"
```

## Azure — Container Apps

| Command | Description |
|---------|-------------|
| `az containerapp env create -n quote-api-env -g quote-api-rg -l eastus` | Create environment |
| `az containerapp show -n quote-api -g quote-api-rg --query properties.configuration.ingress.fqdn -o tsv` | Get app URL |
| `az containerapp update -n quote-api -g quote-api-rg --image quoteapiacr.azurecr.io/quote-api:latest` | Update image |
| `az containerapp logs show -n quote-api -g quote-api-rg` | View app logs |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/quotes` | List all quotes |
| GET | `/quotes/random` | Random quote |
| POST | `/quotes` | Create quote |
| DELETE | `/quotes/{id}` | Delete quote |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |

## Repository

[https://github.com/Suralmk/azure-contianers](https://github.com/Suralmk/azure-contianers)
