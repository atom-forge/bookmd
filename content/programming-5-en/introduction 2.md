# Programming 5 — From an application to a reliable system

This course follows how an application idea becomes a system that behaves understandably with multiple users and under failure. We develop one shared project and task manager throughout: Anna creates a project and invites a member, Jack manages tasks, and both eventually work with shared state.

## Why keep the same example?

Independent technologies can easily become a list of topics. A shared example explains why we need them. We first save a durable task. A lost response motivates retry handling; external sign-in introduces separate identity and session flows; slow email motivates background work; concurrent edits require conflict handling; a failed release requires version identification and recovery.

The initial system is one application and database. We do not assume unlimited load or distribute services merely for the exercise. Every addition identifies the requirement, the problem it solves, and its new cost.

## How to read the material

The seven parts describe a learning sequence, not a fixed weekly or session schedule. Each contains three lessons. Explanations begin with a concrete situation, introduce the necessary concepts, work through a choice, and end with verifiable consequences.

Basic programming, HTTP, and relational-database knowledge is useful. Examples do not depend on one framework. Paths, roles, and states belong to our example contract rather than universally required implementations.

Mermaid diagrams explain individual flows and boundaries, not complete implementations. Callouts highlight important distinctions and decisions that are easily misunderstood. Suggested checks are part of the explanation, not new submission or assessment rules.

## What connects by the end?

By the end, we can justify system boundaries and the data model, follow storage and API behavior, distinguish identity from authorization, and design background work and concurrent updates. Reproducible startup, targeted checks, diagnostics, and recovery planning accompany the working system.

The goal is not to use every technology mentioned. It is to understand the concrete question a solution answers, the boundary it protects, and the failures that still need separate handling.

[Complete table of contents](summary.md)
