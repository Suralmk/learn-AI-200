---
title: "Implement event-driven scaling with KEDA"
pathSlug: "deploy-and-manage-apps-on-azure-container-apps"
moduleName: "Scale containers in Azure Container Apps"
---

## Overview

**Event-driven scaling** lets your Container Apps respond to signals beyond HTTP traffic — message queues, event streams, and other Azure services. Azure Container Apps integrates with **KEDA** (Kubernetes Event-driven Autoscaling) so AI workloads (embedding jobs, inference queues, document processors) scale on **actual backlog**, not just request volume.

## Exam tips

- Know **KEDA** translates external metrics (queue depth, partition lag) into replica count — polls every **30 seconds**
- **Service Bus**: `messageCount` threshold → replicas = messages ÷ threshold
- **Event Hubs**: max effective replicas ≤ **number of partitions** in the hub
- **Storage Queue**: simpler/cheaper than Service Bus; fewer features
- Prefer **managed identity** for scale-rule auth in production vs connection-string secrets
- **Scale-to-zero** is supported for event-driven rules — ideal for async AI pipelines
- First-party KEDA scalers on ACA: Service Bus, Event Hubs, Storage Queue, Blob, Log Analytics, Monitor

## When to use vs when not to use

| Use event-driven (KEDA) scaling | Prefer HTTP/TCP/CPU scaling instead |
|--------------------------------|-------------------------------------|
| Queue processors, embedding workers, batch inference | Public REST APIs with steady browser traffic |
| Workloads with idle periods (scale to zero) | Low-latency sync APIs where cold start hurts |
| Backlog grows faster than HTTP RPS reflects | Simple monolith with predictable CPU load |
| Service Bus / Event Hubs / Storage Queue triggers | No external event source to monitor |

---

## KEDA

> **KEDA** (Kubernetes Event-driven Autoscaling) is an open-source component that scales workloads based on **external event sources** — not just CPU or memory. Azure Container Apps uses KEDA under the hood: you define scaler type, metadata, and auth; the platform polls metrics and adjusts replicas (including **scale-to-zero**).

Azure Container Apps follows the **ScaledObject** pattern: scaler type + metadata + authentication. Microsoft maintains first-party scalers for Azure Service Bus, Event Hubs, Storage Queue, Blob Storage, Log Analytics, and Azure Monitor. Community scalers exist for non-Azure sources.

**Use case:** An AI embedding worker that sits idle overnight but must spin up when 50 documents land on a Service Bus queue.

```text
Queue depth ↑  →  KEDA scaler  →  ACA adds replicas  →  Workers drain queue  →  Scale to zero
```

---

## Scale rules

> **Scale rules** in Container Apps define *when* to add or remove replicas: HTTP concurrency, TCP connections, CPU/memory, or **custom KEDA rules** tied to Azure services. Each rule has a name, type, metadata (thresholds, resource names), and optional auth.

Combine rules carefully — HTTP rules suit APIs; custom KEDA rules suit async AI backends. Set `minReplicas: 0` for cost savings on batch jobs; set `maxReplicas` to cap spend and respect downstream limits (e.g. Event Hub partition count).

---

## Azure Service Bus

> **Azure Service Bus** is a managed **enterprise messaging** service (queues and topics/subscriptions) for decoupling AI pipeline stages — e.g. ingest → embed → index. KEDA monitors **active message count** and scales replicas so backlog is processed within your SLA.

**When to use:** Dead-letter queues, sessions, topics with multiple consumers, higher throughput, enterprise messaging patterns.

**When not to use:** Simple, low-cost FIFO queues with minimal features — consider Storage Queue instead.

### Configure Service Bus scaling

The scaler divides current message count by your `messageCount` threshold. Example: threshold `5` and 50 messages → **10 replicas** requested.

```bash
az containerapp create \
  --name order-processor \
  --resource-group rg-ecommerce \
  --environment my-environment \
  --image myregistry.azurecr.io/order-processor:v1 \
  --min-replicas 0 \
  --max-replicas 30 \
  --secrets "sb-connection=<SERVICE_BUS_CONNECTION_STRING>" \
  --scale-rule-name servicebus-scaling \
  --scale-rule-type azure-servicebus \
  --scale-rule-metadata "queueName=orders" \
                        "namespace=sb-ecommerce" \
                        "messageCount=5" \
  --scale-rule-auth "connection=sb-connection"
```

For **topics**, use `topicName` + `subscriptionName` instead of `queueName`. Each subscription scales independently.

**AI use case:** Service Bus queue receives "document uploaded" events; Container App workers generate embeddings and write to Cosmos DB.

---

## Azure Storage Queue

> **Azure Storage Queue** is a **simple, low-cost** queue built on Azure Storage accounts. KEDA watches **approximate message count** (`queueLength` threshold) and scales replicas similarly to Service Bus — but with lower throughput and fewer messaging features.

**When to use:** Straightforward queue processing, dev/test, cost-sensitive batch jobs.

**When not to use:** You need dead-letter handling, sessions, scheduled delivery, or high throughput — use Service Bus.

### Configure Storage Queue scaling

