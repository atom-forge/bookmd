# Programozás 5. — Tartalomjegyzék

A kurzus fő témája a szolgáltatásalapú rendszerek felépítése és kommunikációja. A tíz fejezet logikai tanulási sorrend; az API-fejezet és a tervezési rész több önálló leckét fog össze.

## [01 – Monolit, modulit, mikroszerviz — felépítés és kompromisszumok](01/01-00-overview.md)

- [01.01. Architektúra: kód, folyamat és telepítés](01/01-01-architecture-dimensions.md)
- [01.02. A monolit: egyszerű határ, összetett belső szerkezet](01/01-02-monolith.md)
- [01.03. Modulit: moduláris monolit és belső szerződések](01/01-03-modular-monolith.md)
- [01.04. Mikroszervizek és az elosztott monolit csapdája](01/01-04-microservices-and-tradeoffs.md)

## [02 – Rendszertervezés, szolgáltatáshatárok és diagramok](02/02-00-overview.md)

- [02.01. Követelményektől a szolgáltatáshatárokig](02/02-01-boundaries-and-requirements.md)
- [02.02. C4, komponensdiagram és deploymentnézet](02/02-02-c4-and-structure.md)
- [02.03. Folyamatábrák, döntések és párhuzamos lépések](02/02-03-flowcharts-and-activities.md)
- [02.04. Szekvencia- és állapotdiagramok](02/02-04-sequence-and-state.md)
- [02.05. Tervek összehasonlítása és fokozatos rendszerátalakítás](02/02-05-decisions-and-evolution.md)
- [02.06. Diagramkészítés Mermaid-del: forrás, jelölés és ellenőrzés](02/02-06-mermaid-authoring.md)

## [03 – A hálózati kommunikáció alapmodelljei](03/03-00-overview.md)

- [03.01. A távoli hívás nem helyi függvényhívás](03/03-01-local-and-remote-calls.md)
- [03.02. Kérés–válasz, üzenet, esemény és stream](03/03-02-interaction-models.md)
- [03.03. Késleltetés, fan-out és kommunikációs csatolás](03/03-03-cost-and-coupling.md)
- [03.04. Kommunikációs szerződés és verziók együttélése](03/03-04-contracts-and-compatibility.md)

## [04 – Szolgáltatások API-jai — REST, RPC, GraphQL és egyedi protokollok](04/04-00-overview.md)

- [04.01. REST: erőforrás, reprezentáció és HTTP](04/04-01-rest-model.md)
- [04.02. HTTP API: hibák, cache, konkurencia és hosszú műveletek](04/04-02-rest-contracts.md)
- [04.03. RPC, JSON-RPC és gRPC](04/04-03-rpc-and-grpc.md)
- [04.04. GraphQL: séma, resolver és adatösszeállítás](04/04-04-graphql.md)
- [04.05. Egyedi API, webhook és alkalmazási protokoll](04/04-05-custom-protocols-and-webhooks.md)
- [04.06. REST, RPC, GraphQL és custom API összehasonlítása](04/04-06-api-selection.md)

## [05 – Service router, gateway és szolgáltatásfelderítés](05/05-00-overview.md)

- [05.01. Service router, reverse proxy, load balancer és gateway](05/05-01-router-gateway-proxy.md)
- [05.02. Service discovery és terheléselosztás](05/05-02-discovery-and-balancing.md)
- [05.03. BFF, aggregáció és API composition](05/05-03-bff-and-composition.md)
- [05.04. Service mesh és a köztes réteg korlátai](05/05-04-service-mesh-and-routing-risk.md)

## [06 – Aszinkron kommunikáció és üzenetközvetítők](06/06-00-overview.md)

- [06.01. Queue, publish–subscribe és eseménynapló](06/06-01-queues-topics-logs.md)
- [06.02. Nyugtázás, kézbesítési garanciák és duplikáció](06/06-02-delivery-and-acknowledgement.md)
- [06.03. Sorrend, retry és dead-letter feldolgozás](06/06-03-ordering-retries-dlq.md)
- [06.04. Backpressure, feldolgozási kapacitás és mintaválasztás](06/06-04-backpressure-and-choice.md)

## [07 – Adatok és konzisztencia mikroszervizek között](07/07-00-overview.md)

- [07.01. Adatgazdák, tranzakciók és konzisztencia](07/07-01-data-ownership-and-consistency.md)
- [07.02. Saga: orchestration, choreography és kompenzáció](07/07-02-sagas.md)
- [07.03. Transactional outbox, inbox és atomi határok](07/07-03-outbox-and-inbox.md)
- [07.04. Read model, CQRS, cache és visszajátszás](07/07-04-read-models-and-cqrs.md)
- [07.05. Elosztott tranzakció, izoláció és üzleti határok](07/07-05-distributed-transactions.md)

## [08 – WebSocket — protokoll, kapcsolatok és skálázás](08/08-00-overview.md)

- [08.01. WebSocket: kapcsolatfelépítés és kétirányú üzenetek](08/08-01-websocket-protocol.md)
- [08.02. WebSocket fölötti alkalmazási protokoll](08/08-02-application-messages.md)
- [08.03. Heartbeat, újracsatlakozás és állapot-visszaszinkronizálás](08/08-03-reconnect-and-resume.md)
- [08.04. WebSocket skálázása és lassú kliensek kezelése](08/08-04-scaling-and-slow-clients.md)

## [09 – WebSocket-alternatívák és választási szempontok](09/09-00-overview.md)

- [09.01. Polling és long polling](09/09-01-polling-long-polling.md)
- [09.02. Server-Sent Events és HTTP streaming](09/09-02-sse-and-http-streaming.md)
- [09.03. WebTransport és WebRTC DataChannel](09/09-03-webtransport-and-webrtc.md)
- [09.04. Socket.IO és a valós idejű megoldások összehasonlítása](09/09-04-realtime-selection.md)

## [10 – Hibatűrés és biztonság szolgáltatások között](10/10-00-overview.md)

- [10.01. Timeout, deadline, retry és idempotencia](10/10-01-timeouts-retries-idempotency.md)
- [10.02. Circuit breaker, bulkhead és túlterhelésvédelem](10/10-02-circuit-breakers-bulkheads.md)
- [10.03. Szolgáltatásazonosság, TLS/mTLS és jogosultság](10/10-03-service-security.md)
- [10.04. Valós idejű kapcsolatok védelme és hibakeresése](10/10-04-realtime-security-and-diagnostics.md)

