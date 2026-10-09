# Task: Verziózott BookMD-motor és vékony példány szétválasztása

## Cél és prioritás

A BookMD alkalmazásmotor telepíthető, verziózott csomag legyen; a jelenlegi `portal` az első fogyasztó példány, nem eldobandó prototípus. Egy második, minimális példány ugyanazzal a csomaggal indíthasson fejlesztői szervert és készíthessen statikus oldalt az alkalmazás forrásának másolása nélkül.

A helyi motor/példány szétválasztás első működő implementációja elkészült: a repó gyökere, privát `@atom-forge/bookmd@0.1.0`, workspace-fogyasztó portal és tarballból telepített második példány. Részletes döntések, CLI-szerződés, ellenőrzések és korlátok: [motor README](../../README.md). A közös feldolgozómag és az új tartalomszerződés is elkészült: környezetfüggetlen `@atom-forge/bookmd/core`, build-adapter, közös típusalapú számozás. A meglévő szerepek megfeleltek, fájlátnevezés nem kellett. 49 teszt, portal check/build és friss tarballból telepített külön fogyasztó check/build sikeres. Jóváhagyott további sorrend: helyi előnézet → Git-források → automatizálás. A motor és a közös feldolgozás tervezése összehangolt, de implementációjuk külön kapun halad át.

Kapcsolatok:

- [Sorrend és szakaszhatárok](workflow.md)
- [Helyi kurzuselőnézet](local-course-preview.md)
- [Git-források és publikálás](automatic-publishing.md)
- [Projekt szabályai](../../AGENTS.md)

## Hatókör és tulajdonosi határok

| Terület | Motor: verziózott csomag | Példány: fogyasztó repo |
|---|---|---|
| Alkalmazás | SvelteKit alkalmazás, route-ok, elrendezés, kurzusrenderer, navigáció és alkalmazásassetek | Nem másolja és nem forkja az alkalmazásforrást |
| Generálás | Tartalomfeldolgozás, modell, validáció, link-/assetfeloldás, statikus generálás és diagnosztika | Konfigurációval kijelöli a saját bemenetet és kimenetet |
| Szerzői előnézet | A `/@dev` route és később annak böngészős adaptere/UI-ja | A route-ot a motorral együtt kapja, nem saját implementáció |
| Tartalom | Egységes helyi/Git/böngészős feldolgozási szerződés | Kurzusregiszter, helyi Markdown és helyi tartalomassetek |
| Konfiguráció | Verziózott, dokumentált konfigurációs szerződés és validátor | Saját portáladatok, kurzusok, tartalomgyökér, base path és hostingbeállítások |
| Függőségek | Dokumentált runtime/build függőségek és kompatibilitási tartományok | Csomagverzió, lockfile, reprodukálható telepítés |
| Üzemeltetés | Dokumentált build/CLI-határ és diagnosztika | Build/deploy workflow, hosting/environment, ütemezés, titkok és jogosultságok |

A későbbi Git-adapter újrahasználható kódja a motoré; a kurzuslista, a machine user hozzáférése, az SSH-kulcs, a sikeres deploy baseline-artifactja és a deploy döntése a példányé. A CLI buildet készít, nem implicit módon publikál. Titok nem része a konfigurációs fájlnak vagy a böngészős konfigurációnak.

Egy motorcsomag és vékony fogyasztó a cél. Nincs plugin-ökoszisztéma, általános bővítmény-API, többcsomagos felbontás, tetszőleges alkalmazásroute-felülírás vagy szerzői repo-template. A szükséges minimális buildintegráció nem jogosít fel helyi renderer vagy párhuzamos pipeline létrehozására.

## Koordinált tervezési kapuk

### A kapu: motor/példány és feldolgozási határ

