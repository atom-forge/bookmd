---
chapter: "04.05"
tags: []
---
# The complete path of a web request

URL, DNS, connection, HTTP, and browser processing are easier to understand in separate chapters, but the user perceives all this as a single operation: opening a page. This chapter pieces the parts into a single process and shows what each step adds to the visible result.

## A student opens a course page

The student enters the address `https://courseware.example.edu/courses`. The browser parses the URL: the scheme requests HTTPS, the host name names the service, the path identifies the requested resource within the service. The browser then needs to find where to connect; it can get an IP address for the name using DNS. Due to previously stored data, some steps may be skipped or happen in a different order during the actual opening.

```mermaid
flowchart LR
    U[URL] --> D[DNS and IP address]
    D --> C[Connection and TLS]
    C --> Q[HTTP request]
    Q --> S[Provider system]
    S --> V[HTTP response]
    V --> B[Browser processing]
    B --> O[Usable page]
```

> [!note] The diagram is a learning model
> The diagram is a complete path for learning purposes. It does not dictate that a separate TCP connection and a new DNS query must happen in every case; connection reuse and caching can alter the specific process. However, the conceptual role of the steps can still be distinguished.

## Name, connection, protection

The DNS response provides a network address for the host name. In traditional HTTPS, the browser builds a TCP connection, then during the TLS handshake, it verifies the server's certificate and establishes the conditions for protected communication. In other technical paths, such as HTTP/3, the transport differs, but the tasks of name resolution, connection protection, and HTTP messaging must still be separated.

The validity of TLS does not indicate that the course page's content is correct, only that the connection was built to the named endpoint with appropriate protection. If the certificate verification gets stuck, we haven't even received an HTTP status code from the given page yet.

## Request, intermediaries, and server

The browser can initiate a `GET` request to the `/courses` path. In the HTTP message, the method, target, headers, and possibly the body have distinct roles. Based on the domain and path associated with the request, the provider's entry point can decide which internal system gets the task. Meanwhile, a CDN or reverse proxy can also provide a response if it is appropriate for the given content.

The application can generate an HTML document in response to the request, or return a stored file. The response contains a status code, headers, and possibly a body. The `Content-Type` header of a successful HTML response helps the browser recognize the nature of the content. In case of a redirect or an error, the browser may follow another path or display an error state.

## From response to page

After the HTML arrives, the browser builds a document tree, can discover additional resources, applies styles, calculates the layout, and renders the page. The `link`, `script`, `img`, and other references can initiate new requests, some of which go to the same service, others to an external endpoint. The page seen by the user is therefore not necessarily the result of a single response.

The course list is truly usable when the important content is understandable, the navigation works, and the necessary operation is available. The `200` status of the first HTML response may be necessary for this, but it is not sufficient proof: a stylesheet might be missing, a script might fail, or an important data fetch might be delayed.

## Different observation points of the process

The address bar shows the URL. The Network panel allows examining the requests initiated and responses received by the browser. The Elements/Inspector gives a view of the current DOM and styles. A user trial shows whether the goal can actually be accomplished. Together, these provide stronger evidence than a single HTTP status code or screenshot.

## Common misconceptions

| Statement | Clarification |
| --- | --- |
| "The URL is directly the application server's IP address." | The URL gives a name and resource target; resolving the name and the internal path are separate steps. |
| "After DNS, an HTTP request immediately follows." | Connection and protection steps may also be needed. |
| "A 200 HTML response means a finished page." | The browser may also need additional resources and processing. |
| "Every opening repeats the same full chain." | Caching and connection reuse can skip steps. |

## Concepts learned

- **Lifecycle of a web request:** The process from parsing the URL through the connection and HTTP messages to the usable result in the browser.
- **Provider entry point:** The first provider-side endpoint of the public request, which can act as an intermediary or an application.
- **Resource chain:** The relationship of the main document and the additional resources directly or indirectly required by it.
- **Observation point:** A view or data making a specific layer of the system's operation visible, such as a Network response or the current DOM.
