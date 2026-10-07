---
children:
  - "[[06-01-queues-topics-logs.md]]"
  - "[[06-02-delivery-and-acknowledgement.md]]"
  - "[[06-03-ordering-retries-dlq.md]]"
  - "[[06-04-backpressure-and-choice.md]]"
---
# 06 – Asynchronous communication and message brokers

A message broker can separate senders and consumers in time and availability. Queues, publish–subscribe, and durable logs offer different delivery and retention models. We follow acknowledgments, ordering, and processing capacity through the full message path.


- [06.01. Queues, publish–subscribe, and event logs](06-01-queues-topics-logs.md) — the delivery and retention models of queues, subscriptions, and logs.
- [06.02. Acknowledgments, delivery guarantees, and duplication](06-02-delivery-and-acknowledgement.md) — separating acceptance, processing, and redelivery.
- [06.03. Ordering, retries, and dead-letter processing](06-03-ordering-retries-dlq.md) — partitioning, retry policies, and unprocessable messages.
- [06.04. Backpressure, processing capacity, and pattern selection](06-04-backpressure-and-choice.md) — overload, queueing, and communication pattern selection.
