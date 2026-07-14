---
title: Image pull behavior
pathSlug: implement-container-application-hosting-on-azure
moduleName: Manage containers in Azure Container Apps
---
## Overview

Understanding **when** App Service pulls images helps you plan deployments and troubleshoot slow starts or unexpected pull activity.

## Short notes (exam revision)

| Scenario | Pull behavior |
|----------|----------------|
| **Initial deploy / image reference change** | Pulls all image layers |
| **App restart** | Checks for changes; pulls **only modified** layers; uses cache if unchanged |
| **Scale out** | Each new instance pulls; may need a **full** pull if layers aren’t cached on new hosts |
| **Pricing tier change** | May allocate new infrastructure → **fresh** pull; can increase startup time |

## Details

### Initial deployment

App Service pulls all image layers when you first deploy the container or change the image reference (new registry path or tag).

### App restart

On restart, App Service checks for changes and pulls only modified layers. If the image is unchanged, cached layers are reused.

### Scale out

When App Service adds instances, each instance must obtain the image. New VMs/hosts might not have layers cached, so a full pull is possible — watch cold-scale latency for large AI images.

### Pricing tier changes

Moving plans/tiers can place the app on new infrastructure, forcing a fresh pull and slower first start after the change.

## Use cases

- Large model image (multi-GB): expect longer scale-out and tier-change startups
- After bumping plan SKU, first request is slow — pull on new hosts is a likely cause
- Planning capacity: cache-friendly restarts vs cold pull on new instances

## Exam tips

- Memorize the four scenarios in the table above
- Scale-out and SKU change are classic “why did pull happen again?” answers
- Restart ≠ always full pull; only changed layers when image is already cached

## Learn more

- [App Service custom containers](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [Scale up/out App Service](https://learn.microsoft.com/en-us/azure/app-service/manage-scale-up)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
