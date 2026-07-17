---
title: "Apply KEDA scalers for custom workloads"
pathSlug: "deploy-and-manage-apps-on-azure-container-apps"
moduleName: "Scale containers in Azure Container Apps"
---

## Overview

Beyond Azure-native scalers, Azure Container Apps supports **any ScaledObject-based KEDA scaler** — Kafka consumer lag, Redis queue depth, Prometheus metrics, cron schedules, PostgreSQL, MongoDB, and more. Custom scalers let AI workloads respond to diverse signals: streaming pipelines, in-memory task queues, business KPIs, and predictable peak windows.

## Exam tips

- ACA supports **ScaledObject-based** KEDA scalers — not every advanced KEDA feature (external scalers, custom intervals) maps 1:1
- **Kafka**: `lagThreshold` per partition; max replicas ≤ **partition count** (same rule as Event Hubs)
- **Redis Lists**: `listLength` via `LLEN`; **Redis Streams**: tracks **pending** (unacknowledged) entries — better for failure handling
- **Cron**: `start` / `end` cron expressions + `desiredReplicas` — establishes **baseline** capacity, not reactive scaling alone
- **Multiple rules**: ACA uses the **highest** replica count among active scalers
- **Prometheus**: `query` (PromQL) ÷ `threshold` = desired replicas
- Prefer **Azure-native scalers** first when the event source is on Azure (first-party support)
- Scaler categories: **Microsoft-maintained** (Azure), **community-maintained**, **external** (separate deployment — limited on ACA)

## When to use vs when not to use

| Use custom KEDA scalers | Avoid or use alternatives |
|-------------------------|---------------------------|
| Kafka, Redis, or Prometheus already in your stack | Event source is Azure Service Bus / Event Hubs — use native scalers |
| Business metrics only in Prometheus | Simple HTTP API with steady traffic — use HTTP concurrency rules |
| Predictable peak hours (cron + HTTP) | Need sub-second scale response — KEDA polls ~30s |
| Multi-cloud or hybrid messaging (Kafka) | External KEDA scalers requiring separate gRPC deployment |
| AI pipeline with Redis task queue between stages | Greenfield on Azure only — native queues are simpler to operate |

---

## KEDA scalers (custom workloads)

> **KEDA scalers** are pluggable adapters that read metrics from an event source (queue depth, consumer lag, PromQL result, cron window) and compute a **desired replica count**. On Container Apps, each scaler becomes a **custom scale rule** with `type`, `metadata`, and `auth` — following the ScaledObject pattern without running KEDA yourself.

Commonly used non-Azure scalers: **Apache Kafka**, **Redis Lists/Streams**, **Prometheus**, **Cron**, PostgreSQL, MySQL, MongoDB, and external metrics APIs. Evaluate each scaler's auth support, metric semantics, and how threshold maps to replicas before production use.

**Scaler maintainer tiers:**

| Tier | Examples | Exam note |
|------|----------|-----------|
| Microsoft-maintained | Service Bus, Event Hubs, Storage Queue | Prefer for Azure resources |
| Community-maintained | Kafka, Redis, Cron, Prometheus | Varying docs/support |
| External scalers | Custom gRPC scaler services | Extra deployment; limited ACA support |

**AI use case:** A RAG pipeline uses Redis Streams as a task queue between document chunking and embedding workers — KEDA scales embedding replicas on pending message count.

```text
Event source  →  KEDA scaler (30s poll)  →  desired replicas  →  ACA scales app
```

---

## Apache Kafka

> **Apache Kafka** is a distributed **event streaming** platform (topics, partitions, consumer groups). The KEDA Kafka scaler monitors **consumer group lag** — the gap between the latest partition offset and your consumer's committed offset — and scales replicas to drain backlog faster.

**When to use:** Existing Kafka clusters (on-prem, Confluent Cloud, AKS), high-throughput streaming AI pipelines, multi-cloud event buses.

**When not to use:** Greenfield Azure-only workloads — **Azure Event Hubs** has a native KEDA scaler with tighter ACA integration.

### Configure Kafka scaling

