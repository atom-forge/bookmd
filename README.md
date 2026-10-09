# @atom-forge/bookmd

Static book collections from Markdown. A collection (a config file, a book list and content) runs the `bookmd` CLI, which owns the SvelteKit app, the Markdown generator and renderer, a browser-safe content core, a local preview (`/@dev`), Git book sources and change-based publishing. The output is a folder of static files, so it can be hosted anywhere (GitHub Pages included).

## Quick start

The fastest start is the [`bookmd-starter`](https://github.com/atom-forge/bookmd-starter) template repository: *Use this template*, switch GitHub Pages to *GitHub Actions*, edit the Markdown in `content/`. Details: [docs/deploy-a-book.md](docs/deploy-a-book.md).

To run it locally (Bun 1.4.0+, Node 22.12+) see [docs/cli.md](docs/cli.md).

## Documentation

User documentation (Hungarian), in [docs/](docs):

- [Writing books](docs/authoring.md): structure, metadata, supported content.
- [Publishing on GitHub Pages](docs/deploy-a-book.md).
- [Books from other GitHub repositories](docs/remote-books.md), including private ones.
- [Self-hosting the static output](docs/self-hosted.md).
- [Commands and configuration](docs/cli.md): `bookmd` commands, `portal.config.ts`, local preview, `bookmd plan`.

Release notes: [CHANGELOG.md](CHANGELOG.md).
