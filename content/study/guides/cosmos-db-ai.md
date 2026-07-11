---
title: Cosmos DB for AI & Vector Search
domain: data-management
description: Store embeddings and metadata in Cosmos DB for NoSQL with vector similarity search.
order: 2
---

## Overview

Cosmos DB for NoSQL supports vector indexing for semantic search and RAG pipelines — a core AI-200 data management topic (25–30% of the exam).

## Key concepts

- **Vector embeddings** — numerical representations of text/images for similarity search
- **DiskANN index** — vector index type in Cosmos DB
- **Consistency levels** — Session is common for app reads; know Strong vs Eventual
- **Change feed** — react to new/updated documents (e.g., re-index embeddings)

## Exam tips

- Understand when to use Cosmos DB vs PostgreSQL pgvector vs Redis
- Know indexing policies affect query cost and RU consumption
- Change feed processor pattern for async embedding pipelines

## Azure CLI

```bash
# Create Cosmos DB account (NoSQL API)
az cosmosdb create \
  --name cosmos-ai200 \
  --resource-group rg-ai200 \
  --locations regionName=eastus

az cosmosdb sql database create \
  --account-name cosmos-ai200 \
  --resource-group rg-ai200 \
  --name vectordb

az cosmosdb sql container create \
  --account-name cosmos-ai200 \
  --resource-group rg-ai200 \
  --database-name vectordb \
  --name documents \
  --partition-key-path "/tenantId"
```

## Python — vector search with SDK

```python
from azure.cosmos import CosmosClient

client = CosmosClient(url, credential=key)
container = client.get_database_client("vectordb").get_container_client("documents")

# Insert document with embedding vector
doc = {
    "id": "doc-1",
    "tenantId": "tenant-a",
    "content": "Azure AI services overview",
    "embedding": [0.12, 0.45, 0.78],  # simplified
}
container.upsert_item(doc)

# Vector similarity query (conceptual — use VectorDistance in SQL)
query = """
SELECT TOP 5 c.id, c.content
FROM c
ORDER BY VectorDistance(c.embedding, @queryVector)
"""
items = list(container.query_items(
    query=query,
    parameters=[{"name": "@queryVector", "value": query_vector}],
    enable_cross_partition_query=True,
))
```

## Learn more

- [Cosmos DB vector search](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search)
- [Change feed in Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/change-feed)
