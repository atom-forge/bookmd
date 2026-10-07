---
children:
  - "[[01-testing-and-observability.md]]"
  - "[[02-reproducible-build-and-delivery.md]]"
  - "[[03-release-recovery-and-handover.md]]"
---
# 07 — Handover and operation

We now examine the working application on another machine and under failure. Targeted tests protect earlier decisions, while logs, metrics, and traces expose operation. Source becomes an identifiable artifact that proceeds through verification to release.

This part uses the complete example system. It separates configuration, durable data, and secrets, then follows compatible schema change and recovery. Handover also states what the system does not guarantee and how its important failure paths were examined.

## Lessons in this part

- [Testing correctness and observing operation](01-testing-and-observability.md)
- [Reproducible startup and delivery](02-reproducible-build-and-delivery.md)
- [Release, recovery, and handover](03-release-recovery-and-handover.md)
