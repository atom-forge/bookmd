# 08.02. Application protocols over WebSocket

A working WebSocket system must establish message types, responses, errors, and ordering rules. `send(JSON.stringify(data))` is only a transmission technique; the receiver does not yet know what action to perform.

## Command, response, and event

There can be three basic categories of messages: the request initiated by the client, the result given to it, and the event initiated by the server. The type field should distinguish them. `requestId` assigned to a request associates the response, while `eventId` is the unique identifier of the server-side fact.

```json
{
  "version": 1,
  "type": "subscribe",
  "requestId": "req-31",
  "payload": {"channel": "orders", "afterEventId": "evt-90"}
}
```

```json
{
  "version": 1,
  "type": "subscriptionAccepted",
  "requestId": "req-31",
  "payload": {"subscriptionId": "sub-8"}
}
```

Accepting a subscription is not the same as delivering all previous events. The contract may mark the end of the replay and the start of the live stream separately. If we start from the state, the shared version boundary of the snapshot and subsequent events must be defined.

## Errors and invalid messages

A stable error code is required in case of unknown type, incorrect JSON, too large payload and illegal operation. Not every error requires closing the connection. We can respond to an incorrect request, but in case of repeated rule violations or protocol incompatibility, it may be justified to close it.

The server must also validate the schema. TypeScript type or client-side validation does not prove the correctness of incoming data. A user ID in a message should not be considered authentic just because it was received as a JSON field.

## Meaning of acknowledgments

'Received', 'Accepted' and 'Executed' are different acknowledgments. For a long operation, the server may first provide a task ID and then send a result later. After losing connection, the client must be able to query the status in another way, if the operation is of lasting business importance.

If the client does not receive a final result, the retry must be related to the same logical operation. New `requestId` may appear to be a new command by itself; a separate idempotency key or a documented reuse rule is required.

## Order and parallel processing

The data flow of a connection is ordered, but server operations started in separate tasks can be completed in different order. The answers are therefore matched with an identifier, not with "the first answer belongs to the first request". A separate sequence contract is required between several connections or server instances.

Message version and entity version have different meanings. The first indicates the format of the payload, the second indicates the progress of the business state. When re-establishing the connection, the entity version can help you recognize the old or missing event.

> [!warning] Transport ordering does not guarantee business processing order
> Concurrent handler, broker and reconnection can change processing order. Business dependency must be handled explicitly.

## Protocol design task

Define messages `subscribe`, `unsubscribe`, `commandResult`, `stateChanged` and `error`. For each, enter the identifier, the required fields and the consequence of the repetition. Describe a connection loss between two sent requests and a received response.