A meglévő kód célzott leltára alapján közösen tervezzük meg a motor határát és a [közös feldolgozás](workflow.md#2-közös-tartalomfeldolgozási-alap) szerződését:

- Konfiguráció, kurzusmodell, metaadatok, stabil ID, tartalomgyökér, útvonalak, linkek, assetek és diagnosztika tulajdonosa.
- Generált adatok és alkalmazásassetek elválasztása a példány tartalomassetjeitől.
- Build/Node/Bun és böngészős importgráf határa; nincs fájlrendszer, Git-hitelesítés vagy teljes publikált adatbázis a preview böngészős bundle-jében.
- Meglévő URL-ek, base path, prerender és navigáció megőrzése; a metaadat-előfeltétel már rögzített szerződésének átvétele.
- Előnézet és publikálás közös biztonsági/paritás fixture-jeinek terve.

**Kapufeltétel:** írásban rögzített felelősségek és minimális interfészek, a közös feldolgozási tervvel ellentmondás nélkül. Nem kell ekkor már böngészős adaptert vagy Git-importot implementálni.

### B kapu: SvelteKit csomagolási spike és tényleges CLI-terv

A helyi spike megvalósult a telepített SvelteKit/Vite/adapter verziókkal: a CLI a csomag alkalmazását példányonkénti `.bookmd/` munkatérből futtatja. A tarballból önállóan telepített második példány `/second/demo/` dev-kérése HTTP 200, checkje és statikus buildje sikeres. A route-okat a munkatér SvelteKitje deríti fel; nincs automatikus npm-route-import. A config hot reload nem készült el, újraindítás szükséges. [Konkrét szerződés és további korlátok](../../README.md).

Összehasonlítandó minimális megoldások: a csomag alkalmazását futtató CLI, amely explicit példánykonfigurációt és bemenetet kap; vagy minimális fogyasztói bootstrap dokumentált csomagintegrációval. Ha generált munkakönyvtár szükséges, az újraépíthető, gitignore-olt motor-kimenet legyen, ne kézzel karbantartott alkalmazásmásolat. A választás bizonyítékát és korlátait rögzíteni kell.

A spike vizsgálja:

- Route-/layout-/load-modulok felderítése csomagból, generált SvelteKit route-típusok, SSR és prerender entry-k; nincs feltételezett automatikus route-import.
- `$lib` és egyéb aliasok, konfiguráció és generált kurzusadatok feloldása a csomag és a példány eltérő gyökeréből, munkakönyvtártól függetlenül.
- SvelteKit app template, statikus fájlok, CSS/Tailwind forrásfelderítés, fontok, képek és dinamikus rendererfüggőségek csomagolása; base path alatti URL-ek és ütközések.
- Svelte/SvelteKit/Vite/UI függőségek: mit szállít a csomag, mi peer dependency; verziókompatibilitás és duplikált runtime kizárása.
- ESM/package exports, CLI bin és transzpiláció; publikált tarball tartalmaz-e minden szükséges fájlt, és nincs-e checkout/symlink/workspace-specifikus feloldás.
- Írási helyek: konfiguráció és tartalom csak olvasott; generált input, cache, SvelteKit temp és statikus output a példány explicit munkaterében. Nem írunk a telepített csomagba.
- Fejlesztői újratöltés helyi tartalom- és configváltozásra; statikus build tiszta telepítésből, szerver nélküli kimenet és közvetlen route-megnyitás.

A CLI nem előre létezőnek tekintett API. A tervnek meg kell határoznia a bin nevét, támogatott parancsokat, konfigurációkeresést vagy explicit config argumentumot, relatív utak bázisát, validációs sorrendet, output/work könyvtárakat, hibakódokat, runtime-követelményeket és a példány scripts/workflow integrációját. Válasszon a támogatott futtatók közül a jelenlegi lockfile/runtime vizsgálatával; ne feltételezzen tetszőleges Bun/Node kompatibilitást.

Megvalósított helyi CLI-parancsok (a további `content`, `check`, `preview` parancsokat a motor README írja le):

```text
bookmd dev --config ./portal.config.ts
bookmd build --config ./portal.config.ts
```

A `dev` alkalmazásfejlesztői szerver, nem a szerzői `/@dev` funkció. A `build` validált statikus kimenetet készít; a Git-szinkronizálás későbbi CLI-beillesztéséről a publikálási taskkal közösen kell dönteni, nem új példányonkénti scriptet előírni.

**Kapufeltétel:** dokumentált választás, futtatható spike bizonyítéka a második minimális fogyasztó dev/statikus buildjére csomagolt tarballból, valamint konkrét CLI- és függőségszerződés. A spike nem jelent teljes migrációt; e dokumentum frissítése önmagában nem végzi el a spike-ot.

## Terjesztési és titokkezelési döntés

A motor verziózott registry-csomag lesz; a registry és a csomag publikus/privát láthatósága nyitott, explicit döntés a kiadás előtt. A jelenlegi privát repo nem dönti el a csomag vagy a publikált oldal láthatóságát.

- Publikus registry-csomag: fogyasztói telepítéshez ne kelljen titok; a publikálási hitelesítés csak a motor kiadási környezetében legyen. Közzététel előtt kód-, licenc- és fájllistaellenőrzés szükséges.
- Privát registry-csomag: dokumentált registry URL, hozzáférés és költség/policy; lokális fejlesztő és példány-CI telepítéséhez minimális read jogosultságú registry-hitelesítés. Token csak secret vagy helyi biztonságos credential, nem verziókezelt `.npmrc`-érték vagy config.
- A registry read/publish jogosultság külön a forrásrepók machine-user SSH-kulcsától és a deploy hitelesítésétől. A példány ne kapjon csomagpublikálási jogot.
- Package tarball, log, cache, artifact és statikus output nem tartalmazhat titkot, privát kurzust vagy példányspecifikus regisztert. Telepítési hitelesítés ne maradjon elérhető külső tartalom feldolgozásakor.

A helyi név `@atom-forge/bookmd`, verzió `0.1.0`, publikálásvédelme `private: true`; nincs registryválasztás vagy kiadás. A támogatott runtime, konfiguráció, upgrade/rollback és lockfile-kezelés a motor README-ben rögzített; a registry és láthatóság a tényleges kiadás előtt döntendő el. A motorfrissítés legyen explicit példányváltozás, ne észrevétlen „latest” letöltés. A későbbi publikálási fingerprint és provenance tartalmazza a tényleges motorverziót/lockfile-azonosságot.

## Migrációs sorrend

1. **Elkészült alap:** metaadatmodell, aggregálás és megjelenítés; nem új migrációs előfeltétel.
2. A és B tervezési kapu, a közös feldolgozási tervvel koordinálva; registrydöntés a kiadás előtt.
3. Alkalmazás, renderer és meglévő generálás áthelyezése a motorba a jóváhagyott csomaghatáron, működésváltoztatás nélkül.
4. `portal` átállítása első fogyasztóvá: saját config, regiszter, helyi tartalom, lockfile és build/deploy megmarad; csak a motor implementációját nem tartja saját másolatként.
5. Második minimális példány validálása valódi csomagolt telepítéssel; a példányok izolációjának ellenőrzése.
6. Motor-migrációs kapu után a közös pipeline implementálása, majd `/@dev`, Git-források és automatizálás a workflow szerint.

A `/@dev` a motor felelőssége, de funkciójának elkészítése a későbbi preview taské. A szétválasztás nem hoz előre preview-, Git- vagy ütemezési implementációt. Meglévő route/képesség nem veszhet el; új preview route a saját szakaszában készül el.

## Elfogadási feltételek

- [x] A motorcsomag tulajdonolja az alkalmazást, renderert és generálást; a `/@dev` tulajdonosa és későbbi integrációja egyértelmű.
- [ ] A két koordinált tervezési kapu döntése és spike-eredménye dokumentált; nincs feltételezett SvelteKit route- vagy CLI API.
- [ ] A `portal` az első fogyasztó, jelenlegi tartalma, URL-jei, metaadatai, navigációja, megjelenítése és statikus deploy-viselkedése regresszió nélkül megmarad.
- [x] Második minimális példány config + kurzusregiszter/helyi tartalom + package manifest/lockfile alapján dev és statikus build módban működik, kézzel karbantartott alkalmazásforrás nélkül; a CLI újraépíthető munkamásolatot készít.
- [x] A második példány tiszta, csomagolt telepítésből is működik; nincs motor-repo checkout- vagy közös workspace-függés. A saját telepített függőségeire mutató generált munkatéri linkek szükségesek.
- [ ] Root és nem üres base path, közvetlen kurzusroute, navigáció, CSS/font/kép/rendererasset és prerender ellenőrizve.
- [ ] A két példány konfigurációja, tartalma, munkakönyvtára és outputja nem szivárog egymásba; nincs írás a csomagba vagy a verziókezelt tartalomba.
- [ ] Registry/láthatóság, kompatibilitás, verziózás, telepítési/publikálási titkok és upgrade/rollback dokumentáltak.
- [ ] A közös pipeline, preview és publikálás függőségei frissítve; nincs párhuzamos helyi motor vagy feldolgozó.

## Validációs terv

- Csomagolt tarball fájllista, exports/bin és dependency/peer dependency ellenőrzése, majd tiszta fogyasztói install rögzített lockfile-lal.
- Mindkét példány célzott tesztjei, típusellenőrzése és statikus buildje; a motor saját tesztjei külön is futnak.
- Kimenet- és URL-regresszió a portal korábbi sikeres buildjéhez; böngészős navigáció és vizuális ellenőrzés.
- Második példány dev újratöltésének és statikus outputjának ellenőrzése, base path alatt is.
- Hiányzó/hibás config, nem kompatibilis függőség, írási hiba és assetfeloldási hiba konkrét diagnosztikája.
- Titok- és példányadat-szivárgás ellenőrzése tarballban, bundle-ben, logban és outputban; a későbbi `/@dev` build–böngésző paritását saját taskja validálja.

## Megvalósítási jegyzetek (a korábbi README-ből)

Az alábbi szakaszok a motor README-jéből kerültek ide; a README már csak áttekintés. Angol nyelvűek maradtak.

### SvelteKit integration and write boundary

The CLI stages package app sources into `<instance>/.bookmd/`, a disposable, ignored work directory. This is a generated execution copy, not a second maintained app or instance fork. SvelteKit discovers actual route/layout/load files there and generates its normal `$types`, SSR and prerender output. `$lib`, relative model imports and Tailwind source scanning retain the original app layout.

Each engine dependency is resolved from the installed engine and linked into the work directory. These are generated dependency links, not links to the engine checkout; the same procedure works with a tarball installation and Bun's isolated dependency layout. UI and lucide-svelte are explicitly bundled for SSR because their published Svelte sources cannot be executed as ordinary Node external modules.

Generated JSON, content assets, `.nojekyll`, `.svelte-kit`, and caches live in `.bookmd/`. The static adapter writes to `<instance>/build/`, and the CLI copies the prerendered 404 catalog to `build/404.html` for Pages. Neither installed package files nor source content are written. Work/output locations are currently fixed; concurrent commands for the same instance are unsupported. The root `static/` directory is not an extension point: currently the app has no static engine assets beyond generated content and `.nojekyll`; fonts/renderer assets come from dependencies.

`dev` watches the configured content root, regenerates content, and requests full browser reloads. Restart `dev` after config or engine source changes. `preview` serves the existing build (and currently prepares the generated work app first). The generator remains filesystem-based; separating a browser-safe core is the next workflow stage, not claimed complete here.

### Developing the engine

```sh
bun install
bun run verify   # tests, type check and a static build of examples/minimal
```

### Validation recorded for the engine extraction

- Portal: `bookmd check` — zero errors/warnings; 46 tests / 213 assertions passed; static build generated 393 pages across 6 courses and Pages `404.html`.
- Independently installed local tarball: own manifest, lockfile and dependencies; config/content only, no maintained app source; check passed; `/second` static build passed with one demo course.
- Tarball dev server: bounded localhost request to `/second/demo/` returned HTTP 200 with the expected SSR title. Changing the local Markdown title was reflected by subsequent HTTP requests; the fixture was restored and the server stopped. Browser/WebSocket reload was not directly exercised.
- Second static output: direct course HTML, `404.html`, `.nojekyll`, two CSS files and 19 WOFF2 font files present; installed `bookmd` bin also executed successfully.
- Root portal and `/second` use separate content, generated work and build output. Package source does not receive generated data.

No browser-driven visual/navigation regression comparison has been performed. Config hot reload, empty catalogs and Windows dependency-link behavior are not validated/supported by this initial local package. Registry release, preview, Git import and automation remain outside this implementation.

### Shared content contract

`@atom-forge/bookmd/core` exports `processContent`, `ContentSource` and the shared
`ContentGraph`/page/navigation types. The core parses Markdown/frontmatter,
composes sources, resolves references through the adapter, renders HTML, validates
hierarchy and computes navigation and numbering. It imports no filesystem,
Node path/crypto modules or environment variables.

```ts
import { processContent, type ContentSource } from '@atom-forge/bookmd/core';
const graph = await processContent(source, 'books.md', { base: '/preview' });
```

A `ContentSource` resolves absolute slash-separated virtual paths within `/`,
reads their text, and supplies asset URLs. `resolve` must return a canonical
identifier, verify existence and reject storage escapes; missing paths use an
error with `code: 'ENOENT'` for the optional Obsidian vault-root fallback
(`rootName`). The core rejects lexical traversal above `/`. Asset storage and URL
lifetimes belong to the adapter. The build adapter keeps realpath/symlink
containment, asset hashing/copying and generated JSON in `scripts/content.ts`.

- `type: chapter`: numbered container; descendants inherit its number prefix.
- `type: content`: numbered material within the nearest chapter context.
- Any other or missing type: unnumbered auxiliary material; consumes no number.
- Declared `children` order determines traversal and numbering, including through
  unnumbered wrappers. Each course starts its own numbering; nested chapters
  extend the prefix. Root-level content uses a course-level number.
- Filenames have no numbering requirement. Frontmatter `chapter` is ignored;
  computed `page.chapter` is also copied to navigation for menus and breadcrumbs.
- Pages outside the course's declared tree remain unnumbered. `sources` compose
  a page and do not independently create numbered pages.
- The export manifest includes only numbered `content` pages and their computed
  number arrays; an exporter must consume these rather than count again.

Existing six courses already have explicit chapter/content/resource roles on
all 390 material files; course entries and the catalog retain their separate
registry semantics. No filename or URL migration was necessary.

Validation for the shared-core step: 49 tests / 250 assertions passed, including
build-adapter/core model parity across existing success fixtures. Browser-target
bundling succeeded without Node imports. Portal check: zero errors/warnings;
static build: 393 pages / 6 courses, 346 numbered pages and 286 content export
entries. Every navigation number matches its page. A newly packed tarball was
reinstalled in the independent consumer: public core import, check and `/second`
static build all succeeded. Browser preview behavior is reserved for the next
stage; no registry publication was performed.

