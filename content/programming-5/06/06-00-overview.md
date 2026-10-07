---
children:
  - "[[06-01-queues-topics-logs.md]]"
  - "[[06-02-delivery-and-acknowledgement.md]]"
  - "[[06-03-ordering-retries-dlq.md]]"
  - "[[06-04-backpressure-and-choice.md]]"
---
# 06 – Aszinkron kommunikáció és üzenetközvetítők

Az üzenetközvetítő időben és rendelkezésre állásban elválaszthatja a küldőt a fogyasztótól. A queue, a pub/sub és a tartós log eltérő kézbesítési és megőrzési modellt ad. A fejezet a nyugták jelentésétől a sorrendig és a feldolgozási kapacitásig jut el.


- [06.01. Queue, publish–subscribe és eseménynapló](06-01-queues-topics-logs.md) — az üzenetsor, az eseményterítés és a tartós log eltérő modelljei.
- [06.02. Nyugtázás, kézbesítési garanciák és duplikáció](06-02-delivery-and-acknowledgement.md) — az átvétel, a feldolgozás és az ismételt kézbesítés megkülönböztetése.
- [06.03. Sorrend, retry és dead-letter feldolgozás](06-03-ordering-retries-dlq.md) — a partíciók, az ismétlés és a végleg hibás üzenetek kezelése.
- [06.04. Backpressure, feldolgozási kapacitás és mintaválasztás](06-04-backpressure-and-choice.md) — a túlterhelés, a sorban állás és a kommunikációs minta kiválasztása.
