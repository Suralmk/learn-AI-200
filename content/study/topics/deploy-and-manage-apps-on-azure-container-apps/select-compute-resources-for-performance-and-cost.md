---
title: "Select compute resources for performance and cost"
pathSlug: "deploy-and-manage-apps-on-azure-container-apps"
moduleName: "Scale containers in Azure Container Apps"
---

## Overview

**CPU**, **memory**, **replica count**, and **workload profile** choices on Azure Container Apps directly control AI workload performance and cost. A chat API, embedding worker, and GPU inference container each need different sizing — this unit covers how to allocate resources, pick Consumption vs Dedicated profiles, and balance scale limits with per-replica capacity.

## Exam tips

- **Memory constraint:** `memory (GiB) ≥ 2 × CPU (cores)` — e.g. 0.5 CPU → minimum 1.0 GiB
- **Defaults:** 0.25 cores, 0.5 GiB per container
- **Consumption max per container:** 4 cores, 8 GiB (not per replica — per container in the pod)
- **Memory over limit** → replica **terminated and restarted**; **CPU over limit** → **throttled** (degraded performance, not killed)
- **Billing:** vCPU-seconds + GiB-seconds while replicas run; idle replicas cost **less** than active; **scale-to-zero** = no compute charge
- **Dedicated workload profiles** required for **GPU** and allocations **> 4 cores / 8 GiB**
- **Total capacity** = per-replica resources × `maxReplicas` (max 1000 replicas per revision)
- Multi-container apps: **each container** has its own CPU/memory allocation

## When to use vs when not to use

| Choose Consumption (serverless) | Choose Dedicated workload profile |
|--------------------------------|-----------------------------------|
| Variable traffic, scale-to-zero savings | GPU inference (CUDA workloads) |
| Web APIs, queue workers, embedding jobs | Need > 4 cores or > 8 GiB per container |
| Cost-sensitive AI microservices | Strict, consistent latency (no noisy-neighbor) |
| Spiky batch inference | Compliance requires dedicated infrastructure |
| Start with defaults, right-size from metrics | Sustained high utilization justifies reserved VMs |

| Right-size smaller replicas | Right-size larger replicas |
|-----------------------------|----------------------------|
| Finer scaling granularity | Fewer replicas for same total capacity |
| More scale events | Coarser steps — may over-provision between thresholds |
| Light API handlers, small models | CPU-heavy JSON, image prep, large in-memory caches |

---

## Resource allocation

> **Resource allocation** is the CPU (cores or fractions) and memory (GiB) assigned to **each container** in a replica. Every replica gets the full allocation; the platform enforces limits so apps in the same environment do not contend for unbounded resources.

Billing tracks **vCPU-seconds** and **GiB-seconds** — larger per-replica sizes cost more per second but may reduce the replica count needed for peak load.

### CPU vs memory behavior

| Limit exceeded | Platform behavior | Impact |
|----------------|-------------------|--------|
| **Memory** | Replica **terminated and restarted** | Hard failure — requests may fail mid-flight |
| **CPU** | Replica **throttled** | Slower responses, timeouts under load — no automatic restart |

### Memory–CPU constraint

| CPU (cores) | Minimum memory (GiB) |
|-------------|----------------------|
| 0.25 | 0.5 (default) |
| 0.5 | 1.0 |
| 1.0 | 2.0 |
| 2.0 | 4.0 |
| 4.0 | 8.0 (Consumption max) |

**AI use case:** An LLM gateway at 0.5 CPU / 1 GiB handles routing; bump to 2 CPU / 4 GiB if you cache tokenizers and prompt templates in memory.

---

## Replica

> A **replica** is one running instance of your container app revision. **Total capacity** = (CPU per replica) × (replica count). Scale rules add or remove replicas; each active replica bills for its configured CPU and memory.

```text
Peak capacity = --cpu × --max-replicas
Example: 0.5 CPU × 20 replicas = 10 cores maximum
```

---

## Configure container resources

Use `--cpu` and `--memory` on create or update. Defaults suit lightweight apps; increase when you see throttling, OOM restarts, or latency tied to resource pressure.

```bash
az containerapp create \
  --name order-api \
  --resource-group rg-ecommerce \
  --environment my-environment \
  --image myregistry.azurecr.io/order-api:v1 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 2 \
  --max-replicas 20
```

