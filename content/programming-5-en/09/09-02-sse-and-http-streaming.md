# 09.02. Server-Sent Events and HTTP streaming

In the case of Server-Sent Events, SSE for short, the server sends multiple text events to the client in one HTTP response. The connection is one-way from the server to the client. The client's actions can also take place on independent HTTP requests; this is sufficient for many status monitoring interfaces.

## EventSource and event format

The browser's native `EventSource` API receives an event stream. The server sends the data as UTF-8 text with content type `text/event-stream`. There is an empty line between the events.

```text
id: evt-91
event: exportStateChanged
data: {"exportId":"x-4","status":"ready"}

```

The name `event` can be associated with a separate handler, `id` can provide a continuation ID, `data` is the application content. The format itself does not require it to be JSON. The server can send a periodic comment if the idle time budget of the intermediate infrastructure needs to be managed with a heartbeat.

## Reconnect and Last-Event-ID

EventSource normally reconnects after disconnection. The last event ID can help to continue and `Last-Event-ID` information can be displayed on a new request. The server must provide stored events or some other recovery option for this.

Automatic reconnect does not guarantee the arrival of missed events. If the server cannot serve the old position, the client needs a new snapshot. The identifier and retention time belong to the stream contract.

## Authentication and infrastructure

The native EventSource does not offer an arbitrary request-header setting like `fetch`. In the case of a cookie-based connection, authentication, credential management and cross-origin rules must be coordinated. Writing a long-lived sensitive token to a URL can be a bad choice, as the address may end up in logs and other diagnostic interfaces.

Reverse proxy buffering can delay events. The server really needs to write out the data incrementally, and the proxy needs proper stream management. Connection or stream limits depending on HTTP version and infrastructure are also examined under load.

## General HTTP streaming

A `fetch` response body can also be read piece by piece. This can be NDJSON, binary data, or other application format. The application has its own parser and designs the event boundary, reconnect and continuation itself.

An incoming byte chunk is not necessarily a complete JSON record: the message may be fragmented and multiple records may be merged. The parser should keep a residual buffer and check the maximum size. The stream processing error and the termination of the HTTP response must also be handled.

## SSE or WebSocket?

For server-side status update, SSE can provide a simpler protocol. If the client also frequently sends messages on the same persistent channel, WebSocket may be more natural. A combination of an SSE stream and separate POST operations is a complete solution if it suits your needs.

> [!important] Unidirectionality is not an application limitation
> The SSE channel is unidirectional, but the entire application can send commands over HTTP. Choose transport based on the combination of interactions.

## Review questions

1. What does the server need to provide to use `Last-Event-ID`?
2. Why can a server running behind an SSE proxy lag?
3. What do we need to solve ourselves for a `fetch`-based NDJSON stream?

Format and API: [HTML Standard — Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html), [MDN SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).
