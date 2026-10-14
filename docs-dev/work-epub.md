# Work plan: EPUB export of a book

Status: draft, nothing implemented. This file is internal; it is not part of the published documentation (`docs/`).

## Goal

Every book of a collection can be downloaded as one `.epub` file: the whole book, in reading order, readable offline in common e-readers and reading apps. The file is produced by the build and published next to the site. Same Markdown, no extra work for the author.

Out of scope for now: Kindle formats (KFX/MOBI), DRM, exporting a single page or a chapter, a PDF export.

## What the build already has

`processContent` returns a `ContentGraph` with, for every page: the final HTML, the headings, the chapter number, the parent and the reading order (`previous`/`next`), plus the books (`name`, `author`, `language`, `intro`, `image`). Assets are already copied to `content-assets/<hash>/<name>`. So the EPUB step is a **post-processing of the graph**, not a second parser: it takes the pages of one book and turns the HTML into XHTML chapters.

## Output

```tree
<site>/
  <id>/
    <id>.epub        # the whole book
```

- A book link appears on the book's front page: "Download as EPUB".
- A CLI command builds the files without the site: `bookmd epub [--out DIR]`. `bookmd build` runs it too, so the files are in the deployed site.
- The file name is the book `id` for included books, the folder name for local ones.

## EPUB structure

EPUB 3, XHTML, one file per page, written without a new zip dependency if possible (a small store/deflate writer on `node:zlib`), otherwise `fflate`.

| Part | Source |
|---|---|
| `dc:title`, `dc:creator`, `dc:language` | book `name`, `author`, `language` |
| `dc:identifier` | stable: `urn:bookmd:<id>`; the commit goes into `dcterms:modified` so readers see updates |
| Cover | the book's `image`; without one a generated plain cover (title, author) |
| Navigation (`nav.xhtml`) | the page tree, with chapter numbers, nesting as in the sidebar |
| Chapters | one XHTML file per page, in the order of the tree |
| Images, SVG, fonts | the assets used by the pages of the book (not the whole `content-assets`) |
| Stylesheet | one small `epub.css`: typography, tables, callouts, code, file trees; no site CSS |

Links between pages of the book are rewritten to the chapter files (`ch-012.xhtml#heading`). A link to another book or a page that is not in the book becomes a link to the published site (needs the site address; if it is unknown, plain text).

## Elements that need work

### Formulas (KaTeX)

The site HTML contains KaTeX output (HTML + hidden MathML). E-readers handle neither well: many ignore the KaTeX CSS and show the formula twice or as garbage. Plan: render with `output: 'mathml'` for the EPUB (MathML is part of EPUB 3 and works in the common readers), and keep the TeX source as the `alttext`. Because the shared core renders the HTML, the cleanest way is an option of `processContent` (`math: 'html' | 'mathml'`) and a second render pass for the EPUB. To decide: how much the second pass costs on big books.

### Mermaid diagrams

Mermaid renders in the browser, so the build has no SVG today. Required for the EPUB, so the build must render it:

