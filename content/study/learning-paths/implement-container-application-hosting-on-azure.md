---
title: Deploy and operate containers on Azure App Service
slug: implement-container-application-hosting-on-azure
certification: AI-200
duration: ''
level: ''
description: >-
  Deploy custom containers to Azure App Service from ACR (managed identity or
  admin credentials), Docker Hub, and other registries using the portal and CLI.
  Configure app settings, connection strings, slot settings, Key Vault
  references, and runtime behavior (ports, startup, Always On, health checks,
  persistent storage). Cover day-two operations—image updates, continuous
  deployment, and pull behavior—plus troubleshooting with log stream, filesystem
  logs, Kudu, and common failure patterns. Includes a hands-on Quote API project
  that builds with ACR Tasks and runs on Azure Container Apps.
tags:
  - Azure Container Registry
  - Azure App Service
  - Azure Container Apps
  - Containers
  - Developer
filterTags:
  - containers
  - acr
  - app-service
  - container-apps
skillFocus: ai-development
order: 1
modules:
  - name: Deploy containers to Azure App Service
    duration: ''
    description: >-
      Deploy and manage containerized applications on Azure App Service by
      configuring container sources, runtime settings, application
      configuration, and diagnostics.
    topics:
      - Explore Container Apps environments
      - Deploy using the Azure portal
      - Deploy to App Service using CLI
      - Deploy from other container registries
      - ACR authentication options
  - name: Configure app settings for Azure container environments
    duration: ''
    description: >-
      Configure application settings, connection strings, slot settings, Key Vault
      references, and container runtime behavior for App Service containers.
    topics:
      - App settings
      - Connection strings
      - Bulk editing
      - Slot settings
      - Key Vault references
      - Configure container runtime behavior
  - name: Manage containers in Azure Container Apps
    duration: ''
    description: >-
      Manage day-two container hosting on App Service and Container Apps. Update
      images, enable continuous deployment, understand image pull behavior, and
      verify deployments.
    topics:
      - Update the container image
      - Enable continuous deployment
      - Image pull behavior
      - Verify the deployment
  - name: Troubleshoot container apps
    duration: ''
    description: >-
      Diagnose and resolve common deployment and runtime issues in Azure Container
      Apps. Manage the app lifecycle, monitor logs, configure health probes, and
      troubleshoot failures with Azure monitoring tools.
    topics:
      - Manage the container app lifecycle
      - Monitor logs and troubleshoot issues
      - Configure health probes and troubleshoot failures
      - Troubleshoot container apps
      - Stream container logs
      - Configure container logs
      - Diagnostic console (Kudu)
      - Common issues and solutions
  - name: 'Project: Example — Deploying a container to Azure Container Apps'
    duration: ''
    description: >-
      Hands-on Quote API sample: build with ACR Tasks, push to Azure Container
      Registry, and deploy to Azure Container Apps. Includes architecture,
      local setup, deploy scripts, commands, and environment variables.
    topics:
      - Project overview
      - Architecture and folder structure
      - Setup and local run
      - Deploy script explained
      - Commands reference
      - Environment variables
---
