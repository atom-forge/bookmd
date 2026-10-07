---
children:
  - "[[10-01-timeouts-retries-idempotency.md]]"
  - "[[10-02-circuit-breakers-bulkheads.md]]"
  - "[[10-03-service-security.md]]"
  - "[[10-04-realtime-security-and-diagnostics.md]]"
---
# 10 – Hibatűrés és biztonság szolgáltatások között

A rendszernek korlátozott, ismert módon kell viselkednie hiba és túlterhelés alatt. A deadline, retry, idempotencia, circuit breaker és bulkhead más-más problémát kezel. A szolgáltatásazonosság, a jogosultság és a tartós kapcsolatok védelme a kommunikációs határokhoz kapcsolódik.


- [10.01. Timeout, deadline, retry és idempotencia](10-01-timeouts-retries-idempotency.md) — az időkeret, a biztonságos ismétlés és a duplikált hatások elkerülése.
- [10.02. Circuit breaker, bulkhead és túlterhelésvédelem](10-02-circuit-breakers-bulkheads.md) — a hibaterjedés és az erőforrás-kimerülés korlátozása.
- [10.03. Szolgáltatásazonosság, TLS/mTLS és jogosultság](10-03-service-security.md) — a szolgáltatások hitelesítése és a hozzáférési szabályok.
- [10.04. Valós idejű kapcsolatok védelme és hibakeresése](10-04-realtime-security-and-diagnostics.md) — a tartós kapcsolatok jogosultsága és a hibafolyamatok megfigyelése.
