# Könyvgyűjtemény feltöltése GitHubra

Ez az útmutató azt mutatja meg, hogyan lesz a saját jegyzetekből (Markdown fájlokból) nyilvános weboldal a GitHub Pages-en. A lépések végén a gyűjteményed egy `https://<felhasználó>.github.io/<repó>/` címen érhető el, és minden `main` ágra küldött változtatás után magától frissül.

## Gyorsindulás: a sablonrepóval

A legegyszerűbb út a kész sablon, amely tartalmazza a fájlokat és a telepítő workflow-t is.

1. Nyisd meg a [`atom-forge/bookmd-starter`](https://github.com/atom-forge/bookmd-starter) sablonrepót, és kattints a **Use this template → Create a new repository** gombra. A repó legyen **nyilvános**.
2. Az új repóban: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Szerkeszd a `content/` mappa Markdown fájljait (akár a GitHub webes szerkesztőjében), és commitold a `main` ágra.
4. Az **Actions** fülön a *Deploy book* futás végén megjelenik az oldal címe: `https://<felhasználó>.github.io/<repó>/`.

Minden további `main` commit után az oldal magától frissül. A lenti szakaszok azt írják le, mit tartalmaz a sablon, és hogyan építhető fel nulláról.

## Felépítés nulláról

### Mire lesz szükséged

- GitHub-fiók és egy **nyilvános** repó. Az ingyenes csomagban privát repóból a GitHub Pages nem érhető el, és a privát repó amúgy sem tenné privátá a kész oldalt.
- Git, vagy a GitHub webes felülete a fájlok feltöltéséhez.

A build a GitHub szerverén fut, a saját gépedre semmit nem kell telepíteni.

### 1. A repó felépítése

A gyűjtemény egy egyszerű mappa, négy fájllal és egy `content/` könyvtárral:

```text
my-books/
  package.json
  portal.config.ts
  .gitignore
  content/
    books.md          # a gyűjtemény nyitóoldala és könyvlistája
    my-first-book/
      book.md         # egy könyv nyitóoldala
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
    "@atom-forge/bookmd": "^0.1.1"
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

`content/books.md` sorolja fel a könyveket. Az idézőjel kötelező:

```md
---
courses:
  - "[[my-first-book/book.md]]"
---
# My books

Welcome.
```

Egy könyv nyitóoldala (`content/my-first-book/book.md`) a saját adatait és a fejezeteit adja meg. A `language` kötelező:

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

A teljes tartalmi szabályokat (hierarchia, címkék, fejezetek) a [szerzői útmutató](authoring.md) írja le. Kész kiindulópontnak használhatod az [`examples/minimal`](https://github.com/atom-forge/bookmd/tree/main/examples/minimal) mappát is.

### 2. A GitHub Pages bekapcsolása

A repó oldalán: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 3. A telepítő workflow

Hozd létre a `.github/workflows/pages.yml` fájlt:

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

A `BASE_PATH` azért kell, mert a „projekt” oldalak a `https://<felhasználó>.github.io/<repó>/` címen élnek, vagyis az oldal egy alkönyvtárban van. Két esetben hagyd el ezt a `env` blokkot:

- ha a repó neve `<felhasználó>.github.io` (a „felhasználói oldal” a gyökéren él), vagy
- ha saját domaint kötsz rá.

Ha a `bun run check` hibát jelez, a workflow megáll, és semmi nem kerül ki az oldalra.

### 4. Feltöltés

```sh
git init -b main
git add .
git commit -m "First books"
git remote add origin git@github.com:<felhasználó>/<repó>.git
git push -u origin main
```

A repó **Actions** fülén látod a futást. Siker után a `deploy` lépés kiírja az oldal címét, ugyanez a **Settings → Pages** alatt is megtalálható. Az első telepítés pár percig tarthat.

## Frissítés

Szerkeszd a Markdown fájlokat, commitold és told fel a `main` ágra. A workflow újraépíti és kicseréli az oldalt. Az **Actions → Deploy book → Run workflow** gombbal kézzel is indíthatod.

## Hibák

- **Az oldal CSS nélkül, törött hivatkozásokkal jelenik meg**: hiányzik vagy rossz a `BASE_PATH`. A projekt oldalaknál `/<repó-neve>` kell, záró perjel nélkül.
- **A `check` hibát jelez egy hivatkozásra**: a hiba megnevezi a fájlt és a hivatkozást; javítsd vagy töröld, és told fel újra.
- **404 a címen**: a Pages forrása nem „GitHub Actions”, vagy az első telepítés még nem ért véget.
