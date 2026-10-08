---
type: content
tags: []
---
# HTTP Cache and CDN

A cache can reduce the time of repeated downloads and server load, but it is only useful if the response remains reusable for an appropriate time and in an appropriate place. A CDN can help bring content closer; for personal and rapidly changing data, freshness and access also matter.

## Why request the same thing again?

Let's imagine a university website. A visitor opens the homepage, the browser downloads the HTML document, the stylesheet, some JavaScript files, the header logo, and several photos. The next page features the exact same logo, font, and stylesheet. It would be pointless to re-transmit these over the network on every click. Moreover, if ten thousand visitors request the same 200 kB image, an absurd amount of repeated work is generated for both the server and the network.

A cache reduces this repetition. It preserves an earlier result for the purpose of a later use. This could be a file on the student's laptop, a record in the server's memory, or a machine on a content delivery network in Europe. The point is the same in every case: if the previous response is still suitable, we use it faster and cheaper than generating the original.

It is important, however, that the cache cannot "lie" limitlessly. An educational news piece from yesterday might still be useful, but for a currently available exam slot or a webshop's inventory, old data can cause harm. Cache design is therefore actually a trade-off between freshness, speed, cost, and load capacity.

```mermaid
flowchart LR
    B[Browser] --> C[Browser cache]
    C --> E[CDN edge point]
    E --> O[Origin server]
    O --> E
    E --> C
```

## The layers of a cache

### Browser cache

The first layer is often the browser itself. Previously downloaded images, CSS and JavaScript files, fonts, and even certain HTTP responses can remain locally. If the user returns to a page, the browser can fetch the still-fresh copy even without a network request. This is very fast, but is tied to a single user: it doesn't help others' browsers.

HTTP response headers can declare how long a response can be considered fresh. `Cache-Control: max-age=3600`, for example, expresses that the response can be reused for an hour. It doesn't mean the resource definitely cannot change, but that the server commits: for an hour, the previous version is acceptable.

### Shared proxy cache

> [!warning] Keep personal responses out of shared caches
> A shared cache can also stand in an organization's network or in front of a provider. This handles shared copies for many users. The images of a public news portal are thus not downloaded separately by every workstation from the remote server. For a shared cache, it is especially important that personal responses do not accidentally end up in a shared storage. A logged-in user's profile page, for instance, generally must not be publicly cached.

### Application and data cache

There is also a lot of repeated work on the server side. Producing a popular course list can require database queries and authorization checks. If the result is acceptable for five minutes, the application can store it in memory or a dedicated cache. Here, we are not necessarily storing an HTTP response: it could be the result of a computation, a database query, session-related data, or a pre-rendered page fragment.

This layer is invisible to the user, but its failure is often spectacular. If, in an academic system, an old headcount appears for minutes after a course registration, it is likely a caching issue, not "bad internet".

### CDN edge cache

A Content Delivery Network, CDN for short, is a network of servers distributed globally or regionally. The origin, meaning the original server, might be in Budapest, for example, while a visitor in London receives the image, video chunk, or static file from the closest CDN node. A CDN node is often called an edge, because it serves at the "edge" of the network, close to the user.

## Fresh, stale, and invalid

Understanding a cache requires three similar but distinct concepts. A **fresh** response can still be used directly according to the set rule. A **stale** response's freshness period has expired; it usually requires revalidation, but some rules allow serving a temporarily stale response. **Invalidation** (or purge) is an active intervention: we tell the cache to no longer serve a previous entry.

For validation, the server can provide an identifier. The `ETag` denotes a specific version of the response. The browser can send it later: "I have this ETag version; has it changed?" If not, the server can send a `304 Not Modified` response without the full content. Thus, there is a network round trip, but the file doesn't need to be downloaded again. The `Last-Modified` and `If-Modified-Since` headers can play a similar role.

It is a particularly good practice to carry the version in the filename. For example, `main.4f8a2c.js` becomes `main.91bd77.js` on a new release. The old file can thus be cached for a very long time, because new content yields a new URL. This is called cache busting, though it is more accurate to think of it as publishing a new, unambiguous address. In contrast, data continuously arriving at the exact same `/current-exchange-rate` address might require a short freshness time.

## What does geographic distance matter?

Digital data does not teleport. The signal travels very fast, but it gets to the destination through cables, network devices, and multiple routers. For a request, latency is made up partly of physical distance, and partly of queuing and processing. When downloading a single large file, bandwidth is also decisive; with many short requests, the numerous round trips can be especially painful.

A CDN is useful because an edge server close to the visitor can respond. A Hungarian user can get an image from a European node instead of going to the American origin. This is not only faster: it also protects the origin server from sudden mass loads. During a sports broadcast or a popular product announcement, edges absorb many identical requests.

Not all content is equally cacheable. Public images, versioned JavaScript files, and video chunks are ideal candidates. A personalized bank account page, cart, or admin interface, however, often requires a fresh, authorized response from the origin application. A CDN can still be useful here for TLS termination, filtering attacks, or serving static assets, but it cannot blindly take over the dynamic business decision.

## Walkthrough example: new university announcement

Suppose the institution publishes a PDF and an accompanying public page. The PDF is named `information-2026-09.pdf`, and the CDN caches it for a day. This is good because the file won't change after publication. If a typo needs to be fixed, it's risky to upload a new PDF to the exact same URL: some visitors might still see the old version. A safer solution is a new, unambiguous name, like `information-2026-09-v2.pdf`, and then modifying the link on the webpage.

The "last updated" information at the top of the page, however, can be cached for a short time, or actively invalidated upon publication. The good solution, therefore, is not "turning everything off", but choosing a rule suited to the nature of the content.

## Common misconceptions

**"A cache is always faster, so let's store everything."** No. For a personal, sensitive, or rapidly changing response, old data can be dangerous or confusing.

**"If I uploaded the new file, everyone sees it immediately."** Only if the freshness rules of the old copies, invalidation, or the new URL ensure this.

**"A CDN is only for large companies."** Small sites can also profit from geographically close static serving and offloading, but needs and costs decide.

**"A CDN speeds up every website."** A CDN doesn't necessarily solve the slowness of a personalized, database-intensive response. First, you must know where the delay occurs.

## Learned concepts

- **Cache:** temporary storage of a previous response or computation result for reuse.
- **Cache hit:** the requested content is found in the cache and can be used.
- **Cache miss:** there is no usable copy, so the original source must be contacted.
- **Origin:** the initial server or application responsible for the original content.
- **CDN:** a geographically distributed network that serves content from points closer to the user.
- **Edge:** a CDN node close to the user.
- **Freshness:** the period during which the stored response can be used without validation.
- **Invalidation:** the targeted removal or prohibition of a previous cache entry.
- **ETag:** an identifier of a response version that supports conditional revalidation.
