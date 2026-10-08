---
chapter: "04.01"
tags: []
---
# REST: resources, representations, and HTTP

In the REST approach, the client works with resources through a uniform interface. The resource concept can be an order, reservation, export job, or collection. The client receives a representation of the resource, not the server's internal object or database row.

## Resource and representation

`/reservations/r-42` can identify a reservation. Its JSON representation can include a status, an expiration time, and a link to the next action. The same resource may appear in several formats; the `Content-Type` and the agreement on accepted formats make the content interpretable.

```http
GET /reservations/r-42 HTTP/1.1
Host: api.example.test
Accept: application/json
```

```json
{
  "id": "r-42",
  "status": "held",
  "expiresAt": "2026-10-07T14:30:00Z",
  "links": {
    "self": "/reservations/r-42",
    "payment": "/reservations/r-42/payment"
  }
}
```

In the example, JSON is a public contract. It does not need to match the inner entity fields. A database transformation need not become an API change if the adapter maintains the meaning of the representation.

## REST constraints

REST is not simply "JSON over HTTP". It describes client-server separation, stateless interaction, explicit cacheability, a uniform interface and a layered system; code-on-demand is an optional constraint. The uniform interface includes resource identification, manipulation through representations, self-descriptive messages, and application state driven by hypermedia.

In practice, many "REST APIs" are more REST-oriented HTTP APIs with little use of hypermedia. It is worth naming this precisely and evaluating the properties used. A noun-shaped path alone does not meet the architectural constraints.

Stateless here means that the client context needed to process the request is not derived from a hidden previous request conversation. The server can of course have persistent business state such as reservation and invoice. Stateless is not "databaseless" operation.

## Methods and intent

`GET` indicates a read intent. `POST` may request processing for the resource, such as creating a new reservation. `PUT` aims to create or replace a representation of a target. `PATCH` describes a partial modification with an agreed patch format. `DELETE` requests to remove the connection to the target URI; this is not necessarily physical data destruction.

With a safe method, the client does not request a business state change. Technical logging can still take place. Repetition of the idempotent method gives the same result in terms of the intended effect as executing it once; does not require the same status code or response body to be returned.

> [!warning] GET should not make purchases
> Browsers, caches, and other intermediate components can re-request or preload read paths. The business modification must be expressed by a suitable operation and contract.

## Why is this useful between services?

HTTP is widely supported, the request and response can be easily observed, the protocol has statuses, cache and conditional request tools. In return, the resource model is not natural for all operations, and querying multiple related data can result in many calls. The model and consumer needs together decide whether it is suitable.

## Review questions

1. What distinguishes a representation from an internal entity?
2. Why are stateless API and persistent reservation not a contradiction?
3. Why can a deletion that first gives `204` and later `404` be idempotent?

Original description of REST constraints: [Fielding — REST](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). The exact meaning of HTTP terms is [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html).
