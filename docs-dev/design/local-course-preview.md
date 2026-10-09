# Task: Helyi kurzuselőnézet a /@dev oldalon

## Cél

Az oktató a publikált portálról, saját fejlesztői környezet és feltöltés nélkül tudja ellenőrizni a helyi kurzusmappáját. Az előnézet kizárólag a böngészőben működjön, és ugyanazt a tartalomfeldolgozást és megjelenítést használja, mint a publikált tananyag.

Ez szerzői előnézeti funkció, nem a portál fejlesztői buildmódja. A felületen „Helyi kurzuselőnézet” néven jelenjen meg.

## Függőségek és tulajdonos

A [workflow](workflow.md) sorrendje kötelező: metaadat-előfeltétel → [motor/példány szétválasztás](bookmd-engine.md) → közös pipeline → ez az előnézet → Git-források → automatizálás. A motor- és pipeline-terv koordinált kapui előzik meg az implementációt.

A `/@dev`, a renderer, a közös feldolgozó és a böngészős adapter a verziózott motor része. A példány csak saját konfigurációt, kurzusokat és üzemeltetést birtokol; nem másol preview alkalmazásforrást. A csomag route-/asset-/függőségintegrációját a motor task spike-ja dönti el. A [publikálási taskkal](automatic-publishing.md) közös a modell és a biztonsági szerződés, nem külön pipeline.

## Hatókör — első verzió

- Valódi, statikusan előállított `/@dev` route.
- Helyi könyvtár kiválasztása a File System Access API-val, desktop Chrome-ra célozva.
- Belépő Markdown-fájl kiválasztása.
- Kurzus feldolgozása a közös pipeline-nal.
- A meglévő kurzusmegjelenítés használata: navigációs fa, cikk, belső linkek, képek, headingnavigáció.
- Kézi újratöltés és másik mappa/belépőfájl választása.
- Látható diagnosztika a feldolgozási és hivatkozási hibákról.

Nem része: szerkesztés, fájlmentés, Git-műveletek, feltöltés, automatikus fájlfigyelés, tartós mappaengedély-kezelés, több kurzus aggregálása.

## Felhasználói folyamat

1. Az oktató megnyitja a `/@dev` oldalt.
2. A „Kurzusmappa megnyitása” gombbal könyvtárat választ.
3. A rendszer beolvassa a fájllistát, és belépőfájlt kér.
4. A `book.md`, `course.md`, `index.md`, `readme.md` fájlokat kis-/nagybetűtől függetlenül, ebben a preferencia-sorrendben kiemelt jelöltként mutatja; az egyértelműen legjobbat előválasztja. A teljes relatív útvonal is látszódjon, hogy az azonos nevű fájlok megkülönböztethetők legyenek.
5. Más Markdown-fájl is választható. Egyetlen kiemelt jelölt előválasztható, de a rendereléshez explicit megerősítés kell.
6. Megerősítés után a kurzus megjelenik a megszokott portálfelülettel.
7. Egy kompakt előnézeti sáv mutatja a mappa nevét és a belépőfájl relatív útvonalát, valamint az újratöltés és választásváltás műveleteit.

A kiválasztott könyvtár legyen a hozzáférési határ. A belépőfájl könyvtárát, a kurzus tartalomgyökerét és a relatív/wikilink feloldást a meglévő publikálási szerződéssel összhangban kell meghatározni; ezt a megvalósítás elején ellenőrizni és dokumentálni kell. A kiválasztott könyvtáron kívüli fájlokat nem olvashatjuk.

## Architektúra

### Közös tartalomfeldolgozó

Ne épüljön külön, egyszerűsített böngészős Markdown-renderer.

A meglévő feldolgozást szét kell választani:

- környezetfüggetlen tartalomfeldolgozás, linkfeloldás, kurzusmodell és diagnosztika;
- build adapter: fájlok olvasása a Node/Bun környezetből;
- böngészős adapter: fájlok olvasása a kiválasztott könyvtárból.

