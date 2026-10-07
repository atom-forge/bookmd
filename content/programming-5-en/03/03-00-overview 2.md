---
children:
  - "[[01-resources-and-operations.md]]"
  - "[[02-errors-retries-and-idempotency.md]]"
  - "[[03-contracts-tests-and-change.md]]"
---
# 03 — The application contract: the API

We now examine the working task operation from the client perspective. The interface must know what it can send, what comes back, and what happens on failure or repetition. The API exposes system behavior rather than merely copying internal tables.

By the end, listing, creation, and invitation operations have understandable contracts. We distinguish a lost response from a failed operation and connect documentation to verifiable examples, contract tests, and integration tests.

## Lessons in this part

- [Resources and operations in the API](01-resources-and-operations.md)
- [Errors, retries, and idempotency](02-errors-retries-and-idempotency.md)
- [Documenting and evolving the API](03-contracts-tests-and-change.md)
