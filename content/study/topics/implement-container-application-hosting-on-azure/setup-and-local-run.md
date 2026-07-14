---
title: Setup and local run
pathSlug: implement-container-application-hosting-on-azure
moduleName: 'Project: Example — Deploying a container to Azure Container Apps'
---
## Prerequisites

- Python 3.12+
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- Docker (optional — ACR can build in the cloud)

## Run locally (Python)

```bash
cd quote-api
python -m venv .venv
```

**Windows:**

```powershell
.venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs

## Run with Docker

```bash
cd quote-api
docker compose up --build
```

## Deploy to Azure

**Windows:**

```powershell
cd quote-api
.\deploy.ps1
```

**Linux/macOS:**

```bash
cd quote-api
chmod +x deploy.sh
./deploy.sh
```

Set a unique ACR name if needed:

```bash
ACR_NAME=myuniqueacr123 ./deploy.sh
```

The script creates the resource group, ACR, builds the image, and deploys to Container Apps.

## Short notes

- Local = `uvicorn` on **8000** or Docker Compose  
- Azure = one-script deploy (`deploy.ps1` / `deploy.sh`)  
- ACR names must be **globally unique**

## Repository

[https://github.com/Suralmk/azure-contianers](https://github.com/Suralmk/azure-contianers)
