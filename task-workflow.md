# Task workflow: Szerzői előnézet és automatikus publikálás

## Cél

Az oktató helyben ellenőrzi a kurzusát, saját GitHub-repójába pusholja, majd a BookMD központi automatizmusa feldolgozza és publikálja a változást.

## Kapcsolódó taskok

- [Verziózott BookMD-motor és vékony példány](task-bookmd-engine.md)
- [Helyi kurzuselőnézet — /@dev](task-local-course-preview.md)
- [Git-forrású kurzusok automatikus publikálása](task-automatic-publishing.md)
- [Projekt megvalósítási szabályai](AGENTS.md)

## Végrehajtási sorrend

### Elkészült alap: kurzusmetaadatok

- Saját kurzusok: `author` az `instructor` helyett; a kurzus `year` mezője megszűnik (a prózában szereplő évszámok maradnak).
- A parser a régi mezőket elutasítja; a modell külön `tags` és `contentTags` listát ad.
- Minden kurzushoz tartozó generált oldal címkéinek normalizált, saját címkékkel is deduplikált aggregálása a feldolgozó feladata, nem a UI-é.
- Katalógus: egyetlen Chip-sor, nyelv → szerző → saját címkék → összesített címkék; keresés és hozzáférhető kibontás. A kurzusoldalon a nyelv és szerző a fejlécben jelenik meg, a bodyban nem ismétlődik. [Működő kompozíció](docs/ui/catalog-card.md#egyetlen-metaadat-címkesor).
- Nincs Tag API vagy függőségfrissítés; a telepített Chip dokumentált class propját használjuk.

**Állapot: implementálva és automatizált ellenőrzésekkel validálva.** Nem új fejlesztési előfeltétel; a motor és a közös mag a meglévő szerződést megőrzi.

### 1. Motor/példány szétválasztás

Specifikáció: [BookMD-motor task](task-bookmd-engine.md).

- A verziózott motor tulajdona az alkalmazás, renderer, generálás és a későbbi `/@dev`; a vékony példány tulajdona a config, kurzusregiszter, helyi tartalom, lockfile, build/deploy és titkok.
- A motorhatár és a következő szakasz feldolgozási szerződésének tervezése közös A kapu. A SvelteKit route-/asset-/függőségfeloldási spike és a tényleges CLI-terv a B kapu; egyik sem feltételezett package API.
- A csomag terjesztésének registry/láthatóság- és hitelesítési döntése a kiadás előfeltétele.
- A jelenlegi portal az első fogyasztó, működése és URL-jei megmaradnak.

**Továbbhaladási feltétel:** a [motor task elfogadási feltételei](task-bookmd-engine.md#elfogadási-feltételek) teljesülnek; második minimális példány dev és statikus build módban működik alkalmazásforrás másolása nélkül. Nem hozzuk előre a preview/Git/automation implementációt.

### 2. Közös tartalomfeldolgozási alap

Kapcsolódó specifikációk:

- [Előnézet: architektúra](task-local-course-preview.md#architektúra)
- [Publikálás: kapcsolat a helyi előnézettel](task-automatic-publishing.md#kapcsolat-a-helyi-előnézettel)
- [Publikálás: stabil kurzusazonosító](task-automatic-publishing.md#stabil-kurzusazonosító)

Elkészült: környezetfüggetlen feldolgozás és megőrzött build-adapter, virtuális tartalomgyökér és útvonal-/asset-szerződés, meglévő HTML-/URL-kezelés és diagnosztika. A konkrét API és tartalomszerződés a [motor README-ben](packages/bookmd/README.md#shared-content-contract) szerepel. A 390 meglévő tananyagfájl chapter/content/resource szerepei már megfeleltek; fájlátnevezés nem történt.

**Továbbhaladási feltétel:** a jelenlegi kurzusok és URL-ek regresszió nélkül működnek; a közös mag nem függ Node/Bun fájlkezeléstől. Tesztek, típusellenőrzés és build sikeresek.

A motor- és feldolgozási terv az első két szakasz koordinált tervezési kapuin halad át; a pipeline implementációja csak a motor/példány migráció kapuja után indul. A közös mag és adapterkód a motor tulajdona, nem példányonkénti implementáció. A preview és publikálási task közös munkája: ne készüljön két feldolgozó.

### Párhuzamos előfeltétel: hosting ellenőrzése

Már az első szakasz alatt ellenőrizzük a privát `atom-forge/bookmd` repo hostingfeltételeit:

- [Hosting előfeltétel](task-automatic-publishing.md#hosting-előfeltétel)

Tisztázandó a Pages elérhetősége, a publikált oldal láthatósága, a base path, az environment jogosultságai és az Actions-keret. Ha a kívánt Pages-felállás nem támogatott, még a deploy implementálása előtt hostingdöntés szükséges.

### 3. Helyi kurzuselőnézet

Specifikáció: [Helyi kurzuselőnézet task](task-local-course-preview.md).

Feladatok:

- Statikus `/@dev` route és olvasási célú böngészős mappaadapter.
- Belépőfájl-választás kiemelt jelöltekkel.
- A közös feldolgozó és meglévő kurzusfelület bekötése.
- Belső navigáció, helyi assetek, kézi újratöltés és diagnosztika.
- Build–böngésző paritás és valódi Chrome-használat ellenőrzése.

**Továbbhaladási feltétel:** az előnézeti task [elfogadási feltételei](task-local-course-preview.md#elfogadási-feltételek) teljesülnek, a [validáció](task-local-course-preview.md#validáció) megtörtént. A helyi fájlokat nem töltjük fel és nem módosítjuk.

### Privát forrásrepók hozzáférése: központi machine user

A választott hozzáférési modell egy külön GitHub-fiók a generátornak. A `bookmd-reader` egyelőre javasolt név; a fiók létrehozása és tényleges nevének rögzítése külön üzemeltetési feladat.

**A tartalomfejlesztő teendője:**

> Add hozzá a generátor megadott GitHub-felhasználóját kollaborátorként a tananyagrepódhoz. Szervezeti repóban Read jogosultságot adj neki.

Nem kell saját tokent generálnia, Actions secretet beállítania vagy workflow-t készítenie. A kurzusregiszter hivatkozása változatlan: `main@github.com/owner/repo/path/course.md`.

**Központi üzemeltetési feladatok:**

- A botfiók létrehozása, 2FA-ja, helyreállítási adatainak védelme és felelősének kijelölése.
- Repo-meghívások elfogadása; a meghívás önmagában még nem aktív hozzáférés.
- A bot SSH-kulcsának kezelése: a privát kulcs kizárólag a központi BookMD Actions secretje legyen, nem adjuk ki a kollégáknak.
- A forrásadapter a publikus regisztercím alapján képezzen ellenőrzött SSH repo-címet a hitelesített Git-műveletekhez; a ref feloldását és a letöltést is ugyanazzal a hozzáféréssel végezze. A portál saját `GITHUB_TOKEN`-ja nem ad általános hozzáférést más privát repókhoz.
- Ellenőrzött GitHub SSH hostkulcs-kezelés; ne tiltsuk le a hostellenőrzést.
- A kulcs csak a forrásolvasási lépésekben legyen elérhető, ne kerüljön logba, cache-be, artifactba vagy build outputba. Külső tartalom nem futtathat kódot a kulccsal rendelkező környezetben.
- Kulcsrotáció, hozzáférési nyilvántartás, szervezeti SSO/policy és esetleges fizetős seat ellenőrzése.

**Korlátok és publikálási jóváhagyás:**

- Személyes privát repóban a collaborator írási jogosultságot is kap; a generátor kizárólag olvasási műveleteket végez, de ez nem technikai read-only jogosultságkorlát. Szigorú read-only igény esetén GitHub App vagy repónkénti read-only deploy key szükséges.
- A bot account SSH-kulcsa a fiók hozzáféréseit örökli; kompromittálása minden számára elérhető repót érinthet.
- A tulajdonos a collaborator eltávolításával visszavonhatja a jövőbeni hozzáférést. Ez a korábban publikált tartalmat nem törli automatikusan; eltávolítása külön regiszter-/publikálási művelet.
- A privát forrás nem teszi priváttá a generált oldalt. A kijelölt tananyag publikálását a szerzőnek külön, egyértelműen jóvá kell hagynia.

A modell a Git-import szakasz része; a [publikálási task](task-automatic-publishing.md) hatóköre publikus és a machine userrel megosztott privát forrásokat is tartalmaz. Az SSH-adapter a motoré, a kulcs és hozzáférés üzemeltetése a példányé.

### 4. Git-források bekötése, kézi ellenőrzéssel

Kapcsolódó specifikációk:

- [Kurzusregiszter és forrásszintaxis](task-automatic-publishing.md#kurzusregiszter-és-forrásszintaxis)
- [Tartalomszinkronizálás](task-automatic-publishing.md#tartalomszinkronizálás)
- [Linkek és assetek](task-automatic-publishing.md#linkek-és-assetek)
- [Biztonság](task-automatic-publishing.md#biztonság)

Feladatok:

- `main@github.com/owner/repo/path/course.md` parser.
- Git-adapter, ref feloldása és a feloldott SHA tartalmának letöltése.
- Helyi és külső kurzusok összeállítása elkülönített build inputtá.
- ID-/névtérvalidáció, forrásverzió-jegyzék és konkrét hibadiagnosztika.
- Valódi publikus és a machine userrel megosztott privát mintarepó importjának és statikus buildjének kézi indítású ellenőrzése.
- Meghívás elfogadása, hibás/visszavont hozzáférés és hiányzó secret ellenőrzése: konkrét diagnosztika, nincs részleges publikálás.

**Továbbhaladási feltétel:** a Git-import, a linkek és assetek működnek, hibás forrás blokkolja a buildet, a verziókezelt helyi tartalom érintetlen marad. Automatikus ütemezést és éles deployt még nem kapcsolunk be.

### 5. Automatikus ellenőrzés és publikálás

Kapcsolódó specifikációk:

- [Időzítés](task-automatic-publishing.md#időzítés)
- [Változásellenőrzés](task-automatic-publishing.md#változásellenőrzés)
- [CI és publikálás](task-automatic-publishing.md#ci-és-publikálás)
- [Hibakezelés és megfigyelhetőség](task-automatic-publishing.md#hibakezelés-és-megfigyelhetőség)

Feladatok:

- Fingerprint és az utolsó sikeres publikálás baseline-jának kezelése külön Actions artifactként tárolt, buildenkénti SHA-forrásjegyzékkel. A jegyzék nem kerül a nyilvános oldalba; hiányzó/lejárt baseline esetén teljes build. [Rögzített szerződés](task-automatic-publishing.md#buildenkénti-forrásjegyzék).
- Magyar helyi idő szerinti időablak-gate.
- Kézi/push indítás, force rebuild és változás nélküli kihagyás.
- Validáció, build és atomikus deploy bekötése a központi workflow-ba.
- Baseline-frissítés kizárólag sikeres deploy után.
- Concurrency és hibajelzések ellenőrzése.

**Befejezési feltétel:** az automatikus publikálási task [elfogadási feltételei](task-automatic-publishing.md#elfogadási-feltételek) teljesülnek, a [validáció](task-automatic-publishing.md#validáció) megtörtént, beleértve a változatlan forrás és a sikertelen publikálás utáni újrapróbálás esetét.

## Követési lista

- [x] Metaadatmodell, aggregálás, megjelenítés és keresés implementálva, automatizáltan validálva.

- [x] Helyi motorhatár és CLI megvalósítva: `packages/bookmd`, portal workspace-fogyasztó, példányonkénti generált SvelteKit munkatér.
- [x] Portal check/46 teszt/statikus build és tarballból telepített második minimális fogyasztó check/build/dev HTTP-próba validálva.

A teljes motor-elfogadási kapu nem lezárt: nincs vizuális/böngészős regresszióvizsgálat, a configváltozás dev-újraindítást igényel, a registrykiadás döntése nyitott. A konkrét helyi szerződés és korlátok a [motor README-ben](packages/bookmd/README.md) szerepelnek. A környezetfüggetlen közös mag a `src/core` alatt elkészült; a `buildGraph` fájlrendszeres adapterként ezt hívja. Az új típusalapú számozás a közös modellben él, a menü és breadcrumb ugyanazt használja.
- [x] Közös feldolgozómag és tartalomszerződés a motorban; 49 teszt, adapterparitás, böngészős csomagolás, portal check/build és friss tarballos külön fogyasztó check/build sikeres.
- [ ] Hosting/Actions-előfeltételek ellenőrizve.
- [x] Helyi kurzuselőnézet (`/@dev`) kész: check, 58 teszt (köztük build–böngésző paritásteszt), statikus build, scriptelt Chrome-próba és a szerző kézi tesztje (dev mód, valódi mappaválasztó) sikeres. Base path (`/courses`) alatt is ellenőrizve. Mobil nézet és világos téma a szerző kézi tesztjében rendben. Nyitott: célzott ellenőrzés a gyors mappaváltás és újratöltés elavult eredményeire.
- [ ] Machine user, meghíváskezelés és védett központi SSH-hitelesítés beállítva.
- [ ] Git-import publikus és privát forrással, kézi indítással kész és validált.
  - Kész és validált (78 teszt, valódi `pte-mik/info` repó): forrásszintaxis-parser, ref→SHA feloldás (branch/tag/SHA, fallback nélkül), pontos SHA letöltése (`bookmd sources`), hibák blokkolják a futást. Nyitott: stabil kurzus-ID és névtér, helyi+külső összeállítás build inputtá, forrásverzió-jegyzék a buildben, privát (SSH) transport.
- [ ] Változásalapú, időablakos publikálás kész és validált.

A részletes taskok a funkcionális követelmények forrásai; ez a dokumentum a sorrendet és a szakaszhatárokat rögzíti. A közös szerződések változásakor mindhárom kapcsolódó taskot aktualizálni kell.
