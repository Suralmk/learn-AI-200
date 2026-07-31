---
title: Configure spans and traces
pathSlug: observe-and-troubleshoot-apps-on-azure
moduleName: Instrument an app with OpenTelemetry
---

## Overview

A **trace** is the end-to-end journey of one request. A **span** is one unit of work inside that journey (an HTTP call, a DB query, an embedding step). Spans nest into a parent/child tree — that nesting is what produces the waterfall view in Application Insights.

## Exam tips

- Parent/child spans share one **trace ID**; Azure groups them with **`operation_Id`**
- Use **`span.set_attribute(...)`** for queryable metadata (model name, order ID, token count)
- Mark failures with **status ERROR** and **`record_exception`**
- Context propagation uses the W3C **`traceparent`** header across HTTP/messaging hops
- Auto-instrumentation covers common clients; queues and custom protocols may need **manual propagation**
- Use **sampling** in production to control cost (ratio-based or Azure adaptive sampling)

## When to create manual spans

| Create a custom span | Rely on auto-instrumentation |
|----------------------|------------------------------|
| AI-specific steps (embed, rank, call LLM) | Outbound HTTP via `requests` / `HttpClient` |
| Business operations you want named in the UI | Framework request handling (Flask, ASP.NET) |
| Logical stages inside one function | Standard DB drivers already instrumented |

---

## Traces and spans

> A **trace** is the full end-to-end operation. A **span** is a timed unit of work inside a trace. Child spans nest under parents; together they form the distributed waterfall.

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process_order") as span:
    span.set_attribute("order.id", order_id)
    span.set_attribute("order.total", total)

    with tracer.start_as_current_span("charge_payment") as child_span:
        child_span.set_attribute("payment.method", "card")
        result = charge_card(order_id)
        if not result.success:
            child_span.set_status(trace.StatusCode.ERROR, result.error_message)
            child_span.record_exception(result.exception)
```

**AI use case:** Parent span `rag_query` with children `vector_search`, `rerank`, and `chat_completion` — instantly shows which stage dominates latency.

---

## Attributes, status, and events

> **Attributes** are key-value metadata on a span. They become **custom dimensions** in Azure Monitor and are queryable in KQL via `customDimensions`.

| Concept | Definition | Example |
|---------|------------|---------|
| **Attribute** | Metadata on a span | `model.name = gpt-4o`, `http.status_code = 200` |
| **Status** | Outcome of the span (`OK` / `ERROR`) | Failed payment → `ERROR` |
| **Event** | Timestamped note attached to a span | `span.add_event("cache_miss")` |
| **Exception recording** | Attach exception details to the span | `span.record_exception(ex)` |

```python
span.set_attribute("gen_ai.model", "text-embedding-3-large")
span.set_attribute("documents.count", len(docs))
span.add_event("cache_miss")
```

---

## Context propagation

> **Context propagation** carries the active trace across process and network boundaries so Service B’s spans join Service A’s trace. HTTP uses the W3C **`traceparent`** header.

- Auto-instrumentation for `requests`, `httpx`, and `HttpClient` injects/extracts headers automatically
- Message queues and custom protocols often need **manual** inject/extract with a propagator
- If traces “stop” at a service boundary, propagation usually broke (or the next service is not instrumented)

```text
Service A span  --traceparent-->  Service B span  --traceparent-->  DB dependency
                 (same Trace ID / operation_Id across the chain)
```

---

## Sampling

> **Sampling** decides which traces to keep. In production you rarely keep 100% — sampling controls ingestion cost while still capturing enough failures for debugging.

| Approach | Notes |
|----------|-------|
| **Ratio-based** | e.g. keep 10% of traces (`TraceIdRatioBased(0.1)`) |
| **Parent-based** | Child spans follow the parent’s sampling decision |
| **Adaptive sampling** | Azure Monitor distro can adjust rates automatically |

```python
from opentelemetry.sdk.trace.sampling import ParentBasedTraceIdRatio

# Keep ~10% of root traces; children follow parent decision
sampler = ParentBasedTraceIdRatio(0.1)
```

---

## Learn more

- [Traces and spans](https://opentelemetry.io/docs/concepts/signals/traces/)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
