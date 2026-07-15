---
title: "Configure secrets and variables and deploy to ACA in Azure"
pathSlug: "deploy-and-manage-apps-on-azure-container-apps"
moduleName: "Deploy a container to Container Apps"
---

## Overview

Complete guide to **secure secret management and deployment** with Azure Container Apps, Managed Identity, and Azure Key Vault. Your AI apps never store secrets permanently — Azure authenticates the app and Key Vault returns secrets at runtime.

## Exam tips

- Prefer **Managed Identity + Key Vault** over hardcoding secrets or embedding them in Docker images
- Use **Key Vault Secrets User** (least privilege), not Key Vault Administrator
- `DefaultAzureCredential` works for both local (`az login`) and production (managed identity) with no code changes
- Separate non-secret config (env vars) from secrets (Key Vault)

## Why use Azure Key Vault?

Your application may need:

- Database passwords
- OpenAI API keys
- Stripe secret keys
- JWT signing keys
- SMTP passwords
- OAuth client secrets

A beginner usually writes:

```python
OPENAI_KEY = "sk-xxxxxxxx"
DATABASE_PASSWORD = "mypassword"
JWT_SECRET = "supersecret"
```

Or:

```env
OPENAI_KEY=sk-xxxxxxxx
DB_PASSWORD=password123
```

This is dangerous because:

- Secrets get committed to GitHub
- Developers can see them in source
- Passwords are difficult to rotate
- Compromised repositories expose everything

Instead, the app calls Key Vault at runtime:

```text
Application → Azure Key Vault → Secrets stored securely
```

Your application never stores secrets permanently.

---

## Authentication vs authorization

People often confuse these.

| Concept | Question answered |
|---------|-------------------|
| **Authentication** | Who are you? |
| **Authorization** | What are you allowed to do? |

For Azure Key Vault:

```text
Application
      │
      ▼
Microsoft Entra ID  (authentication → access token)
      │
      ▼
Azure Key Vault     (authorization → RBAC / access policies)
      │
      ▼
Secret returned
```

- **Authentication** is performed by Microsoft Entra ID
- **Authorization** is performed by Azure RBAC (or older access policies)

---

## Overall architecture

```text
                     Microsoft Entra ID
                              ▲
                              │ Access Token
                              ▲
                     Managed Identity
                              ▲
                              │
                 Azure Container App
                              │
                              ▼
                    Azure Key Vault
                              │
            ┌─────────────────┴────────────────┐
            ▼                                  ▼
   Database Password                      OpenAI Key
```

Notice: the application never stores username, password, service principal secret, or client secret. Azure handles authentication automatically.

---

## Resources you'll create

```text
Resource Group
│
├── Azure Container Registry
├── Container Apps Environment
├── Azure Container App
├── Azure Key Vault
└── Managed Identity
```

---

## Creating Azure resources

### Create a resource group

```bash
az group create \
  --name my-rg \
  --location eastus
```

Everything lives inside this resource group.

### Create Azure Container Registry

```bash
az acr create \
  --resource-group my-rg \
  --name myregistry \
  --sku Basic
```

Your Docker images are stored here.

### Create a Key Vault

```bash
az keyvault create \
  --resource-group my-rg \
  --name my-demo-kv \
  --location eastus
```

### Create a Container Apps environment

```bash
az containerapp env create \
  --name my-env \
  --resource-group my-rg \
  --location eastus
```

Think of this as the infrastructure hosting your Container Apps.

### Create the Container App

```bash
az containerapp create \
  --name my-api \
  --resource-group my-rg \
  --environment my-env \
  --image myregistry.azurecr.io/api:latest
```

At this point the Container App has **no identity**. If it tries to access Key Vault, Key Vault asks “Who are you?” and access is denied.

---

## Storing secrets in Key Vault

Store an OpenAI key:

```bash
az keyvault secret set \
  --vault-name my-demo-kv \
  --name OpenAIKey \
  --value sk-xxxxxxxx
```

Store a PostgreSQL password:

```bash
az keyvault secret set \
  --vault-name my-demo-kv \
  --name DatabasePassword \
  --value superSecret123
```

Store a JWT secret:

```bash
az keyvault secret set \
  --vault-name my-demo-kv \
  --name JwtSecret \
  --value myjwtsecret
```

Key Vault now contains:

- `OpenAIKey`
- `DatabasePassword`
- `JwtSecret`

---

## Managed identity explained

Managed Identity is an **Azure-managed identity that Microsoft Entra ID trusts**.

Instead of username / password / client secret, you get an Azure identity — no passwords, no secrets, no credentials to rotate.

---

## System-assigned vs user-assigned identity

### System-assigned

```text
Container App → Identity
```

- One identity tied to the resource
- Deleted with the resource
- Perfect for most applications

### User-assigned

```text
User Assigned Identity
│
├── Container A
└── Container B
```

- Identity exists independently
- Useful when multiple apps need the same permissions, the identity must survive app deletion, or identity is shared

---

## Assigning a managed identity

### System-assigned

```bash
az containerapp identity assign \
  --name my-api \
  --resource-group my-rg
```

Azure creates a principal similar to:

```text
Managed Identity
Principal ID: 9d8b...
Tenant ID: ...
```

### Retrieve the principal ID

```bash
az containerapp show \
  --name my-api \
  --resource-group my-rg \
  --query identity.principalId \
  -o tsv
```

Example output: `5c48d9...`

### Create a user-assigned identity

