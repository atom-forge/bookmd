# Self-hosting: build and upload

Instead of GitHub Pages you can serve the collection from any static host: your own web server, object storage (for example S3-like storage) or a static hosting service. BookMD needs no running server; the result of the build is a folder of plain HTML, CSS and JavaScript files. This guide describes how the build works and what to consider when uploading.

The structure of your collection is described in the [authoring guide](authoring.md), the GitHub Pages route in the [publishing guide](deploy-a-book.md).

## What does the build do?

`bookmd build` (`bun run build` in the `package.json` of the collection) does the following:

1. **Fetches sources.** If `books.md` contains lines pointing at other GitHub repositories ([included books](remote-books.md)), it downloads those commits and assembles them with the local content into one common content root. The local `content/` folder is not modified.
2. **Processes the Markdown.** It reads the metadata, builds the hierarchy and the numbering, turns Markdown into HTML, and copies images and attached files. If the content is faulty (for example a broken link), the build stops.
3. **Produces the pages.** In the `.bookmd/` folder (a disposable work area, do not commit it) the built-in SvelteKit application prerenders every page into static HTML.
4. **Writes the result** to the `build/` folder, and saves the error page as `build/404.html` too.

`.bookmd/` and `build/` are generated folders; you can delete and rebuild them at any time.

## Building on your own machine

Required: Bun 1.4.0+ and Node 22.12+.

```sh
bun install
bun run check     # look for errors; optional but worthwhile
bun run build
```

If the collection does not live at the root of the domain but in a subdirectory (for example `https://example.com/books/`), give the prefix. Start it with a slash, no trailing slash:

```sh
BASE_PATH=/books bun run build
```

The same can be set with the `basePath` field in `portal.config.ts`. The `BASE_PATH` environment variable overrides the config, even when its value is empty. If the collection lives at the root of the domain, set nothing.

To try the finished site before uploading:

```sh
bunx bookmd preview
```

The command serves the existing `build/` folder locally.

## What is in `build/`?

```text
build/
  index.html            # the front page of the collection
  404.html              # error page (shows the list of books)
  .nojekyll             # only needed for GitHub Pages
  _app/                 # the engine's JavaScript and CSS files, with content hashes
  <book>/index.html     # the front page of a book
  <book>/<page>/index.html
  ...
```

Every page has its own `folder/index.html` file, so URLs work with or without a trailing slash if the server serves `index.html` for folders. The whole folder can be uploaded; nothing else needs to be installed.

## Upload

Copy the **contents** of the `build/` folder to the root of the host (or to the subdirectory matching `BASE_PATH`):

```sh
rsync -av --delete build/ user@server:/var/www/books/
```

`--delete` removes pages that no longer exist. When you update, rebuild and upload the same way.

## Server settings

The server must do three things:

1. **Serve `index.html` for folders.** Most web servers do this by default.
2. **Serve `404.html` for a missing page, with a 404 status code.** The error page shows the list of books. No redirect is needed; the URL stays as it is.
3. **Allow long caching of the files in `_app/`.** The file names carry a content hash, so they are safe to cache for a long time.

An example nginx configuration (the principle matters; the exact setup depends on your server):

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/books;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }

  location /_app/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  error_page 404 /404.html;
}
```

For a collection in a subdirectory, adjust `root` and the `location` paths to match `BASE_PATH`.

## Automatic builds

The build is not tied to GitHub: the same steps run in any CI. Install Bun and Node, then `bun install`, `bun run check`, `bun run build`, and finally upload `build/`. The build also downloads included books, so it needs network access. A change on the branch of an included book shows up on the site only after a new build, so it is worth scheduling the build or starting it by hand. To rebuild only when something has really changed, use the [`bookmd plan`](cli.md#change-detection-bookmd-plan) command.

## Troubleshooting

- **The site appears without CSS and with broken links:** `BASE_PATH` is missing or wrong.
- **Subpages return 404:** the server does not look for `index.html` in folders (see point 1).
- **A wrong address returns 200 instead of 404.html:** the server rewrites missing pages to the front page (an SPA-style setup). Turn that off, or set the 404 status.
- **The `build` stops with an error:** the error message names the file and the problem. Fix it and build again.
