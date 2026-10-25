---
title: Connect to PostgreSQL
pathSlug: develop-ai-solutions-with-azure-database-for-postgresql
moduleName: Build and query with Azure Database for PostgreSQL
description: >-
  Connect securely to Azure Database for PostgreSQL: Entra tokens, managed identity, sslmode verify-full, firewall vs private access and port 6432.
last_reviewed: 2026-10-25
source_version: 2026-10-07
tags: [Azure Database for PostgreSQL, Microsoft Entra ID, TLS, Networking]
objectives: [pg-connect-query, pg-connections]
---

## What this covers

How an application reaches Azure Database for PostgreSQL flexible server: the connection parameters, Microsoft Entra versus native PostgreSQL authentication, TLS modes, public versus private networking, and when to use port 5432 or the PgBouncer port 6432. Most "can't connect" exam scenarios are answered by one of these settings.

**Exam weight:** Develop AI solutions by using Azure data management services (30–35%)

**Skills measured**

- "Connect and query Azure Database for PostgreSQL by using SDKs"
- "Implement connection optimization to improve throughput and minimize latency"

## Key concepts

### Connection parameters

Every PostgreSQL client needs the same pieces, whether it uses a URI, keyword/value pairs or separate arguments:

| Parameter | Value on Azure |
| --- | --- |
| host | `<server-name>.postgres.database.azure.com` |
| port | `5432` direct, `6432` through built-in PgBouncer |
| dbname | your database (default `postgres`) |
| user | PostgreSQL role, Entra UPN, or the display name of a group or managed identity |
| password | stored password, or an Entra access token |
| sslmode | `require` minimum; `verify-full` recommended in production |

Flexible server uses the plain role name. The `user@servername` suffix was a Single Server convention and is not needed.

### Microsoft Entra authentication

Entra authentication swaps passwords for short-lived OAuth 2.0 access tokens. Benefits: no stored secrets, managed identities for Azure-hosted code, central identity lifecycle, and sign-ins recorded in Entra logs.

Setup steps:

1. Set the server's authentication mode to **PostgreSQL and Microsoft Entra authentication** or **Microsoft Entra authentication only**.
2. Add one or more Entra admins (user, group, service principal or managed identity). Don't run the app as this admin, because it has elevated rights such as `CREATEDB`.
3. As an Entra admin, map each app identity to a database role with `pgaadauth_create_principal`, then `GRANT` only what it needs.
4. The app requests a token for the resource `https://ossrdbms-aad.database.windows.net` (scope `.../.default`) and sends it as the password.

Tokens are valid for about 5–60 minutes. The token is checked only when the connection is opened, so existing pooled connections keep working after it expires. New connections need a fresh token.

### Native PostgreSQL authentication

The admin login you create at provisioning uses native authentication. Use native roles only when Entra isn't possible (legacy tools, identities outside your tenant). If you do, keep the password in Azure Key Vault, rotate it, generate it randomly and grant least privilege.

### TLS and sslmode

The server requires TLS (`require_secure_transport = ON`) and accepts TLS 1.2 and 1.3. Client `sslmode` values:

| sslmode | Encrypts | Validates CA | Validates host name |
| --- | --- | --- | --- |
| disable | No (rejected by Azure) | No | No |
| allow / prefer | If server asks | No | No |
| require | Yes | No | No |
| verify-ca | Yes | Yes | No |
| verify-full | Yes | Yes | Yes |

`verify-ca` and `verify-full` need the DigiCert and Microsoft root CAs that the server certificate chains to. Most OS and Azure images already trust them. Otherwise, download them and point `sslrootcert` at the bundle.

### Networking

- **Public access**: the server has a public IP and server-level firewall rules list allowed client IPs. The special rule 0.0.0.0–0.0.0.0 allows all Azure services, which is convenient but broad.
- **Private access (VNet integration)**: the server only gets a private IP in a delegated subnet. Clients must be in that VNet, a peered VNet, or connect over VPN/ExpressRoute. Entra admin operations then need outbound access to the `AzureActiveDirectory` service tag.
- Private endpoints are also supported for servers created with public access mode.

## How it works

```mermaid
sequenceDiagram
  participant App as App (managed identity)
  participant Entra as Microsoft Entra ID
  participant PG as PostgreSQL flexible server
  App->>Entra: get_token(ossrdbms-aad .default)
  Entra-->>App: access token (5–60 min)
  App->>PG: TLS connect, user=<identity name>, password=<token>
  PG->>PG: validate token, map to role
  PG-->>App: session established
```

## Hands-on

### Azure portal

1. Open the server, then **Security > Authentication**, choose **PostgreSQL and Microsoft Entra authentication**, and select **Add Microsoft Entra Admins**.
2. Under **Networking**, add your client IP as a firewall rule (public access) or confirm the VNet.
3. Under **Server parameters**, set `pgbouncer.enabled` to `true` (General Purpose or Memory Optimized only) to use port 6432.
4. Connect with psql as the Entra admin and create a role for your app identity.

