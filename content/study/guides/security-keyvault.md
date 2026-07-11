---
title: Security with Key Vault & App Configuration
domain: secure-monitor
description: Secure secrets, keys, and feature flags for AI applications.
order: 7
---

## Overview

AI solutions handle API keys (OpenAI, Cognitive Services), connection strings, and model endpoints. Key Vault and App Configuration are essential for secure, manageable deployments.

## Key concepts

- **Key Vault secrets** — API keys, connection strings
- **Key Vault keys** — encryption keys (CMK scenarios)
- **Managed identity** — apps authenticate to Key Vault without credentials in code
- **App Configuration** — feature flags, dynamic settings (model version, rate limits)

## Exam tips

- Prefer managed identity over connection strings in production
- Know Key Vault access policies vs RBAC
- App Configuration refresh without redeploying containers

## Azure CLI

```bash
# Create Key Vault
az keyvault create \
  --name kv-ai200 \
  --resource-group rg-ai200 \
  --location eastus

# Store OpenAI API key
az keyvault secret set \
  --vault-name kv-ai200 \
  --name openai-api-key \
  --value "sk-..."

# Assign managed identity to Container App and grant access
az containerapp identity assign \
  --name ai-api \
  --resource-group rg-ai200 \
  --system-assigned

az keyvault set-policy \
  --name kv-ai200 \
  --object-id <principal-id> \
  --secret-permissions get list
```

## Python — read secret with DefaultAzureCredential

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://kv-ai200.vault.azure.net/", credential=credential)

api_key = client.get_secret("openai-api-key").value
```

## Learn more

- [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/)
- [Azure App Configuration](https://learn.microsoft.com/en-us/azure/azure-app-configuration/)
