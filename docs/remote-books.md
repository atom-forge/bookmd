# Books from other GitHub repositories

A book in your collection does not have to live in your own folder: you can include a book from another GitHub repository, kept by its author in their own repository. The author has nothing to do: no workflow, token or BookMD installation is needed, only the Markdown files in the repository. The download and the build run in the workflow of your collection.

This guide assumes that you already have a working collection (see [publishing a collection](deploy-a-book.md)), for example from the template repository.

## 1. The author's part: the entry file

The front page of an included book is a Markdown file in the repository (for example `book.md`), and **its folder is the content root of the book**. The file may have an `id`: a suggestion for the address of the book in a collection. **The collection decides the address**, see [section 2](#2-your-part-one-line-in-booksmd); without an `id` the address comes from the folder of the file.

```md
---
id: web-programming
title: Web programming
language: en
children:
  - "[[01-intro.md]]"
---
# Web programming
```

- The address (an `id` or a slug) may contain only lower-case letters, digits and single hyphens (it cannot start or end with a hyphen, and cannot contain two hyphens in a row), at most 64 characters.
- `_app`, `404`, `@dev`, `content-assets`, `assets`, `static` and `favicon.ico` are reserved.
- The address must not collide with that of another included book, nor with the name of a file or folder in your `content/` folder.
- The other metadata (`name`, `language`, `author`, `tags`, `children`) is the same as for local books, see the [authoring guide](authoring.md).
- The files of the book can refer to anything in **their own repository**, for example to a shared `_common/` folder next to the book's folder (`sources: ["../../_common/part.md"]`). A link to another repository, to another book of your collection or to your `content/` folder does not work. The book is still served at its `id`, whatever folder it is in.

## 2. Your part: one line in `books.md`

In the `books` list of `content/books.md`, next to the local `[[…]]` references, add a line in this form:

```text
<ref>@github.com/<owner>/<repository>/<path-to-the-entry-file.md>
```

```md
---
books:
  - "[[my-first-book/book.md]]"
  - "main@github.com/colleague/web-notes/book.md"
  - "v2.1@github.com/other-colleague/algorithms/materials/book.md"
---
```

- The **ref is required**: a branch name (`main`), a tag (`v2.1`) or a full commit SHA. There is no default branch. If a name is both a branch and a tag, the build reports an error; use a SHA then.
- The only host for now is `github.com`.
- The path of the entry file is relative to the repository root and must end in `.md`.
- The quotes are required.

Commit and push. On the next run the workflow downloads the book, and it appears in your collection (for example at `/web-programming/`).

### The address of the book

The address belongs to your collection, not to the author, so you can choose it. Write the item as an object with a `source` and a `slug`:

```md
---
books:
  - "main@github.com/colleague/web-notes/book.md"
  - source: "v2.1@github.com/other-colleague/algorithms/materials/book.md"
    slug: algorithms
---
```

The address of a book is, in this order:

1. the `slug` in your `books` list,
2. the `id` in the entry file of the book, if it has one,
3. the name of the folder of the entry file (`programming-5-hu/book.md` gives `programming-5-hu`), or the name of the repository when the file is in the root.

A name is made of lower-case letters, digits and single hyphens (accents are removed, other characters become hyphens). If two books want the same address, or the address collides with a folder of your `content/`, the build tells you to set a `slug`. Changing the `slug` changes the address of the book, so choose it once: the author cannot change it by editing the book.

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

A public book needs none of this. A **private** repository can be included too, but the build has to prove that it may read it. The built-in token of a GitHub Actions run (`GITHUB_TOKEN`) only works for the repository the workflow runs in, even inside the same organisation, so the collection uses a **read-only GitHub App**. Two people are involved:

- **The operator (host)** runs the collection. They create the App once, store its credentials as secrets in the collection, and list the book in `books.md`.
- **The author** owns the private repository. They only install the operator's App on that repository and approve the publication. No token, secret or workflow is needed on their side. If you are both, you do both parts.

A private repository **does not make the finished site private**. That is why the author must approve the publication in the entry file (`publish: true`, step A2 below).

### The operator: set up once

**1. Create the App.** For an organisation, open `https://github.com/organizations/<organisation>/settings/apps/new` (for a personal account: *Settings → Developer settings → GitHub Apps → New GitHub App*) and fill in:

- **GitHub App name**: for example `<organisation>-bookmd`. **Homepage URL**: your site address.
- **Webhook**: untick *Active*. The App needs no webhook.
- **Repository permissions → Contents: Read-only.** (*Metadata: Read-only* is added automatically.) Give it nothing else.
- **Where can this app be installed?** Choose *Only on this account* when every book is in your own account or organisation. Choose *Any account* when authors from other accounts have to install it.

Click **Create GitHub App**. Use one App for one operator: its private key can read every repository the App is installed on, so do not share a key between unrelated sites.

**2. Note the App ID and create a key.** On the App's page copy the **App ID** (a number). In *Private keys* click **Generate a private key**: a `.pem` file is downloaded once. GitHub does not keep it, so you cannot download it again, only generate another one. An App can have several keys, so a key can be replaced without downtime.

**3. Store the credentials as secrets** in the repository of the collection. In the browser: *Settings → Secrets and variables → Actions → New repository secret*, twice:

| Secret | Value |
|---|---|
| `BOOKMD_APP_ID` | the App ID |
| `BOOKMD_APP_PRIVATE_KEY` | the whole content of the `.pem` file, from `-----BEGIN` to `-----END` |

With the GitHub CLI, and without leaving the key on your disk:

```text
gh secret set BOOKMD_APP_ID --repo <owner>/<collection> --body 123456
gh secret set BOOKMD_APP_PRIVATE_KEY --repo <owner>/<collection> < key.pem
rm key.pem
```

If you run several collections, create the two secrets once as *organization secrets* (*Organization settings → Secrets and variables → Actions*) and select the repositories that may use them.

**4. Give the secrets to the build.** A secret reaches a step only when the workflow passes it. In the workflow of the template (`.github/workflows/*.yml`), add the two `env` lines to the steps that download books, `check` and `build`:

```yaml
      - run: bun run check
        env:
          BOOKMD_APP_ID: ${{ secrets.BOOKMD_APP_ID }}
          BOOKMD_APP_PRIVATE_KEY: ${{ secrets.BOOKMD_APP_PRIVATE_KEY }}
      - run: bun run build
        env:
          BASE_PATH: /${{ github.event.repository.name }}
          BOOKMD_APP_ID: ${{ secrets.BOOKMD_APP_ID }}
          BOOKMD_APP_PRIVATE_KEY: ${{ secrets.BOOKMD_APP_PRIVATE_KEY }}
```

If you use the plan workflow with separate steps (see [the CLI](cli.md)), give the secrets only to `bookmd plan` and `bookmd sources`; `check` and `build` work from the downloaded commits without them.

**5. Send the author the install address** of your App: `https://github.com/apps/<app-name>/installations/new` (the name is in the address of the App's page).

### The author: for each private book

**A1. Install the App** on the repository of the book: open the address from the operator, choose your account or organisation, select **Only select repositories**, pick the repository of the book and click **Install**. (You need to be an owner of the account, or an admin of the repository.) This gives read access to that repository only.

**A2. Approve the publication** in the entry file of the book, and give it an `id`:

```md
---
id: web-programming
title: Web programming
language: en
publish: true
children:
  - "[[01-intro.md]]"
---
```

Without `publish: true` the build skips the book, removes it from the catalog and prints a warning; the rest of the collection builds as usual, so a book that is still being written can already be listed.

**A3. Tell the operator the address** of the entry file: `main@github.com/<owner>/<repository>/<path>/book.md`.

To withdraw the access: *Settings → Applications → Installed GitHub Apps → Configure* and remove the repository. This stops further reads; it does not take back what has already been published.

### The operator: add the book and check

Add the line from A3 to `content/books.md` (see above), commit and push. The run log ends the check with `Generated N pages in M courses (K from Git)`; the number K counts the included books. If a book is missing or the run fails, see the list below.

### How it works

The engine first tries to download every source anonymously, so a public source never needs a key. Only if that fails does it sign a short-lived App token, look up the installation of the repository and ask for a one-repository, read-only token. The token reaches Git through the environment, not through arguments or the URL, and is not written anywhere. The list of installations of the App is the access register.

In a public repository the logs and artifacts are public: they can reveal the **names** of private repositories.

## Common errors

- **"course id … is already used" / collision with local content**: two books have the same address, or a folder under `content/` has the same name. Give one of them a different `slug`.
- **Invalid `id` or `slug`**: the value does not follow the rules above (or a name cannot be derived from the folder, for example `404`; set a `slug`). The book is left out (or replaced by its last good version) with a warning, see [a book that does not build](cli.md#a-book-that-does-not-build).
- **Unknown ref**: a mistyped branch or tag name; check that it exists in the repository.
- **The repository is not readable** (`cannot read repository …`): a mistyped owner or repository name, or the repository is private and the App is not installed on it (operator step 5 / author step A1).
- **`configure the BookMD GitHub App`**: the repository is private and the build has no credentials. The two secrets are missing, or the workflow does not pass them to the step (operator steps 3 and 4).
- **A private book does not appear and the log warns about `publish: true`**: the entry file lacks `publish: true` (author step A2).
- **A link in the book does not work**: the linked file is outside the repository of the book; an included book is sealed and can only refer to files of its own repository.
