# 04.03. RPC, JSON-RPC, and gRPC

In the case of RPC, i.e. remote procedure call, the center of the interface is the operation that can be called remotely. The caller indicates that they want to perform an operation `ReserveSeats` or `CalculatePrice`. The protocol transmits parameters, result and error.

## Operation-oriented model

A REST booking API can have `POST /reservations`. We publish operation `ReserveSeats(eventId, seatIds, requestId)` in RPC. The business objective may be similar, but the organization of the interface is different. RPC also does not entitle you to publish unlimited fine-grained internal methods: the network boundary requires an appropriate operation size.

JSON-RPC, the operation name, parameters and request ID are sent to a JSON message:

```json
{
  "jsonrpc": "2.0",
  "method": "ReserveSeats",
  "params": {"eventId": "e-12", "seatIds": ["a-1", "a-2"]},
  "id": "call-17"
}
```

The request ID is used to match the response. Not automatically a business idempotency key: a change sent again with the same identifier is only safe if the server also implements such a rule. A "notification" to which we do not expect a response also does not prove successful execution.

## gRPC and contract-driven development

For gRPC, we often describe the service and messages in Protocol Buffers. From this, client- and server-side code can be generated. The typed contract helps with cross-language interoperability, and you don't have to write all the decoding by hand.

```protobuf
syntax = "proto3";

service Stock {
  rpc Reserve(ReserveRequest) returns (ReserveReply);
}

message ReserveRequest {
  string request_id = 1;
  string product_id = 2;
  int32 quantity = 3;
}

message ReserveReply {
  string reservation_id = 1;
}
```

The field numbers are part of the wire contract. The number of a removed field must not be reused for a new field with a different meaning; the notation `reserved` can be used to maintain it. In addition to the generated types, business validation is also required, such as a positive quantity and a valid product ID.

## Call types

For a unary call, one request is associated with one response. In case of server streaming, the server sends several responses, in case of client streaming, the client sends several messages. In bidirectional streaming, both parties can send messages independently within a call. The stream must be described separately, when it ends and which message acknowledges what.

The deadline indicates the entire time budget of the call. Cancellation can help interrupt work that is no longer necessary, but it cannot undo a business modification that has already been durably committed. The server must actually listen for the interrupt signal.

## Advantages and limitations

For an internal service connection, the typed contract, compact representation and streaming can be an advantage. In return, the development is accompanied by generation and version management tools. The application meaning of error codes must also be planned. For a browser client, the usual native gRPC transport cannot be used directly as between servers; gRPC-Web or another intermediary solution can be considered.

> [!warning] Nice method syntax can hide the cost
> `client.reserve()` is a remote operation. It is not advisable to call it thousands of times in a loop as if we were reading an element of a local array.

## Review questions

1. What is the difference between a correlation identifier and an idempotency key?
2. When is a streaming call justified instead of unary?
3. What to check when changing a protobuf schema?

Contract formats: [JSON-RPC 2.0](https://www.jsonrpc.org/specification), [Protocol Buffers](https://protobuf.dev/programming-guides/proto3/). Details: [gRPC core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/), [gRPC deadlines](https://grpc.io/docs/guides/deadlines/).
