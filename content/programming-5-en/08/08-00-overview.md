---
children:
  - "[[08-01-websocket-protocol.md]]"
  - "[[08-02-application-messages.md]]"
  - "[[08-03-reconnect-and-resume.md]]"
  - "[[08-04-scaling-and-slow-clients.md]]"
---
# 08 – WebSocket — protocol, connections, and scaling

Establishing a persistent bidirectional connection is only the first step. We also design application messages, acknowledgments, heartbeats, and reconnection, then coordinate snapshots with streams and distribute connections across server instances.


- [08.01. WebSocket: connection establishment and bidirectional messages](08-01-websocket-protocol.md) — establishing connections and exchanging protocol messages.
- [08.02. Application protocols over WebSocket](08-02-application-messages.md) — contracts for requests, results, subscriptions, and acknowledgments.
- [08.03. Heartbeats, reconnection, and state resynchronization](08-03-reconnect-and-resume.md) — recovering from disconnections and missed events.
- [08.04. Scaling WebSocket and handling slow clients](08-04-scaling-and-slow-clients.md) — distributing connections and limiting slow-client buffers.
