---
children:
  - "[[05-01-router-gateway-proxy.md]]"
  - "[[05-02-discovery-and-balancing.md]]"
  - "[[05-03-bff-and-composition.md]]"
  - "[[05-04-service-mesh-and-routing-risk.md]]"
---
# 05 – Service router, gateway és szolgáltatásfelderítés

A kliens logikai szolgáltatást hív, de a kérésnek konkrét példányhoz kell eljutnia. Megkülönböztetjük a routingot, a terheléselosztást és a discoveryt. A belépési gateway, a klienshez igazított BFF és a belső service mesh eltérő szerepet kap.


- [05.01. Service router, reverse proxy, load balancer és gateway](05-01-router-gateway-proxy.md) — a köztes rétegek feladatainak és határainak megkülönböztetése.
- [05.02. Service discovery és terheléselosztás](05-02-discovery-and-balancing.md) — a logikai szolgáltatásnévtől a megfelelő példányig vezető út.
- [05.03. BFF, aggregáció és API composition](05-03-bff-and-composition.md) — a klienshez igazított interfész és a több szolgáltatásból összeállított válasz.
- [05.04. Service mesh és a köztes réteg korlátai](05-04-service-mesh-and-routing-risk.md) — a belső kommunikáció kezelése és a közvetítők működési kockázatai.
