---
title: Azure Managed Redis for AI Caching
domain: data-management
description: Cache embeddings, session data, and vector indexes with Azure Managed Redis.
order: 4
---

## Overview

Azure Managed Redis provides low-latency caching and can support vector similarity search for AI retrieval workloads.

## Key concepts

- **Caching patterns** — cache-aside, write-through for embedding results
- **TTL and eviction** — `volatile-lru` for expiring cache keys
- **Vector indexing** — Redis vector search capabilities for similarity queries
- **Connection resilience** — retry policies, connection multiplexing

## Exam tips

- Know when Redis complements (not replaces) Cosmos DB / PostgreSQL
- Understand cache invalidation strategies for updated documents
- Vector index configuration for dimensions and distance metric

## Azure CLI

```bash
# Create Azure Managed Redis (preview name may vary by region)
az redis create \
  --name redis-ai200 \
  --resource-group rg-ai200 \
  --location eastus \
  --sku Basic \
  --vm-size c0

# Get connection string
az redis list-keys \
  --name redis-ai200 \
  --resource-group rg-ai200
```

## Python — cache embeddings

```python
import redis
import json

r = redis.Redis(
    host="redis-ai200.redis.cache.windows.net",
    port=6380,
    password=access_key,
    ssl=True,
)

def get_embedding_cached(text: str) -> list[float]:
    key = f"emb:{hash(text)}"
    cached = r.get(key)
    if cached:
        return json.loads(cached)

    embedding = call_embedding_model(text)  # Azure OpenAI, etc.
    r.setex(key, 3600, json.dumps(embedding))
    return embedding
```

## Learn more

- [Azure Managed Redis](https://learn.microsoft.com/en-us/azure/redis/)
- [Redis vector search](https://redis.io/docs/latest/develop/interact/search-and-query/vectors/)
