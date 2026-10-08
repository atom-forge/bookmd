# Task workflow: Szerzői előnézet és automatikus publikálás

## Cél

Az oktató helyben ellenőrzi a kurzusát, saját GitHub-repójába pusholja, majd a BookMD központi automatizmusa feldolgozza és publikálja a változást.

## Kapcsolódó taskok

- [Helyi kurzuselőnézet — /@dev](task-local-course-preview.md)
- [Git-forrású kurzusok automatikus publikálása](task-automatic-publishing.md)
- [Projekt megvalósítási szabályai](AGENTS.md)

## Végrehajtási sorrend

### 0. Metaadat-előfeltétel a közös mag előtt

- Saját kurzusok: `author` az `instructor` helyett; a kurzus `year` mezője megszűnik (a prózában szereplő évszámok maradnak).
- A parser a régi mezőket elutasítja; a modell külön `tags` és `contentTags` listát ad.
- Minden kurzushoz tartozó generált oldal címkéinek normalizált, saját címkékkel is deduplikált aggregálása a feldolgozó feladata, nem a UI-é.
- Katalógus és kurzusnyitó: egyetlen Chip-sor, nyelv → szerző → saját címkék → összesített címkék; keresés és hozzáférhető kibontás. [Működő kompozíció](docs/ui/catalog-card.md#egyetlen-metaadat-címkesor).
- Nincs Tag API vagy függőségfrissítés; a telepített Chip dokumentált class propját használjuk.

**Továbbhaladási feltétel:** metaadat-parser, aggregálás és keresés tesztjei, check és build sikeresek; a közös mag ezt a szerződést veszi át. A böngészős vizuális, billentyűzetes és képernyőolvasós ellenőrzést külön rögzítsük.

### 1. Közös tartalomfeldolgozási alap

Kapcsolódó specifikációk:

- [Előnézet: architektúra](task-local-course-preview.md#architektúra)
- [Publikálás: kapcsolat a helyi előnézettel](task-automatic-publishing.md#kapcsolat-a-helyi-előnézettel)
- [Publikálás: stabil kurzusazonosító](task-automatic-publishing.md#stabil-kurzusazonosító)

Feladatok:

- A jelenlegi pipeline és függőségeinek feltérképezése.
- A fájlolvasás leválasztása a környezetfüggetlen feldolgozásról.
- A kurzusgyökér, stabil ID, link- és assetfeloldás közös szerződésének rögzítése, helyi kompatibilitással.
- Közös HTML-/URL-biztonsági szabályok és diagnosztika.
- A meglévő build adapter bekötése a közös magra.

**Továbbhaladási feltétel:** a jelenlegi kurzusok és URL-ek regresszió nélkül működnek; a közös mag nem függ Node/Bun fájlkezeléstől. Tesztek, típusellenőrzés és build sikeresek.

Ez mindkét task közös munkája: ne készüljön két feldolgozó implementáció.

### Párhuzamos előfeltétel: hosting ellenőrzése

Már az első szakasz alatt ellenőrizzük a privát `atom-forge/bookmd` repo hostingfeltételeit:

- [Hosting előfeltétel](task-automatic-publishing.md#hosting-előfeltétel)

Tisztázandó a Pages elérhetősége, a publikált oldal láthatósága, a base path, az environment jogosultságai és az Actions-keret. Ha a kívánt Pages-felállás nem támogatott, még a deploy implementálása előtt hostingdöntés szükséges.

### 2. Helyi kurzuselőnézet

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

A modell a Git-import szakasz része. A [publikálási task](task-automatic-publishing.md) jelenlegi, csak publikus forrásokra szűkített hatókörét ennek megfelelően ki kell bővíteni a megvalósítás előtt.

### 3. Git-források bekötése, kézi ellenőrzéssel

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

### 4. Automatikus ellenőrzés és publikálás

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

- [ ] Metaadat-előfeltétel és kézi UI-validáció.
- [ ] Közös feldolgozómag és szerződések.
- [ ] Hosting/Actions-előfeltételek ellenőrizve.
- [ ] Helyi kurzuselőnézet kész és validált.
- [ ] Machine user, meghíváskezelés és védett központi SSH-hitelesítés beállítva.
- [ ] Git-import publikus és privát forrással, kézi indítással kész és validált.
- [ ] Változásalapú, időablakos publikálás kész és validált.

A részletes taskok a funkcionális követelmények forrásai; ez a dokumentum a sorrendet és a szakaszhatárokat rögzíti. A közös szerződések változásakor mindkét kapcsolódó taskot aktualizálni kell.
