---
children:
  - "[[01-background-work-and-visible-state.md]]"
  - "[[02-durable-delivery-and-outbox.md]]"
  - "[[03-service-boundaries-and-partial-failure.md]]"
---
# 05 — When work does not fit into one request

Storing an invitation can be quick while sending its email depends on an external provider. That difference motivates durable background work. Processing continues after the initial save, so it needs explicit state, retry handling, and observation.

We distinguish commands, events, delivery, and business effects. The gap between writes motivates the outbox. Only then do we examine independent services and decide which data may acceptably lag.

## Lessons in this part

- [Background work and visible processing state](01-background-work-and-visible-state.md)
- [Durable delivery, outbox, and idempotency](02-durable-delivery-and-outbox.md)
- [Service boundaries and partial failures](03-service-boundaries-and-partial-failure.md)
