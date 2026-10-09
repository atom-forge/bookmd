# @atom-forge/bookmd

Static course portals from Markdown. An instance (a config file, a course registry and content) runs the `bookmd` CLI, which owns the SvelteKit app, the Markdown generator and renderer, a browser-safe content core, a local course preview (`/@dev`), Git course sources and change-based publishing.

- Instance setup: see [`examples/minimal`](examples/minimal) and the sections below.
- Writing courses (registry, metadata, hierarchy): [docs/authoring.md](docs/authoring.md) (Hungarian).
- Design records and contracts: [docs/design](docs/design).
- Release notes: [CHANGELOG.md](CHANGELOG.md).

Status: 0.1.0, not released yet (`private: true` until the first publication).

## Runtime and commands

Use Bun 1.4.0 or newer and Node 22.12+ (validated with Bun 1.4.0 / Node 24.4.1). Bun runs the TypeScript CLI/generator; Node runs SvelteKit, Vite, and svelte-check. The package owns its existing Svelte 5 / SvelteKit 2 / Vite 7 / Tailwind 4 dependencies, rather than requiring an instance to assemble a build stack. Instance lockfiles pin the resolved versions. No peer runtime or plugin API is introduced.

```sh
bookmd dev --config ./portal.config.ts
bookmd build --config ./portal.config.ts
bookmd check --config ./portal.config.ts
bookmd content --config ./portal.config.ts
bookmd preview --config ./portal.config.ts -- --host 127.0.0.1
```

`--config` defaults to `portal.config.ts` in the current working directory. All instance paths resolve relative to the config file, not the shell's working directory. Arguments after `--` go to Vite. Invalid commands/configuration, missing input, and failed tools exit nonzero. Config is trusted executable TypeScript, never untrusted course code or a place for secrets.

```ts
export default {
  title: 'BookMD',              // optional title fallback
  contentRoot: './content',    // required; read only
  entrypoint: 'courses.md',    // required; relative to contentRoot
  basePath: ''                 // optional; e.g. '/courses', no trailing slash
};
```

`BASE_PATH` overrides `basePath`, including an explicitly empty value. The existing course registry/frontmatter, metadata, slug and URL rules are unchanged. No new chapter/content scheme is introduced.

## SvelteKit integration and write boundary

The CLI stages package app sources into `<instance>/.bookmd/`, a disposable, ignored work directory. This is a generated execution copy, not a second maintained app or instance fork. SvelteKit discovers actual route/layout/load files there and generates its normal `$types`, SSR and prerender output. `$lib`, relative model imports and Tailwind source scanning retain the original app layout.

Each engine dependency is resolved from the installed engine and linked into the work directory. These are generated dependency links, not links to the engine checkout; the same procedure works with a tarball installation and Bun's isolated dependency layout. UI and lucide-svelte are explicitly bundled for SSR because their published Svelte sources cannot be executed as ordinary Node external modules.

Generated JSON, content assets, `.nojekyll`, `.svelte-kit`, and caches live in `.bookmd/`. The static adapter writes to `<instance>/build/`, and the CLI copies the prerendered 404 catalog to `build/404.html` for Pages. Neither installed package files nor source content are written. Work/output locations are currently fixed; concurrent commands for the same instance are unsupported. The root `static/` directory is not an extension point: currently the app has no static engine assets beyond generated content and `.nojekyll`; fonts/renderer assets come from dependencies.

`dev` watches the configured content root, regenerates content, and requests full browser reloads. Restart `dev` after config or engine source changes. `preview` serves the existing build (and currently prepares the generated work app first). The generator remains filesystem-based; separating a browser-safe core is the next workflow stage, not claimed complete here.

## Installing the engine in an instance

An instance needs a package manifest that depends on `@atom-forge/bookmd`, `portal.config.ts`, and `content/courses.md` with at least one course (see `examples/minimal`):

