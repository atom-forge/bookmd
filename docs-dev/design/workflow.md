# Task workflow: Szerzői előnézet és automatikus publikálás

## Cél

Az oktató helyben ellenőrzi a kurzusát, saját GitHub-repójába pusholja, majd a BookMD központi automatizmusa feldolgozza és publikálja a változást.

## Kapcsolódó taskok

- [Verziózott BookMD-motor és vékony példány](bookmd-engine.md)
- [Helyi kurzuselőnézet — /@dev](local-course-preview.md)
- [Git-forrású kurzusok automatikus publikálása](automatic-publishing.md)
- [Projekt megvalósítási szabályai](../../AGENTS.md)

## Végrehajtási sorrend

### Elkészült alap: kurzusmetaadatok

- Saját kurzusok: `author` az `instructor` helyett; a kurzus `year` mezője megszűnik (a prózában szereplő évszámok maradnak).
- A parser a régi mezőket elutasítja; a modell külön `tags` és `contentTags` listát ad.
- Minden kurzushoz tartozó generált oldal címkéinek normalizált, saját címkékkel is deduplikált aggregálása a feldolgozó feladata, nem a UI-é.
- Katalógus: egyetlen Chip-sor, nyelv → szerző → saját címkék → összesített címkék; keresés és hozzáférhető kibontás. A kurzusoldalon a nyelv és szerző a fejlécben jelenik meg, a bodyban nem ismétlődik. [Működő kompozíció](../ui/catalog-card.md#egyetlen-metaadat-címkesor).
- Nincs Tag API vagy függőségfrissítés; a telepített Chip dokumentált class propját használjuk.

**Állapot: implementálva és automatizált ellenőrzésekkel validálva.** Nem új fejlesztési előfeltétel; a motor és a közös mag a meglévő szerződést megőrzi.

### 1. Motor/példány szétválasztás

Specifikáció: [BookMD-motor task](bookmd-engine.md).

- A verziózott motor tulajdona az alkalmazás, renderer, generálás és a későbbi `/@dev`; a vékony példány tulajdona a config, kurzusregiszter, helyi tartalom, lockfile, build/deploy és titkok.
- A motorhatár és a következő szakasz feldolgozási szerződésének tervezése közös A kapu. A SvelteKit route-/asset-/függőségfeloldási spike és a tényleges CLI-terv a B kapu; egyik sem feltételezett package API.
- A csomag terjesztésének registry/láthatóság- és hitelesítési döntése a kiadás előfeltétele.
- A jelenlegi portal az első fogyasztó, működése és URL-jei megmaradnak.

**Továbbhaladási feltétel:** a [motor task elfogadási feltételei](bookmd-engine.md#elfogadási-feltételek) teljesülnek; második minimális példány dev és statikus build módban működik alkalmazásforrás másolása nélkül. Nem hozzuk előre a preview/Git/automation implementációt.

### 2. Közös tartalomfeldolgozási alap

Kapcsolódó specifikációk:

- [Előnézet: architektúra](local-course-preview.md#architektúra)
- [Publikálás: kapcsolat a helyi előnézettel](automatic-publishing.md#kapcsolat-a-helyi-előnézettel)
- [Publikálás: stabil kurzusazonosító](automatic-publishing.md#stabil-kurzusazonosító)

Elkészült: környezetfüggetlen feldolgozás és megőrzött build-adapter, virtuális tartalomgyökér és útvonal-/asset-szerződés, meglévő HTML-/URL-kezelés és diagnosztika. A konkrét API és tartalomszerződés a [motor README-ben](bookmd-engine.md#shared-content-contract) szerepel. A 390 meglévő tananyagfájl chapter/content/resource szerepei már megfeleltek; fájlátnevezés nem történt.

**Továbbhaladási feltétel:** a jelenlegi kurzusok és URL-ek regresszió nélkül működnek; a közös mag nem függ Node/Bun fájlkezeléstől. Tesztek, típusellenőrzés és build sikeresek.

A motor- és feldolgozási terv az első két szakasz koordinált tervezési kapuin halad át; a pipeline implementációja csak a motor/példány migráció kapuja után indul. A közös mag és adapterkód a motor tulajdona, nem példányonkénti implementáció. A preview és publikálási task közös munkája: ne készüljön két feldolgozó.

### Párhuzamos előfeltétel: hosting ellenőrzése

Már az első szakasz alatt ellenőrizzük a privát `atom-forge/bookmd` repo hostingfeltételeit:

- [Hosting előfeltétel](automatic-publishing.md#hosting-előfeltétel)

Tisztázandó a Pages elérhetősége, a publikált oldal láthatósága, a base path, az environment jogosultságai és az Actions-keret. Ha a kívánt Pages-felállás nem támogatott, még a deploy implementálása előtt hostingdöntés szükséges.

### 3. Helyi kurzuselőnézet

Specifikáció: [Helyi kurzuselőnézet task](local-course-preview.md).

Feladatok:

- Statikus `/@dev` route és olvasási célú böngészős mappaadapter.
- Belépőfájl-választás kiemelt jelöltekkel.
- A közös feldolgozó és meglévő kurzusfelület bekötése.
- Belső navigáció, helyi assetek, kézi újratöltés és diagnosztika.
- Build–böngésző paritás és valódi Chrome-használat ellenőrzése.

**Továbbhaladási feltétel:** az előnézeti task [elfogadási feltételei](local-course-preview.md#elfogadási-feltételek) teljesülnek, a [validáció](local-course-preview.md#validáció) megtörtént. A helyi fájlokat nem töltjük fel és nem módosítjuk.

### Privát forrásrepók hozzáférése: GitHub App

A választott modell egy, az üzemeltető szervezet által birtokolt GitHub App („PTE MIK BookMD reader”). A korábban tervezett machine user + SSH modellt ez váltotta ki: a machine user személyes privát repóban írási jogot is kap, az App repónként csak olvasási jogot ad.

**A tartalomfejlesztő teendője:** telepíti az Appet a saját fiókjára (vagy szervezetére), és kiválasztja a kurzusrepót („Only select repositories”). Nincs token, secret vagy workflow a szerzőnél. A regiszter hivatkozása változatlan: `main@github.com/owner/repo/path/course.md`.

**Üzemeltetői teendők:** az App létrehozása (Contents: read-only, Metadata: read-only; bárki telepítheti), a `BOOKMD_APP_ID` és `BOOKMD_APP_PRIVATE_KEY` Actions secret a példányon, kulcsrotáció (az Appnak több kulcsa lehet), a hozzáférési nyilvántartás (`GET /app/installations`).

**Működés:** a forrást a motor előbb névtelenül próbálja, így nyilvános forrásnál nincs hitelesítés. Csak ha ez sikertelen, kér az App egy rövid életű, egyetlen repóra szóló, csak olvasási installation tokent; az a Gitnek környezeten át jut, nem argumentumban vagy URL-ben, és a naplóban maszkolt. A hitelesítés csak a `plan` és a forrásletöltés lépésben él, a `check`/`build` nélküle fut.

**Jóváhagyás:** a privát forrás nem teszi priváttá az oldalt. A hitelesítést igénylő forrást a motor csak akkor publikálja, ha a belépőfájl frontmatterében `publish: true` szerepel.

**Nyilvánosság:** a példányrepó publikus, ezért a privát források nevei a regiszterben és a naplókban látszanak; ez tudatos döntés. A Free csomag Pagest csak publikus repóból enged.

### 4. Git-források bekötése, kézi ellenőrzéssel

Kapcsolódó specifikációk:

- [Kurzusregiszter és forrásszintaxis](automatic-publishing.md#kurzusregiszter-és-forrásszintaxis)
- [Tartalomszinkronizálás](automatic-publishing.md#tartalomszinkronizálás)
- [Linkek és assetek](automatic-publishing.md#linkek-és-assetek)
- [Biztonság](automatic-publishing.md#biztonság)

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

- [Időzítés](automatic-publishing.md#időzítés)
- [Változásellenőrzés](automatic-publishing.md#változásellenőrzés)
- [CI és publikálás](automatic-publishing.md#ci-és-publikálás)
- [Hibakezelés és megfigyelhetőség](automatic-publishing.md#hibakezelés-és-megfigyelhetőség)

Feladatok:

- Fingerprint és az utolsó sikeres publikálás baseline-jának kezelése külön Actions artifactként tárolt, buildenkénti SHA-forrásjegyzékkel. A jegyzék nem kerül a nyilvános oldalba; hiányzó/lejárt baseline esetén teljes build. [Rögzített szerződés](automatic-publishing.md#buildenkénti-forrásjegyzék).
- Magyar helyi idő szerinti időablak-gate.
- Kézi/push indítás, force rebuild és változás nélküli kihagyás.
- Validáció, build és atomikus deploy bekötése a központi workflow-ba.
- Baseline-frissítés kizárólag sikeres deploy után.
- Concurrency és hibajelzések ellenőrzése.

**Befejezési feltétel:** az automatikus publikálási task [elfogadási feltételei](automatic-publishing.md#elfogadási-feltételek) teljesülnek, a [validáció](automatic-publishing.md#validáció) megtörtént, beleértve a változatlan forrás és a sikertelen publikálás utáni újrapróbálás esetét.

## Követési lista

Kész és validált:

- [x] Kurzusmetaadatok, aggregálás, megjelenítés és keresés.
- [x] Motor/példány szétválasztás: a repó gyökere a `@atom-forge/bookmd` csomag (publikus npm, MIT; kiadás a ship-pel, Trusted Publishing), a példányok (`pte-mik/info`, tartalom: `laborci/books`) külön repók.
- [x] Közös, böngészőbiztos feldolgozómag és tartalomszerződés.
- [x] Helyi kurzuselőnézet (`/@dev`): scriptelt Chrome-próba, szerzői kézi teszt, base path, mobil és világos téma.
- [x] Git-források: forrásszintaxis, ref→SHA, pontos commit letöltése, kötelező külső kurzus-`id`, lezárt kurzushatár, forrásjegyzék.
- [x] Privát források GitHub Appal, kötelező `publish: true` jóváhagyással; élő próba privát repóval.
- [x] Változásalapú, időablakos publikálás (`bookmd plan`, pin-elt build, baseline sikeres deploy után): élő próba a változatlan, force, hibás és újrapróbált esetre.
- [x] Hosting: publikus példányrepó + GitHub Pages (Free csomagon privát repóból a Pages nem működik).

Nyitott:

- [ ] Az első valódi ütemezett (cron) futás: a `schedule` trigger be van állítva, de ütemezett futást még nem figyeltünk meg.
- [ ] Célzott ellenőrzés a `/@dev` gyors mappaváltásánál (elavult eredmény, blob-szivárgás).
- [ ] A második példány (`pte-mik/architecture`).

A részletes taskok a funkcionális követelmények forrásai; ez a dokumentum a sorrendet és a szakaszhatárokat rögzíti. A közös szerződések változásakor mindhárom kapcsolódó taskot aktualizálni kell.
