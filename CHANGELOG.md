# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The address of a book from a Git source can be chosen in the collection: an item of the `books` list can be an object `{ source, slug }`. The `slug` wins over the `id` in the book.

### Changed

- The `id` in the entry file of a Git book is no longer required. Without a `slug` or an `id` the book is served at the name of the folder of its entry file (or of the repository). A collision now names the `slug` as the remedy.

## [0.1.13] - 2026-10-15

### Fixed

- The pages below a `content` page are numbered below it (`1.2.1`, `1.2.2`) instead of continuing the numbers of its siblings.

### Added

- Code blocks in `svelte` (or `sveltehtml`) are highlighted: the markup, the `<script>` and `<style>` parts, the `{expressions}` and the `{#if}` / `{:else}` / `{@render}` block tags.

## [0.1.12] - 2026-10-15

### Added

- `author` can be a list of names, on a book and on a page. `released` (a year, a month or a day), `copyright` and `license` are new optional fields of a book's front page; they are shown on the front page of the book.

### Changed

- The catalogue has no search field any more: a filter panel beside the list shows the languages, authors, tags and topics as buttons to switch on and off. Language and author match any of the selected options, tags and topics need all of them, and the groups combine with and. Every button shows how many books it leaves, and the selection is kept in the address.
- The name of a book is its `title`; the older `name` key is still accepted and is used only when there is no `title`. The documentation uses `title` and `subtitle`.

## [0.1.11] - 2026-10-15

### Added

- A book can have a `subtitle` in the frontmatter of its front page: a second line under the name in the catalogue, in the header of the book, and in the catalogue search.

## [0.1.10] - 2026-10-13

### Added

- A book's `intro` can be a wikilink to a Markdown file (`intro: "[[about.md]]"`): the text of that file is shown on the catalogue card.

### Fixed

- The local preview (`/@dev`) offers "Choose another folder" on the entry file screen too, so a folder with an error or without a book can be replaced.
- Column alignment in tables (`:---`, `:---:`, `---:`) is shown; the page styles used to override it.

### Changed

- A book included from a GitHub repository can refer to any file of its own repository (for example a shared `_common/` folder beside the book's folder), not only to its own folder. It is still served at its `id`; a reference that leaves the repository remains an error.
- Tables are shown in a raised card with a header row, cell padding and a row highlight; a wide table scrolls inside its card.
- Mermaid diagrams carry the `not-prose` class, so the typography styles of the page no longer affect them.

## [0.1.9] - 2026-10-12

### Changed
- The download marker of a link is now `#!download` (`[notes](llm.md#!download)`) instead of `#:download`, because GitHub drops links whose fragment contains a colon. Links written with `#:download` become ordinary links again.

## [0.1.8] - 2026-10-12

### Added
- A ```` ```tree ```` code block shows a file structure with folder and file icons: nesting by indentation or pasted `tree` output, `# comments`, `**highlights**` and `...`.
- Chemical formulas, equations and units in formulas: `$\ce{2H2 + O2 -> 2H2O}$`, `$\pu{12.5 kJ mol-1}$` (mhchem).
- A fenced code block with `file=path` (and optionally `lines=10-20`) shows the text of a source file instead of its own, highlighted by the block's language or the file extension. The syntax of the Obsidian plugins Embed Code File (`embed-ts` with `PATH:`/`LINES:`) and Code File Embed (`codefile path:10-25`) works too.
- `![[note]]` embeds another Markdown file where it is written, `![[note#Heading]]` one section of it, and `![[picture.png|300]]` inserts an image (width or alt text after the bar). A more flexible alternative to `sources`.
- The list of books in the collection's entry file is now called `books`. The older `courses` still works; both in one file is an error.
- A link ending in `#:download` (`[notes](llm.md#:download)` or `[[llm#:download|notes]]`) offers the file as it is, even a Markdown file, instead of linking to a page; the browser saves it under its own name. Works in the build and in the local preview.
- A build warns about files of 25 MB or more, and about books whose files add up to 500 MB.

### Changed
- Copied images and files keep their file name (`/content-assets/<hash>/<name>`) instead of a bare hash, so downloads are saved under their own name.

## [0.1.7] - 2026-10-12

### Added
- A book that does not build (broken link, missing file, missing or invalid `id`) no longer stops the whole site. It is built on its own first; if it fails, its last good commit from the baseline plan is used (`--baseline plan.json` on `sources`, `check` and `build`), or the book is left out. A warning names the book. The plan file records what was really built (`used`).

## [0.1.6] - 2026-10-12

### Changed
- A private source without `publish: true` no longer stops the build: it is skipped with a warning and left out of the catalog, so a book that is not ready yet can already be listed.

## [0.1.5] - 2026-10-12

### Added
- An "← All Books" link at the top of the book navigation panel.

### Changed
- The BookMD logo and name in the header are one link back to all books, with an "All Books" tooltip.

## [0.1.4] - 2026-10-10

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
