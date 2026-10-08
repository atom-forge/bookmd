---
type: content
tags: []
---
# Microservices and the distributed monolith trap

In a microservices architecture, independently runnable and deployable services implement the system's business capabilities. Each service has a clear responsibility, a published contract, and a data-management boundary. “Micro” is not a line or class count: service size follows responsibility and the team's work.

## What does independence give us?

Search can scale separately, billing can be released separately, and media processing can use a different runtime. Teams can work on narrower codebases. A well-separated service can change its implementation while preserving its consumer contract.

Independence has several dimensions: development, deployment, data, and error handling. Every service does not need a separate repository or physical database server. The important properties are ownership boundaries and independent change. A monorepo can contain services with separate release pipelines.

## What do we pay for it?

Local calls may become network calls. Timeouts, partial failures, contract versions, and remote authorization must be handled. An operation involving multiple data owners may no longer have one shared transaction. Debugging connects logs and traces from several processes.

Operations must maintain more releases, configurations, endpoints, and connections. Measurement and automation are necessary. In a small team, the cost of maintaining infrastructure can easily outweigh the development autonomy services provide.

## The distributed monolith

A distributed monolith emerges when components run in separate processes but cannot meaningfully change or operate independently. Symptoms include directly writing shared tables, coordinated releases for every change, and long synchronous call chains.

A request might pass through five services, with the failure of any one stopping the entire operation. Network complexity has appeared, but the failure domain has not become smaller. Sending events does not automatically remove coupling either: if every consumer expects the exact version of an internal data structure, they still need coordinated updates.

| Dimension | monolithh | modulithh | Microservices |
| --- | --- | --- | --- |
| Deployable unit | Shared application | Shared application | Independent services |
| Internal boundary | Varying strictness | Enforced module interface | Network contract |
| Multi-function transaction | Often local | Often local | Must be designed separately |
| Selective scaling | Limited | Limited | Possible per service |
| Debugging | Starts in one process | Can follow module boundaries | Requires distributed observation |
| Operational cost | Usually lower | Usually lower | Usually higher |

The table describes typical consequences, not absolute rules. A poorly operated monolith is not necessarily cheap, and two simple services are not necessarily more complex than one enormous application.

> [!warning] Demonstrate independence with a concrete change
> Rather than relying on the “separate service” label, show that a change can be released independently, remains compatible with consumers, and handles a dependency failure.

## Decision criteria

Choose microservices when separate lifecycles, load profiles, data ownership, or team responsibilities reflect a real need. Identify the benefit, the network and data-management costs, and how independence will be verified. The goal is manageable change and operation, not the largest possible number of services.

## Review questions

1. Why does a separate Git repository not prove independence?
2. What signs would lead you to call a system a distributed monolith?
3. When would you choose a modulith instead of microservices?
