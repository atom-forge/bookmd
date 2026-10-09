# The `bookmd` command line and configuration

A collection is a small project: `package.json`, `portal.config.ts` and the `content/` folder. The engine provides the `bookmd` command, which runs the application in the disposable `.bookmd/` work area; the static output goes to the `build/` folder. Running it requires Bun 1.4.0+ and Node 22.12+.

## Commands

```sh
bookmd dev       # development server with live reload
bookmd check     # check the content and the links
bookmd build     # static site into the build/ folder
bookmd preview   # serve the finished build locally
bookmd content   # process the content only (for debugging)
bookmd sources   # download the included Git sources
bookmd plan      # change detection, see below
```

- `--config <file>` gives the configuration; the default is `portal.config.ts` in the current folder. The paths of the project are relative to the configuration file.
- Arguments after `--` go to Vite (for example `bookmd preview -- --host 127.0.0.1`).
- An invalid command or setting, missing input and a failing tool all end with a non-zero exit code.
- `dev` watches the content folder and reloads the browser. After changing the configuration or the engine, restart it.

## Configuration (`portal.config.ts`)

```ts
export default {
  title: 'BookMD',           // optional title
  contentRoot: './content',  // required; the engine only reads it
  entrypoint: 'books.md',    // required; relative to the content folder
  basePath: ''               // optional, for example '/books', no trailing slash
};
```

The `BASE_PATH` environment variable overrides `basePath`, even when its value is empty. The configuration is executable TypeScript, so do not put secrets in it.

## Installing into a collection

A collection needs a `package.json` that depends on the `@atom-forge/bookmd` package, a `portal.config.ts`, and `content/books.md` with at least one book (see the [`examples/minimal`](https://github.com/atom-forge/bookmd/tree/main/examples/minimal) folder):

```json
{ "private": true, "type": "module",
  "scripts": { "dev": "bookmd dev", "build": "bookmd build", "check": "bookmd check" },
  "dependencies": { "@atom-forge/bookmd": "^0.1.2" } }
```

- Do not commit the `.bookmd/`, `build/` and `node_modules/` folders; the lockfile is fine to commit.
- Upgrading or rolling back: change the version, update the lockfile, then `check` and `build`.
- An empty book list is an error: `books.md` needs at least one book.

## Local preview in the browser (`/@dev`)

The `/@dev` page of any BookMD site (and of the `dev` server) previews a local folder directly in the browser, without installing anything. Authors should read [Previewing your book locally](authoring.md#previewing-your-book-locally).

## Change detection: `bookmd plan`

If the collection contains included books, `plan` tells you whether a new build is needed:

```sh
bookmd plan --instance-commit <sha> [--baseline plan.json] [--out plan.json] [--force]
bookmd build --sources plan.json
```

`plan` resolves every ref to a concrete commit (without downloading) and writes a plan file: the commit of the collection, the engine version, the fingerprints of `bun.lock` and the book list, and the commits of the included sources. It compares the plan with that of the last successful publication and prints `Changed: <reasons>` or `Unchanged: nothing to publish`. In GitHub Actions it also sets the `changed` and `reasons` outputs.

- A missing, corrupt or incomplete baseline always means a full build; `--force` always rebuilds.
- `build --sources plan.json` downloads exactly the planned commits and never resolves a ref again, so the commit that was checked is the commit that is built, even if a branch has moved on in the meantime.
- Storing the baseline is the collection's job: keep the plan file only after a successful deployment.
