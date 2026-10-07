# 10.04. Securing and diagnosing real-time connections

With a persistent connection, authentication is not a one-time waiver valid for all future messages. The connection can live longer than the token or the user’s permissions. The subscription, incoming operations and outgoing data must also be protected.

## Handshake and Origin

With browser WebSockets, the server can check the Origin header based on an explicit allowlist of origins. With cookie-based authentication, this is especially important against unauthorized socket connections initiated from other websites. Origin is not a strong client identity: a non-browser client can send any value.

The native browser WebSocket constructor does not allow arbitrary request headers. A protected cookie, short-lived connection ticket, or another documented mechanism can be used. Avoid long-lived sensitive tokens in URLs that may be logged. If authentication happens in the first application message, enforce a tightly restricted state and a short timeout.

## Subscription authorization

Knowing a `orders:customer-42` channel name does not grant access. The server checks the subscription based on the authenticated user and tenant. Filtering forwarded events should not only rely on the client's request.

In the event of a change in authorization, the access to the connection must be updated or the connection must be terminated. The token's expiration date and the method of reauthentication are described in the protocol. A socket open for a long time cannot keep a previously revoked privilege alive indefinitely.

## Message limits and abuse

Schema validation, maximum message size, operation speed limit and subscription number limit are required. Even a small message can be expensive if you make a thousand internal calls. The load limit therefore does not only look at the number of bytes.

The resource cost of compression and large payload must be measured. Do not allow incorrect or oversized messages to reach the parser and business layer indefinitely. The error response should be manageable, but not provide detailed internal information to the attacker.

## Debugging on multiple layers

A connection failure may be a handshake rejection, proxy timeout, authentication failure, business rejection, or slow consumer. Give these distinct log codes. Connection IDs, safely recorded user identifiers, and operation IDs help correlate events.

For HTTP and RPC calls, the trace context connects the call chain. When sending messages, the connection between producer and consumer can be indicated by a forwarded context or a trace link. Not all background jobs are continuations of the same short-lived request: long times and multiple consumers require a different monitoring model.

The metrics should show the number of connections, message rate, reconnect ratio, buffer and rejection reason. Do not use the ID of each connection or user as a metric label, as this may result in unlimited cardinality. The individual details should be recorded in a log or trace.

> [!important] Diagnostics should clarify the meaning of the failure
> "socket closed" is not enough. It is necessary to know whether the operation was completed, whether the client is lagging, and what recovery path follows.

## Combined verification scenarios

Check expired token, forbidden origin, other tenant's channel, too big message, too fast commands and slow client. Then check the resync and query the persistent operation result by disconnecting. These are tests of the correctness of the protocol, not separate deployment training material.

## Review questions

1. Why doesn't Origin replace authentication?
2. How should a persistent connection handle revoked access?
3. On the basis of which data would you separate proxy error and business rejection?

Guidelines: [OWASP WebSocket Security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html), [W3C Trace Context](https://www.w3.org/TR/trace-context/).
