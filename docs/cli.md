# A `bookmd` parancssor és a beállítások

A gyűjtemény egy kis projekt: `package.json`, `portal.config.ts` és a `content/` mappa. A motor a `bookmd` parancsot adja, ami az eldobható `.bookmd/` munkaterületben futtatja az alkalmazást, a statikus kimenet pedig a `build/` mappába kerül. Futtatáshoz Bun 1.4.0+ és Node 22.12+ kell.

## Parancsok

```sh
bookmd dev       # fejlesztői szerver élő újratöltéssel
bookmd check     # a tartalom és a hivatkozások ellenőrzése
bookmd build     # statikus oldal a build/ mappába
bookmd preview   # a kész build kiszolgálása helyben
bookmd content   # csak a tartalom feldolgozása (hibakereséshez)
bookmd sources   # a beemelt Git-források letöltése
bookmd plan      # változásellenőrzés, lásd lent
```

- A `--config <fájl>` megadja a konfigurációt; alapértéke az aktuális mappa `portal.config.ts` fájlja. A projekt útvonalai a konfigurációs fájlhoz viszonyítva értendők.
- A `--` utáni argumentumokat a Vite kapja (például `bookmd preview -- --host 127.0.0.1`).
- Hibás parancs vagy beállítás, hiányzó bemenet és sikertelen eszköz nem nulla kilépési kóddal jár.
- A `dev` figyeli a tartalommappát, és újratölti a böngészőt. A konfiguráció vagy a motor változtatása után indítsd újra.

## Konfiguráció (`portal.config.ts`)

```ts
export default {
  title: 'BookMD',        // opcionális cím
  contentRoot: './content',  // kötelező; a motor csak olvassa
  entrypoint: 'books.md',    // kötelező; a tartalommappához képest
  basePath: ''               // opcionális, például '/konyvek', záró perjel nélkül
};
```

A `BASE_PATH` környezeti változó felülírja a `basePath` értékét, üres érték esetén is. A konfiguráció futtatható TypeScript, ezért ne tegyél bele titkot.

## Telepítés egy gyűjteménybe

A gyűjteménynek kell egy `package.json`, ami függ az `@atom-forge/bookmd` csomagtól, egy `portal.config.ts` és a `content/books.md` legalább egy könyvvel (lásd az [`examples/minimal`](https://github.com/atom-forge/bookmd/tree/main/examples/minimal) mappát):

```json
{ "private": true, "type": "module",
  "scripts": { "dev": "bookmd dev", "build": "bookmd build", "check": "bookmd check" },
  "dependencies": { "@atom-forge/bookmd": "^0.1.1" } }
```

- A `.bookmd/`, `build/` és `node_modules/` mappát ne commitold; a lockfile mehet.
- Frissítés vagy visszalépés: verziócsere, lockfile-frissítés, majd `check` és `build`.
- Az üres könyvlista hibát okoz: legalább egy könyv kell a `books.md`-ben.

## Helyi előnézet a böngészőben (`/@dev`)

A publikált oldalon (és a `dev` szerveren) a `/@dev` cím egy szerzői előnézetet ad: egy helyi mappát nyithatsz meg a böngészőben (`showDirectoryPicker`, asztali Chrome vagy Edge, HTTPS vagy localhost), és a tartalmat azonnal látod. A fájlokat csak a böngésző olvassa, semmi nem töltődik fel vagy íródik vissza.

- Az indításkor kiválaszthatod a belépőfájlt. A `book.md`, `course.md`, `index.md` és `readme.md` nevűek kiemelve jelennek meg.
- A rejtett mappák és a `node_modules` kimaradnak; legfeljebb 20 000 fájl listázódik, az 5 MB-nál nagyobb Markdown elutasítva.
- A törött hivatkozások és képek diagnosztikaként jelennek meg, az előnézet nem áll le.
- Újratöltés után a böngésző megjegyzi a mappát és az oldalt. Ha a Chrome már nem ad olvasási jogot, egy „Continue with this folder” gomb kéri újra.

## Változásellenőrzés: `bookmd plan`

Ha a gyűjtemény beemelt könyveket tartalmaz, a `plan` megmondja, kell-e új build:

```sh
bookmd plan --instance-commit <sha> [--baseline plan.json] [--out plan.json] [--force]
bookmd build --sources plan.json
```

A `plan` feloldja az összes ref-et konkrét commitra (letöltés nélkül), és egy tervfájlt ír: a gyűjtemény commitját, a motor verzióját, a `bun.lock` és a könyvlista ujjlenyomatát, valamint a beemelt források commitjait. Összeveti a legutóbbi sikeres publikáció tervével, és kiírja, hogy `Changed: <okok>` vagy `Unchanged: nothing to publish`. GitHub Actionsben a `changed` és `reasons` kimenetet is beállítja.

- Hiányzó, sérült vagy hiányos alapterv mindig teljes buildet jelent; a `--force` is mindig újraépít.
- A `build --sources plan.json` pontosan a tervezett commitokat tölti le, és nem old fel újra refet, így az ellenőrzött és az épített commit megegyezik akkor is, ha közben egy ág továbblépett.
- Az alapterv tárolása a gyűjtemény dolga: a terv fájlját csak sikeres telepítés után szabad eltenni.
