---
title: Connection strings
pathSlug: implement-container-application-hosting-on-azure
moduleName: Configure app settings for Azure container environments
---
## Overview

Connection strings are a specialized form of app settings for database connectivity. App Service prefixes connection-string environment variables with a **type identifier**.

## Short notes (exam revision)

| Type | Env var prefix |
|------|----------------|
| SQL Server | `SQLCONNSTR_` |
| SQL Azure | `SQLAZURECONNSTR_` |
| MySQL | `MYSQLCONNSTR_` |
| PostgreSQL | `POSTGRESQLCONNSTR_` |
| Custom | `CUSTOMCONNSTR_` |

- Example: name `DefaultConnection` + type `SQLAzure` → `SQLAZURECONNSTR_DefaultConnection`
- For **Python / Node.js / non-.NET**: prefer normal **app settings** — prefixes add complexity with no benefit

## Configure a connection string

```bash
az webapp config connection-string set \
  --resource-group myResourceGroup \
  --name myDocumentProcessor \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=myserver.database.windows.net;Database=mydb;..."
```

## When to use what

| Runtime | Prefer |
|---------|--------|
| .NET (expects prefixed vars) | Connection strings |
| Python, Node.js, similar | App settings for DB URLs |

## Use cases

- ASP.NET app reading `SQLAZURECONNSTR_DefaultConnection`
- FastAPI AI service: store `DATABASE_URL` as a plain app setting instead

## Exam tips

- Memorize the prefix table (especially `SQLAZURECONNSTR_`)
- Know that non-.NET usually should use app settings, not connection strings

## Learn more

- [Configure connection strings](https://learn.microsoft.com/en-us/azure/app-service/configure-common#configure-connection-strings)
- [az webapp config connection-string](https://learn.microsoft.com/en-us/cli/azure/webapp/config/connection-string)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