Key metadata: `bootstrapServers`, `consumerGroup`, `topic`, `lagThreshold`. Auth: SASL (PLAIN, SCRAM) or TLS via secrets.

Lag math: `lagThreshold=100` and 500 total lag → **5 replicas** requested.

**Partition limit (exam):** One active consumer per partition per consumer group — `maxReplicas` above partition count wastes money.

```yaml
scale:
  minReplicas: 1
  maxReplicas: 50
  rules:
    - name: kafka-scaling
      custom:
        type: kafka
        metadata:
          bootstrapServers: "kafka-broker:9092"
          consumerGroup: "order-consumers"
          topic: "orders"
          lagThreshold: "100"
        auth:
          - secretRef: kafka-credentials
            triggerParameter: sasl
```

```bash
az containerapp update \
  --name ai-stream-processor \
  --resource-group rg-ai200 \
  --min-replicas 1 \
  --max-replicas 32 \
  --scale-rule-name kafka-scaling \
  --scale-rule-type kafka \
  --scale-rule-metadata "bootstrapServers=kafka:9092" \
                        "consumerGroup=embedding-workers" \
                        "topic=document-events" \
                        "lagThreshold=50" \
  --scale-rule-auth "sasl=kafka-credentials"
```

**AI use case:** Kafka topic receives real-time user events; Container Apps workers run feature extraction before sending prompts to an LLM endpoint.

---

## Redis

> **Azure Cache for Redis** (or self-hosted Redis) provides **in-memory** data structures used as lightweight task queues. KEDA offers two scalers: **Redis Lists** (`LLEN` on a list key) and **Redis Streams** (pending entries in a consumer group — includes in-flight, unacknowledged work).

**When to use:**

- **Redis Lists** — Simple producer/consumer (`LPUSH` / `BRPOP`), dev/test, low-latency in-memory queues between AI microservices
- **Redis Streams** — Consumer groups, acknowledgment, better recovery when workers crash mid-job

**When not to use:** Durable, high-volume enterprise messaging — use Service Bus or Kafka. Very large backlogs — memory cost and eviction risk.

ACA supports standard Redis, **Redis Cluster**, and **Redis Sentinel** — pick the scaler variant matching your topology.

### Redis Lists scaler

Metadata: `address`, `listName`, `listLength` (threshold).

```yaml
scale:
  minReplicas: 0
  maxReplicas: 20
  rules:
    - name: redis-list-scaling
      custom:
        type: redis
        metadata:
          address: "redis-cache.redis.cache.windows.net:6380"
          listName: "embedding-jobs"
          listLength: "10"
          enableTLS: "true"
        auth:
          - secretRef: redis-password
            triggerParameter: password
```

### Redis Streams scaler

Metadata: `address`, `stream`, `consumerGroup`, `pendingEntriesCount` (threshold).

```yaml
scale:
  rules:
    - name: redis-streams-scaling
      custom:
        type: redis-streams
        metadata:
          address: "redis:6379"
          stream: "inference-tasks"
          consumerGroup: "gpu-workers"
          pendingEntriesCount: "5"
        auth:
          - secretRef: redis-password
            triggerParameter: password
```

**AI use case:** API gateway pushes inference requests to a Redis Stream; GPU-backed Container Apps scale on pending entries, ack on completion.

---

## Cron

> **Cron scaling** is a KEDA scaler that requests a **fixed replica count** during **scheduled time windows** — not based on live metrics. Use cron expressions for `start` and `end`, plus `timezone` and `desiredReplicas`. Outside the window, the cron rule is inactive and does not influence replica count.

**When to use:** Known peak periods (business hours, batch ETL windows, scheduled model retraining), pre-warming before traffic spikes, combining with HTTP/event scalers for baseline + reactive capacity.

**When not to use:** Sole scaling strategy for unpredictable load — pair with HTTP or queue-based rules. Workloads that should scale to zero 24/7 with no scheduled peaks.

### Configure cron + HTTP scaling

During the cron window, at least `desiredReplicas` run. ACA picks the **maximum** across all active rules.

