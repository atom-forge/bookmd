# Table of contents

[Introduction](introduction.md)

## [01 — What must the system do?](01/01-00-overview.md)

- [Users, goals, and system boundaries](01/01-users-goals-and-scope.md)
- [Domain model and business invariants](01/02-domain-model-and-invariants.md)
- [Quality expectations and verifiable success](01/03-quality-constraints-and-success.md)

## [02 — The first working version](02/02-00-overview.md)

- [From a request to durable state](02/01-request-to-durable-state.md)
- [Modules, responsibilities, and dependencies](02/02-modules-and-dependencies.md)
- [Architecture and decision records](02/03-architecture-and-decision-records.md)

## [03 — The application contract: the API](03/03-00-overview.md)

- [Resources and operations in the API](03/01-resources-and-operations.md)
- [Errors, retries, and idempotency](03/02-errors-retries-and-idempotency.md)
- [Documenting and evolving the API](03/03-contracts-tests-and-change.md)

## [04 — Who are you, and what may you do?](04/04-00-overview.md)

- [Identity and a local session](04/01-identity-and-local-session.md)
- [External sign-in: OAuth and OIDC](04/02-external-sign-in-and-oidc.md)
- [Project authorization and defense boundaries](04/03-resource-authorization-and-defense.md)

## [05 — When work does not fit into one request](05/05-00-overview.md)

- [Background work and visible processing state](05/01-background-work-and-visible-state.md)
- [Durable delivery, outbox, and idempotency](05/02-durable-delivery-and-outbox.md)
- [Service boundaries and partial failures](05/03-service-boundaries-and-partial-failure.md)

## [06 — Multiple users, shared state](06/06-00-overview.md)

- [Live updates and choosing a transport](06/01-live-updates-and-transport.md)
- [Concurrent editing and conflicts](06/02-concurrent-edits-and-conflicts.md)
- [Reconnection, ordering, and load](06/03-reconnection-order-and-scaling.md)

## [07 — Handover and operation](07/07-00-overview.md)

- [Testing correctness and observing operation](07/01-testing-and-observability.md)
- [Reproducible startup and delivery](07/02-reproducible-build-and-delivery.md)
- [Release, recovery, and handover](07/03-release-recovery-and-handover.md)