Metadata: `queueName`, `accountName`, `queueLength`. Auth via connection string secret or **managed identity** with Storage Queue Data Reader.

**AI use case:** Nightly batch job reads image URLs from a queue and runs vision inference — scales to zero between batches.

---

## Azure Event Hubs

> **Azure Event Hubs** is a **high-throughput event streaming** platform (Kafka-style partitions). KEDA scales based on **consumer lag** — unprocessed events vs checkpoint position — not simple message count.

**When to use:** Streaming telemetry, high-volume ingestion, real-time AI pipelines reading partitioned event streams.

**When not to use:** Simple point-to-point job queues — Service Bus or Storage Queue is simpler.

**Critical exam point:** Max useful replicas ≤ **partition count**. A 32-partition hub cannot benefit from 50 replicas in one consumer group.

### Configure Event Hubs scaling

Key metadata: `consumerGroup`, `unprocessedEventThreshold`, `checkpointStrategy` (prefer `blobMetadata` when checkpointing to Blob Storage).

```yaml
scale:
  minReplicas: 0
  maxReplicas: 32
  rules:
    - name: eventhubs-scaling
      custom:
        type: azure-eventhub
        metadata:
          consumerGroup: "$Default"
          unprocessedEventThreshold: "64"
          checkpointStrategy: "blobMetadata"
        auth:
          - secretRef: eh-connection
            triggerParameter: connection
```

**AI use case:** Stream of user events fed to Event Hubs; Container Apps consumers run real-time feature extraction before model inference.

---

## Authenticate scale rules

Custom scalers need auth to read queue/event metrics.

| Method | Description |
|--------|-------------|
| **Secrets** | Store connection strings as ACA secrets; map via `--scale-rule-auth` |
| **Managed identity** (preferred) | User-assigned identity + RBAC (e.g. Service Bus Data Receiver); no secrets in config |

```bash
az containerapp create \
  --name queue-processor \
  --resource-group rg-ecommerce \
  --environment my-environment \
  --image myregistry.azurecr.io/queue-processor:v1 \
  --user-assigned <MANAGED_IDENTITY_RESOURCE_ID> \
  --min-replicas 0 \
  --max-replicas 20 \
  --scale-rule-name storage-queue-scaling \
  --scale-rule-type azure-queue \
  --scale-rule-metadata "accountName=stecommerce" \
                        "queueName=inventory-updates" \
                        "queueLength=10" \
  --scale-rule-identity <MANAGED_IDENTITY_RESOURCE_ID>
```

---

## Best practices

1. **Use managed identity** — fewer secrets, easier rotation, better security posture
2. **Set thresholds from processing time** — if one message takes 10s and you need 100/min, target ~17 concurrent workers; tune `messageCount` / `queueLength` accordingly
3. **Scale to zero** for async AI workers — messages/events trigger scale-up automatically
4. **Monitor queue depth + replica count** in Azure Monitor — growing backlog means lower threshold; idle replicas mean raise threshold
5. **Cap `maxReplicas`** — control cost and respect Event Hub partition limits
6. **Match scaler to pattern** — queue = Service Bus/Storage; stream = Event Hubs; API = HTTP rules

---

## Pricing and cost optimization

### How Container Apps is charged

| Component | Billing model |
|-----------|----------------|
| **vCPU & memory** | Per second, per replica, while running |
| **Requests** | HTTP request count (ingress) |
| **Idle (scale to zero)** | **No compute charge** when replicas = 0 |
| **Environment** | Shared infrastructure; no per-app environment fee for standard usage |

Event-driven scaling saves money when workloads are **spiky or idle**: embedding workers, batch inference, and queue processors pay only while messages exist.

### Cost optimization features

- **`minReplicas: 0`** — scale to zero when queue/stream is empty (biggest saver for async AI)
- **Right-size CPU/memory** per replica — don't over-provision GPU/CPU for light queue handlers
- **Tune scale thresholds** — avoid over-scaling (too many idle replicas) or under-scaling (long backlogs)
- **Choose the right queue** — Storage Queue is cheaper than Service Bus for simple scenarios
- **Limit `maxReplicas`** — prevents runaway scale during poison-message storms
- **Managed identity** — no secret rotation ops cost; reduces security incident risk
- **Consumption plan** — pay per use; no cluster management overhead vs AKS

### Example cost mindset

```text
1000 docs/day, 2 min processing each, burst over 2 hours
→ Without scale-to-zero: replicas run 24h
→ With KEDA + minReplicas 0: replicas run ~2h
→ ~90%+ compute savings on idle time
```

---

## Summary

**KEDA** on Azure Container Apps lets AI backends scale on **Service Bus**, **Storage Queue**, and **Event Hubs** metrics — not just HTTP. Configure scale rules with the right threshold, authenticate with **managed identity** when possible, respect **Event Hub partition limits**, and use **scale-to-zero** to optimize cost for asynchronous AI workloads.

## Learn more

- [Scale rules in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)
- [KEDA scalers on Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app#custom)
- [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/)
- [Azure Event Hubs](https://learn.microsoft.com/en-us/azure/event-hubs/)
- [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
