---
title: Architecture and folder structure
pathSlug: implement-container-application-hosting-on-azure
moduleName: 'Project: Example — Deploying a container to Azure Container Apps'
---
## Architecture

```text
Developer
    │
    ├── Local dev ──▶ docker compose up ──▶ Quote API (port 8000)
    │
    └── Azure deploy ──▶ ACR (build image) ──▶ Container Apps (run API)
                              │
                              └── ACR Tasks (build, lint, push on trigger)
```

**Flow:**

1. Code is built into a Docker image  
2. Image is stored in **Azure Container Registry**  
3. **Azure Container Apps** pulls the image and runs the API  
4. **ACR Tasks** automate build → lint → push (see `acr-task.yaml`)

## Folder structure

```text
quote-api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment settings
│   ├── models.py            # Domain models
│   ├── schemas.py           # Request/response schemas
│   ├── database.py          # In-memory quote store
│   ├── routes/
│   │   └── quotes.py        # API endpoints
│   └── services/
│       └── quote_service.py # Business logic
├── deploy.sh                # Azure deployment (Linux/macOS)
├── deploy.ps1               # Azure deployment (Windows)
├── acr-task.yaml            # Multi-step ACR build pipeline
├── Dockerfile               # Production container image
├── docker-compose.yml       # Local development
├── requirements.txt
├── .env.example             # Environment variable template
└── .gitignore
```

## Short notes

- `deploy.ps1` / `deploy.sh` — end-to-end Azure provision + deploy  
- `acr-task.yaml` — multi-step ACR Task (lint + build + push)  
- App listens on **8000** (matches Container Apps `--target-port`)

## Repository

[https://github.com/Suralmk/azure-contianers](https://github.com/Suralmk/azure-contianers)
