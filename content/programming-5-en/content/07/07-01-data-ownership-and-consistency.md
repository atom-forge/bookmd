---
chapter: "07.01"
tags: []
---
# Data ownership, transactions, and consistency

A service’s data owner is responsible for its business state and the associated rules. This is central to independence: consumers access data through a contract and do not write another service’s tables.

## What an owned database means

The "database per service" pattern does not necessarily mean a separate physical database server. There can be a separate schema or logical database on the same infrastructure if the authorization and ownership boundaries are separate. A shared machine is an operational dependency, and shared table writes is a data model coupling; the two are separate problems.

The consumer can store a local copy of data for reading, but must be told where it is updated from and how long it can be delayed. The copy does not automatically receive the right to modify the original data.

## Local transaction

A service's own transaction can save related data together. For example, inventory reservation checking and recording can remain within a transaction boundary or atomic conditional operation. If the check is read by another service and later written separately, a race condition may arise.

We cannot assume a common transaction for operations involving two independent data owners. Saving the order and charging the payment service provider is a separate execution boundary. With the success of one, the outcome of the other may be unknown.

## Strong and eventual consistency

Strong consistency can cover different models; the requirement must state exactly what read and order guarantees are expected. For example, it may be necessary that reading the same service after a successful reservation already shows the new status.

In case of eventual consistency, the replicas eventually catch up with changes under suitable conditions. This does not mean an unlimited, untraceable delay and does not resolve contradictions by itself. The read-your-writes experience can be important for the user: the action he just performed should not appear to disappear immediately in a lagging read view.

## Where is an immediate decision required?

The 'in stock' search result may be late. On the other hand, the inventory owner decides on availability during the actual booking. At the time of purchase, the price and other contractual data can be recorded as a snapshot so that later catalog changes do not overwrite the meaning of the old order.

Not all data copies are faulty: business documents often preserve a historical fact. The question is whether the copy represents a current state or a fact valid at a given time.

> [!important] The owner of the data makes the final decision
> Cached availability can inform the user. The inventory owner enforces the stock reservation rule atomically with the update.

## CAP and requirements language

In case of network partition, in certain distributed systems, a choice must be made between responding to all requests and strict consistency guarantees. It is not worth treating this with the simplification of "the system chooses two letters". For a specific operation, it must be decided whether a modification can be accepted with an uncertain connection and how the status is resolved.

## Review questions

1. Why is the common database server not the same as the common data owner?
2. Which data can be late on a product page, and which decision can't rely solely on it?
3. How would you show the user's own recent modification with a lagging read model?
