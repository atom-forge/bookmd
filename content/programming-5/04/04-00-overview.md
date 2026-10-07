---
children:
  - "[[04-01-rest-model.md]]"
  - "[[04-02-rest-contracts.md]]"
  - "[[04-03-rpc-and-grpc.md]]"
  - "[[04-04-graphql.md]]"
  - "[[04-05-custom-protocols-and-webhooks.md]]"
  - "[[04-06-api-selection.md]]"
---
# 04 – Szolgáltatások API-jai – REST, RPC, GraphQL és egyedi protokollok

Egy közös fejezetben vizsgáljuk a szolgáltatásközi interfészek fő stílusait. A REST erőforrást, az RPC műveletet, a GraphQL sémát és kliensoldali mezőigényt helyez előtérbe. Az egyedi protokoll megadja a szabadságot, de a hiányzó szabályokat és toolingot nekünk kell kialakítani.


- [04.01. REST: erőforrás, reprezentáció és HTTP](04-01-rest-model.md) — az erőforrások, a reprezentációk és a HTTP-szemantika kapcsolata.
- [04.02. HTTP API: hibák, cache, konkurencia és hosszú műveletek](04-02-rest-contracts.md) — a hibaválaszok, a gyorsítótárazás és a konkurens módosítások szerződése.
- [04.03. RPC, JSON-RPC és gRPC](04-03-rpc-and-grpc.md) — a távoli művelethívás és a típusos szolgáltatásinterfészek.
- [04.04. GraphQL: séma, resolver és adatösszeállítás](04-04-graphql.md) — a lekérdezési séma, a resolverek és az adatösszeállítás költsége.
- [04.05. Egyedi API, webhook és alkalmazási protokoll](04-05-custom-protocols-and-webhooks.md) — a saját üzenetszabályok és a visszahívások megbízható kezelése.
- [04.06. REST, RPC, GraphQL és custom API összehasonlítása](04-06-api-selection.md) — az API-stílus kiválasztása a fogyasztó és a működési igények alapján.
