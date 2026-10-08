---
type: content
tags: []
---
# WebTransport and WebRTC DataChannel

Some real-time applications do not need a single reliable, orderly message channel. They can be separate streams of data that move independently of each other, or rapidly out-of-date status messages for which retransmission is worse than loss. WebTransport and WebRTC DataChannel also provide tools for such needs, with a different connection model.

## WebTransport

The browser WebTransport API can offer reliable one-way and two-way streams and datagrams in a client-server connection. The HTTP/3-based environment used is based on QUIC. The order and reliability within a stream does not imply the common order of all separate streams.

Datagram may be lost and out of sequence. This can be useful, for example, for frequently updated positions, where old data is less important. A purchase order should not be sent with the same "it's okay if it's lost" message. A reliable and unreliable channel can be used together if the application protocol differentiates the purposes.

Multiple streams can reduce blocking between independent streams, but do not bring unlimited capacity. Each stream needs size, rate, and lifecycle rules. Backpressure for the stream can help manage the consumer pace.

## Support and server requirements

The use of WebTransport requires a suitable browser, server and network infrastructure. It is not sufficient to rewrite the URL of a standard WebSocket endpoint. Support and fallback requirements for the target environment should be checked separately, as platform capabilities may vary.

In addition to examining the support, the business contract is still required. The success of a datagram transmission at the API level does not mean permanent business processing. The important operation requires a separate result and replay protection.

## WebRTC DataChannel

WebRTC DataChannel can carry application data between two peers. Communications may be related to cross-browser collaboration, gaming, or media applications. A peer is not necessarily another browser, but it differs from the traditional central HTTP service model.

Establishing a connection requires signaling: the parties exchange the connection description and network information. The delivery of signaling is not specified by WebRTC as a single mandatory application protocol; HTTP or WebSocket can also be used.

ICE helps to find the connection path, STUN to discover the network address situation, TURN can mediate if a direct path is not established. "Peer-to-peer" therefore does not guarantee that all data goes without an intermediary. The capacity and cost of the relay are part of the plan.

## Ordering and reliability

The DataChannel can be configured for ordered, unordered, or limited retransmission operation. Settings such as `maxRetransmits` and `maxPacketLifeTime` need an application-level interpretation. It is not appropriate to have the same rule for all messages: a current cursor position and a document change are handled differently.

> [!warning] Low latency does not replace data ownership
> We do not automatically accept the status communicated by the client as an authentic business fact. Final decision and authorization remains a designated responsibility.

## Selection exercise

Examine three data: cursor position, document modification and payment result. Decide whether you need sorting, resending, and persistent state. Then justify whether client-server or peer communication is appropriate for the task.

Details: [WebTransport API](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport), [WebTransport specification](https://www.w3.org/TR/webtransport/), [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel).
