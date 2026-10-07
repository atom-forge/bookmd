---
children:
  - "[[10-01-timeouts-retries-idempotency.md]]"
  - "[[10-02-circuit-breakers-bulkheads.md]]"
  - "[[10-03-service-security.md]]"
  - "[[10-04-realtime-security-and-diagnostics.md]]"
---
# 10 – Fault tolerance and security between services

A system must behave in a bounded, understood way under failure and overload. Deadlines, retries, idempotency, circuit breakers, and bulkheads solve different problems. Service identity, authorization, and persistent-connection security protect communication boundaries.


- [10.01. Timeouts, deadlines, retries, and idempotency](10-01-timeouts-retries-idempotency.md) — time budgets, safe retries, and duplicate-effect prevention.
- [10.02. Circuit breakers, bulkheads, and overload protection](10-02-circuit-breakers-bulkheads.md) — limiting failure propagation and resource exhaustion.
- [10.03. Service identity, TLS/mTLS, and authorization](10-03-service-security.md) — authenticating services and enforcing access rules.
- [10.04. Securing and diagnosing real-time connections](10-04-realtime-security-and-diagnostics.md) — authorizing persistent connections and diagnosing failures.
