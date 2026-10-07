# 04.06. Comparing REST, RPC, GraphQL, and custom APIs

When choosing an API style, we first look at the consumer, the operation, and the change request. Several styles can coexist in one system: for example, public HTTP API, internal gRPC, GraphQL-based client aggregation and external integration with webhooks.

## Same problem, different interface

You can expose the creation of a reservation as a RESTful API resource: `POST /reservations`, then `GET /reservations/r-42`. `CreateReservation` and `GetReservation` operations appear in RPC. In GraphQL, a mutation creates the reservation, and the client selects the returned fields. A `reservation.create` typed message can be initiated in a custom protocol.

Each solution requires the same business rule, authorization and replay protection. The difference is in the expressive means of the interface, the tooling and the consumer relationship. The name of the style does not ensure the correct state change.

| Aspect | REST-oriented HTTP | RPC/gRPC | GraphQL | Custom API |
| --- | --- | --- | --- | --- |
| Central concept | Resource and representation | Operation and typed message | Schema and field requirement | Own contract |
| Typical Strength | HTTP Ecosystem, Intermediaries | Internal Calls, Generation, Streaming | Different Client Data Demand | Special Requirement |
| Client tools | HTTP client, OpenAPI | Generated stub | Query and schema knowledge | Own client or SDK |
| Compound Read | Multiple Endpoints or Aggregation | Summary Operation | Field Based Query | Own Operation |
| Major design risk | Chatty API, misused HTTP | Too fine-grained remote methods | Query cost, N+1 | Missing own rules |
| Cache | More direct with HTTP tools | At application level | Query and data model dependent | By own rules |

The table is not a quality ranking. The strength of one solution is only an advantage if the usage situation requires it. A simple price query does not necessarily require a free graph query, and a classic single HTTP response is not sufficient for a live two-way stream.

## Consumer and trust boundary

For a public API, broad device support, documentation and slow client updates are important. For internal services, typed contracts and joint tooling are easier to undertake. In the case of a browser, the available transports, authentication and intermediate infrastructure limit the choice.

GraphQL can be beneficial when multiple clients use different subsets of the same graph. RPC can be natural when the boundary publishes business operations. REST can be good if it has a stable resource lifecycle and HTTP features to help with collaboration. With a custom API, more rules and tooling must be maintained in exchange for freedom.

## Coexistence and adapters

The external interface is not necessarily the same as the internal one. A BFF can receive GraphQL queries while requesting data from services over gRPC and HTTP. The adapter must also translate errors, time budgets, and authorization context. Compilation cannot mean that all internal errors are removed as successful blank responses.

Too many API styles increase learning and operation cost. The reason for the variation must be documented. Instead of "every service can use different" freedom, common policies can help in consistent operation.

> [!tip] Decision order
> First define the business operation and the consumer. Then the interaction model, API style, transport and format. The selection of the framework follows.

## Comparison exercise

Design an interface for three situations: public product catalog, internal stock reservation, mobile screen data compiled from several services. For each, justify a choice and a discarded alternative. Also show the contract of successful, failed and repeated operation.
