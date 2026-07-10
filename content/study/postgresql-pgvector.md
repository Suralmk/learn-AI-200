---
title: PostgreSQL with pgvector for RAG
domain: data-management
description: Use Azure Database for PostgreSQL with pgvector for semantic search and RAG.
order: 3
---

## Overview

Azure Database for PostgreSQL Flexible Server with the **pgvector** extension is a first-class option for storing embeddings and running similarity search in AI solutions.

## Key concepts

- **pgvector** — PostgreSQL extension for vector storage and distance queries
- **HNSW / IVFFlat indexes** — approximate nearest neighbor indexes
- **Metadata filtering** — combine vector search with SQL `WHERE` clauses
- **Connection pooling** — PgBouncer or built-in pooler to reduce latency

## Exam tips

- Know index types (HNSW vs IVFFlat) and trade-offs
- Understand schema design: separate embedding table vs JSONB columns
- Optimize compute/memory for vector operations

## Azure CLI

```bash
# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --name pg-ai200 \
  --resource-group rg-ai200 \
  --location eastus \
  --admin-user pgadmin \
  --admin-password 'ChangeMe123!' \
  --sku-name Standard_B2s \
  --tier Burstable \
  --version 16

# Allow Azure services (for Functions/Container Apps)
az postgres flexible-server firewall-rule create \
  --resource-group rg-ai200 \
  --name pg-ai200 \
  --rule-name AllowAzure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## Python — pgvector similarity search

```python
import psycopg
from pgvector.psycopg import register_vector

conn = psycopg.connect("postgresql://pgadmin:pass@pg-ai200.postgres.database.azure.com/vectordb")
register_vector(conn)

with conn.cursor() as cur:
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chunks (
            id SERIAL PRIMARY KEY,
            content TEXT,
            tenant_id TEXT,
            embedding vector(1536)
        )
    """)
    cur.execute("""
        INSERT INTO chunks (content, tenant_id, embedding)
        VALUES (%s, %s, %s)
    """, ("RAG chunk text", "tenant-a", query_embedding))

    cur.execute("""
        SELECT content, embedding <=> %s AS distance
        FROM chunks
        WHERE tenant_id = %s
        ORDER BY embedding <=> %s
        LIMIT 5
    """, (query_embedding, "tenant-a", query_embedding))

conn.commit()
```

## Learn more

- [Azure Database for PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/)
- [pgvector extension](https://github.com/pgvector/pgvector)