A konkrét interfészeket a jelenlegi pipeline célzott átnézése után kell kialakítani, nem előre feltételezett API-ra építve. A böngészős importgráf ne húzzon be Node/Bun fájlkezelést, szervermodulokat vagy a publikált teljes kurzusadatbázist.

Megőrzendő képességek a meglévő támogatásnak megfelelően:

- frontmatter és kurzusmetaadatok;
- kurzusfa és olvasási sorrend;
- wikilinkek és relatív Markdown-linkek;
- headingazonosítók és fragmentek;
- calloutok és összecsukható calloutok;
- kódkiemelés, matematika, Mermaid;
- képek, helyi mellékletek és támogatott beágyazások.

### Megjelenítés

A meglévő kurzuskompozíciókat használjuk újra. Ha a jelenlegi komponensek publikált URL-ekhez vagy szerveroldali adatokhoz kötöttek, a szükséges minimális határon válasszuk külön a navigációs célok képzését és az adatbetöltést. Ne legyen második, eltérően működő kurzusfelület.

A közös tartalomfeldolgozó a motor hordozható infrastruktúrája; annak alkalmazásán belül `$lib` lehet. A kizárólag előnézethez tartozó állapot, adapter és UI a leaf `/@dev` route mellett legyen, az `AGENTS.md` szerint. Csak tényleges újrahasználat esetén kerüljön kód a közös `(+lib)` alá.

## Böngésző és fájlhozzáférés

- A `showDirectoryPicker()` kizárólag felhasználói kattintásból induljon, olvasási jogosultsággal.
- HTTPS vagy localhost szükséges; capability detection alapján jelezzük a nem támogatott környezetet. Ne csak user-agent szövegből döntsünk.
- A választás megszakítása normális felhasználói művelet, ne hibaüzenet legyen.
- Jogosultságvesztés, nem olvasható vagy közben törölt fájl kapjon érthető hibajelzést és újraválasztási lehetőséget.
- Ne kérjünk írási jogosultságot, és ne módosítsunk fájlokat.
- A mappa teljes abszolút helyi útvonalának elérhetőségét ne feltételezzük; a handle nevét és relatív fájlútvonalakat használjuk.
- A bejárás hagyja ki a `.git`, `node_modules` és más, dokumentáltan nem tartalmi könyvtárakat. A nagy fájlok és mappák kezeléséhez legyen ésszerű erőforráskorlát és érthető visszajelzés.
- Mappa- vagy belépőfájl-váltáskor a korábbi aszinkron feldolgozás eredménye ne írhassa felül az új állapotot.

## Navigáció és helyi assetek

- Az előnézeti oldalváltás maradjon a `/@dev` route-on, például `/@dev#page=chapters/introduction.md` formátumban, biztonságosan kódolt útvonallal.
- A pontos hash-sémát a headingfragmentekkel együtt kell megtervezni: az oldal és a heading ne versenyezzen ugyanazért a fragmentért.
- A böngésző vissza/előre navigációja működjön.
- A route minden képzése vegye figyelembe a SvelteKit deployment base pathját.
- Belső kurzuslinkek ne navigáljanak át a publikált tananyagra; külső linkek maradjanak külsők.
- Képek és támogatott helyi mellékletek blob URL-eket kapjanak. A korábbi URL-eket mappaváltáskor, újratöltéskor és komponenslebontáskor fel kell szabadítani, de csak amikor már nincsenek használatban.
- Hiányzó vagy a hozzáférési határon kívülre mutató cél kapjon diagnosztikát.
- A címsor ne tartalmazzon fájltartalmat vagy mappaengedélyt. Oldalfrissítés után új mappaválasztásra lehet szükség; ezt jelezzük.

## Újratöltés és állapotok

