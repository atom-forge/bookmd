# Programming 5 — Table of contents

The main topic of the course is the construction and communication of service-based systems. The ten chapters are in a logical learning sequence; the API chapter and the design part combine several independent lessons.

## [01 – Monolith, modulith, and microservices — structure and trade-offs](01/01-00-overview.md)

- [01.01. Architecture: code, processes, and deployment](01/01-01-architecture-dimensions.md)
- [01.02. The monolith: a simple boundary with an intricate internal structure](01/01-02-monolith.md)
- [01.03. The modulith: a modular monolith with internal contracts](01/01-03-modular-monolith.md)
- [01.04. Microservices and the distributed monolith trap](01/01-04-microservices-and-tradeoffs.md)

## [02 – System design, service boundaries, and diagrams](02/02-00-overview.md)

- [02.01. From requirements to service boundaries](02/02-01-boundaries-and-requirements.md)
- [02.02. C4, component diagrams, and deployment views](02/02-02-c4-and-structure.md)
- [02.03. Flowcharts, decisions, and parallel steps](02/02-03-flowcharts-and-activities.md)
- [02.04. Sequence and state diagrams](02/02-04-sequence-and-state.md)
- [02.05. Comparing designs and evolving a system incrementally](02/02-05-decisions-and-evolution.md)
- [02.06. Creating diagrams with Mermaid: source, notation, and verification](02/02-06-mermaid-authoring.md)

## [03 – Fundamental models of network communication](03/03-00-overview.md)

- [03.01. A remote call is not a local function call](03/03-01-local-and-remote-calls.md)
- [03.02. Request–response, messages, events, and streams](03/03-02-interaction-models.md)
- [03.03. Latency, fan-out, and communication coupling](03/03-03-cost-and-coupling.md)
- [03.04. Communication contracts and version coexistence](03/03-04-contracts-and-compatibility.md)

## [04 – Service APIs — REST, RPC, GraphQL, and custom protocols](04/04-00-overview.md)

- [04.01. REST: resources, representations, and HTTP](04/04-01-rest-model.md)
- [04.02. HTTP APIs: errors, caching, concurrency, and long-running operations](04/04-02-rest-contracts.md)
- [04.03. RPC, JSON-RPC, and gRPC](04/04-03-rpc-and-grpc.md)
- [04.04. GraphQL: schemas, resolvers, and data composition](04/04-04-graphql.md)
- [04.05. Custom APIs, webhooks, and application protocols](04/04-05-custom-protocols-and-webhooks.md)
- [04.06. Comparing REST, RPC, GraphQL, and custom APIs](04/04-06-api-selection.md)

## [05 – Service routers, gateways, and service discovery](05/05-00-overview.md)

- [05.01. Service routers, reverse proxies, load balancers, and gateways](05/05-01-router-gateway-proxy.md)
- [05.02. Service discovery and load balancing](05/05-02-discovery-and-balancing.md)
- [05.03. BFF, aggregation, and API composition](05/05-03-bff-and-composition.md)
- [05.04. Service meshes and the limits of intermediaries](05/05-04-service-mesh-and-routing-risk.md)

## [06 – Asynchronous communication and message brokers](06/06-00-overview.md)

- [06.01. Queues, publish–subscribe, and event logs](06/06-01-queues-topics-logs.md)
- [06.02. Acknowledgments, delivery guarantees, and duplication](06/06-02-delivery-and-acknowledgement.md)
- [06.03. Ordering, retries, and dead-letter processing](06/06-03-ordering-retries-dlq.md)
- [06.04. Backpressure, processing capacity, and pattern selection](06/06-04-backpressure-and-choice.md)

## [07 – Data and consistency across microservices](07/07-00-overview.md)

- [07.01. Data ownership, transactions, and consistency](07/07-01-data-ownership-and-consistency.md)
- [07.02. Sagas: orchestration, choreography, and compensation](07/07-02-sagas.md)
- [07.03. Transactional outbox, inbox, and atomic boundaries](07/07-03-outbox-and-inbox.md)
- [07.04. Read models, CQRS, caching, and replay](07/07-04-read-models-and-cqrs.md)
- [07.05. Distributed transactions, isolation, and business boundaries](07/07-05-distributed-transactions.md)

## [08 – WebSocket — protocol, connections, and scaling](08/08-00-overview.md)

- [08.01. WebSocket: connection establishment and bidirectional messages](08/08-01-websocket-protocol.md)
- [08.02. Application protocols over WebSocket](08/08-02-application-messages.md)
- [08.03. Heartbeats, reconnection, and state resynchronization](08/08-03-reconnect-and-resume.md)
- [08.04. Scaling WebSocket and handling slow clients](08/08-04-scaling-and-slow-clients.md)

## [09 – WebSocket alternatives and selection criteria](09/09-00-overview.md)

- [09.01. Polling and long polling](09/09-01-polling-long-polling.md)
- [09.02. Server-Sent Events and HTTP streaming](09/09-02-sse-and-http-streaming.md)
- [09.03. WebTransport and WebRTC DataChannel](09/09-03-webtransport-and-webrtc.md)
- [09.04. Socket.IO and a comparison of real-time solutions](09/09-04-realtime-selection.md)

## [10 – Fault tolerance and security between services](10/10-00-overview.md)

- [10.01. Timeouts, deadlines, retries, and idempotency](10/10-01-timeouts-retries-idempotency.md)
- [10.02. Circuit breakers, bulkheads, and overload protection](10/10-02-circuit-breakers-bulkheads.md)
- [10.03. Service identity, TLS/mTLS, and authorization](10/10-03-service-security.md)
- [10.04. Securing and diagnosing real-time connections](10/10-04-realtime-security-and-diagnostics.md)