```json
{ "private": true, "type": "module",
  "scripts": { "dev": "bookmd dev", "build": "bookmd build", "check": "bookmd check" },
  "dependencies": { "@atom-forge/bookmd": "^0.1.0" } }
```

Ignore `.bookmd/`, `build/` and `node_modules/`; commit the lockfile. Until the first release, depend on a local checkout (`"file:../bookmd"`) or on a tarball made with `bun pm pack` in this repository (the tarball contains the app, generator and CLI, but no tests, configuration, content, lockfiles, build output or credentials). An upgrade or rollback is a version change followed by a lockfile update, `check` and `build`.

The app needs a non-empty course catalog: an empty registry fails SvelteKit prerender coverage.

## Developing the engine

```sh
bun install
bun run verify   # tests, type check and a static build of examples/minimal
```

## Validation recorded for the engine extraction

- Portal: `bookmd check` — zero errors/warnings; 46 tests / 213 assertions passed; static build generated 393 pages across 6 courses and Pages `404.html`.
- Independently installed local tarball: own manifest, lockfile and dependencies; config/content only, no maintained app source; check passed; `/second` static build passed with one demo course.
- Tarball dev server: bounded localhost request to `/second/demo/` returned HTTP 200 with the expected SSR title. Changing the local Markdown title was reflected by subsequent HTTP requests; the fixture was restored and the server stopped. Browser/WebSocket reload was not directly exercised.
- Second static output: direct course HTML, `404.html`, `.nojekyll`, two CSS files and 19 WOFF2 font files present; installed `bookmd` bin also executed successfully.
- Root portal and `/second` use separate content, generated work and build output. Package source does not receive generated data.

No browser-driven visual/navigation regression comparison has been performed. Config hot reload, empty catalogs and Windows dependency-link behavior are not validated/supported by this initial local package. Registry release, preview, Git import and automation remain outside this implementation.

## Shared content contract

`@atom-forge/bookmd/core` exports `processContent`, `ContentSource` and the shared
`ContentGraph`/page/navigation types. The core parses Markdown/frontmatter,
composes sources, resolves references through the adapter, renders HTML, validates
hierarchy and computes navigation and numbering. It imports no filesystem,
Node path/crypto modules or environment variables.

```ts
import { processContent, type ContentSource } from '@atom-forge/bookmd/core';
const graph = await processContent(source, 'courses.md', { base: '/preview' });
```

A `ContentSource` resolves absolute slash-separated virtual paths within `/`,
reads their text, and supplies asset URLs. `resolve` must return a canonical
identifier, verify existence and reject storage escapes; missing paths use an
error with `code: 'ENOENT'` for the optional Obsidian vault-root fallback
(`rootName`). The core rejects lexical traversal above `/`. Asset storage and URL
lifetimes belong to the adapter. The build adapter keeps realpath/symlink
containment, asset hashing/copying and generated JSON in `scripts/content.ts`.

- `type: chapter`: numbered container; descendants inherit its number prefix.
- `type: content`: numbered material within the nearest chapter context.
- Any other or missing type: unnumbered auxiliary material; consumes no number.
- Declared `children` order determines traversal and numbering, including through
  unnumbered wrappers. Each course starts its own numbering; nested chapters
  extend the prefix. Root-level content uses a course-level number.
- Filenames have no numbering requirement. Frontmatter `chapter` is ignored;
  computed `page.chapter` is also copied to navigation for menus and breadcrumbs.
- Pages outside the course's declared tree remain unnumbered. `sources` compose
  a page and do not independently create numbered pages.
- The export manifest includes only numbered `content` pages and their computed
  number arrays; an exporter must consume these rather than count again.

Existing six courses already have explicit chapter/content/resource roles on
all 390 material files; course entries and the catalog retain their separate
registry semantics. No filename or URL migration was necessary.

