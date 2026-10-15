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

```tree
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
books:
  - "[[my-first-book/book.md]]"
---
# My books

Welcome.
```

The front page of a book (`content/my-first-book/book.md`) gives its own data and chapters. `language` is required:

```md
---
title: My first book
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
title: Deploy book

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

Both are described in [your own address](#your-own-address-a-user-site-and-a-custom-domain).

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

## Your own address: a user site and a custom domain

By default the collection lives at `https://<user>.github.io/<repository>/`, in a subdirectory. There are two ways to give it a shorter address; in both the site is at the **root** of its address, so the build does not need `BASE_PATH`.

### A user or organisation site: `<name>.github.io`

Every user and every organisation can have one special site at `https://<name>.github.io/`.

1. Name the repository exactly `<name>.github.io`, where `<name>` is your user name or the name of the organisation (for an organisation, create the repository inside it).
2. Turn on Pages as in step 2: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. In the workflow `.github/workflows/pages.yml`, **remove the `env` block** of the `bun run build` step (the one that sets `BASE_PATH`), so that the step is only `- run: bun run build`.
4. Push. The site is at `https://<name>.github.io/`.

Good to know:

- You can have only one such site per user or organisation. Your other repositories with Pages remain project sites, at `https://<name>.github.io/<repository>/`.
- Creating Pages for an organisation needs the owner or admin role of the organisation.
- Public repositories can use Pages on every plan; a private repository needs a paid plan.

### A custom domain

You can serve the site from your own domain, for example `books.example.com` or `example.com`. It works with a project site and with a user site alike.

1. Decide the address. A subdomain (`books.example.com`) is the simpler choice; an apex domain (`example.com`) needs more records.
2. In the DNS settings of your domain provider add the records:
   - **Subdomain**: one `CNAME` record from `books` (the name you chose) to `<name>.github.io` (your user or organisation name, **without** the repository name).
   - **Apex domain**: `A` records for `@` to the four addresses GitHub lists for Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153` (and, if you like, the matching `AAAA` records for IPv6). Check the current addresses in the GitHub documentation "Managing a custom domain for your GitHub Pages site" before you enter them.
3. In the repository: **Settings → Pages → Custom domain**, enter the domain and save. GitHub checks the DNS records; this can take from a few minutes to a day.
4. When the check passes, tick **Enforce HTTPS**. The certificate is issued automatically and can take up to an hour.
5. **Remove the `env` block with `BASE_PATH`** from the workflow (the site is now at the root of the domain), and push.

Good to know:

- With a deployment from GitHub Actions you do not add a `CNAME` file to the repository: the **Custom domain** setting is enough, and a `CNAME` file is ignored.
- To stop someone else from taking over your domain, an owner of the account can *verify* the domain in the Pages settings of the user or organisation.
- If the site shows up without CSS after the change, `BASE_PATH` is still set; see [Troubleshooting](#troubleshooting).

## Updating

Edit the Markdown files, commit and push to `main`. The workflow rebuilds and replaces the site. You can also start it by hand with **Actions → Deploy book → Run workflow**.

## Troubleshooting

- **The site appears without CSS and with broken links**: `BASE_PATH` is missing or wrong. Project sites need `/<repository-name>` with no trailing slash; a user site (`<name>.github.io`) or a site with a custom domain must not set it at all.
- **`check` reports an error on a link**: the error names the file and the link; fix or remove it and push again.
- **404 at the address**: the source of Pages is not "GitHub Actions", or the first deployment has not finished yet.