```yaml
scale:
  minReplicas: 0
  maxReplicas: 20
  rules:
    - name: business-hours
      custom:
        type: cron
        metadata:
          timezone: "America/New_York"
          start: "0 8 * * 1-5"
          end: "0 18 * * 1-5"
          desiredReplicas: "5"
    - name: http-scaling
      http:
        metadata:
          concurrentRequests: "50"
```

```bash
az containerapp update \
  --name chat-api \
  --resource-group rg-ai200 \
  --scale-rule-name business-hours \
  --scale-rule-type cron \
  --scale-rule-metadata "timezone=America/New_York" \
                        "start=0 8 * * 1-5" \
                        "end=0 18 * * 1-5" \
                        "desiredReplicas=5"
```

**Behavior:** Off-hours + no HTTP → scale to zero. Business hours → minimum 5 replicas even if idle. HTTP spikes above 5 → HTTP rule wins.

**AI use case:** Customer support chatbot API pre-scales 5 replicas at 8 AM; HTTP rule adds more during lunch-hour traffic.

---

## Prometheus

> **Prometheus** is an open-source **metrics and alerting** system that scrapes time-series data. The KEDA Prometheus scaler runs a **PromQL query** against your Prometheus server and divides the result by `threshold` to compute desired replicas — enabling scale on **custom business metrics**, SLOs, or app-specific signals HTTP/queue rules cannot see.

**When to use:** Active sessions, GPU utilization proxies, pending transactions, custom AI inference queue depth exported to Prometheus, SLO-driven scaling.

**When not to use:** Metric already available as a native ACA/Azure Monitor signal — simpler to use built-in scalers. No Prometheus in your observability stack.

### Configure Prometheus scaling

Metadata: `serverAddress`, `metricName`, `query`, `threshold`.

```yaml
scale:
  minReplicas: 1
  maxReplicas: 30
  rules:
    - name: prometheus-scaling
      custom:
        type: prometheus
        metadata:
          serverAddress: "http://prometheus.monitoring:9090"
          metricName: "active_inference_requests"
          query: "sum(active_inference_requests)"
          threshold: "20"
```

```bash
az containerapp update \
  --name llm-gateway \
  --resource-group rg-ai200 \
  --scale-rule-name prometheus-scaling \
  --scale-rule-type prometheus \
  --scale-rule-metadata "serverAddress=http://prometheus:9090" \
                        "metricName=active_inference_requests" \
                        "query=sum(active_inference_requests)" \
                        "threshold=20"
```

**AI use case:** Scale LLM gateway replicas when `sum(active_inference_requests)` exceeds 20 per replica — correlates with token throughput better than raw HTTP count.

---

## Convert KEDA ScaledObject to Container Apps rules

> A **KEDA ScaledObject** is the Kubernetes CRD that binds a deployment to one or more triggers. On Container Apps, you map the same fields to **scale rules** in YAML or `az containerapp` CLI — secrets replace TriggerAuthentication, and `minReplicaCount`/`maxReplicaCount` become `minReplicas`/`maxReplicas`.

### Conversion steps

| KEDA ScaledObject | Container Apps |
|-------------------|----------------|
| `triggers[].type` | `--scale-rule-type` or `custom.type` |
| `triggers[].metadata` | `--scale-rule-metadata` or `custom.metadata` |
| `TriggerAuthentication` | Secrets + `--scale-rule-auth` or `auth[]`; or `--scale-rule-identity` |
| `minReplicaCount` | `--min-replicas` / `minReplicas` |
| `maxReplicaCount` | `--max-replicas` / `maxReplicas` |

### Example: KEDA ScaledObject → ACA YAML

**KEDA (Kubernetes):**

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: order-processor
spec:
  scaleTargetRef:
    name: order-processor
  minReplicaCount: 0
  maxReplicaCount: 50
  triggers:
    - type: kafka
      metadata:
        bootstrapServers: kafka:9092
        consumerGroup: order-consumers
        topic: orders
        lagThreshold: "100"
      authenticationRef:
        name: kafka-auth
