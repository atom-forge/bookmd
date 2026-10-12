# BookMD authoring reference for LLMs

This file is written to be given to an AI assistant that writes or edits the Markdown of a BookMD collection. It is a compact, rule-first summary of the [authoring guide](authoring.md); where the two disagree, the guide wins.

## What BookMD builds

BookMD turns Markdown files into a static website: a **collection** (the site) with a catalogue of **books**; a book has **pages** (one Markdown file each) arranged in a tree. There is no central tree file: every page declares its own direct children.

## Files and the collection

```text
content/
  books.md              # entry file of the collection: lists the books
  my-book/
    book.md             # front page of the book (its folder is the book's root)
    01-intro.md
    02-next.md
    img/diagram.png
```

`books.md` (path set by `entrypoint` in `portal.config.ts`):

```md
---
branding: My School
books:                         # the older key name "courses" is still accepted
  - "[[my-book/book.md]]"
  - "main@github.com/owner/repo/path/book.md"   # a book from another GitHub repository
---
# Catalogue text
```

## Frontmatter reference

Every list below holds **quoted** wikilinks or Markdown links, because unquoted `[[x]]` is parsed by YAML as a nested list.

| Field | Where | Meaning |
|---|---|---|
| `books` | collection entry file | Ordered list of books: `"[[dir/book.md]]"` or a Git source. (`courses` is the older name; never use both.) |
| `branding` | collection entry file | Text in the site header. |
| `name` | book front page | Book name; else `title`, else the first heading. |
| `language` | book front page | **Required.** e.g. `en`, `hu`. |
| `author`, `tags`, `intro`, `image` | book front page | Optional. `author` and `tags` also work on any page. |
| `id` | book front page | **Required only for a book included from another repository.** Lower-case letters, digits, single hyphens; at most 64 characters. |
| `publish: true` | book front page | **Required for a book in a private repository** that is included elsewhere; without it the book is left out. |
| `title` | page | Page title (see the order below). |
| `type` | page | `chapter` (numbered, children inherit the prefix), `content` (numbered inside the nearest chapter); anything else or missing is unnumbered. |
| `children` | page | Ordered direct subpages: `"[[page.md]]"` or `"[Custom title](page.md)"`. |
| `sources` | page | Files whose content is appended to this page, in order: `"[[part.md]]"`. |
| `attachments` | page | Files offered for download below the page: `"[[docs/llm.md]]"`. |
| `requires`, `teaches` | page | Lists of concept strings, shown in the sidebar. |

Title order: the title in the parent's `children` link, then `title`, then the first heading of the shallowest level, then the file name.

## Rules that are easy to get wrong

- **All paths are relative to the file that contains them**, in `children`, `sources`, `attachments` and in the body. From `part/b.md`, a sibling is `[[c.md]]`, the parent folder is `[[../a.md]]`. A book-root-relative path such as `[[resources/x.md]]` written inside `resources/y.md` points to `resources/resources/x.md` and fails.
- The `.md` extension may be omitted in wikilinks. A Markdown link needs it.
- A page can have **one** parent. A page listed in two `children` lists, a cycle, or the old `series`/`tree` fields are errors. `chapter` in frontmatter is ignored: numbering comes from `type` and the `children` order.
- Instead of `children`, put the subpages in a folder named like the page without `.md` (`algebra.md` + `algebra/01-sets.md`, `algebra/02-functions.md`); they are ordered by file name with numbers compared as numbers. A `children` field, even an empty one, turns this off.
- A book's files may only reference files **inside the book's own folder**. A path leaving it (`../../other`) is an error; an included book cannot link to another book.
- Pages under a folder named `resources` cannot have `tags`, `requires` or `teaches`.
- Raw HTML in Markdown does not reach the output. Do not rely on it.
- `author`, `tags`, `requires`, `teaches` are not inherited from the book or parent.

## Body syntax

- Standard Markdown with GitHub extensions (tables, task lists, strikethrough).
- Formulas: `$x^2$` inline, `$$E=mc^2$$` display (LaTeX).
- Diagrams: a fenced code block with the language `mermaid`.
- Code blocks are syntax highlighted.
- Callouts (Obsidian syntax): `> [!tip] Title`, with `+` (open) or `-` (closed) after the type for collapsible ones. Types: note, abstract, info, todo, tip, success, question, warning, failure, danger, bug, example, quote.
- Links to other pages: `[[page]]`, `[[page#heading|Custom text]]` or `[text](page.md)`. Links in the body do not change the navigation tree.
- Images: `![alt](img/diagram.png)`. Other files: `[slides](slides.pdf)`. They are copied into the site and keep their file name.
- **Attachments:** `[[!docs/llm.md]]` or `[[!docs/llm.md|notes]]` offers the file for download **as it is**, even if it is a `.md` file. A plain link to a `.md` file is always a page.
- Embeds: a paragraph containing only `[[https://youtu.be/<11-char-id>]]`, a Desmos (`https://www.desmos.com/calculator/<id>`, `…/3d/<id>`) or GeoGebra (`https://www.geogebra.org/m/<id>`) address. Other addresses are plain links. The Obsidian `![[file]]` embed is not supported.

## Included books (another GitHub repository)

A line in `books`: `<ref>@github.com/<owner>/<repo>/<path-to-entry.md>`, where `<ref>` is a branch, a tag or a full commit SHA. The entry file's folder is the book's root and the file needs an `id`. A private repository additionally needs `publish: true` in the entry file's frontmatter.

If an included book does not build, the site still builds: the book's last published version is used, or the book is left out, with a warning.

## Minimal examples

A book front page:

```md
---
name: Web Programming
language: en
author: Jane Doe
tags: [web]
intro: How the web works.
children:
  - "[[01-intro.md]]"
  - "[Second part](02-next.md)"
---
# Web Programming
```

A chapter with a download:

```md
---
type: chapter
attachments:
  - "[[files/exercises.zip]]"
---
# Introduction

See [[02-next]] and the notes: [[!files/notes.md|notes for LLMs]].

> [!tip] Hint
> Formulas work: $a^2 + b^2 = c^2$.
```

## Checklist before you finish

1. The book front page has `language`; an included book also has `id` (and `publish: true` if its repository is private).
2. Every list item in `books`, `children`, `sources` and `attachments` is quoted.
3. Every path is relative to the file it is written in, and stays inside the book's folder.
4. Each page is listed under exactly one parent, and the `children` order is the reading order.
5. Chapters have `type: chapter`; their pages have `type: content`.
6. Files you want downloaded use `[[!file]]` or `attachments`, not a plain link to a `.md` file.
