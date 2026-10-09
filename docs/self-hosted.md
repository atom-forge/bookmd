# Saját szerveren: a build és a feltöltés

A GitHub Pages helyett a gyűjteményt bármilyen statikus tárhelyen kiszolgálhatod: saját webszerveren, objektumtárolón (például S3-szerű tárhelyen) vagy egy statikus hosting szolgáltatón. A BookMD nem igényel futó szervert, a build eredménye sima HTML-, CSS- és JavaScript-fájlok mappája. Ez az útmutató azt írja le, hogyan működik a build, és mit kell a feltöltésnél figyelembe venni.

A gyűjteményed felépítését a [szerzői útmutató](authoring.md), a GitHub Pages-es utat a [feltöltési útmutató](deploy-a-book.md) írja le.

## Mit csinál a build?

A `bookmd build` (a gyűjtemény `package.json`-jában `bun run build`) a következőket végzi:

1. **Forrásokat szerez.** Ha a `books.md` tartalmaz más GitHub-repóra mutató sort ([könyv beemelése](remote-books.md)), letölti azokat a commitokat, és a helyi tartalommal egy közös tartalomgyökérbe állítja össze. A helyi `content/` mappát nem módosítja.
2. **Feldolgozza a Markdownt.** Kiolvassa a metaadatokat, felépíti a hierarchiát és a számozást, a Markdownból HTML-t készít, a képeket és csatolt fájlokat átmásolja. Ha a tartalom hibás (például törött hivatkozás), a build leáll.
3. **Előállítja az oldalakat.** Az `.bookmd/` mappában (eldobható munkaterület, ne commitold) a beépített SvelteKit-alkalmazással minden oldalt előre kirajzol statikus HTML-be.
4. **Kiírja az eredményt** a `build/` mappába, és a hibaoldalt `build/404.html` néven is elmenti.

A `.bookmd/` és a `build/` generált mappák, bármikor törölhetők és újraépíthetők.

## Építés a saját gépeden

Szükséges: Bun 1.4.0+ és Node 22.12+.

```sh
bun install
bun run check     # hibák keresése; opcionális, de érdemes
bun run build
```

Ha a gyűjtemény nem a tartomány gyökerén él, hanem egy alkönyvtárban (például `https://example.com/konyvek/`), add meg az előtagot. Záró perjel nélkül, perjellel kezdve:

```sh
BASE_PATH=/konyvek bun run build
```

Ugyanez a `portal.config.ts`-ben a `basePath` mezővel is megadható. A `BASE_PATH` környezeti változó felülírja a configot, üres érték esetén is. Ha a gyűjtemény a tartomány gyökerén él, ne adj meg semmit.

A kész oldal kipróbálása feltöltés előtt:

```sh
bunx bookmd preview
```

A parancs a meglévő `build/` mappát szolgálja ki helyben.

## Mi van a `build/` mappában?

```text
build/
  index.html            # a gyűjtemény nyitóoldala
  404.html              # hibaoldal (a könyvlistát mutatja)
  .nojekyll             # csak GitHub Pages-hez kell
  _app/                 # a motor JavaScript- és CSS-fájljai, tartalomhash-szel
  <könyv>/index.html    # egy könyv nyitóoldala
  <könyv>/<oldal>/index.html
  ...
```

Minden oldalnak saját `mappa/index.html` fájlja van, ezért az URL-ek perjel nélkül is, perjellel is kiszolgálhatók, ha a szerver a mappákhoz az `index.html`-t adja. A mappa teljes tartalma feltölthető, mást nem kell hozzá telepíteni.

## Feltöltés

Másold a `build/` mappa **tartalmát** a tárhely gyökerébe (vagy a `BASE_PATH` szerinti alkönyvtárba):

```sh
rsync -av --delete build/ felhasznalo@szerver:/var/www/konyvek/
```

A `--delete` eltávolítja a már nem létező oldalakat. Frissítéskor építsd újra, és töltsd fel ugyanígy.

## A szerver beállítása

A szervernek három dolgot kell tudnia:

1. **Mappához az `index.html`-t adja.** A legtöbb webszerver alapból ezt teszi.
2. **A hiányzó oldalra a `404.html`-t adja, 404-es állapotkóddal.** A hibaoldal a könyvlistát mutatja. Átirányítás nem szükséges, az URL megmarad.
3. **A `_app/` fájljait hosszan gyorsítótárazhassa.** A fájlnevek tartalomhash-t viselnek, ezért biztonságosan lehet rájuk hosszú lejáratot adni.

Példa nginx-konfiguráció (az elv a lényeg, a pontos beállítás a te szervereden múlik):

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/konyvek;
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

Alkönyvtárban futó gyűjteménynél a `root` és a `location` útvonalakat a `BASE_PATH`-hoz kell igazítani.

## Automatikus építés

A build nem kötődik a GitHubhoz, ugyanezek a lépések futnak bármely CI-ben: telepíti a Bunt és a Nodeot, majd `bun install`, `bun run check`, `bun run build`, végül a `build/` feltöltése. A build letölti a beemelt könyveket is, ezért hálózatot igényel. Egy beemelt könyv ágának frissülése csak újabb build után látszik az oldalon, ezért érdemes a buildet időzíteni vagy kézzel indítani. Hogy csak tényleges változás esetén építsen újra, használd a [`bookmd plan`](cli.md#változásellenőrzés-bookmd-plan) parancsot.

## Hibák

- **Az oldal CSS nélkül jelenik meg, a hivatkozások törtek:** hiányzik vagy hibás a `BASE_PATH`.
- **Az aloldalak 404-et adnak:** a szerver nem keresi az `index.html`-t a mappákban (lásd az 1. pontot).
- **A hibás címen 200-as kód jön a 404.html helyett:** a szerver átírja a hiányzó oldalakat a nyitóoldalra (SPA-szerű beállítás). Kapcsold ki, vagy állítsd a 404-es kódot.
- **A `build` leáll hibával:** a hibaüzenet megnevezi a fájlt és a problémát. Javítsd, és építs újra.
