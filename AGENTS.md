## Task plans and workflow documentation

Keep plans and checklists focused on concrete, necessary work. Do not add generic
QA reminders, speculative follow-ups, or non-blocking caveats as standalone tasks
merely because an optional check was not performed. Include validation work only
when it addresses a specific requirement or identified risk of the planned change.

Record completed work as completed; do not reopen it as an artificial prerequisite.
Remove stale or redundant checklist items instead of carrying them forward. Report
actual validation limits honestly in the implementation summary, without turning
every unperformed check into a new workflow task.

## Changelog

Every change that affects users or the published package gets an entry in the
`[Unreleased]` section of `CHANGELOG.md` in the same change, following the
existing Keep a Changelog headings (`Added`, `Changed`, `Fixed`, `Removed`).
Write it for readers of the package, not as a commit log. Do not wait to be
asked, and do not add entries for internal-only changes such as refactors or
test-only work.

## AtomForge UI

Before implementing UI with `@atom-forge/ui`, read:
`node_modules/@atom-forge/ui/README-AI.md`.

Follow its documentation pointers and read the relevant control
documentation before choosing or composing components.

The Markdown files are filesystem documentation, not package import subpaths.
If the dependency is symlinked, follow the symlink to the library repository.
Use documentation matching the installed package version.

Prefer an existing documented capability over new local infrastructure that
solves the same problem. Explain any package limitation that requires a local
implementation. Keep application-owned behavior separate from library behavior.

### CSS and layout spacing

Use Tailwind utilities wherever possible. Write custom CSS only when utilities
cannot express the required styling clearly.

Avoid padding on layout containers. Give their children the necessary margins
instead, using utilities such as `mx-*`, `mt-*`, and `mb-*`. Keep spacing ownership
explicit: do not combine container padding and child margins for the same inset,
or compensate for container padding with negative margins.

For example, a container provides layout and appearance, while its children
provide the insets:

```svelte
<section class="flex flex-col rounded-lg border">
  <h2 class="mx-6 mt-6 text-xl font-semibold">Section title</h2>
  <p class="mx-6 mt-3">Section content.</p>
  <div class="mx-6 mt-4 mb-6">Section actions</div>
</section>
```

This convention applies to layout containers, not intrinsic padding inside
controls such as buttons or inputs. Use flex or grid where needed to prevent
child margins from collapsing through a container.

### Reusable UI compositions

Consult existing UI composition patterns before building a similar interface.
When a composition works well and is useful beyond one screen, document it as a
reusable pattern so future screens follow the same structure and styling.

Describe when to use the pattern, its component structure, spacing, and supported
variations. Include a minimal, copyable example using the current UI components
and Tailwind utilities, without feature-specific content or business logic.

For example, a modal pattern should explain the header, body, and action area;
which elements own margins; where long content scrolls; how primary and secondary
actions are aligned; and which parts are optional.

Document the working composition, not just a screenshot. Keep the example current
when the adopted pattern changes. Store application-specific compositions in the
project's UI documentation, separate from the package API reference. A documented
pattern does not require a shared component; extract one when shared code is also
useful.

## SvelteKit

### Pages and component placement

Keep route pages focused on composition. Place feature-specific state, derived
presentation data, and interaction behavior in the closest component that owns
it. A parent coordinates shared source state; it does not precompute every
child's labels, images, and display details merely because it has the data.

Use these placement conventions:

- A leaf route keeps `+page.svelte` and its private components/helpers beside
  each other. Do not add a `(+page)` wrapper when there are no route children.
- At a branch with its own page and real child routes, put that page and its
  private supporting code in `(+page)/`.
- Put code shared by two or more pages or components in `(+lib)/` at their
  nearest common route ancestor. Create it only when that reuse exists.
- A zone shared by sibling routes can have its own `(+lib)/`. Move components
  shared across zones to `src/routes/(+lib)/`, not to an arbitrary zone.
- Keep application-specific presentation components near their route consumers.
  Use `$lib` for portable helpers and shared infrastructure, rather than as a
  default dumping ground for page-specific components.
- Split large components by coherent UI responsibilities: for example, move tab
  content into separate components while the shell owns tab and save coordination.
- Avoid speculative shared abstractions and unrelated file moves.

Example with two independent zones:

```text
src/
  lib/
    format-value.ts                  # portable utility
  routes/
    (+lib)/
      BrandHeader.svelte             # actually used by both zones
    (zone-a)/
      workspace/                     # /workspace has a page AND child routes
        (+page)/
          +page.svelte               # /workspace
          WorkspaceSummary.svelte    # private to that page
        (+lib)/
          ItemSummary.svelte         # used by list and details
        list/                        # leaf route: no wrapper
          +page.svelte               # /workspace/list
          ListFilters.svelte
        details/
          +page.svelte               # /workspace/details
          DetailPanel.svelte
    (zone-b)/
      (+lib)/
        SectionHeader.svelte         # used by multiple pages in this zone
      help/
        +page.svelte                 # /help
        HelpContent.svelte
      contact/
        +page.svelte                 # /contact
```

SvelteKit route groups in parentheses do not add URL segments. `(+page)` and
`(+lib)` are project naming conventions, not special SvelteKit APIs. Keep
`(+lib)` free of route entry files. Do not also put a second `+page.svelte` at the
parent URL already owned by `(+page)/+page.svelte`.

A private component can start as one sibling file. If it grows subcomponents,
keep its shell as `Editor.svelte` and place the parts under `Editor/`. Do not
assume importing a directory automatically resolves an `index.svelte`.

### Svelte 5 and Svelte Helpers

Before using `@atom-forge/svelte-helpers`, start with
`node_modules/@atom-forge/svelte-helpers/README-AI.md` at the package root, then
follow its documentation pointers and check the exported types for the installed
version. Follow dependency symlinks to the library repository when present. This
is a filesystem Markdown path, not a package import subpath. Use the helpers where
their contracts fit; do not introduce a local replacement for a suitable helper.

- Import type-only helpers with `import type`.
- Use `ClassProp` for a public class prop, and `ChildrenProp` or
  `ChildrenPropOptional` for required or optional children snippets. Specify a
  tuple argument type when the snippet receives parameters.
- For native-element wrappers, prefer Svelte's specific HTML attribute types.
  Use `AnyProp` only for deliberately broad additional props, as the final member
  of the intersection, and forward attributes intentionally.
- Use `XOR` for mutually exclusive prop variants and `AtLeastOne` when at least
  one field is required. These describe compile-time contracts, not runtime
  validation. Include an empty `XOR` alternative only when selecting no variant is allowed.
- Use `variantMap` to map boolean variant props to an internal value. Wrap it in
  `$derived` when the value should follow prop changes; take a one-time snapshot
  only when ignoring later changes is intentional.
- Render ordinary children with `{@render children()}` or
  `{@render children?.()}`, not legacy slots. Use `RenderSnippet` when an API
  expects a component but the content is a snippet; check its installed props
  before wiring it to a modal or drawer.
- Use `debounce` or `debounceAsync` for interactions that benefit from delayed
  callbacks. Handle async failures and stale responses separately; debouncing
  alone does not guarantee response order.
- Treat `as` as a type assertion, not conversion or validation. Do not use it to
  hide a real type mismatch or assume it is required for template expressions.

Example of a small component with typed optional children:

```svelte
<script lang="ts">
  import type { ClassProp, ChildrenPropOptional } from '@atom-forge/svelte-helpers';

  let { class: classes, children }: ClassProp & ChildrenPropOptional = $props();
</script>

<section class={classes}>
  {@render children?.()}
</section>
```