```bash
# Right-size after monitoring — update without redeploying image
az containerapp update \
  --name embedding-worker \
  --resource-group rg-ai200 \
  --cpu 1.0 \
  --memory 2.0Gi \
  --min-replicas 0 \
  --max-replicas 50
```

### Multi-container replicas

> In a **multi-container** replica (app + sidecar), **each container** declares its own `--cpu` and `--memory`. Sidecars for logging, OpenTelemetry, or model warm-up add to the per-replica footprint and environment capacity usage.

| Container | Typical AI role | Sizing note |
|-----------|-----------------|-------------|
| Main app | API or worker | Size for request handling |
| Sidecar | OTel collector, auth proxy | Keep small (0.25 CPU / 0.5 GiB) |
| Init | Model download | Runs once per replica start |

---

## Workload profiles and environment types

> A **Container Apps environment** hosts your apps. **Consumption-only** environments use shared, serverless compute with pay-per-use billing. **Workload profile** environments add **Dedicated** VM pools reserved for your workloads — required for GPU and larger per-container limits.

### Environment comparison

| Feature | Consumption-only environment | Workload profiles environment |
|---------|------------------------------|-------------------------------|
| Billing | vCPU + GiB per second (active/idle rates) | Consumption profile: same; Dedicated: VM reservation |
| Max per container | 4 CPU, 8 GiB | Dedicated: larger (VM-size dependent) |
| GPU | Not supported | Supported on GPU workload profiles |
| Performance | Shared tenants — some variability | Dedicated: consistent, isolated |
| Best for | Most APIs, async AI workers | GPU inference, compliance, large memory |

### Consumption plan

> The **Consumption plan** (serverless) charges only while replicas run. You do not provision VMs; the platform scales infrastructure. **Scale-to-zero** eliminates compute cost during idle periods — ideal for intermittent embedding or batch jobs.

**When to use:** Variable traffic, cost optimization, most web and background AI services.

**When not to use:** GPU workloads, per-container needs above 4 CPU / 8 GiB, or strict latency SLAs that cannot tolerate cold starts or shared-tenant variability.

### Dedicated workload profile

> A **Dedicated workload profile** assigns specific VM sizes (e.g. D-series, GPU SKUs) to your environment. Your container apps run on reserved capacity — more predictable performance, higher baseline cost, required for **GPU** and large memory models.

**When to use:** Local LLM inference on GPU, large in-memory vector indexes, compliance-mandated isolation.

**When not to use:** Low-traffic dev APIs where Consumption + scale-to-zero is cheaper.

**AI use case:** Consumption profile for a document-ingestion API (scale-to-zero nights); Dedicated GPU profile for real-time image generation with stable sub-second latency.

---

## Optimize for cost efficiency

> **Cost optimization** on Container Apps means minimizing billable vCPU-seconds and GiB-seconds without missing SLAs — scale-to-zero, right-sizing, and Consumption over Dedicated when utilization is spiky.

### What you pay for

| Charge type | Details |
|-------------|---------|
| **Active replicas** | Full vCPU + GiB rate while processing |
| **Idle replicas** | Lower rate — still running but not handling requests |
| **Scale-to-zero** | **$0 compute** for that app when replicas = 0 |
| **HTTP requests** | Per-request ingress charge (separate from compute) |
| **Dedicated VMs** | Reserved profile cost even when apps scale down |

### Cost optimization checklist

- Set **`minReplicas: 0`** for intermittent queue workers and batch inference
- **Start at defaults** (0.25 CPU / 0.5 GiB) — increase only from Azure Monitor data
- Prefer **Consumption** over Dedicated unless GPU, size limits, or compliance require it
- **Cap `maxReplicas`** — defines cost ceiling: `max cost ∝ cpu × memory × maxReplicas`
- Avoid **over-sized cron baselines** — idle replicas during business hours still bill
- **Right-size before scaling out** — doubling replicas costs more than modest CPU bump if app is CPU-throttled

```text
Async embedding worker:
  minReplicas 0 + KEDA queue scaler → pay only when documents arrive
  vs minReplicas 2 24/7 → ~100% idle compute waste overnight
```

---

## Optimize for performance

> **Performance optimization** ensures each replica has enough CPU and memory to meet latency and throughput targets — and enough **minimum replicas** to avoid cold-start delays where SLAs require it.

### Performance levers

