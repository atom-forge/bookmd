---
chapter: "09.05"
tags: []
---
# Kereshetőség és a tartalom minősége

A nyilvános webes tartalom akkor található meg és érthető jól, ha elérhető, világosan szerkesztett és pontos. A keresőoptimalizálás a feltérképezés, indexelés és a felhasználónak hasznos tartalom kapcsolatát vizsgálja. Az AI-alapú keresési felületek mellett is ezek az alapok számítanak; nincs garantált helyezés vagy megjelenés.

## Hogyan jut el egy oldal a keresési eredményig?

Amikor valaki rákeres arra, hogy „hogyan működik a DNS”, a keresőnek előbb tudnia kell, hogy létezik egy erre válaszoló oldal. A folyamat első lépése a **feltérképezés**: automatizált programok – gyakran robotoknak vagy crawlereknek nevezik őket – követik a hivatkozásokat, illetve ismert címeket keresnek fel, hogy tartalmat fedezzenek fel. Egy jól elérhető oldalhoz vezetnek más oldalakból linkek, és a szerver engedi, hogy a robot lekérje a nyilvános dokumentumot.

A következő lépés az **indexelés**. A rendszer feldolgozza az oldal szövegét, szerkezetét, nyelvét, hivatkozásait és más jeleit, majd felveheti egy kereshető adatbázisba. Az indexelés nem ugyanaz, mint a rangsorolás. Az, hogy egy oldal bekerülhet az indexbe, nem jelenti, hogy bármely keresésre előkelő helyen vagy egyáltalán meg fog jelenni. A **rangsorolás** az a későbbi döntés, amikor a kereső egy adott lekérdezéshez próbál releváns és hasznos eredményeket választani.

E három fogalom szétválasztása megóv a félreértéstől. Ha a kereső nem tudja lekérni az oldalt, a tartalom nem feltérképezhető. Ha nem tudja értelmezni vagy nem tartja felvehetőnek, nem indexelődik. Ha viszont indexelhető, de a kérdésre jobb, megbízhatóbb vagy közelebbi eredmények vannak, nem feltétlenül fog magas helyre kerülni. A kereső pontos rangsorolási szabályai nem nyilvánosak és idővel változhatnak; senki nem tud tisztességesen garantálni első helyet.

```mermaid
flowchart LR
    P[Nyilvános oldal] --> F[Feltérképezés]
    F --> I[Indexelés lehetséges]
    I --> R[Rangsorolás lekérdezésenként]
    R --> U[Felhasználói találat]
```

## Feltérképezhetőség: legyen elérhető az, amit meg akarunk találni

A feltérképezhetőség alapja, hogy a szerver a nyilvános oldalra normálisan válaszoljon. Egy jelszó mögé tett belső tananyag vagy egy csak bejelentkezéssel elérhető ügyfélfelület természetesen nem ugyanúgy kezelhető, mint egy nyilvános cikk. A cél mindig a szándéknak megfelelő láthatóság: nem minden oldalnak kell kereshetőnek lennie.

A belső hivatkozások segítik a látogatót és a robotot is abban, hogy megértse, mely oldalak kapcsolódnak egymáshoz. Ha egy fontos oldalhoz csak egy, JavaScript által későn létrehozott, nehezen elérhető út vezet, az kockázat. A hagyományos, értelmes linkek – beszédes horgonyszöveggel – erősítik a navigációt. A „kattints ide” helyett a „HTTP-státuszkódok részletes magyarázata” egyszerre használhatóbb és informatívabb.

> [!warning] A robots.txt nem hozzáférés-ellenőrzés
> A `robots.txt` és a robots meta utasítások szabályozhatnak egyes feltérképezési vagy indexelési viselkedéseket, de ezek nem biztonsági eszközök. Titkos dokumentumot nem szabad pusztán ettől remélni elrejteni; annak megfelelő hozzáférés-vezérlésre van szüksége. A webhelytérkép, azaz sitemap, segíthet a keresőnek a fontos nyilvános URL-ek listájával, különösen nagy vagy kevés belső hivatkozással rendelkező oldalaknál. Nem helyettesíti azonban a jó navigációt és a hasznos tartalmat.

