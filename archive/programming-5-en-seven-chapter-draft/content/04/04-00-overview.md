---
children:
  - "[[01-identity-and-local-session.md]]"
  - "[[02-external-sign-in-and-oidc.md]]"
  - "[[03-resource-authorization-and-defense.md]]"
---
# 04 — Who are you, and what may you do?

Verified identity replaces the development test user. We separately follow external sign-in, the local session, and project access. Anna and Jack use the same application but do not have the same permissions on every resource.

Existing API operations now receive verified user context. This part explains why client-supplied identifiers are not evidence, how external identity maps to a local user, and where permissions must be enforced.

## Lessons in this part

- [Identity and a local session](01-identity-and-local-session.md)
- [External sign-in: OAuth and OIDC](02-external-sign-in-and-oidc.md)
- [Project authorization and defense boundaries](03-resource-authorization-and-defense.md)