| Lever | Action | AI example |
|-------|--------|------------|
| **More CPU** | Reduce throttling on serialization, tokenization, image decode | PDF chunking API |
| **More memory** | Larger caches, bigger request payloads, in-memory indexes | RAG context cache |
| **`minReplicas ≥ 1`** | Eliminate cold start on first request | User-facing chat API |
| **Dedicated profile** | Consistent CPU, GPU access | Stable LLM inference |
| **Tune `maxReplicas`** | Enough peak cores for concurrent inference | 2000 RPS ÷ 100 RPS/replica = 20 replicas |

### Cold start trade-off

| Setting | Latency | Cost |
|---------|---------|------|
| `minReplicas: 0` | First request waits for provision + pull image | Lowest idle cost |
| `minReplicas: 1+` | Always warm | Always-on compute charge |

Monitor **CPU utilization**, **memory working set**, and **replica restart count** (OOM indicator) in Azure Monitor before and after changes.

---

## Balance scaling limits with resources

> **Scaling limits** (`minReplicas`, `maxReplicas`) and **per-replica resources** together define peak capacity and maximum spend. Plan both from expected peak load and per-replica throughput.

### Capacity planning formula

```text
Required maxReplicas = peak load ÷ throughput per replica
Total peak CPU = --cpu × maxReplicas
Total peak memory = --memory × maxReplicas
```

| Scenario | Per replica | Peak need | Config |
|----------|-------------|-----------|--------|
| Chat API | 100 RPS, 0.5 CPU | 2000 RPS | `--cpu 0.5 --max-replicas 20` |
| Embedding worker | 10 docs/min, 1 CPU | 500 docs/min | `--cpu 1.0 --max-replicas 50` |
| GPU inference | 5 req/s, 4 CPU + GPU | 50 req/s | Dedicated profile, `--max-replicas 10` |

### Replica size vs granularity

**Larger replicas (fewer copies):**

- Fewer scale events, less orchestration overhead
- Risk of over-provisioning between scale steps

**Smaller replicas (more copies):**

- Finer match to demand
- More scale events; ensure app handles connection drain gracefully

**Exam cap:** Maximum **1000 replicas** per revision — practical limits usually come from workload and cost before hitting this.

---

## Best practices

1. **Start with defaults, scale from data** — 0.25 CPU / 0.5 GiB, then tune from Azure Monitor
2. **Use Consumption for most AI microservices** — Dedicated only when GPU, size, or compliance demands it
3. **Remember memory ≥ 2× CPU** — invalid combos fail at deploy time
4. **Scale-to-zero for async** — pair with reliable KEDA/HTTP triggers
5. **`minReplicas: 1` for sync user APIs** — when cold start is unacceptable
6. **Monitor OOM vs throttle** — restarts = memory; slow under load = CPU
7. **Plan total cost** — `cpu × memory × maxReplicas` is your worst-case compute envelope
8. **Size sidecars separately** — don't starve the main inference container

---

## Pricing and billing summary

| Plan / profile | Billing model | Cost optimization highlight |
|----------------|---------------|----------------------------|
| **Consumption** (serverless) | Per vCPU-second + GiB-second + requests | Scale-to-zero, right-sizing, variable traffic |
| **Idle replicas** | Reduced rate vs active | Lower than active but not free — prefer zero min for batch |
| **Dedicated workload profile** | Reserved VM capacity + app consumption | Use only when utilization is steady or GPU required |
| **Multi-container** | Sum of each container's allocation × replicas | Minimize sidecar resources |

### Example: cost vs performance decision

```text
LLM routing API (lightweight):
  0.25 CPU, 0.5 GiB, minReplicas 1, maxReplicas 10
  → Low per-replica cost, always-warm for <200ms SLA

Batch summarization worker:
  1.0 CPU, 2.0 GiB, minReplicas 0, maxReplicas 30, KEDA on Service Bus
  → Zero cost overnight, scales with queue depth
```

---

## Summary

Select **CPU and memory** per container (memory at least **2× CPU** in GiB), pick **Consumption** for most variable AI workloads and **Dedicated** for GPU or large allocations, and align **`maxReplicas` × per-replica resources** with peak load and budget. Use **scale-to-zero** and monitoring to optimize cost; use **`minReplicas ≥ 1`** and Dedicated profiles when latency and consistency matter more than idle savings.

## Learn more

- [Containers in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/containers)
- [Workload profiles](https://learn.microsoft.com/en-us/azure/container-apps/workload-profiles-overview)
- [Scale apps in Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)
- [Monitor Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/observability)
- [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
