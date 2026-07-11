---
title: Service Bus & Event Grid for AI Pipelines
domain: azure-services
description: Build event-driven AI workflows with messaging and event routing.
order: 5
---

## Overview

AI solutions often process documents, embeddings, and inference requests asynchronously. Service Bus and Event Grid are central to AI-200's "Connect to and consume Azure services" domain.

## Key concepts

- **Service Bus queues** — point-to-point messaging with competing consumers
- **Service Bus topics/subscriptions** — pub/sub with filters
- **Dead-letter queue (DLQ)** — failed messages for inspection and retry
- **Event Grid** — reactive event routing (blob uploaded → trigger embedding job)

## Exam tips

- Queue vs Topic: single consumer vs multiple subscribers
- Know DLQ reasons: max delivery count exceeded, TTL expired
- Event Grid vs Service Bus: events vs messages (fire-and-forget vs guaranteed delivery)

## Azure CLI

```bash
# Service Bus namespace and queue
az servicebus namespace create \
  --name sb-ai200 \
  --resource-group rg-ai200 \
  --location eastus \
  --sku Standard

az servicebus queue create \
  --name embed-jobs \
  --namespace-name sb-ai200 \
  --resource-group rg-ai200 \
  --max-delivery-count 5 \
  --enable-dead-lettering-on-message-expiration true

# Event Grid topic
az eventgrid topic create \
  --name eg-ai200 \
  --resource-group rg-ai200 \
  --location eastus
```

## Python — send embedding job to queue

```python
from azure.servicebus import ServiceBusClient, ServiceBusMessage
import json

with ServiceBusClient.from_connection_string(conn_str) as client:
    sender = client.get_queue_sender("embed-jobs")
    with sender:
        message = ServiceBusMessage(
            json.dumps({"documentId": "doc-42", "blobUrl": "https://..."})
        )
        sender.send_messages(message)
```

## Learn more

- [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/)
- [Azure Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/)