## Szemantikus tartalom: előbb az embernek legyen világos

A szemantikus HTML azt jelenti, hogy a jelölés nem pusztán azt mondja meg, „hogyan nézzen ki valami”, hanem azt is, „mi ez”. A valódi főcím `h1`, a bekezdés `p`, a navigáció `nav`, a fő tartalom `main`, a cikk `article`, a lista pedig `ul`, `ol` vagy `dl`. Ez segít a képernyőolvasót használó embereknek, a karbantartóknak és a gépi feldolgozásnak is.

Egy jó cikknek általában van egyértelmű címe, logikus alcímhierarchiája, rövid bevezetője, és a kérdésre adott tényleges válasza. Nem attól lesz jó, hogy egy kulcsszó harmincszor szerepel benne. Ha valaki azt kérdezi, „Mi a különbség cookie és localStorage között?”, a hasznos oldal először röviden válaszol, utána pontosítja a tulajdonságokat, példát ad, és jelzi a korlátokat. Az ismételgetett, természetellenes kulcsszavak inkább rontják az olvasási élményt, mint javítják.

A címhierarchia nem vizuális méretezési eszköz. Nem jó gyakorlat kisebb `h3`-at választani csak azért, mert tetszetősebb a betűmérete. A CSS feladata a megjelenés; a címsorok feladata a dokumentum értelmi tagolása. Egy jól tagolt dokumentumot a hallgató, a képernyőolvasó és az automatizált rendszer is könnyebben tud áttekinteni.

## Metaadatok: rövid jelzések a dokumentumról

A HTML dokumentum `head` részében elhelyezett metaadatok nem a látogató számára megjelenő törzsszöveg helyett vannak, hanem azt egészítik ki. A `title` elem rövid, pontos címként jelenhet meg böngészőfülön, könyvjelzőben és keresési környezetben. A jó cím megkülönbözteti az oldalt a webhely többi oldalától: a „Webprogramozás” kevésbé beszédes, mint a „HTTP státuszkódok – Webprogramozás I”.

A meta leírás (`meta name="description"`) egy tömör összefoglaló lehet. A keresők ezt felhasználhatják, de nem kötelesek pontosan ezt megjeleníteni; a felhasználó kérdéséhez olykor az oldal más részletét találják relevánsabbnak. Emiatt a leírást nem szabad ígéretként vagy rejtett kulcsszóhalomként kezelni. Legyen emberi nyelvű, és mondja el, mire számíthat az olvasó.

A kanonikus cím (`link rel="canonical"`) akkor segíthet, ha ugyanaz vagy nagyon hasonló tartalom több URL-en is elérhető, például szűrési paraméterek miatt. A jelzés egy preferált változatot javasol, de nem helyettesíti az átgondolt URL- és tartalomkezelést. A nyelvi változatoknál a megfelelő nyelvi jelölések segíthetnek tisztázni, melyik oldal mely közönségnek készült.

## Strukturált adat: tények gépileg is értelmezhető formában

A **strukturált adat** olyan szabványosított jelölés, amellyel egy oldal egyes tényeit kifejezettebben leírhatjuk a gépeknek. Egy eseményoldal például jelezheti az esemény nevét, időpontját, helyét és szervezőjét; egy recept az elkészítési időt és az összetevőket; egy kurzusoldal a tantárgy nevét és oktatóját. Sok esetben erre JSON-LD formátumot használnak, amely a dokumentum mellett, elkülönült adatként írja le az információt.

A strukturált adat nem jogosít automatikus különleges keresési megjelenésre. Akkor hasznos és felelős, ha a jelölt információ a felhasználó számára az oldalon is ténylegesen megtalálható, pontos és naprakész. Nem helyes fiktív értékeléseket, nem létező készletet vagy félrevezető árat csak a gépi jelölésbe írni. Itt is ugyanaz az elv: a gépnek adott információ egyezzen az embernek adott információval.

