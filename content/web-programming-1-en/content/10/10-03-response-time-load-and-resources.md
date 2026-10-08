---
chapter: "10.03"
tags: []
---
# Response time, load, and resource requirements

A system's performance cannot be described by a single server-side time alone. The network, the server, the downloaded resources, and the browser's work together determine when the user can take meaningful action.

## What does the user perceive?

A visitor doesn't ask for milliseconds, but for a result. When they open a schedule page, they expect departure info to appear quickly; when submitting a form, to get clear feedback; when clicking a button, for the UI to react. The goal of technical performance measurement is ultimately to understand and improve this experience.

The phrase "the page loaded" is misleadingly simple. The browser must first find the server, establish a connection, request the HTML, and then discover further resources from it: stylesheets, JavaScript files, images, fonts, videos, and data requests. Some of these can be parallelized, others wait for each other. Then the browser processes the document, builds the rendering, executes scripts, and the user can only actually work when interactions also function.

Therefore, it's worth thinking about three separate questions: how fast does the server respond; how fast does useful content appear; and how fast does the interface react to intervention. A good measurement states which question it answers.

```mermaid
flowchart LR
    B[Browser] --> H[Network]
    H --> S[Server response]
    S --> L[Downloading resources]
    L --> R[Rendering and interaction]
```

## Response time and network latency

**Response time** is simply the time that elapses from initiating a request to the arrival of the response. This, however, consists of multiple stages. The request must reach the server, the server must process it, and then the response must travel back. Network latency is partly a physical constraint: long distance, a mobile connection, or a congested network adds time. Server-side processing can depend on a database query, the response of another service, or the complexity of computation.

If an API prepares a response in 80 milliseconds from the server's perspective, the user might still experience half or a full second before the request makes its round trip and the client processes the result. This is not necessarily an error, but a consequence of the distributed nature of the system. Because of this, the "it's fast for me" statement is not enough: the exact same page from a different network, different device, and different geographical location can behave completely differently.

## Load time: not a single moment

Load time is often attempted to be characterized by a single number, even though the visitor forms an opinion gradually. In the first few moments, they sense whether anything happened at all. Later, whether the main content is visible. Finally, whether the controls work. A page's blank white screen and a quickly appearing but still-filling layout do not provide the same experience.

In modern conversations about performance, we therefore encounter user-centric signals like the appearance of the largest visible content element, unexpected layout shifts, or the interface's responsiveness. It is not necessary to view these as an exam for a specific tool; the underlying question is what matters. When does the page become useful? Does the button jump away right when the user was about to click? Does the system give feedback immediately after the click?

For a news portal, the title and the beginning of the article should be visible early. On a shopping site, the product's price, availability, and cart button are critical. For an admin interface, the first useful part of the table might be more important than loading every decorative icon. Speed is therefore not just a matter of byte count, but also a matter of priority.

## Resource requirements: what are we asking of the visitor?

Every downloaded image, font, script, and ad or analytics component requires data traffic, memory, processor time, and sometimes battery. On a modern desktop, a large app might merely seem slower; on an older phone or an energy-saving network, the same can become completely unusable. Performance is therefore also an equity issue: who can actually use the service?

Among resources, JavaScript is especially important because it doesn't just download: the browser must also parse and execute it. With a page loading too much code, the content might already be visible on the screen, but the interface still doesn't react because the device is performing long tasks in the background. Large images and videos primarily pose a network burden; too much styling and scripts can hinder the path of rendering and processing as well.

The goal is not for every page to be of minimal size. A map, educational, or video service can rightfully have larger demands. The goal is rather proportionality: does the downloaded and executed content serve the user's task? If a simple event page downloads multiple megabytes of trackers, animations, and unused code, then it's not the feature, but careless design burdening the visitor.

## Backend metrics vs. UX metrics: why do they say different things?

From the backend's side, a request's processing time is often visible: when it arrived, how long the application worked on it, with what status code it responded. This is valuable data, but only part of the story. It doesn't necessarily include DNS resolution, connection setup, radio network jitter, the subsequent downloading of resources, or how much the user's phone struggles with rendering.

A UX, or user experience-centric measurement, on the other hand, looks at what is actually experienced in the browser: how long it took for relevant content to appear, how long interaction was blocked, and whether any unexpected layout shifts were experienced. Therefore, it is dangerous to claim that "the website is fast" based solely on a server log. It's possible the server quickly sends the initial HTML, but the page waits on ten additional external services, or too many scripts on the client device hinder usability.

The two perspectives are not competitors. Backend measurement can help locate if a database or external API is slowing things down; UX measurement shows if the fix is actually perceptible to the user. If the backend is fast but the UX is bad, the investigation turns toward the client, the network, and resources. If UX degrades and server-side time increases as well, there is likely a common cause or a mutually reinforcing problem.

## Distributions instead of averages

> [!note] Averages can hide slow experiences
> The average value can easily mask bad experiences. If nine requests take 100 milliseconds and one takes 10 seconds, the average is roughly 1.09 seconds. This might seem acceptable, while for the tenth user, the service is clearly bad. Therefore, it is common to investigate the slower cases too, asking for example: within what time were 95% of requests completed? This 95th percentile type of thinking gets us closer to seeing more than just the lucky average user.

The temporal pattern matters too. The system might be fast on a weekday morning, and slow when everyone tries to buy a ticket. Interpreting performance should always be tied to load, device, network, and user task. This doesn't make measurement more detailed for the sake of complexity, but rather provides a fairer picture.

## Example: the fast API and the slow webshop

The developers of a webshop see that the API providing product data responds on average in 120 milliseconds. From this, they conclude that the product page is fast. Yet customers complain: on mobile, it takes many seconds before they can select a size.

Upon investigation, it might turn out that the product photos are too large, multiple external tracking codes slow down loading, and a large amount of client-side code must be processed for the size selector to work. The API measurement wasn't false, it just didn't measure the entire user flow. The solution isn't a single "speed-up trick" either: it's deciding which content is primary, which resource is needed immediately, and what can be delayed until later.

## Common misconceptions

**"Load time is the same as the server's response time."** The server's response time is just one component. Browser-side processing and the network can add a lot.

**"Testing on a developer's machine with fast internet is enough."** Users' devices and connections vary; the difference can be especially large on mobile.

**"The more content there is on the page at once, the better."** Early usefulness and responsiveness are often ruined precisely by unnecessary initial load.

**"Average response time describes quality well."** The average can hide slow, but real user cases.

## Learned concepts

- **Response time:** the time elapsed from initiating the request to the arrival of the response.
- **Latency:** the time delay resulting from transmitting and processing data.
- **Load time:** the gradual process of the web page's appearance and usability.
- **Interaction delay:** the time between a user action and the perceptible reaction.
- **Backend measurement:** measurement describing server-side operation.
- **UX measurement:** measurement close to the user's experience observed in the browser.
- **Percentile:** a value describing the distribution; for example, 95% of measurements fall below the 95th percentile.