- Az újratöltés ténylegesen újraolvassa a fájlokat és a könyvtárlistát, beleértve az új és törölt fájlokat.
- Meglévő oldal maradjon kiválasztva, ha továbbra is elérhető; eltűnt oldalnál térjünk a belépőfájlra és adjunk visszajelzést.
- Legyen elkülönített kezdeti, beolvasási, belépőválasztási, feldolgozási, kész és hibás állapot.
- Az újratöltés sikertelensége ne cserélje le észrevétlenül félkész adatokra a korábbi előnézetet. Jelöljük, ha a megjelenített tartalom az előző sikeres betöltésből származik.
- A diagnosztika mutassa az érintett relatív fájlt, a hiba okát és lehetőség szerint a hibás célhivatkozást.
- Fatális belépőfájl-/feldolgozási hiba blokkolja az új előnézetet; nem fatális linkhibáknál a tartalom megjelenhet figyelmeztetéssel.

## Biztonság és adatvédelem

- A helyi fájlok tartalma kizárólag a böngészőben maradjon: ne legyen upload, tartalomtelemetria vagy fájltartalommal küldött hibariport.
- A felületen jelezzük, hogy nincs feltöltés és fájlmódosítás, de külső beágyazások hálózati kéréseket indíthatnak.
- A helyi Markdown nem megbízható input. A generált HTML és URL-ek nem engedhetnek scriptfuttatást a portál originjén.
- A közös pipeline-ban definiáljuk és teszteljük a HTML-sanitization szerződését, az engedélyezett URL-protokollokat és beágyazásokat. A calloutok, kód, matematika és egyéb támogatott generált markup ne sérüljön.
- A támogatott iframe-ekhez legyen célzott engedélyezés; ne engedjünk tetszőleges aktív HTML-t csak a frontend-only működés miatt.
- Normalizált relatív útvonalakkal dolgozzunk, és tiltsuk a hozzáférési határból kilépő feloldást.

## UI és megvalósítási szabályok

- Követni kell az `AGENTS.md` fájlelrendezési, felelősségi és spacing szabályait.
- UI megvalósítás előtt el kell olvasni a telepített `@atom-forge/ui/README-AI.md` fájlt és a releváns kontroll-dokumentációt.
- A könyvtárnyitás, választás és diagnosztika dokumentált csomagképességeket használjon, ahol azok szerződése illeszkedik. A szükséges helyi implementáció csomagkorlátját indokolni kell.
- A hosszú fájlútvonalak tördelődjenek; a fájlválasztó billentyűzettel is használható legyen.
- Az előnézeti sáv ne törje el a meglévő sticky fejléc, breadcrumb és oldalsávok elhelyezését.
- Az újrahasználható előnézeti kompozíciót a projekt UI-dokumentációjában kell dokumentálni.

## Megvalósítási lépések

1. A motor/példány és közös pipeline kapuinak lezárása; a motorban lévő kurzusmodell, linkfeloldás és renderer böngészőkompatibilitásának ellenőrzése.
2. A már közös feldolgozómag és build adapter szerződésének átvétele, a publikált kimenet regressziós ellenőrzésével; nem újabb helyi szétválasztás.
3. Olvasási célú könyvtáradapter és belépőfájl-választás.
4. Előnézeti kurzusmodell, asset-életciklus és belső navigáció.
5. Meglévő kurzuskompozíciók bekötése, újratöltés és diagnosztika.
6. Biztonsági, paritás- és böngészős validáció, dokumentáció.

## Elfogadási feltételek

