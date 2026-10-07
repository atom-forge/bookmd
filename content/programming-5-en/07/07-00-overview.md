---
children:
  - "[[07-01-data-ownership-and-consistency.md]]"
  - "[[07-02-sagas.md]]"
  - "[[07-03-outbox-and-inbox.md]]"
  - "[[07-04-read-models-and-cqrs.md]]"
  - "[[07-05-distributed-transactions.md]]"
---
# 07 – Data and consistency across microservices

With independent data owners, an operation involving several services may not fit within one transaction. Sagas, outboxes, and inboxes address different gaps in the process, while read models and CQRS separate query needs from write-side rules.


- [07.01. Data ownership, transactions, and consistency](07-01-data-ownership-and-consistency.md) — consistency and transactions with independent data owners.
- [07.02. Sagas: orchestration, choreography, and compensation](07-02-sagas.md) — multi-step business processes and compensation.
- [07.03. Transactional outbox, inbox, and atomic boundaries](07-03-outbox-and-inbox.md) — atomic boundaries between data updates and messaging.
- [07.04. Read models, CQRS, caching, and replay](07-04-read-models-and-cqrs.md) — updating, observing lag in, and rebuilding read models.
- [07.05. Distributed transactions, isolation, and business boundaries](07-05-distributed-transactions.md) — the cost of distributed commit and isolation across service boundaries.