### Azure CLI

```bash
# Add an Entra admin
az postgres flexible-server microsoft-entra-admin create \
  -g <resource-group> -s <server-name> \
  -u <admin-upn-or-display-name> -i <object-id> -t User

# Firewall rule for your client (public access)
az postgres flexible-server firewall-rule create \
  -g <resource-group> --name <server-name> --rule-name dev-client \
  --start-ip-address <your-ip> --end-ip-address <your-ip>

# Enable built-in PgBouncer, then connect on 6432
az postgres flexible-server parameter set \
  --resource-group <resource-group> --server-name <server-name> \
  --name pgbouncer.enabled --value true

# psql with an Entra token (token is too long to type, so pass it in PGPASSWORD)
export PGPASSWORD=$(az account get-access-token --resource-type oss-rdbms --query accessToken -o tsv)
psql "host=<server-name>.postgres.database.azure.com port=5432 dbname=postgres user=<upn> sslmode=verify-full sslrootcert=/etc/ssl/certs/ca-certificates.crt"
```

Map a managed identity to a role (run as Entra admin, in the `postgres` database):

```sql
SELECT * FROM pgaadauth_create_principal('<managed-identity-name>', false, false);
GRANT CONNECT ON DATABASE appdb TO "<managed-identity-name>";
```

### Python

```python
import psycopg
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()  # managed identity in Azure, Azure CLI locally
token = credential.get_token("https://ossrdbms-aad.database.windows.net/.default")

conn = psycopg.connect(
    host="<server-name>.postgres.database.azure.com",
    port=5432,                      # 6432 for PgBouncer
    dbname="appdb",
    user="<managed-identity-name>",
    password=token.token,           # token used as the password
    sslmode="verify-full",
    connect_timeout=10,
)
```

Connection string patterns:

```text
# Basic, TLS required
postgresql://myuser:mypassword@myserver.postgres.database.azure.com/mydb?sslmode=require
# With certificate verification
postgresql://myuser:mypassword@myserver.postgres.database.azure.com/mydb?sslmode=verify-full&sslrootcert=/etc/ssl/certs/ca-certificates.crt
# Through PgBouncer (port 6432)
postgresql://myuser:mypassword@myserver.postgres.database.azure.com:6432/mydb?sslmode=require
```

## Exam traps

| Situation | Answer |
| --- | --- |
| App in Container Apps/Functions, no secrets allowed | Managed identity + Entra auth + `pgaadauth_create_principal` |
| Protect against man-in-the-middle | `sslmode=verify-full` |
| Dev laptop gets "no pg_hba.conf entry"/timeout on public server | Add a firewall rule for the client IP |
| Server only reachable from a VNet | Private access (VNet integration) or private endpoint |
| Many short-lived connections | Built-in PgBouncer on port 6432 |
| Token resource for PostgreSQL | `https://ossrdbms-aad.database.windows.net/.default` |

> [!WARNING]
> **Exam trap:** `sslmode=require` encrypts but does **not** verify the server identity. Only `verify-full` checks both CA and host name.

> [!WARNING]
> **Exam trap:** Entra tokens are not refreshed on an open connection. Long-running apps must fetch a new token each time the pool opens a connection (see [Integrate SDKs and applications](/study/develop-ai-solutions-with-azure-database-for-postgresql/integrate-sdks-and-applications)).

> [!TIP]
> "ossrdbms" = open-source relational databases. The same token resource works for Azure Database for MySQL.

> [!NOTE]
> Entra user and group names are case-sensitive. Escape spaces in group names when using psql.

## Quick review

- Host format: `<server>.postgres.database.azure.com`; 5432 direct, 6432 PgBouncer.
- Entra admin can be a user, group, service principal or managed identity.
- App identities are mapped with `pgaadauth_create_principal('<name>', false, false)`.
- Tokens last 5–60 minutes and are used as the password.
- TLS 1.2+ is enforced; `sslmode=disable` is rejected.
- Public access uses firewall rules; private access uses VNet integration.

## Practice

[Practice: connect and query questions](/practice/pg-connect-query) · [Practice: connection optimization questions](/practice/pg-connections)

## Official references

- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
- [Unit: Connect to PostgreSQL](https://learn.microsoft.com/en-us/training/modules/build-query-azure-database-postgresql/3-connect-to-postgresql)
- [Use Microsoft Entra ID authentication](https://learn.microsoft.com/en-us/azure/postgresql/security/security-entra-configure)
- [az postgres flexible-server microsoft-entra-admin](https://learn.microsoft.com/en-us/cli/azure/postgres/flexible-server/microsoft-entra-admin)
- [PgBouncer in flexible server](https://learn.microsoft.com/en-us/azure/postgresql/connectivity/concepts-pgbouncer)
- [Microsoft Learn](https://learn.microsoft.com/)
