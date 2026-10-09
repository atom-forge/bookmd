# Books from other GitHub repositories

A book in your collection does not have to live in your own folder: you can include a book from another GitHub repository, kept by its author in their own repository. The author has nothing to do: no workflow, token or BookMD installation is needed, only the Markdown files in the repository. The download and the build run in the workflow of your collection.

This guide assumes that you already have a working collection (see [publishing a collection](deploy-a-book.md)), for example from the template repository.

## 1. The author's part: the entry file

The front page of an included book is a Markdown file in the repository (for example `book.md`), and **its folder is the content root of the book**. The file must have an `id`, which becomes the address of the book in your collection:

```md
---
id: web-programming
name: Web programming
language: en
children:
  - "[[01-intro.md]]"
---
# Web programming
```

- The `id` may contain only lower-case letters, digits and single hyphens (it cannot start or end with a hyphen, and cannot contain two hyphens in a row), at most 64 characters.
- `_app`, `404`, `@dev`, `content-assets`, `assets`, `static` and `favicon.ico` are reserved.
- The `id` must not collide with the `id` of another included book, nor with the name of a file or folder in your `content/` folder.
- The other metadata (`name`, `language`, `author`, `tags`, `children`) is the same as for local books, see the [authoring guide](authoring.md).
- The files of the book can only refer to **their own folder**. A link to another book, to your `content/` folder or to the rest of the repository does not work.

## 2. Your part: one line in `books.md`

In the `courses` list of `content/books.md`, next to the local `[[…]]` references, add a line in this form:

```text
<ref>@github.com/<owner>/<repository>/<path-to-the-entry-file.md>
```

```md
---
courses:
  - "[[my-first-book/book.md]]"
  - "main@github.com/colleague/web-notes/book.md"
  - "v2.1@github.com/other-colleague/algorithms/materials/book.md"
---
```

- The **ref is required**: a branch name (`main`), a tag (`v2.1`) or a full commit SHA. There is no default branch. If a name is both a branch and a tag, the build reports an error; use a SHA then.
- The only host for now is `github.com`.
- The path of the entry file is relative to the repository root and must end in `.md`.
- The quotes are required.

Commit and push. On the next run the workflow downloads the book, and it appears in your collection under its `id` (for example `/web-programming/`).

## How does an included book update?

On every run the build downloads one specific commit, after resolving the ref. Therefore:

- **Pinned version**: if you give a SHA or a tag, the book does not change until you rewrite the line.
- **Followed branch**: if you give `main`, the site shows the latest state of the book, **but it only updates when your workflow runs**. A push by the author does not start your workflow.

To follow a branch automatically, schedule the workflow. Add to the `on:` block, next to `push`:

```yaml
on:
  push:
    branches: [main]
  schedule:
    - cron: '17 4 * * *'   # once a day
  workflow_dispatch:
```

You can also start it by hand with **Actions → Deploy book → Run workflow**.

## Private repositories

The build can read from a private repository only if the operator has created a read-only GitHub App and the author has installed it on their repository. Access is per repository and read-only.

- **Author:** installs the App on their account (or organisation) and selects the book's repository ("Only select repositories", Contents: read). No token, secret or workflow is needed on their side. Removing the installation stops further reads; it does not take back what has already been published.
- **Approval:** a private repository **does not make the finished site private**. So the entry file must state the approval: `publish: true`. Without it the build stops with an error.
- **Operator:** creates the App (Contents: read-only, Metadata: read-only) and provides `BOOKMD_APP_ID` and `BOOKMD_APP_PRIVATE_KEY` (PEM) in the environment of the collection (or as Actions secrets). The list of installations (`GET /app/installations`) is the access register. The App can have several keys, so a key can be rotated without downtime.
- **Behaviour:** the engine first tries to download every source anonymously, so a public source never needs a key. Only if that fails does it sign a short-lived App token, look up the installation of the repository and ask for a one-repository, read-only token. The token reaches Git through the environment, not through arguments or the URL, and is not written anywhere. The error message says whether the App is not installed (or the repository does not exist), the credentials were rejected, or no credentials are configured.
- **CI:** give the secret only to the `plan` and `sources` steps; `check` and `build` run without it from the downloaded, pinned commits. In a public repository, remember that logs and artifacts can reveal the names of private repositories.

## Common errors

- **"course id … is already used" / collision with local content**: the `id` is repeated, or a folder under `content/` has the same name. Rename one of them.
- **Missing or invalid `id`**: the frontmatter of the entry file has no `id`, or it does not follow the rules above.
- **Unknown ref**: a mistyped branch or tag name; check that it exists in the repository.
- **The repository is not readable**: a mistyped owner or repository name, or the repository is private and the App is not installed.
- **A link in the book does not work**: the linked file is outside the folder of the book; an included book is sealed and can only refer to its own folder.
