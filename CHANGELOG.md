# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- A folder named like a page (without `.md`) supplies that page's children when the page has no `children` field; they are ordered by file name (`2-` before `10-`). A `children` field, even an empty one, always wins.
- An optional `title` page frontmatter field.

### Changed
- A page or book without an H1 takes its title from the first heading of the shallowest level it has (for example an H2), before falling back to the file name.

## [0.1.3] - 2026-10-09

### Added
- A "Support AtomForge" link (GitHub Sponsors) in the page footer.

### Changed
- The local preview (`/@dev`) says "book" instead of "course" ("Open book folder", "Local book preview").

## [0.1.2] - 2026-10-09

### Added
- A course entry named `book.md` gets the same short URL as `course.md` (`/<folder>/`).
- `requires` and `teaches` page frontmatter; a block below "On this page" (at the end of the article on narrow screens) lists them.

### Changed
- Symlinks inside the content root are followed, also when they point outside it (for example book folders linked from a notes vault). A path that leaves the content root by `../` is still rejected.

## [0.1.1] - 2026-10-09

### Fixed
- Git no longer tries to run a non-portable `/bin/false` as credential helper (it failed to start on macOS and obscured the real error).

### Changed
- `bookmd plan`: `--engine-commit` is optional, for engines installed from a registry; their version and the instance lockfile identify the engine.

## [0.1.0] - 2026-10-09

### Added
- `bookmd` CLI (`dev`, `build`, `check`, `content`, `preview`, `sources`, `plan`) that runs the portal app in a disposable `.bookmd/` work directory of the instance.
- Browser-safe content core (`@atom-forge/bookmd/core`): Markdown/frontmatter processing, hierarchy, numbering, link and asset resolution through a `ContentSource` adapter.
- Local course preview at `/@dev`: read-only folder access, entry file choice, hash navigation, blob assets, diagnostics, reload and restore after a browser reload.
- Git course sources (`<ref>@github.com/<owner>/<repo>/<path>.md`): ref-to-commit resolution, exact-commit download, stable course ids, per-course sealed namespaces and a source manifest.
- Private course sources through a read-only GitHub App, with explicit author approval (`publish: true`).
- Change detection (`bookmd plan`) with fingerprints, baseline comparison, forced rebuilds and builds pinned to the planned commits.

### Changed
- Configure releases with Ship.
- Markdown links with schemes other than `http`, `https`, `mailto` and `tel` are rendered as text.

---
