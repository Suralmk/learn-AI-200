---
title: "Explore Azure Cosmos DB for NoSQL"
pathSlug: "develop-ai-solutions-with-azure-cosmos-db-for-nosql"
moduleName: "Build queries for Azure Cosmos DB for NoSQL"
---

## Overview

Azure Cosmos DB for NoSQL is a globally distributed, multi-model database well suited for AI workloads that need low-latency document storage, flexible schemas, and vector search for RAG pipelines.

## Key concepts

- **Account → database → container** hierarchy with partition keys for scale
- **Request Units (RUs)** — throughput currency; queries and writes consume RUs
- **SQL API** — query JSON documents with familiar SQL syntax
- **Vector search** — store embeddings alongside documents for semantic retrieval
- **Change feed** — stream of document changes for async embedding pipelines

## Exam tips

- Know when Cosmos DB fits vs PostgreSQL pgvector vs Redis (scale, global distribution, native vector indexing)
- Partition key choice affects query performance and RU cost
- Consistency levels (Session, Bounded Staleness, Strong) trade freshness for cost

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

## Python

```python
from azure.cosmos import CosmosClient

client = CosmosClient(url, credential=key)
container = client.get_database_client("vectordb").get_container_client("documents")

doc = {
    "id": "doc-1",
    "tenantId": "tenant-a",
    "content": "Azure AI services overview",
    "embedding": [0.12, 0.45, 0.78],
}
container.upsert_item(doc)
```

## Learn more

- [Cosmos DB for NoSQL](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/)
- [Vector search in Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