## AIO: tartalom AI-asszisztensek és válaszmotorok korában

Az **AIO** itt nem egyetlen hivatalos, egységes szabvány neve, hanem az a törekvés, hogy a tartalom AI-alapú keresők, asszisztensek vagy válaszmotorok számára is jól érthető és idézhető legyen. Ezek a rendszerek eltérően működhetnek, és a hozzáférési, kiválasztási vagy hivatkozási szabályaik változhatnak. Ezért hibás lenne azt ígérni, hogy bizonyos formázással biztosan bekerülünk egy AI által adott válaszba.

Az alapelvek meglepően közel vannak a jó dokumentáció elveihez. Egy oldal válaszoljon egyértelműen arra, amit állít; használjon leíró címeket; különítse el a tényeket, a példákat és a véleményeket; jelölje a szerzőt, a dátumot és – amikor releváns – az eredeti forrást. A fontos állítás legyen megtalálható a tényleges oldalszövegben, ne csak egy illusztrációra írt képen. A táblázat lehet hasznos összehasonlításra, de legyen érthető fejléce és bevezetője is.

Például egy egyetemi tantárgyoldal akkor értelmezhető jól, ha világosan tartalmazza a tantárgy nevét, célját, előfeltételeit, időpontjait, az aktuális félév dátumát és a hivatalos kapcsolattartási utat. Egy AI-rendszer és egy hallgató is nehezebben dolgozik fel egy olyan oldalt, ahol mindez csupán egy beszkennelt, rossz minőségű PDF-képen vagy egy elavult közösségi bejegyzésben szerepel.

Az AIO nem azt jelenti, hogy a szöveget gépnek írjuk. A természetes, pontos, jól strukturált szakmai tartalom a jó cél. A mesterségesen gyártott, sekély és forrás nélküli szöveg rövid távon sok oldalnak tűnhet, de nem épít bizalmat és nehezen ellenőrizhető. Különösen egészségügyi, pénzügyi, jogi vagy oktatási kérdésekben lényeges a szerzői felelősség, az időbeliség és a hivatkozások átláthatósága.

## Példa: egy egyetemi laboroldal javítása

Tegyük fel, hogy egy labor időpontját és jelentkezését ismertető oldal címe „Információk”, a tényleges időpont pedig egy képként feltöltött plakáton szerepel. Nincs egyértelmű főcím, a jelentkezési határidő két külön bekezdésben, eltérő dátummal olvasható. A kereső, a képernyőolvasót használó hallgató és egy AI-asszisztens számára egyaránt bizonytalan, mi a hiteles információ.

A javított oldal címe lehet „Webprogramozás I labor – jelentkezés és időpontok, 2026 ősz”. A törzsben egy rövid összefoglaló, jól jelölt szakaszok, valódi szövegként kiírt dátumok, beszédes jelentkezési link és a frissítés dátuma szerepel. Ha indokolt, strukturált eseményadat is kiegészítheti. Ez nem garantál sem keresőbeli helyezést, sem AI-hivatkozást, de a tartalom minden érintett számára megbízhatóbban használható.

## Gyakori félreértések

- **„A SEO kulcsszavak minél többszöri ismétlése.”** A túlzott ismétlés nem pótolja a releváns, érthető választ.
- **„Az indexelés garantálja az első helyet.”** Az indexbe kerülés és a rangsorolás eltérő lépés.
- **„A meta leírás mindig pontosan megjelenik.”** A kereső dönthet úgy, hogy más szövegrészletet mutat.
- **„A strukturált adat biztosan kiemelt találatot ad.”** Segíthet az értelmezésben, de nem ígér megjelenési formát vagy rangsort.
- **„Az AIO-hoz AI-szöveget kell gyártani.”** A cél a pontos, embernek is hasznos, ellenőrizhető tartalom.
