# Programming 5 — Microservice architecture and communication

This course examines how to organize an application into modules or independent services, how these parts communicate, and what network boundaries imply. Its central topics are monoliths, modular monoliths, and microservices; REST, RPC, GraphQL, and custom APIs; routing and messaging; and WebSocket and its alternatives.

## Purpose and benefits of the course

Collaboration in a multi-service system depends on contracts. We must define responsibilities, data ownership, message semantics, time budgets, and the consequences of failure. A remote operation can execute even when its response never arrives. A message can be delivered repeatedly. A persistent connection can break. A sound design treats these situations as part of normal operation.

The goal is to make informed architecture choices. We learn when the simplicity of a monolith is useful, when the internal boundaries of a modulith help, and when an independent service is justified. We evaluate benefits alongside development, scaling, data management, and failure-propagation costs.

## Expected learning outcomes

By the end of the course, students will be able to:

- distinguish monolithic, modular monolithic, and microservice architectures and justify the trade-offs of their choice;
- explain an architecture's boundaries, communication, and failure paths;
- interpret inter-service contracts, data ownership, message semantics, and the consequences of network failures;
- weigh benefits against development, scaling, data management, and failure-propagation costs;
- interpret structural, flow, sequence, and state diagrams and recognize the limits of the operational guarantees they depict.

## Structure of the material

The first three chapters establish system structure, design methods, and fundamental communication models. The fourth compares the main API styles in one unit. Routing, asynchronous messaging, and distributed data management follow. Two chapters cover WebSocket and its alternatives; the final chapter connects fault tolerance and security to service boundaries.

Chapters are learning units rather than fixed teaching weeks. Design, APIs, and distributed data management each require several sessions. Basic programming, HTTP, and database knowledge is expected. The material is independent of any single framework or cloud platform.

## Design and diagrams

Structural diagrams describe the system context, components, and deployment locations. Flowcharts show decision branches, sequence diagrams show message order, and state diagrams describe lifecycles. We use version-controlled Mermaid sources and check that the diagrams do not promise stronger guarantees than the system actually provides.

## How to use the material

Lessons are self-contained conceptual units with short examples. Each example explains a specific architectural question. Code and message fragments illustrate contracts rather than complete demonstration applications.

Callouts highlight important distinctions and common mistakes. Review questions, calculations, and design exercises support understanding without introducing submission or assessment rules. Lessons also link to official documentation and standards for tool-specific details.

> [!important] Be able to justify your design
> Go beyond listing technologies. Show the architecture’s boundaries, communication, failure paths, and why its trade-offs are acceptable.