- Render every ` ```mermaid ` block to SVG in a headless Chromium at build time (`mermaid` in a page, `securityLevel: 'strict'`, the same light theme as the site), one browser for the whole build, one page per diagram.
- Embed the SVG as an image file in the EPUB (`<img src="diagrams/d-123.svg">`), plus a PNG fallback for readers that cannot show SVG (`<picture>`-like fallback via the manifest `fallback` attribute, or a raster `<img>` only if testing shows SVG is unreliable).
- The browser is an optional dependency (`playwright-core` with a downloaded Chromium, or the system Chrome via an environment variable). Without it the diagram is not dropped silently: the block is shown as a code block with the Mermaid source, and the build prints a warning. A diagram that fails to render does the same.
- The diagrams are cached by the hash of their source, so a rebuild does not render unchanged diagrams again.
- The same SVGs could later be used on the site for a no-JavaScript fallback; not part of this work.

### Embedded videos and interactive math (YouTube, Desmos, GeoGebra)

None of them can run in an EPUB. Each becomes a small figure:

1. a **preview image**,
2. the **title and the address as a link**,
3. a **QR code** of the address, so that it can be opened from a paper-like reader or from a printed copy.

```
+------------------------------+
|        preview image         |
+------------------------------+
| YouTube video: <title>       |        [QR]
| https://youtu.be/...         |
+------------------------------+
```

- **QR code:** generated at build time as SVG by a small pure-JavaScript library (no network, deterministic). Error correction level M.
- **YouTube preview:** `https://img.youtube.com/vi/<id>/hqdefault.jpg`, fetched at build time and stored in the EPUB.
- **Desmos and GeoGebra preview:** there is no documented stable thumbnail address. Options, in order of preference: (1) a documented thumbnail endpoint if one exists (to be verified), (2) a screenshot of the embed address taken by the same headless browser as the diagrams, (3) a generic placeholder with the service name. The first option that works is used, per embed.
- A preview that cannot be fetched or taken never fails the build: the placeholder is used and a warning is printed (same reporting as the books that need attention). Previews are cached by address, and the cache is part of the work directory, so builds without network still work with a warm cache.
- The recognition of these addresses already exists in the core (`youtubeId`, the Desmos/GeoGebra patterns); the EPUB step reuses it instead of parsing the iframes again. For a nicer title the build could read the page title; the first version uses the service name ("YouTube video").

### Other elements

| Element | EPUB handling |
|---|---|
| Code blocks | highlight.js classes kept, a small colour set in `epub.css`; long lines wrap |
| Callouts | `div` with a class and a left border; collapsible callouts are always open |
| ` ```tree ` file structures | the nested list is kept; the Lucide icons are inline SVG and work; the CSS is reduced to indentation |
| Tables | kept; alignment attributes kept; very wide tables are a known limit of e-readers |
| `#!download` files | link to the published site; the file itself is not packed (size) |
| Images | packed; very large images are left as they are in the first version, a size warning is printed |
| Raw HTML | does not exist in the output (already removed by the pipeline) |
| Interactive widgets in future features | must define an EPUB form when they are added |

## Plan

1. **Skeleton**: zip writer, package/nav/chapter generation from the graph, link rewriting, cover, stylesheet; `bookmd epub` for local books. Tests on the generated XML and on the file list.
2. **Formulas**: MathML pass.
3. **Embeds**: preview image, link, QR (YouTube first, then Desmos/GeoGebra).
4. **Mermaid**: headless rendering, cache, fallback.
5. **Site integration**: `bookmd build` writes the files, the download link on the book page, a size warning, documentation (`docs/`) and the changelog.
6. **Included books**: the EPUB of a Git book uses its planned commit; a book that falls back to its last good commit gets the EPUB of that version.

Each step is releasable on its own. The order puts the riskiest unknowns (previews, headless browser) after the skeleton exists.

## Verification

- A unit test per transformation (links, embeds, formulas) on small inputs.
- The generated file is checked with **epubcheck** in CI when Java is available (optional step; not a requirement for local development).
- A manual check with at least two readers (an Apple Books or Calibre viewer, and a mobile reader) on the `docs/` book, which has code, tables, callouts, a tree, formulas and diagrams.

## Decisions to make

1. **Headless browser:** `playwright-core` with a downloaded Chromium (reliable, large download) or the system Chrome (no download, may not exist on a CI runner; GitHub's `ubuntu-latest` has Chrome)? Proposal: use the system Chrome when found, otherwise fall back to the code-block display, so the base install stays small.
2. **Collection-wide EPUB:** one file per book only, or also an optional "all books" file? Proposal: per book only.
3. **Link target for pages outside the book:** needs the public site address; it could come from `portal.config.ts` or `BASE_PATH` plus a site URL setting.
4. **Opt-out:** a book may not want an EPUB (frontmatter `epub: false` on the book front page)? Proposal: yes, cheap to add.
5. **Size:** a limit on the EPUB size with a warning, like the asset warnings (suggestion: warn from 50 MB).
