---
children:
  - "[[01-request-to-durable-state.md]]"
  - "[[02-modules-and-dependencies.md]]"
  - "[[03-architecture-and-decision-records.md]]"
---
# 02 — The first working version

We turn the earlier rules into a complete task-creation operation, following the request from the interface to durable database state. Then we decide where checks and responsibility boundaries belong. The initial version is one application with deliberately organized internals.

This part builds on the domain model and invariants. It explains what a transaction protects, what it does not solve alone, and how a change can test a module boundary. We then document decisions so another developer can understand them.

## Lessons in this part

- [From a request to durable state](01-request-to-durable-state.md)
- [Modules, responsibilities, and dependencies](02-modules-and-dependencies.md)
- [Architecture and decision records](03-architecture-and-decision-records.md)
