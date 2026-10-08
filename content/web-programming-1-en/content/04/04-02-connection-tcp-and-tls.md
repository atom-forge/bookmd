---
type: content
tags: []
---
# Connection establishment, TCP and TLS

Knowing the IP address does not yet mean the browser can send an HTTP request. In a traditional HTTPS connection, TCP provides a reliable data stream, and TLS protects the communication and helps authenticate the server. The layers solve different problems, so we interpret a page's unavailability differently if it gets stuck during the establishment of the connection or the protection.

## What happens after name resolution?

The student opens the course material page from the library network. The DNS response is already known, but the browser must initiate data exchange with the appropriate service endpoint. With traditional HTTPS, this typically means a TCP connection and a TLS connection over it. The scheme and port of the URL also affect the target of the connection: for HTTPS, the default port is 443 if the address does not specify another.

```mermaid
flowchart LR
    N[Host name and IP address] --> T[TCP connection]
    T --> L[TLS handshake]
    L --> H[HTTP messages]
```

> [!note] The TCP model has limits
> This is the simplified path of TCP-based HTTPS. Not all HTTP connections today use TCP: HTTP/3 is built on QUIC, which uses UDP. The course's main model helps understand the role of the layers, but it does not claim that TCP is the only possible transport solution.

## TCP: ordered data stream

The network forwards data in smaller units; these can be delayed or lost. TCP creates a connection between the endpoints and provides a reliable, ordered byte stream for the layer operating above it. To do this, it uses sequencing, acknowledgment, and retransmission if necessary. This way, the browser doesn't have to hunt down the missing or swapped pieces of the HTML document itself.

TCP does not interpret the web path, the HTTP status code, or the HTML. It handles the problem of data transport. Even with a successful TCP connection, the TLS handshake or the web application itself can fail. Separating the layers is therefore a diagnostic tool: "I can't connect" is different from "I received a 404 response".

## TLS: protected communication

TCP provides ordered transport, but in itself does not encrypt and does not authenticate the web service. TLS provides confidentiality and integrity for the transferred data, and allows the browser to verify the server's identity. At the beginning of the connection, the parties negotiate the parameters of the protected communication. The server presents a certificate, which binds the associated key to the named domain; the browser verifies the validity and trustworthiness of the certificate.

The certificate is not the same as the user's login. Here, the browser checks whether it is building a protected connection to the appropriately named service. Verifying the user's identity is a later, application-level question. A certificate error is a serious signal: the browser can stop the process before the HTTP response appears.

## Cost and connection reuse

DNS query, connection establishment, and the TLS handshake can take time. This does not mean that the entire sequence necessarily starts from the beginning for every single image. The browser and the server can also reuse an existing connection for multiple HTTP requests under appropriate conditions. Because of caching and reuse, the timeline of a specific browsing session can differ from the complete, learning-purpose diagram.

If the connection is established, requests and responses travel over it according to HTTP rules. The network layer, the security layer, and the application message thus build on each other, but cannot be interchanged. The next chapter examines the exact boundary of the promises and limits of HTTPS.

## Common misconceptions

| Statement | Clarification |
| --- | --- |
| "TCP encrypts." | TCP serves reliable transport; TLS provides connection protection. |
| "The page appears immediately after the DNS response." | Connection, HTTP response, and browser processing may also be needed. |
| "The certificate verifies the user's login." | In the usual web case, it helps identify the server. |
| "Every HTTPS connection uses TCP." | HTTP/3 is built on QUIC, which uses a different transport path. |

## Concepts learned

- **TCP:** Connection-oriented transport protocol that provides a reliable, ordered byte stream between endpoints.
- **TLS:** A protocol supporting the confidentiality, integrity of communication, and authentication of the other party.
- **TLS handshake:** The initial negotiation of a protected connection, in which the parties handle the server's certificate and encryption conditions, among other things.
- **Certificate:** Digitally verified data that binds the server's key to the named domain on the web.
- **HTTP/3:** A version of HTTP that operates over QUIC, thus not following the classic TCP-based path.