Validation for the shared-core step: 49 tests / 250 assertions passed, including
build-adapter/core model parity across existing success fixtures. Browser-target
bundling succeeded without Node imports. Portal check: zero errors/warnings;
static build: 393 pages / 6 courses, 346 numbered pages and 286 content export
entries. Every navigation number matches its page. A newly packed tarball was
reinstalled in the independent consumer: public core import, check and `/second`
static build all succeeded. Browser preview behavior is reserved for the next
stage; no registry publication was performed.

## Local preview (`/@dev`)

A statically prerendered `/@dev` route lets an author open a local folder with `showDirectoryPicker({ mode: 'read' })` (desktop Chrome/Edge, HTTPS or localhost). Files are read in the browser only; nothing is uploaded or written.

- The shared core processes the folder, mounted under the virtual `/course` beside a generated catalog, so a `course.md` in the folder root is a valid entry. Candidates named `book.md`, `course.md`, `index.md`, `readme.md` are highlighted and listed in that order of preference (then shallower paths first); the uniquely best one is preselected, but confirming a choice is always required.
- Hidden directories and `node_modules` are skipped; at most 20000 files are listed and Markdown files over 5 MB are rejected.
- `processContent` accepts `link` (custom page URLs) and `diagnostics` options. With `diagnostics`, broken local links/assets are collected instead of failing; builds still fail. Link schemes other than http, https, mailto and tel are rendered as text (also in builds).
- Pages use `#page=<slug>[&heading=<id>]`. In-page `#fragment` clicks are rewritten to keep the page in the hash.
- Assets become blob URLs, revoked after a reload replaced them or when the route is left. SVG is allowed only as an image, never as a link; HTML and other active documents are not exposed.
- A browser reload restores the preview: the folder handle and entry path (never contents) are kept in IndexedDB, and the page hash restores the position. If Chrome no longer grants read access, a "Continue with this folder" button asks again (it needs a click); otherwise the folder is reopened automatically.
- A failed reload keeps the previous successful preview, marked as such.

Validated: check, 57 tests (entry candidates, hash scheme, source/core integration, diagnostics, scheme and containment rules), static build, and a scripted desktop Chrome session against an OPFS directory handle (entry choice, navigation, back, heading scroll, blob images, callout/math/Mermaid, reload with changes, failed reload, no external requests). Not yet exercised: the native folder dialog, a non-empty base path, narrow viewports and a build/browser parity test.

## Git course sources (registry syntax and download)

A registry entry can point at a course in a GitHub repository: `<ref>@github.com/<owner>/<repo>/<path-to-entry.md>`, for example `main@github.com/colleague/course/materials/course.md`. The entry file's directory is the course content root. Local `[[…]]` entries are unchanged.

- The ref is required and may be a branch, tag or full commit SHA (ASCII `A–Z a–z 0–9 . _ + - /`). The first `@` separates ref and source. There is no default-branch fallback; a name that is both a branch and a tag is rejected (use a SHA). Only `github.com` is supported; owner and repo are compared case-insensitively.
- The parser (`src/core/source-ref.ts`) gives a concrete error for a missing ref, unsupported host, invalid owner/repository, a missing or non-`.md` path, and path segments such as `..` or empty ones. Refs cannot start with `-`; Git is always started with an argument array, never a shell.
- `bookmd sources` resolves every ref to one commit SHA and downloads exactly that commit into `.bookmd/repos/<sha256 of repository+ref>/` (one checkout serves several courses from the same repository and ref; the hash is not a URL). It writes `.bookmd/course-sources.json` (`schemaVersion`, `source`, `commit`). Any failure — unreadable repository, unknown ref, missing entry file, duplicate listing — aborts the whole command with a message and exit code 1.
- Git runs without user or system configuration (no credential helpers, URL rewriting or hooks), never prompts, creates no symlinks (they become plain files), skips LFS and submodules, and leaves no `.git` directory in the checkout.
- Public repositories use anonymous HTTPS. Private sources need a different transport (machine-user SSH) and are not implemented; the transport is a replaceable `GitTransport` in `scripts/git-source.ts`.

