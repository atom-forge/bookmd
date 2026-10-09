# Task: Git-forrású kurzusok automatikus publikálása

## Cél

A kollégák saját GitHub-repositoryba pusholják a tananyagaikat. A BookMD központi kurzusregisztere hivatkozik ezekre a forrásokra, a portál automatizmusa pedig időablakosan ellenőrzi a változásokat, és csak szükség esetén buildel és publikál.

A szerzői repókban nem szükséges külön deployfolyamat vagy a portál fejlesztői környezetének telepítése. A tartalomletöltés, validáció, build és publikálás a központi `atom-forge/bookmd` repo felelőssége.

## Függőségek és tulajdonos

A [workflow](workflow.md) sorrendje: metaadat-előfeltétel → [motor/példány szétválasztás](bookmd-engine.md) → közös pipeline → [helyi előnézet](local-course-preview.md) → kézzel validált Git-import → automatizálás. Az első két szakasz tervezési kapui koordináltak; nem indítunk külön példányoldali feldolgozást.

A regiszterparser, Git-adapter, összeállítás, validáció és generálás újrahasználható implementációja a motoré. A példányé a config, kurzusregiszter/helyi tartalom, lockfile, CI/build/deploy, machine-user SSH secret, hozzáférési nyilvántartás és sikeres publikálási baseline. A pontos CLI-integrációt a motor task tényleges terve rögzíti, nem feltételezett script/API. A registry-hitelesítés külön a Git SSH-kulcstól és a deploy-jogosultságtól.

## Hatókör — első verzió

- Publikus és a központi machine userrel megosztott privát GitHub-kurzusrepók támogatása, helyi kurzusokkal együtt.
- Egysoros Git-forráshivatkozások a `content/courses.md` regiszterben.
- Stabil kurzusazonosítók.
- Generált, elkülönített build input összeállítása.
- Időablakos változásellenőrzés magyar helyi idő szerint.
- Csak változáskor build és atomikus publikálás.
- Forrásverzió-jegyzék, diagnosztika és kézi workflow-indítás.

Nem része: további hitelesítési modellek (GitHub App, repónkénti deploy key), kurzusonkénti utolsó jó tartalom visszatöltése, külső push által indított webhookok, szerzői repo-template és külön szerzői CI.

A központi portálrepo jelenleg privát. Ez nem akadálya publikus tananyagforrások olvasásának, de a hosting jogosultságait, Actions-keretet és a publikált oldal láthatóságát külön ellenőrizni kell.

## Kurzusregiszter és forrásszintaxis

A meglévő helyi hivatkozások maradjanak támogatottak:

```yaml
---
courses:
  - "[[web-programming-1/course.md]]"
  - "main@github.com/colleague/repo/folder/course.md"
  - "release/2026@github.com/another-colleague/algorithms/course.md"
---
```

A Git-hivatkozás alkalmazásszintű szintaxis, nem közvetlen letöltési URL:

```text
<ref>@github.com/<owner>/<repo>/<path-to-entrypoint.md>
```

- A ref kötelező; nincs implicit `main` alapérték.
- A ref lehet branch, tag vagy commit SHA.
- Az első `@` jelnél választjuk szét a refet és a forrást. A ref ebben a szintaxisban nem tartalmazhat `@` karaktert; a `/` engedélyezett.
- A host első körben kizárólag `github.com`.
- Az owner és repo utáni útvonal a belépő Markdown-fájl repohoz relatív útvonala.
- A belépőfájl könyvtára a kurzus tartalomgyökere.
- A parser adjon konkrét hibát hiányzó ref, hibás owner/repo, érvénytelen vagy gyökéren kívülre mutató útvonal esetén.
- Ne adjuk át a regiszter szövegét shellparancsnak; folyamatargumentumok és a validált owner/repo alapján képzett, ellenőrzött GitHub SSH repo-cím használata szükséges. A regiszterszintaxis változatlan, nem tartalmaz credentialt.

### Privát források: machine-user SSH

