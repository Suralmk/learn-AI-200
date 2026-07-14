---
title: Deploy using the Azure portal
pathSlug: implement-container-application-hosting-on-azure
moduleName: Deploy containers to Azure App Service
---
## Overview

The Azure portal provides a guided experience for creating a **Web App for Containers**. Use it when you want to configure settings visually and verify choices before you deploy.

## Short notes (exam revision)

- Create flow: **Create a resource** → search **Web App** → **Create**
- Basics: subscription, resource group, app name, region
- **Publish** = **Container**, **OS** = **Linux** (typical for custom containers)
- Pick or create an **App Service plan**
- **Container** tab configures the image source (ACR vs other registries)
- ACR auth options in portal: **Managed Identity** (needs `AcrPull`) or **Admin credentials**

## Create the web app

1. In the Azure portal, select **Create a resource** and search for **Web App**
2. Select **Create** and choose **Web App**
3. On the **Basics** tab, configure subscription, resource group, app name, and region
4. For **Publish**, select **Container**
5. For **Operating System**, select **Linux**
6. Select an App Service plan or create a new one
7. Open the **Container** tab to configure the image source

## Configure the container image

On the **Container** tab you specify where App Service pulls the image.

### Azure Container Registry

1. **Image Source** → **Azure Container Registry**
2. Select your **Registry** (same-subscription registries appear automatically)
3. Choose an **Authentication method**:
   - **Managed Identity** — user-assigned or system-assigned; identity must have **`AcrPull`** on the registry
   - **Admin credentials** — registry admin username/password; admin user must be enabled on ACR
4. Select the **Image** and **Tag** to deploy

### Other registries

1. **Image Source** → **Other container registries**
2. For private images, provide **Server URL** (example Docker Hub: `https://index.docker.io/v1/`)
3. Enter **Username** and **Password** for private registries
4. Enter the **Full Image Name** and **Tag** (for example `nginx:latest` or `myuser/myapp:v1`)

## Use cases

- First-time AI container deploy where you want to see every dropdown (registry, tag, auth) before commit
- Comparing ACR managed identity vs admin credentials settings in the UI
- Pulling a public Docker Hub sample image for a quick smoke test app

## Exam tips

- Publish = **Container** + Linux is the core portal pattern for custom images
- Same-subscription ACR shows up in the dropdown automatically
- Managed identity path implies **`AcrPull`**; admin path implies **admin user enabled**
- “Other container registries” is how Docker Hub / GHCR appear in the portal wizard

## Learn more

- [Configure a custom container on Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [Create a web app](https://learn.microsoft.com/en-us/azure/app-service/getting-started)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
