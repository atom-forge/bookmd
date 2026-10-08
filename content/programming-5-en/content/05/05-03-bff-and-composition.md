---
type: content
tags: []
---
# BFF, aggregation, and API composition

Backend for Frontend, BFF for short, is a server-side layer adapted to the needs of a specific client. The mobile application and the large web admin interface may require different data format, operation and response size. A BFF handles these differences in front of the more stable contracts of internal services.

## What does the aggregator do?

A product page may require catalog information, price, stock and rating. If the client calls all four services directly, it needs to know the internal topology, errors, and partial result assembly. An aggregator can put this work on the server side.

During API composition, we compile results from responses from several sources. Calls can be parallel, but full time budget, partial failure and critical data have a clear rule. Compose does not provide a common database transaction over resources.

## Partial result

Catalog data and price are mandatory, ratings may be optional. The aggregator can give a partial answer when the evaluation fails. This must be made visible in the contract, otherwise the client may confuse "no ratings" with "we can't retrieve it".

The summarized data may come from different points in time. The inventory may have already changed by the time the user makes a purchase. A read response is not a substitute for a final stock reservation. The API should not promise consistency that it does not provide for snapshots assembled from multiple services.

## Contract tailored to the client

BFF can convert internal errors into manageable states for the client, reduce payload, and provide responses tailored to a screen. Web and mobile BFF can change separately, but a common business rule should not be copied by both.

Authorization decisions and personalized caching require special attention. The same path does not necessarily mean the same answer for two users. The context affecting the response must be included in the cache key, or the shared cache must be disabled.

> [!important] Aggregation does not create a new data owner
> The BFF composes and translates data. The owning service ensures the correctness of source data and controls its modification. Direct writes from the BFF to business tables blur that boundary.

## GraphQL as an aggregation interface

GraphQL can be used as an interface to BFF when the client sends a variable field request. The same fan-out and partial failure problems remain behind the resolvers. A REST-based, screen-tailored summary endpoint may also be suitable if the data demand is stable and the cache is simpler.

## Comparison with read model

API composition requests data at request time. A materialized read model maintains a pre-processed data copy of events, so reading can have fewer direct dependencies. Instead, the view may lag and require rebuilding. The choice depends on the freshness and availability requirement.

## Design exercise

An order summary screen needs order status, payment status and shipping estimate. Mark mandatory and optional data. Write the form of the partial answer and the full time budget. Then show a requirement that would drive the solution in the direction of the read model.
