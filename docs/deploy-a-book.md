# Publishing a collection on GitHub

This guide shows how to turn your own notes (Markdown files) into a public website on GitHub Pages. At the end your collection is available at `https://<user>.github.io/<repository>/` and updates itself after every change pushed to the `main` branch.

## Quick start: the template repository

The easiest way is the ready-made template, which contains the files and the deployment workflow.

1. Open the [`atom-forge/bookmd-starter`](https://github.com/atom-forge/bookmd-starter) template repository and click **Use this template → Create a new repository**. Make the repository **public**.
2. In the new repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Edit the Markdown files in the `content/` folder (even in the GitHub web editor) and commit to `main`.
4. At the end of the *Deploy book* run on the **Actions** tab, the address of the site appears: `https://<user>.github.io/<repository>/`.

After every further commit to `main` the site updates itself. The sections below describe what the template contains and how to build it from scratch.

## Building it from scratch

### What you need

- A GitHub account and a **public** repository. On the free plan GitHub Pages is not available from a private repository, and a private repository would not make the finished site private anyway.
- Git, or the GitHub web interface for uploading files.

The build runs on GitHub's servers; you do not need to install anything on your own machine.

### 1. The structure of the repository

A collection is a plain folder with a few files and a `content/` directory:

```text
my-books/
  package.json
  portal.config.ts
  .gitignore
  content/
    books.md          # the front page and the list of books
    my-first-book/
      book.md         # the front page of a book
      01-intro.md
```

`package.json`:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "check": "bookmd check",
    "build": "bookmd build"
  },
  "dependencies": {
    "@atom-forge/bookmd": "^0.1.4"
  }
}
```

`portal.config.ts`:

```ts
export default {
  title: 'My books',
  contentRoot: './content',
  entrypoint: 'books.md'
};
```

`.gitignore`:

```text
node_modules
.bookmd/
build/
.DS_Store
```

`content/books.md` lists the books. The quotes are required:

```md
---
courses:
  - "[[my-first-book/book.md]]"
---
# My books

Welcome.
```

The front page of a book (`content/my-first-book/book.md`) gives its own data and chapters. `language` is required:

```md
---
name: My first book
language: en
children:
  - "[[01-intro.md]]"
---
# My first book

Short introduction.
```

The complete content rules (hierarchy, tags, chapters) are in the [authoring guide](authoring.md). You can also use the [`examples/minimal`](https://github.com/atom-forge/bookmd/tree/main/examples/minimal) folder as a starting point.

### 2. Turn on GitHub Pages

On the repository page: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 3. The deployment workflow

Create the file `.github/workflows/pages.yml`:

```yaml
name: Deploy book

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: '1.4.0'
      - run: bun install
      - run: bun run check
      - run: bun run build
        env:
          BASE_PATH: /${{ github.event.repository.name }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`BASE_PATH` is needed because "project" sites live at `https://<user>.github.io/<repository>/`, that is, in a subdirectory. Remove the `env` block in two cases:

- the repository is named `<user>.github.io` (a "user site" lives at the root), or
- you attach a custom domain to it.

If `bun run check` reports an error, the workflow stops and nothing reaches the site.

### 4. Upload

```sh
git init -b main
git add .
git commit -m "First books"
git remote add origin git@github.com:<user>/<repository>.git
git push -u origin main
```

You can follow the run on the repository's **Actions** tab. When it succeeds, the `deploy` step prints the address of the site; the same address is under **Settings → Pages**. The first deployment can take a few minutes.

## Updating

Edit the Markdown files, commit and push to `main`. The workflow rebuilds and replaces the site. You can also start it by hand with **Actions → Deploy book → Run workflow**.

## Troubleshooting

- **The site appears without CSS and with broken links**: `BASE_PATH` is missing or wrong. Project sites need `/<repository-name>` with no trailing slash.
- **`check` reports an error on a link**: the error names the file and the link; fix or remove it and push again.
- **404 at the address**: the source of Pages is not "GitHub Actions", or the first deployment has not finished yet.
