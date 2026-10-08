---
chapter: "06.03"
tags: []
---
# Ordering, retries, and dead-letter processing

Asynchronous messages may be delayed, repeated, and may arrive in a different processing order due to parallel consumption. Producer publication order, broker storage order and business effect order are separate concepts.

## Ordering and partitions

If the sequence of events of the same order is important, a partition key according to the order ID can be used. The processing order of a given partition can thus be more easily followed. In general, we do not assume a common overall order between different partitions.

Key selection affects load. If all messages receive the same key, a partition becomes a bottleneck. If each event receives a random key, the sequence for the same entity may be lost. Business ordering requirements and load balancing must be planned together.

## Versions and late events

An event belonging to an entity can carry a monotonically increasing version. If the read model has already applied version 12, you cannot treat the later version 11 as a fresh state. For a delta event, however, the missing version 10 can be significant: an intermediate operation cannot be dropped in the same way as a full snapshot.

The timestamp does not provide reliable global ordering because the clocks can differ and messages arrive on separate paths. If order is required, the identifier, version, and source contract should be the primary reference.

## Retry based on reason

Transient database access error may resolve later. An invalid schema or a missing mandatory field will not be corrected by repeating the same content. The consumer should distinguish between temporary, permanent and business rejection.

Delayed retry and backoff help to avoid burdening a failed dependency with the same work. Have an attempt or time upper limit. A failed message should not indefinitely block all other processing unless business order warrants it.

## Dead-letter queue

A dead-letter queue isolates messages that failed or could not be processed. Not a solution in itself: you need a reason, original identifier, attempt information and replay order. After the repaired consumer, you must be able to restart the work in a controlled manner.

Replay can repeat previous effects, so idempotency is required. Traceability must be maintained when events are rewritten. A "DLQed" status for a business-critical message represents a user or operational consequence, not successful completion.

> [!important] Tie ordering requirements to an entity
> Global ordering of the entire system is often unnecessary and expensive. Name which operations should be organized around the same business data.

## Failure scenario analysis

A read model receives `Created`, `AddressChanged` and `Cancelled` events. The address change is isolated because of a malformed payload, while cancellation proceeds. Decide if you can continue and what needs to be preserved for later recovery. The answer depends on whether the cancellation carries a full state or just a delta.

## Review questions

1. What ordering does and does not ensure a partition key?
2. Why is it dangerous to treat all errors with unlimited retries?
3. Under what conditions is it safe to replay dead-letter messages?
