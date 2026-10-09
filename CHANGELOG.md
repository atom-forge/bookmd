# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `bookmd` CLI (`dev`, `build`, `check`, `content`, `preview`, `sources`, `plan`) that runs the portal app in a disposable `.bookmd/` work directory of the instance.
- Browser-safe content core (`@atom-forge/bookmd/core`): Markdown/frontmatter processing, hierarchy, numbering, link and asset resolution through a `ContentSource` adapter.
- Local course preview at `/@dev`: read-only folder access, entry file choice, hash navigation, blob assets, diagnostics, reload and restore after a browser reload.
- Git course sources (`<ref>@github.com/<owner>/<repo>/<path>.md`): ref-to-commit resolution, exact-commit download, stable course ids, per-course sealed namespaces and a source manifest.
- Private course sources through a read-only GitHub App, with explicit author approval (`publish: true`).
- Change detection (`bookmd plan`) with fingerprints, baseline comparison, forced rebuilds and builds pinned to the planned commits.

### Changed
- Markdown links with schemes other than `http`, `https`, `mailto` and `tel` are rendered as text.

---