A választott modell a [workflow hozzáférési szerződése](workflow.md#privát-forrásrepók-hozzáférése-központi-machine-user): külön GitHub-fiók (a `bookmd-reader` név még javaslat), elfogadott collaborator-meghívás, szervezeti repóban Read jogosultság. A szerző nem készít tokent, secretet vagy workflow-t. A ref feloldása és az adott SHA letöltése ugyanazzal a machine-user SSH-hozzáféréssel történik; a portál `GITHUB_TOKEN`-ja nem általános privátrepo-credential.

A példány üzemeltetője felel a fiókért, 2FA/helyreállításért, meghívások elfogadásáért, SSO/policy/seat ellenőrzésért, hozzáférési nyilvántartásért és kulcsrotációért. A privát SSH-kulcs kizárólag központi Actions secret; ellenőrzött GitHub hostkulcsokkal, hostellenőrzés kikapcsolása nélkül. Csak forrásolvasáskor legyen elérhető, ne build/deploy vagy külső kódfuttatás közben.

Személyes privát repó collaborator joga írható is lehet; a generátor csak olvas, de ez nem technikai read-only korlát. A kulcs kompromittálása a fiók minden hozzáférését érinti. Visszavonás a jövőbeni olvasást tiltja, nem törli automatikusan a már publikált tartalmat. A szerző külön jóváhagyja a kijelölt privát tananyag publikálását; privát forrás nem garantál privát oldalt.

## Stabil kurzusazonosító

A külső kurzus belépőfájljának frontmattere tartalmazzon stabil `id` mezőt:

```yaml
---
id: web-programming-1
name: Webprogramozás 1
---
```

- A portál URL-névtere az ID-hoz kötődjön, ne a repo/mappa nevéhez vagy kurzuscímhez.
- Az ID legyen biztonságos, dokumentált URL-szegmens; tiltott érték, hiány és ütközés validációs hiba.
- Helyi kurzusoknál őrizzük meg a jelenlegi URL-eket és kompatibilitást. A konkrét migrációs szerződést a meglévő modell ellenőrzése után rögzíteni kell.
- Több kurzus vagy nyelvi változat egy repóból külön regiszterbejegyzéssel és külön ID-val importálható.
- Két azonos nevű fájl vagy kép külön kurzusban ne ütközzön.

## Tartalomszinkronizálás

A motor forrásszinkronizáló művelete; a konkrét CLI/parancs és buildbekötés a motor task tervezési kapujában dől el, nem új példányoldali implementáció:

1. Beolvassa és validálja a regisztert.
2. Feloldja a kért refeket tényleges commit SHA-kra.
3. Az adott SHA-khoz tartozó tartalmat ideiglenes munkakönyvtárba tölti.
4. Ellenőrzi a belépőfájlt, kurzusgyökeret, ID-kat és biztonsági határokat.
5. Helyi és külső kurzusokból összeállítja a generált tartalomgyökeret.
6. Előállítja az összesített kurzusjegyzéket és a forrásverzió-jegyzéket.
7. A meglévő tartalomfeldolgozóra bízza a tananyag validációját és renderelését.

A Git-réteg a generátor előtt feloldja a forrásokat helyi fájlokra. A checkoutok determinisztikus könyvtárba kerüljenek: `.generated/repos/<source-hash>/`. A hash a normalizált repo + ref alapján készül, SHA-256-tal; a belépőútvonal nem része, így egy checkout több kurzust is kiszolgálhat. A tárolási hash nem jelenhet meg a kurzus URL-jében.

A generátor továbbra is helyi Markdownból dolgozik. A jelenlegi gyökérhez kötött biztonsági és URL-képzési logikát célzottan hozzá kell igazítani a feloldott forrásokhoz vagy a közös összeállított buildgyökérhez.

A hashkönyvtár önmagában nem tartós CI-cache: a GitHub-hosted runner friss környezet. Változatlan fingerprintnél nem buildelünk; szükséges buildnél a forrásokat biztosan elő kell állítani, cache nélkül is.

Példa, a tényleges helyeket a meglévő buildhez igazítva:

```text
content/                     # Verziókezelt helyi tartalom és regiszter
.generated/content/          # Gitignore-olt, összeállított build input
  courses.md
  web-programming-1/
  algorithms/
.generated/course-sources.json
```

- A verziókezelt `content/` fájljait nem írjuk felül.
- Nem használunk submodule-okat, és nem készítünk napi automatikus tartalomcommitot a portálrepo-ba.
- Az azonos repóból, azonos SHA-n érkező kurzusok letöltését lehetőség szerint deduplikáljuk.
- Az ellenőrzéskor feloldott SHA-t kell buildelni, nem később újra a mozgó branchnevet. Így az ellenőrzés és letöltés közötti push nem okoz verzióeltérést.
- Nem használható bizonytalan feloldás, például egy nem létező ref helyett automatikus default branch fallback.
- Hiányzó vagy nem elérhető forrás esetén a futás hibás legyen, ne maradjon ki észrevétlenül a kurzus.

## Linkek és assetek

- Kurzusonként elkülönített namespace-ben dolgozzunk.
- A relatív Markdown-linkek, wikilinkek, headingfragmentek és helyi assetek a kurzus tartalomgyökeréből, a meglévő feloldási szabályokkal összhangban működjenek.
- A kiválasztott kurzusgyökéren kívülre mutató hivatkozás ne olvasson be tetszőleges repófájlt.
- A különböző kurzusok közötti linkelés támogatását ne feltételezzük implicit fájlnév-kereséssel; az első verzió szerződését dokumentálni kell.
- A jelenlegi helyi kurzusok feloldását és URL-jeit regressziós tesztek védjék.

## Időzítés

A frissítési ablak `Europe/Budapest` időzóna szerint:

| Időszak | Ellenőrzési célidőpontok |
|---|---|
| 08–18 | 08:17, 09:17, …, 17:17 |
| 18–24 | 18:17, 20:17, 22:17 |
| 00–08 | Nincs automatikus tartalomellenőrzés vagy build |

Ez napi 13 tervezett tartalomellenőrzés.

Megvalósítási alap: óránkénti GitHub Actions cron (`17 * * * *`) és egy rövid időablak-gate, amely magyar helyi idő szerint engedélyezi a további lépéseket. A téli/nyári időszámítást az időzóna kezeli, nem kézzel karbantartott UTC-eltolás.

- A gate miatt éjszaka is indulhat rövid workflow, de nem kérdezünk le kurzusrepókat és nem buildelünk.
- A napi 13 szám a tartalomellenőrzésekre vonatkozik, nem a gate workflow-indításaira.
- A késő GitHub cron futást a tényleges helyi idő alapján kapuzzuk; a cron nem percre pontos szolgáltatás.
- A `workflow_dispatch` kézi indítás és a portál `main` push bypassolja az időablakot.
- A kézi futásnak legyen opcionális „force rebuild” lehetősége.
- Ellenőrizni és dokumentálni kell a GitHub aktuális schedule-korlátait. Az ütemezés a default branchről működik; aktivitásfüggő letiltást és késést ne hagyjunk figyelmen kívül.

## Változásellenőrzés

A jelenlegi állapotot az **utolsó sikeres publikálás** forrásjegyzékével hasonlítsuk össze.

A fingerprint tartalmazza legalább:

- a példány saját commit SHA-ját, ezzel a helyi tartalom/config/buildintegráció változását is;
- a tényleges motorcsomag-verziót és lockfile-azonosságot; a verziózott provenance-séma ezt is rögzítse;
- a normalizált kurzusregisztert, a forrásútvonalakat és kért refeket;
- a külső források feloldott commit SHA-ját;
- a fingerprint séma-/pipeline-verzióját, ha a commiton túl szükséges.

Működés:

```text
Időablak vagy kézi/push indítás
  → aktuális forrásverziók feloldása
  → összehasonlítás az utolsó sikeres publikálással
  → nincs változás: sikeres befejezés build/deploy nélkül
  → változás vagy force: szinkronizálás + validáció + build + deploy
```

- Első futáskor vagy megbízható baseline hiányában teljes build szükséges.
- Hibás build/deploy nem írhatja át a sikeres baseline-t; a következő futás újra próbálkozik.
- A választott baseline-tárolás: buildenként külön GitHub Actions artifactban tárolt `course-sources.json`. Kezelni kell a retentiont; kizárólag a megfelelő deployment-célhoz és sikeres deployhoz tartozó jegyzék fogadható el, nem egyszerűen a legutóbbi build vagy workflow artifactja.
- Ne alapozzuk a helyességet Actions cache-re: a cache gyorsítás, nem garantált állapottároló.
- A forrásjegyzék nem része a nyilvános weboldalnak vagy a Pages artifactnak: privát repóneveket és útvonalakat is tartalmazhat. A következő futás Actions artifactként olvassa vissza.
- Hiányzó, lejárt, sérült vagy ismeretlen sémájú baseline esetén teljes build szükséges; soha ne hagyjunk ki buildet bizonytalan összehasonlítás alapján.

### Buildenkénti forrásjegyzék

A szinkronizálás előállítja a buildhez ténylegesen felhasznált verziókat, például:

```json
{
  "schemaVersion": 1,
  "portalCommit": "<full-portal-commit-sha>",
  "sources": [
    {
      "source": "main@github.com/colleague/repo/materials/course.md",
      "commit": "<full-resolved-source-commit-sha>"
    }
  ]
}
```

A jegyzék a normalizált teljes regisztert vagy annak determinisztikus fingerprintjét is tartalmazza, hogy a helyi/külső források hozzáadása, törlése és útvonalváltozása is összehasonlítható legyen. A tényleges séma és a rendezés legyen verziózott és tesztelt.

- Buildkor a jegyzék az adott futáshoz kötött provenance; csak sikeres deploy után válik baseline-ná.
- A deploy és a jegyzék kapcsolata legyen egyértelmű a run/deployment azonosítóval. A külön deploy jobnak a buildkor előállított jegyzéket kell továbbvinnie, nem újra feloldania a refeket.
- Hibás vagy megszakított build/deploy artifactja nem írhatja felül az utolsó sikeres publikálás referenciáját.
- A sikertelen deploy utáni újrapróbálás és az artifact lejárata külön teszteset.

## CI és publikálás

Kiindulópont: `.github/workflows/pages.yml`.

A pipeline feladatai:

1. Checkout és függőségek telepítése lockfile alapján.
2. Időablak-gate és változásellenőrzés a megfelelő sorrendben; ablakon kívül kerüljük a felesleges drága lépéseket.
3. Kurzusforrások szinkronizálása, forrásjegyzék.
4. Tartalomvalidáció, típusellenőrzés, tesztek.
5. Statikus build.
6. Build artifact feltöltése és deploy.
7. Csak sikeres deploy után a sikeres publikációhoz tartozó baseline rögzítése.

A build és deploy concurrency-jét úgy kell beállítani, hogy ne forduljon elő régebbi build későbbi publikálása vagy sikeres állapot elvesztése megszakított futás miatt. A meglévő `cancel-in-progress` viselkedést ennek fényében vizsgálni kell.

### Hosting előfeltétel

Az `atom-forge/bookmd` privát repo. A megvalósítás elején ellenőrizni kell:

- a szervezet csomagja támogatja-e a választott GitHub Pages felállást privát repóból;
- a Pages/environment jogosultságokat és base pathot;
- az Actions-perckeretet és a túlfogyasztási beállításokat;
- a publikált oldal elvárt láthatóságát.

A privát forrásrepo nem jelenti automatikusan, hogy a publikált oldal privát. Ha a Pages nem használható a kívánt feltételekkel, hostingdöntés szükséges; ne állítsuk, hogy a jelenlegi workflow ettől függetlenül publikálni fog.

## Hibakezelés és megfigyelhetőség

- Bármely kurzus letöltési, validációs vagy buildhibája blokkolja az új publikálást.
- A korábbi sikeres oldal változatlanul elérhető marad; nincs részleges kurzuskihagyás vagy félkész deploy.
- A log és workflow summary tartalmazza a kurzust, repót, kért refet, feloldott SHA-t, érintett relatív fájlt és hibát, ahol rendelkezésre állnak.
- Legyen áttekinthető összegzés: ablakon kívül / nincs változás / sikeresen publikált / hibás.
- Használjuk a GitHub Actions meglévő hibajelzését; külön fizetős értesítési szolgáltatás nem része az első verziónak.
- A forrásjegyzék build artifactként segítse a visszakövethetőséget; nyilvános megjelenítése külön adatvédelmi döntés.

## Biztonság

- Külső repókat tartalomként, nem futtatható projektként kezelünk.
- Nem futtatjuk a repók scriptjeit, hookjait vagy workflow-it, és nem telepítjük a függőségeiket.
- Nem importáljuk a `.git`, `.github`, `node_modules` és más dokumentáltan kizárt könyvtárakat; nincs rekurzív submodule-letöltés.
- Útvonalnormalizálás és symlink-ellenőrzés akadályozza meg a kijelölt tartalomgyökérből való kilépést.
- Letöltésre és feldolgozásra legyen idő-, méret- és fájlszámkorlát, érthető hibaüzenettel.
- A Markdown HTML-/URL-kezelése ne engedjen tetszőleges scriptfuttatást a portál originjén. A biztonsági szerződés legyen közös a helyi előnézeti taskkal.
- A CI minimális jogosultságokat használjon; deploy-jogosultság csak a szükséges jobban legyen.
- Titkok nem kerülhetnek regiszterbe, generált tartalomba, forrásjegyzékbe vagy logba.

## Kapcsolat a helyi előnézettel

Kapcsolódó taskok: [helyi előnézet](local-course-preview.md), [motor/példány](bookmd-engine.md), [workflow](workflow.md).

- A kurzusmetaadatok, gyökér, linkfeloldás, diagnosztika és HTML-biztonság szerződése legyen közös.
- A Git adapter és a böngészős mappaadapter külön IO-réteg; ne hozzunk létre két tartalomfeldolgozó implementációt.
- Az oktató helyben előnéz, pushol, majd a központi automatizmus a következő engedélyezett ellenőrzéskor feldolgozza a változást.
- A workflow sorrendje kötött: a motor/példány és közös pipeline kapui, majd a helyi előnézet előzik meg a Git-importot; az automatizálás csak kézzel validált import után indul.

## Megvalósítási lépések

1. Motor/példány, közös pipeline és preview kapuinak átvétele; hosting/Actions, machine user és védett SSH-hozzáférés ellenőrzése.
2. Regiszterparser, ID-szerződés, forrásjegyzék és célzott tesztek.
3. Git-forrásadapter és generált build input, helyi kompatibilitással.
4. Fingerprint és sikeres baseline tárolása.
5. Időablak-gate és meglévő workflow bővítése.
6. Atomikus deploy, diagnosztika, dokumentáció és végponttól végpontig teszt.

## Elfogadási feltételek

- [x] Helyi és egysoros Git-kurzusforrások együtt működnek, publikus és privát (GitHub App-pal olvasott) repóval is.
- [x] Hozzáférés GitHub Appal (a machine user/SSH modell helyett): hiányzó telepítés, elutasított kulcs, hiányzó hitelesítés és elutasított tokenkérés konkrét diagnosztikával, unit tesztekkel ellenőrizve; hiba esetén nincs részleges publikálás (élő hibafutás igazolta). Az élő telepítés-visszavonás szándékosan nem lett kipróbálva.
- [x] Az App privát kulcsa csak a `plan` és a forrásletöltés lépésben érhető el, a `check`/`build` nélküle fut; az installation token a Gitnek környezeten át jut és maszkolt; nincs credential a logban, artifactban vagy outputban (élő naplók ellenőrizve). A privát tartalom publikálását a szerző `publish: true`-val hagyja jóvá.
- [x] Branch, tag, commit SHA és `/`-t tartalmazó ref helyesen feloldható.
- [x] Az ellenőrzött SHA kerül buildbe, mozgó branch esetén is.
- [x] Stabil ID biztosítja az URL-t; hibás vagy ütköző ID blokkolja a buildet.
- [x] Kurzusonkénti wikilinkek, relatív linkek és assetek nem ütköznek: külön névtér (`id`), lezárt kurzushatár; a hat helyi kurzus azonos fájlnevekkel is ütközésmentes.
- [x] Magyar helyi idő szerinti 08–18 óránkénti, 18–24 kétóránkénti ablak és éjszakai tiltás helyes, téli/nyári időszámítással is.
- [x] Kézi indítás és main push ablakon kívül is használható; force rebuild működik.
- [x] Változatlan bemenetnél nincs build/deploy; új portál- vagy forráscommit esetén van.
- [x] Sikertelen publikálás nem változtatja meg a baseline-t; a következő futás újra próbálkozik.
- [x] Egyetlen hibás kurzus esetén a korábbi publikált oldal marad elérhető.
- [x] Forrásjegyzék és konkrét hibadiagnosztika rendelkezésre áll.
- [x] Külső repo kódja nem fut le, és fájlútvonal/symlink nem léphet ki a tartalomgyökérből.
- [x] Hosting ellenőrizve és dokumentálva: a példányrepó publikus, a Pages Actions-forrással működik; Free csomagon privát repóból a Pages nem érhető el. A privát források nevei ezért a regiszterben és a naplókban látszanak (tudatos döntés).
- [x] A jelenlegi helyi kurzusok és build működése regresszió nélkül megmarad (393 oldal, 6 kurzus a motor minden szakaszában).

## Validáció

- Parser tesztek érvényes/hibás forráshivatkozásokkal.
- ID-, névtér-, útvonal- és symlink-biztonsági tesztek.
- Helyi teszt-repókkal ref/SHA feloldás és mozgó branch viselkedés ellenőrzése, hálózat nélküli célzott tesztekkel ahol lehetséges.
- Időablak tesztek határórákra, téli/nyári időre és kézi/push bypassra.
- Fingerprint/baseline tesztek első futás, változatlanság, forrásváltozás, portálváltozás, hibás deploy és hiányzó/lejárt baseline esetére.
- Teljes projekttesztek, típusellenőrzés és statikus build.
- Valódi publikus és machine userrel megosztott privát mintarepóval kézi import/statikus build, majd CI end-to-end próba, változás nélküli és új commit utáni futás.
- Meghívás elfogadása, hiányzó secret, visszavont hozzáférés és hostkulcshiba: nincs deploy vagy baseline-frissítés; titokszivárgás ellenőrzése.
- Szándékosan hibás kurzussal ellenőrzés: nincs új deploy, előző oldal megmarad, következő futás újra próbál.
- Actions runneridő és hostingbeállítások ellenőrzése; a GitHub aktuális korlátait ne korábbi becslésekből feltételezzük.
