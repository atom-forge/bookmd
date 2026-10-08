---
chapter: "04.05"
tags: []
---
# Custom APIs, webhooks, and application protocols

We can talk about a custom API if the interface defines its own actions and message rules, whether over HTTP or other transport. "Custom" does not mean undocumented. On the contrary: what a ready-made protocol does not define, we must record precisely.

## Custom HTTP API

A `POST /calculate-shipping` can be an action-oriented HTTP endpoint. It doesn't need to be called REST to be a good API. You can use standard HTTP method, statuses and authentication, while the payload and action meaning is its application contract.

The choice may be justified for a specific business operation, legacy system or simple integration. The limitation is that shared tools can know less about the application semantics. Client generation, documentation and interoperability are only good if the contract is written in a machine-processable form.

## Message envelope

A consistent envelope is useful on a persistent socket connection or on a custom message channel:

```json
{
  "version": 1,
  "type": "reserveSeats",
  "messageId": "m-18",
  "correlationId": "request-7",
  "payload": {"eventId": "e-12", "seatIds": ["a-1"]}
}
```

`type` can indicate the meaning, `version` the contract version, `messageId` the individual message, `correlationId` the related conversation. A distinction must be made between the message identifier, the business operation identifier, and the trace identifier. Neither automatically replaces the other.

## Framing and byte streams

TCP provides a byte stream, not application messages. A `write` does not necessarily arrive as a `read` event. The protocol itself must therefore define framing: for example, a length prefix, a separator, or a fixed-size header.

In the case of a length prefix, the encoding of the number, its byte order, its maximum value and the handling of the incomplete message must be specified. A declared length that is too large can cause memory exhaustion without checking. The parser must handle partial arrival and multiple messages in a row. With WebSocket, the transport provides message framing, but we still define the application envelope and its semantics.

## Webhook: the service provider calls the consumer

For a webhook, the event source sends an HTTP request to the consumer's registered endpoint. The direction of the initiative is reversed compared to a query. A consumer-accessible endpoint, authentication, deduplication management, and processing status are required.

The receiver often quickly saves the checked event permanently and processes it later. A successful HTTP response in such a contract indicates acceptance, not necessarily complete business processing. The provider can resend, so the event ID is associated with permanent deduplication.

The signature must be verified against the agreed raw content. Re-serializing the payload to JSON can change the bytes. A time stamp and a limited acceptance time window can protect against replay, but the window and the service provider's retry order must be coordinated.

> [!warning] A webhook is not a trusted fact just because it arrived via HTTP
> Verify the sender, validate the contract, and handle duplicate delivery. The public endpoint can receive any request.

## Custom protocol checklist

Fix encoding, maximum size, versions, required fields, error responses, meaning of acknowledgments, and ordering rules. Examples include incomplete, unknown and repeated messages. The protocol is only complete if two independent developers interpret it in the same way.
