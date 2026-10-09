# Könyv beemelése másik GitHub-repóból

A gyűjteményedbe nemcsak saját mappából vehetsz fel könyvet: egy másik GitHub-repó könyvét is beemelheted, ha a szerzője a saját repójában tartja. A szerzőnek nincs dolga: nem kell workflow-t, tokent vagy BookMD-t telepítenie, elég a Markdown fájlokat a repóban tartania. A letöltés és a build a te gyűjteményed workflow-jában történik.

Az útmutató a [könyvgyűjtemény feltöltését](deploy-a-book.md) feltételezi, vagyis már van működő gyűjteményed (például a sablonrepóból).

## 1. A szerző teendője: a belépőfájl

A beemelt könyv nyitóoldala a repóban egy Markdown fájl (például `book.md`), amelynek **a mappája a könyv tartalomgyökere**. Ebben a fájlban kötelező egy `id`, a könyv címe lesz a gyűjteményedben:

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

- Az `id` csak kisbetűt, számot és kötőjelet tartalmazhat (nem kezdődhet vagy végződhet kötőjellel, nem lehet két egymás utáni kötőjel), legfeljebb 64 karakter lehet.
- Nem foglalt az `_app`, `404`, `@dev`, `content-assets`, `assets`, `static` és `favicon.ico`.
- Az `id` nem ütközhet más beemelt könyv `id`-jával, sem a `content/` mappa valamelyik fájljának vagy mappájának nevével.
- A többi metaadat (`name`, `language`, `author`, `tags`, `children`) ugyanaz, mint a helyi könyveknél, lásd a [szerzői útmutatót](authoring.md).
- A könyv fájljai csak a **saját mappájukra** hivatkozhatnak. Másik könyvre, a te `content/` mappádra vagy a repó többi részére mutató hivatkozás nem működik.

## 2. A te teendőd: egy sor a `books.md`-ben

A `content/books.md` `courses` listájába a helyi `[[…]]` hivatkozások mellé egy sort veszel fel ebben a formában:

```text
<ref>@github.com/<tulajdonos>/<repó>/<útvonal-a-belépőfájlhoz.md>
```

```md
---
courses:
  - "[[my-first-book/book.md]]"
  - "main@github.com/kollega/web-notes/book.md"
  - "v2.1@github.com/mas-kollega/algorithms/materials/book.md"
---
```

- A **ref kötelező**: ágnév (`main`), címke (`v2.1`) vagy teljes commit SHA. Nincs alapértelmezett ág. Ha egy név ág is, címke is, a build hibát jelez, ilyenkor használj SHA-t.
- A host egyelőre csak `github.com`.
- A belépőfájl útvonala a repó gyökeréhez képest értendő, és `.md`-re kell végződnie.
- Az idézőjel kötelező.

Commitold és told fel. A következő futásnál a workflow letölti a könyvet, és a gyűjteményedben az `id` néven jelenik meg (például `/web-programming/`).

## Hogyan frissül a beemelt könyv?

A build minden futáskor egy konkrét commitot tölt le, a ref feloldása után. Ezért:

- **Rögzített verzió**: ha SHA-t vagy címkét adsz meg, a könyv addig nem változik, amíg te át nem írod a sort.
- **Követett ág**: ha `main`-t adsz meg, az oldal a könyv legfrissebb állapotát mutatja, **de csak akkor frissül, ha lefut a workflow-d**. A szerző pusholása a te workflow-dat nem indítja el.

Az ág automatikus követéséhez időzítsd a workflow-t. Az `on:` blokkba, a `push` mellé vedd fel:

```yaml
on:
  push:
    branches: [main]
  schedule:
    - cron: '17 4 * * *'   # naponta egyszer
  workflow_dispatch:
```

Kézzel is indíthatod az **Actions → Deploy book → Run workflow** gombbal.

## Privát repó

Privát repóból csak akkor tud olvasni a build, ha az üzemeltető egy olvasási jogú GitHub App-ot hozott létre, és a szerző telepítette azt a repójára. A hozzáférés repónként, csak olvasásra szól.

- **Szerző:** telepíti az App-ot a saját fiókjára (vagy szervezetére), és kiválasztja a könyv repóját („Only select repositories”, Contents: read). Token, titkos kulcs vagy workflow nem kell nála. A telepítés visszavonása a további olvasást szünteti meg, a már publikált oldalt nem veszi vissza.
- **Jóváhagyás:** a privát repó **nem teszi privátá a kész oldalt**. Ezért a belépőfájlban ki kell mondani a jóváhagyást: `publish: true`. Enélkül a build hibával megáll.
- **Üzemeltető:** létrehozza az App-ot (Contents: read-only, Metadata: read-only), és a gyűjtemény futtatási környezetében (vagy Actions secretjeként) megadja a `BOOKMD_APP_ID` és `BOOKMD_APP_PRIVATE_KEY` (PEM) értéket. A telepítések listája (`GET /app/installations`) a hozzáférési nyilvántartás. Több kulcs is lehet az App-hoz, így a kulcs forgatható kiesés nélkül.
- **Működés:** a motor minden forrást először hitelesítés nélkül próbál letölteni, így a nyilvános forrásnak sosem kell kulcs. Csak ha ez nem sikerül, akkor írja alá egy rövid életű App-tokent, kikeresi a repó telepítését, és egyrepós, csak olvasási tokent kér. A token környezeten át jut a Gitnek, nem argumentumban vagy URL-ben, és sehová nem íródik ki. A hibaüzenet megmondja, hogy az App nincs telepítve (vagy a repó nem létezik), a hitelesítő adatot elutasították, vagy nincs beállítva hitelesítő adat.
- **CI:** a titkos adatot csak a `plan` és `sources` lépés kapja; a `check` és a `build` nélküle fut, a letöltött, rögzített commitokból. Nyilvános repóban ne add meg a titkot, mert a naplók és az artifactok elárulnák a privát repók nevét.

## Gyakori hibák

- **„course id … is already used” / ütközés helyi tartalommal**: az `id` ismétlődik, vagy egy `content/` alatti mappa ugyanezt a nevet viseli. Nevezd át az egyiket.
- **Hiányzó vagy érvénytelen `id`**: a belépőfájl frontmatterében nincs `id`, vagy nem a fenti szabályok szerinti.
- **Ismeretlen ref**: elírt ág- vagy címkenév; ellenőrizd, hogy létezik a repóban.
- **A repó nem olvasható**: elírt tulajdonos vagy repónév, vagy a repó privát, és nincs telepítve az App.
- **A könyv egyik hivatkozása nem működik**: a hivatkozott fájl a könyv mappáján kívül van; a beemelt könyv zárt, csak a saját mappájára hivatkozhat.