```

**Container Apps equivalent:**

```yaml
scale:
  minReplicas: 0
  maxReplicas: 50
  rules:
    - name: kafka-scaling
      custom:
        type: kafka
        metadata:
          bootstrapServers: "kafka:9092"
          consumerGroup: "order-consumers"
          topic: "orders"
          lagThreshold: "100"
        auth:
          - secretRef: kafka-credentials
            triggerParameter: sasl
```

**ACA limitations vs native KEDA:** No full `TriggerAuthentication` resource — reference secrets inline. External scalers and custom polling intervals may not be available.

---

## Best practices

1. **Start with Azure-native scalers** when the event source is on Azure (Service Bus, Event Hubs, Storage Queue)
2. **Test in staging** — validate poll interval (~30s), threshold math, and scale-down behavior before production
3. **Combine cron + reactive** — cron for baseline; HTTP/Kafka/Redis/Prometheus for spikes
4. **Respect partition limits** — Kafka and Event Hubs: `maxReplicas` ≤ partitions
5. **Document thresholds** — why `lagThreshold=100`, who owns the PromQL query, rotation for secrets
6. **Cap `maxReplicas`** — prevent runaway cost from misconfigured thresholds or poison messages

---

## Pricing and cost optimization

### How this affects billing

Custom KEDA scalers do not add a separate KEDA fee on Container Apps. You pay standard ACA **compute** (vCPU + memory per replica per second), **HTTP requests** (if ingress), and the **backing services** (Kafka cluster, Redis cache, Prometheus VM/AKS, etc.).

| Cost driver | Custom scaler impact |
|-------------|---------------------|
| **Replicas running** | Kafka/Redis/Prometheus rules add replicas when backlog/metrics rise |
| **Cron scaler** | Keeps `desiredReplicas` running during window — **baseline cost** even if idle |
| **Scale to zero** | Kafka/Redis/Prometheus can use `minReplicas: 0`; cron windows may prevent zero during business hours |
| **Redis / Kafka** | Separate service billing (Cache SKU, Confluent, self-hosted infra) |

### Cost optimization

- **`minReplicas: 0`** on Kafka/Redis/Prometheus rules — avoid paying for idle workers
- **Tune thresholds** — too low → excess replicas; too high → slow backlog drain and SLA misses
- **Cron only for real peaks** — don't set `desiredReplicas: 10` all day if HTTP scaling suffices mornings only
- **Right-size Redis** — in-memory queues are fast but costly at scale; move durable backlog to Service Bus
- **Kafka partitions** — match partition count to max needed parallelism; don't over-partition
- **Prometheus query cost** — simple queries; avoid expensive PromQL evaluated every 30s across large datasets
- **`maxReplicas` cap** — hard limit on spend during metric storms or lag spikes
- **Prefer Azure-native scalers** — fewer moving parts, no extra Kafka/Redis infra if Azure queues suffice

### Example: cron vs scale-to-zero trade-off

```text
Cron: 5 replicas × 10 business hours/day × $0.000024/vCPU-s
  → Baseline cost for instant morning capacity

Kafka lag scaler: 0 replicas overnight, scale on demand
  → Save ~70% compute vs always-on 5 replicas
  → Accept cold-start latency when first messages arrive
```

---

## Summary

Custom KEDA scalers on Container Apps unlock **Kafka**, **Redis**, **Cron**, and **Prometheus** (plus dozens more) for event-driven AI workloads. Map ScaledObject specs to ACA scale rules, combine scheduled and reactive scaling, respect **partition limits**, and optimize cost with **scale-to-zero**, tuned thresholds, and capped `maxReplicas`.

## Learn more

- [Scale rules in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)
- [KEDA scalers catalog](https://keda.sh/docs/latest/scalers/)
- [KEDA Apache Kafka scaler](https://keda.sh/docs/latest/scalers/apache-kafka/)
- [KEDA Redis scaler](https://keda.sh/docs/latest/scalers/redis-lists/)
- [KEDA Cron scaler](https://keda.sh/docs/latest/scalers/cron/)
- [KEDA Prometheus scaler](https://keda.sh/docs/latest/scalers/prometheus/)
- [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