```bash
az identity create \
  --resource-group my-rg \
  --name shared-identity
```

Attach it:

```bash
az containerapp identity assign \
  --resource-group my-rg \
  --name my-api \
  --user-assigned "/subscriptions/.../resourceGroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/shared-identity"
```

Grant Key Vault permissions once — every app using that identity inherits them.

---

## Granting Key Vault permissions

Assign the built-in role **Key Vault Secrets User**:

```bash
az role assignment create \
  --assignee 5c48d9... \
  --role "Key Vault Secrets User" \
  --scope $(az keyvault show \
    --name my-demo-kv \
    --query id \
    -o tsv)
```

Now the managed identity can read secrets.

### Behind the scenes

When the application starts:

```text
Container App
  → Managed Identity
  → Microsoft Entra ID
  → Access Token
  → Key Vault
  → Secret
```

Your application never authenticates using a password.

---

## Accessing secrets from Python

Install packages:

```bash
pip install azure-identity azure-keyvault-secrets
```

### Option 1 — read secrets directly in code

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()

client = SecretClient(
    vault_url="https://my-demo-kv.vault.azure.net/",
    credential=credential,
)

db_password = client.get_secret("DatabasePassword").value
openai_key = client.get_secret("OpenAIKey").value

print(db_password)
```

Notice there is **no** `client_id`, `client_secret`, or `tenant_id`. Everything is automatic.

**Advantages:** always gets the latest version; can reload secrets; ideal for long-running services.

### What DefaultAzureCredential does

**Local development** (after `az login`):

```text
Azure CLI login → DefaultAzureCredential → Entra ID → Access Token
```

**When deployed:**

```text
Managed Identity → DefaultAzureCredential → Entra ID → Access Token
```

Your code never changes between environments.

---

## Using secrets as environment variables

Container Apps support environment variables for non-secret config:

| Non-secrets (env vars) | Secrets (Key Vault) |
|------------------------|---------------------|
| `APP_ENV`, `PORT`, `LOG_LEVEL` | API keys, passwords, connection strings, JWT secrets |

### Option 2 — Container Apps retrieves secrets

Azure Container Apps can retrieve Key Vault secrets using its managed identity and expose them as secrets / environment variables:

```text
Container App
  → Managed Identity
  → Azure Key Vault
  → Container App Secret
  → Environment Variable
  → Python Application
```

Your application simply reads:

```python
import os

db_password = os.environ["DATABASE_PASSWORD"]
```

It does not need to know the value came from Key Vault. Ideal for config loaded at startup.

### Typical environment variables

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
OPENAI_API_KEY=
REDIS_URL=
JWT_SECRET=
LOG_LEVEL=
APP_ENV=
```

### Example application configuration

```python
import os

DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
```

---

## Deploying to Azure Container Apps

Typical deployment flow:

```text
Build Docker Image
  → Push Image
  → Azure Container Registry
  → Azure Container App
  → Managed Identity
  → Key Vault
  → Secrets
  → Application Starts
```

Example deployment:

```bash
az containerapp create \
  --name my-api \
  --resource-group my-rg \
  --environment my-env \
  --image myregistry.azurecr.io/api:latest \
  --target-port 8000 \
  --ingress external
```

---

## Complete end-to-end flow

```text
Developer
  → Docker Build
  → Azure Container Registry
  → Azure Container Apps
  → Managed Identity
  → Microsoft Entra ID
  → Access Token
  → Azure Key Vault
  → Secrets Returned
  → Application Uses Secrets
```

---

## Best practices

1. **Use Managed Identity** — never store Azure credentials in the app
2. **Use Key Vault** — never hardcode secrets
3. **Grant least privilege** — use `Key Vault Secrets User`, not Administrator
4. **Separate config from secrets** — env vars for `APP_ENV` / `LOG_LEVEL`; Key Vault for passwords and API keys
5. **Use DefaultAzureCredential** — avoid `ClientSecretCredential` unless you truly need a service principal
6. **Prefer one identity per app** — system-assigned unless sharing is required
7. **Rotate secrets in Key Vault** — never bake secrets into Docker images

---

## Common mistakes

### Storing secrets in Git

```python
# ❌ Don't do this
PASSWORD = "password123"
```

### Putting secrets inside Docker images

```dockerfile
# ❌ Don't do this
ENV DATABASE_PASSWORD=password123
```

### Using client secrets in Azure

```python
# ❌ Avoid for Azure-hosted apps
from azure.identity import ClientSecretCredential

credential = ClientSecretCredential(
    tenant_id="...",
    client_id="...",
    client_secret="...",
)
```

Prefer:

```python
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
```

### Granting administrator permissions

Avoid giving applications **Key Vault Administrator** when they only need **Key Vault Secrets User**.

---

## Summary

Azure Container Apps integrates with **Microsoft Entra ID** through **Managed Identity**, allowing your application to authenticate without storing credentials. After assigning a managed identity and granting it **Key Vault Secrets User**, your app can securely retrieve secrets from **Azure Key Vault** using `DefaultAzureCredential()`, or have Container Apps inject those secrets as environment variables.

This architecture eliminates hardcoded credentials, simplifies secret rotation, and follows Azure security best practices — with the same application code for local development and production.

## Learn more

- [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/)
- [Managed identities for Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity)
- [Manage secrets in Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets)
- [DefaultAzureCredential](https://learn.microsoft.com/en-us/python/api/overview/azure/identity-readme)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
