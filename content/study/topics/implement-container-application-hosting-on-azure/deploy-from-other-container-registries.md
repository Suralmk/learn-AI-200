---
title: Deploy from other container registries
pathSlug: implement-container-application-hosting-on-azure
moduleName: Deploy containers to Azure App Service
---
## Overview

For registries **other than ACR**, provide the **server URL** and credentials when creating the web app. This works for **Docker Hub**, **GitHub Container Registry (GHCR)**, and self-hosted registries.

## Short notes (exam revision)

- Docker Hub URL: `https://index.docker.io/v1/`
- GHCR URL: `https://ghcr.io`
- Public images: image name + server URL (no user/password required)
- Private images: also pass `--docker-registry-server-user` and `--docker-registry-server-password`
- Same `az webapp create` flow as ACR, with registry server flags instead of ACR-managed dropdowns

## Public images from Docker Hub

```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myWebApp \
  --container-image-name nginx \
  --docker-registry-server-url https://index.docker.io/v1/
```

## Private images

```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myWebApp \
  --container-image-name myusername/myapp:latest \
  --docker-registry-server-url https://index.docker.io/v1/ \
  --docker-registry-server-user myusername \
  --docker-registry-server-password <password>
```

## GitHub Container Registry

Use `https://ghcr.io` as the server URL, with a GitHub username/token (or equivalent) for private packages.

## Portal equivalent

On the **Container** tab → **Image Source** → **Other container registries**, then enter Server URL, credentials (if private), and full image name/tag.

## Use cases

- Quick smoke test with a public `nginx` image before switching to your ACR AI image
- Pull a partner’s private Docker Hub image during integration
- Deploy from GHCR when CI builds images into GitHub Packages

## Exam tips

- Memorize Docker Hub server URL: `https://index.docker.io/v1/`
- Memorize GHCR: `https://ghcr.io`
- Public vs private = whether username/password flags are required
- “Other registries” ≠ ACR managed identity/`AcrPull` path

## Learn more

- [Configure custom containers from any registry](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [Docker Hub](https://hub.docker.com/) / [GitHub Packages containers](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