### Course ids and assembly

Every build command (`dev`, `build`, `check`, `content`) first downloads the Git sources and assembles one content root `.bookmd/content/`: a copy of the local content plus each external course's directory (the entry file's directory) under `<id>/`. The registry entry becomes `<id>/<entry file>`, so the course URL namespace is its id (`/<id>/` when the entry is `course.md`, otherwise `/<id>/<name>/`). The versioned local content is never written. Registries without Git entries are processed in place.

- The external entry file must declare `id` in its frontmatter: lower-case letters, digits and single hyphens, at most 64 characters, not reserved (`_app`, `404`, `@dev`, `content-assets`, `assets`, `static`, `favicon.ico`). A missing, invalid, reserved or duplicate id, or a collision with a local top-level file or directory, blocks the build.
- Each external course is sealed: its files may only reference files inside its own directory (relative links and `/`-rooted links alike); other courses, local content and the rest of the repository are unreachable. Local courses keep their current URLs and rules.
- `.bookmd/course-sources.json` lists `id`, normalized source and resolved commit of the build. `bookmd dev` re-syncs only when restarted.

Not yet done: the registry fingerprint and baseline comparison for change detection, the CI/time-window workflow, private sources.

## Change detection: `bookmd plan`

```sh
bookmd plan --instance-commit <sha> --engine-commit <sha> [--baseline plan.json] [--out plan.json] [--force]
bookmd build --sources plan.json
```

`plan` resolves every Git ref to a commit (no download) and writes a plan: schema version, the fingerprint, its inputs and the resolved sources. Inputs: instance commit (local content, config, integration), engine commit and version, SHA-256 of the instance `bun.lock`, SHA-256 of the normalized course registry, and every source with its commit. It compares the plan with a baseline — the plan of the last successful publication — and prints `Changed: <reasons>` or `Unchanged: nothing to publish`; under GitHub Actions it also writes `changed` and `reasons` to `$GITHUB_OUTPUT`.

- A missing, corrupt, tampered, unknown-schema or incomplete baseline always means a full build. `--force` always rebuilds. An unresolvable ref or invalid registry fails the command (exit code 1).
- `--sources plan.json` makes `build`, `check`, `content` and `sources` download exactly the planned commits and never resolve a ref again, so the commits that were checked are the commits that are built, even if a branch moved in between. A plan that does not match the registry is rejected.
- The baseline is the instance's responsibility: the plan file of a deployment is stored only after that deployment succeeded.

## Private course sources (GitHub App)

A course author can keep the repository private and still have it published. Access is read-only and per repository, through a GitHub App owned by the instance operator.

- **Author:** installs the app on their account and selects the course repository (Contents: read). No tokens, secrets or workflows. Removing the installation ends future reads; it does not unpublish what was published.
- **Approval:** a private repository does not make the generated site private. A source that needed credentials is published only if its entry file has `publish: true` in the frontmatter; otherwise the build fails with an explanation.
- **Operator:** creates the app (permissions: Contents read-only, Metadata read-only), then provides `BOOKMD_APP_ID` and `BOOKMD_APP_PRIVATE_KEY` (PEM) as environment variables or Actions secrets. The list of installations (`GET /app/installations`) is the access register; extra private keys allow rotation without downtime.
- **Behaviour:** every source is tried anonymously first, so public sources never involve credentials. Only if that fails, the engine signs a short-lived app JWT, looks up the installation of that repository and asks for a one-repository, read-only installation token. The token reaches Git through the environment (`GIT_CONFIG_*` extra header), never through arguments or the URL, and is not written anywhere. Failures say whether the app is not installed (or the repository does not exist), the credentials were rejected, or no credentials are configured.
- **CI:** credentials are given only to the `plan` and `sources` steps; `check` and `build` run without them from the downloaded, pinned commits. The reference workflow refuses credentials in a public repository, because its logs and artifacts would reveal private repository names.
