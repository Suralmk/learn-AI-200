---
title: Project overview
pathSlug: implement-container-application-hosting-on-azure
moduleName: 'Project: Example — Deploying a container to Azure Container Apps'
---
## What this project is

**Quote API** is a FastAPI REST sample built to learn **Azure Container Registry (ACR) Tasks**, **Docker**, and **Azure Container Apps**.

You take a simple quotes API, package it as a container, build/push it with ACR (including multi-step ACR Tasks), then run it on Container Apps with HTTPS, scaling, and environment configuration.

## Why it matters for AI-200

This project practice mirrors the exam skills of:

- Storing images in ACR
- Building with ACR Tasks / `az acr build`
- Deploying containers to Azure Container Apps
- Wiring registry auth, target ports, env vars, and replicas

## Repository

Full source, deploy scripts, and CI workflow:

**[https://github.com/Suralmk/azure-contianers](https://github.com/Suralmk/azure-contianers)**

Local path (this machine): `acr-tasks/quote-api/`

## High-level flow

1. Code is built into a Docker image  
2. Image is stored in **Azure Container Registry**  
3. **Azure Container Apps** pulls the image and runs the API  
4. **ACR Tasks** can automate build → lint → push (`acr-task.yaml`)

## API endpoints (quick view)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/quotes` | List all quotes |
| GET | `/quotes/random` | Random quote |
| POST | `/quotes` | Create quote |
| DELETE | `/quotes/{id}` | Delete quote |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |

## Next topics in this module

- Architecture and folder structure  
- Setup and local run  
- Deploy script explained (step-by-step Azure CLI)  
- Commands reference  
- Environment variables  

## Learn more

- [Repo: Suralmk/azure-contianers](https://github.com/Suralmk/azure-contianers)
- [Azure Container Apps overview](https://learn.microsoft.com/en-us/azure/container-apps/overview)
- [ACR Tasks](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview)
