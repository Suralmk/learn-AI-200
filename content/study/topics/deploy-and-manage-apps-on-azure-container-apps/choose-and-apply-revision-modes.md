---
title: "Choose and apply revision modes"
pathSlug: "deploy-and-manage-apps-on-azure-container-apps"
moduleName: "Scale containers in Azure Container Apps"
---

## Overview

**Revision modes** control how Azure Container Apps deploys new versions and whether multiple versions run at once. Your choice affects zero-downtime updates, traffic splitting, canary releases, and how replicas scale during rollouts.

## Revision

> A **revision** is an **immutable snapshot** of a container app at a point in time. Deploying changes to images, scale rules, env vars, or template settings creates a **new revision** — you cannot edit an existing one. Roll back by reactivating an older revision.

**Replicas** are running instances of a **specific revision**. Each active revision scales on its own rules and traffic share.

## Exam tips

- **Single revision mode** = default; only one active revision; zero-downtime swap is automatic
- **Multiple revision mode** = several active revisions; you manage traffic and deactivation
- **Revision-scope** changes (image, scale rules, env vars) → **new revision**
- **Application-scope** changes (secrets, ingress, traffic split) → **no new revision**
- Traffic weights must total **100%**; routing is **probabilistic**
- **`latest`** weight targets the newest revision without updating names each deploy
- **Labels** = direct URL to one revision; independent of traffic splitting
- Up to **100 inactive revisions** kept; oldest purged when exceeded
- Multiple active revisions → **higher cost** (each has its own min replicas)

---

## Revision-scope vs application-scope changes

| Creates new revision | Does not create new revision |
|----------------------|------------------------------|
| Container image | Secrets |
| Scale rules | Ingress settings |
| Environment variables | Traffic splitting weights |
| Template properties | — |

---

## Single revision mode

> **Single revision mode** keeps **one active revision** at a time. When you deploy, ACA starts the new revision, waits for health checks, shifts **all traffic**, then **deactivates** the old one — zero-downtime by default.

**Use when:** Simple replace deployments; no canary or A/B testing needed.

**Do not use when:** You need gradual rollouts or traffic splitting — switch to multiple revision mode.

```text
Deploy v2 → v2 becomes ready → 100% traffic to v2 → v1 deactivated
```

---

## Multiple revision mode

> **Multiple revision mode** allows **several active revisions** at once. Each can receive traffic, scale independently, and stay running until you **deactivate** it. Enables canary, blue-green, and A/B patterns.

**Use when:** Canary releases, production validation with partial traffic, blue-green cutover.

**Trade-off:** More ops work — manage weights, monitor each revision, deactivate old ones promptly.

```bash
az containerapp update \
  --name order-api \
  --resource-group rg-ecommerce \
  --revision-mode multiple
```

### Revision states

| State | Receives traffic | Uses compute |
|-------|------------------|--------------|
| **Active** | Yes | Yes — scales per its rules |
| **Inactive** | No | No — kept for rollback (max 100) |

---

## Traffic splitting

> **Traffic splitting** sends incoming requests to active revisions by **percentage weights** (must sum to 100). Assignment is random per request — actual split may vary slightly from configured values.

```bash
az containerapp ingress traffic set \
  --name order-api \
  --resource-group rg-ecommerce \
  --revision-weight order-api--v1=80 order-api--v2=20
```

**Canary pattern:** 5–10% → monitor → 50% → 100% → deactivate old revision.

| Weight target | Behavior |
|---------------|----------|
| `order-api--v1=80` | Fixed revision name |
| `latest=20` | Newest revision gets 20% automatically |

---

## Revision labels

> A **revision label** is a **named URL** that always routes to one specific revision — **ignoring** traffic split on the main app URL. Move a label to switch which revision it points to (atomic).

**Use for:** Tester-only URLs during canary; blue/green staging endpoints before shifting production traffic.

**Rules:** Start with a letter; lowercase letters, numbers, dashes only; no consecutive dashes; max 64 chars.

```text
Main URL     → follows traffic split (e.g. 80/20)
Label URL    → always hits the labeled revision (e.g. v2-canary)
```

---

## Scaling with multiple revisions

Each active revision scales on **its own traffic and scale rules** — total replicas can exceed what one revision would need.

| Scenario | Effect |
|----------|--------|
| 50/50 split, `minReplicas: 1` each | At least **2 replicas** total |
| Half traffic per revision | Each may scale slower than a single revision at 100% |
| Long 50/50 split | Higher cost — deactivate old revision when done |

**Tip:** Move through splits quickly (10% → validate → 100%). Monitor replica count, errors, and CPU per revision in Azure Monitor.

---

## Single vs multiple — quick comparison

| | Single revision | Multiple revision |
|---|-----------------|-------------------|
| Active revisions | 1 | Many |
| Zero-downtime deploy | Automatic | Manual traffic management |
| Traffic splitting | No | Yes |
| Canary / A/B | No | Yes |
| Labels | Limited need | Very useful |
| Operational effort | Low | Higher |
| Default | Yes | Opt-in |

---

## Best practices

1. **Default to single revision** unless you need canary or traffic split
2. **Enable multiple revision** for production validation before full rollout
3. **Deactivate old revisions** after cutover — active revisions still bill
4. **Test with labels** before adding a revision to traffic weights
5. **Use `latest` weight** in CI/CD to avoid updating revision names every deploy
6. **Watch per-revision metrics** during canary — errors on 10% traffic before going to 100%

---

## Summary

A **revision** is an immutable app version. **Single mode** replaces the old version automatically with zero downtime. **Multiple mode** runs versions side by side for **traffic splitting** and **labels**. Plan scaling and cost when several revisions stay active — deactivate old ones as soon as the rollout finishes.

## Learn more

- [Revisions in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/revisions)
- [Traffic splitting](https://learn.microsoft.com/en-us/azure/container-apps/traffic-splitting)
- [Revision labels](https://learn.microsoft.com/en-us/azure/container-apps/revisions-manage#revision-labels)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
