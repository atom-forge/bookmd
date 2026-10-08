---
children:
  - "[[01-live-updates-and-transport.md]]"
  - "[[02-concurrent-edits-and-conflicts.md]]"
  - "[[03-reconnection-order-and-scaling.md]]"
---
# 06 — Multiple users, shared state

Jack wants to see Anna's changes without refreshing, while both can edit the same task. Live notification and correct saving are separate concerns: one maintains view freshness, the other protects stored data.

This part relies on the API and permission contracts. Requirements determine transport, versions protect updates, and reconnection is explicit. With multiple servers and slow clients, we still state ordering and freshness boundaries.

## Lessons in this part

- [Live updates and choosing a transport](01-live-updates-and-transport.md)
- [Concurrent editing and conflicts](02-concurrent-edits-and-conflicts.md)
- [Reconnection, ordering, and load](03-reconnection-order-and-scaling.md)
