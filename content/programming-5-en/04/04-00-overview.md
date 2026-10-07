---
children:
  - "[[04-01-rest-model.md]]"
  - "[[04-02-rest-contracts.md]]"
  - "[[04-03-rpc-and-grpc.md]]"
  - "[[04-04-graphql.md]]"
  - "[[04-05-custom-protocols-and-webhooks.md]]"
  - "[[04-06-api-selection.md]]"
---
# 04 – Service APIs — REST, RPC, GraphQL, and custom protocols

This chapter compares the main styles of service interfaces. REST emphasizes resources, RPC emphasizes operations, and GraphQL emphasizes a schema and the fields requested by clients. Custom protocols offer flexibility while requiring explicit rules and tooling.


- [04.01. REST: resources, representations, and HTTP](04-01-rest-model.md) — the relationship between resources, representations, and HTTP semantics.
- [04.02. HTTP APIs: errors, caching, concurrency, and long-running operations](04-02-rest-contracts.md) — contracts for failures, caching, and concurrent updates.
- [04.03. RPC, JSON-RPC, and gRPC](04-03-rpc-and-grpc.md) — remote operations and typed service interfaces.
- [04.04. GraphQL: schemas, resolvers, and data composition](04-04-graphql.md) — query schemas, resolver execution, and composition costs.
- [04.05. Custom APIs, webhooks, and application protocols](04-05-custom-protocols-and-webhooks.md) — defining message rules and handling callbacks reliably.
- [04.06. Comparing REST, RPC, GraphQL, and custom APIs](04-06-api-selection.md) — choosing an interface for consumer and operational needs.