- [x] A publikált statikus portálon a `/@dev` közvetlenül megnyitható, base path alatt is (`BASE_PATH=/courses` build, scriptelt Chrome-futás: teljes folyamat és böngésző-újratöltés).
- [x] Támogatott Chrome-környezetben kattintással választható helyi mappa; megszakítás és nem támogatott böngésző megfelelően kezelt.
- [x] A belépőválasztó kiemeli a megadott neveket, és bármely Markdown-fájlt enged választani.
- [x] Egyazon fixture a build és a böngészős adapterrel egyenértékű kurzusfát, linkcélokat, headingeket és tartalmat ad, környezetspecifikus URL-eltérésektől eltekintve.
- [x] Menü, belső linkek, vissza/előre navigáció, headingnavigáció és helyi képek működnek.
- [x] Az egyetlen nyitott ágútvonal és a mobil navigáció meglévő működése megmarad (a szerző kézi tesztje: mobil és világos téma).
- [x] Újratöltéskor az új, módosított és törölt fájlok változásai is érvényesülnek.
- [x] Hiányzó fájlok és hibás linkek látható, fájlhoz köthető diagnosztikát adnak.
- [ ] Gyors mappaváltásnál vagy újratöltésnél nincs elavult eredményfelülírás vagy blob URL-szivárgás.
- [x] Nincs fájlírás, tartalomfeltöltés vagy helyi tartalmat továbbító telemetria.
- [x] Nem megbízható Markdown/HTML nem futtathat scriptet és nem léphet ki a fájlhozzáférési határból.
- [x] A meglévő publikálási pipeline és a normál portáloldalak működése megmarad.

## Validáció

- Célzott tesztek a belépőjelöltek felismerésére, útvonalnormalizálásra, link/assetfeloldásra és biztonsági határokra.
- Közös fixture-ökön build–böngésző paritástesztek, köztük nested callout, kód, matematika, Mermaid és fragmentes link.
- HTML/URL biztonsági regressziós tesztek.
- Aszinkron állapotváltás és asset-felszabadítás célzott tesztjei, ahol automatizálható.
- Teljes projekt-tesztek, típusellenőrzés és statikus build.
- Manuális desktop Chrome-teszt HTTPS/localhost alatt: valódi mappaválasztás, megszakítás, jogosultságvesztés, újratöltés és böngészőhistory.
- Világos/sötét téma, hosszú útvonalak és szűk viewport vizuális ellenőrzése.
- Network panel ellenőrzés: a helyi tananyag nem kerül továbbításra; az esetleges külső beágyazáskérések külön azonosíthatók.

## Megvalósítási jegyzetek (a korábbi README-ből)

A következő szakasz a motor README-jéből került ide.

### Local preview (`/@dev`)

A statically prerendered `/@dev` route lets an author open a local folder with `showDirectoryPicker({ mode: 'read' })` (desktop Chrome/Edge, HTTPS or localhost). Files are read in the browser only; nothing is uploaded or written.

- The shared core processes the folder, mounted under the virtual `/course` beside a generated catalog, so a `course.md` in the folder root is a valid entry. Candidates named `book.md`, `course.md`, `index.md`, `readme.md` are highlighted and listed in that order of preference (then shallower paths first); the uniquely best one is preselected, but confirming a choice is always required.
- Hidden directories and `node_modules` are skipped; at most 20000 files are listed and Markdown files over 5 MB are rejected.
- `processContent` accepts `link` (custom page URLs) and `diagnostics` options. With `diagnostics`, broken local links/assets are collected instead of failing; builds still fail. Link schemes other than http, https, mailto and tel are rendered as text (also in builds).
- Pages use `#page=<slug>[&heading=<id>]`. In-page `#fragment` clicks are rewritten to keep the page in the hash.
- Assets become blob URLs, revoked after a reload replaced them or when the route is left. SVG is allowed only as an image, never as a link; HTML and other active documents are not exposed.
- A browser reload restores the preview: the folder handle and entry path (never contents) are kept in IndexedDB, and the page hash restores the position. If Chrome no longer grants read access, a "Continue with this folder" button asks again (it needs a click); otherwise the folder is reopened automatically.
- A failed reload keeps the previous successful preview, marked as such.

Validated: check, 57 tests (entry candidates, hash scheme, source/core integration, diagnostics, scheme and containment rules), static build, and a scripted desktop Chrome session against an OPFS directory handle (entry choice, navigation, back, heading scroll, blob images, callout/math/Mermaid, reload with changes, failed reload, no external requests). Not yet exercised: the native folder dialog, a non-empty base path, narrow viewports and a build/browser parity test.

