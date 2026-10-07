---
children:
  - "[[05-01-router-gateway-proxy.md]]"
  - "[[05-02-discovery-and-balancing.md]]"
  - "[[05-03-bff-and-composition.md]]"
  - "[[05-04-service-mesh-and-routing-risk.md]]"
---
# 05 – Service routers, gateways, and service discovery

Clients address logical services, but requests must reach specific instances. We distinguish routing, load balancing, and discovery, and examine the different roles of entry gateways, client-specific BFFs, and internal service meshes.


- [05.01. Service routers, reverse proxies, load balancers, and gateways](05-01-router-gateway-proxy.md) — distinguishing the responsibilities and boundaries of intermediaries.
- [05.02. Service discovery and load balancing](05-02-discovery-and-balancing.md) — finding a suitable instance from a logical service name.
- [05.03. BFF, aggregation, and API composition](05-03-bff-and-composition.md) — client-specific interfaces and responses assembled from multiple services.
- [05.04. Service meshes and the limits of intermediaries](05-04-service-mesh-and-routing-risk.md) — managing internal traffic and intermediary risks.
