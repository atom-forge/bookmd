---
children:
  - "[[03-01-local-and-remote-calls.md]]"
  - "[[03-02-interaction-models.md]]"
  - "[[03-03-cost-and-coupling.md]]"
  - "[[03-04-contracts-and-compatibility.md]]"
---
# 03 – Fundamental models of network communication

Moving from a local call to a remote call introduces latency and new failure modes. We distinguish interaction semantics, transport, and contracts, then compare synchronous requests, asynchronous commands, events, and streams.


- [03.01. A remote call is not a local function call](03-01-local-and-remote-calls.md) — network latency, partial failures, and unknown outcomes.
- [03.02. Request–response, messages, events, and streams](03-02-interaction-models.md) — distinguishing communication intent and interaction models.
- [03.03. Latency, fan-out, and communication coupling](03-03-cost-and-coupling.md) — the cost of the complete call path and its dependencies.
- [03.04. Communication contracts and version coexistence](03-04-contracts-and-compatibility.md) — message semantics and compatible contract evolution.
