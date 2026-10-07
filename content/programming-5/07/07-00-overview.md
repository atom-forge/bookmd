---
children:
  - "[[07-01-data-ownership-and-consistency.md]]"
  - "[[07-02-sagas.md]]"
  - "[[07-03-outbox-and-inbox.md]]"
  - "[[07-04-read-models-and-cqrs.md]]"
  - "[[07-05-distributed-transactions.md]]"
---
# 07 – Adatok és konzisztencia mikroszervizek között

Önálló adatgazdák mellett a több szolgáltatást érintő művelet nem feltétlenül fér egyetlen tranzakcióba. A saga, az outbox és az inbox a folyamat különböző réseit kezeli. A read model és a CQRS az olvasási igényeket választja el az írási szabályoktól.


- [07.01. Adatgazdák, tranzakciók és konzisztencia](07-01-data-ownership-and-consistency.md) — az önálló adatgazdák és a szolgáltatások közötti konzisztencia.
- [07.02. Saga: orchestration, choreography és kompenzáció](07-02-sagas.md) — a több lépésből álló üzleti folyamat és a kompenzáció.
- [07.03. Transactional outbox, inbox és atomi határok](07-03-outbox-and-inbox.md) — az adatmentés és az üzenetkezelés közötti atomi határok.
- [07.04. Read model, CQRS, cache és visszajátszás](07-04-read-models-and-cqrs.md) — az olvasási modellek frissítése, késése és újraépítése.
- [07.05. Elosztott tranzakció, izoláció és üzleti határok](07-05-distributed-transactions.md) — az elosztott commit és az izoláció költsége a szolgáltatáshatárok mentén.
