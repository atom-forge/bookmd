---
type: content
tags: []
---
# HTTP-gyorsítótár és CDN

A gyorsítótár csökkentheti az ismételt letöltés idejét és a szerver terhelését, de csak akkor hasznos, ha a válasz megfelelő ideig és megfelelő helyen marad újrahasználható. A CDN a tartalom közelebb vitelében segíthet; a személyes és gyorsan változó adatoknál a frissesség és a hozzáférés is számít.

## Miért kell ugyanazt újra elkérni?

Képzeljünk el egy egyetemi honlapot. Egy látogató megnyitja a kezdőoldalt, a böngésző letölti a HTML-dokumentumot, a stíluslapot, néhány JavaScript-fájlt, a fejléc logóját és több fényképet. A következő oldalon ugyanaz a logó, betűkészlet és stíluslap szerepel. Felesleges volna ezeket minden kattintáskor újra átküldeni a hálózaton. Ráadásul ha tízezer látogató ugyanazt a 200 kB-os képet kéri, a kiszolgáló és a hálózat számára is értelmetlenül sok ismétlődő munka keletkezik.

A gyorsítótár ezt az ismétlődést csökkenti. A korábbi eredményt egy későbbi felhasználás céljára megőrzi. Ez lehet egy fájl a hallgató laptopján, egy rekord a szerver memóriájában, vagy egy tartalomszolgáltató hálózat egyik európai gépén. A lényeg minden esetben ugyanaz: ha a korábbi válasz még megfelelő, gyorsabban és olcsóbban használjuk fel, mint az eredeti előállítását.

Fontos azonban, hogy a cache nem „hazudhat” korlátlanul. Egy tegnapi oktatási hír még lehet hasznos, de az éppen elérhető vizsgaidőpont vagy egy webáruház készlete esetében a régi adat kárt okozhat. A cache-tervezés ezért valójában kompromisszum a frissesség, a sebesség, a költség és a terhelhetőség között.

```mermaid
flowchart LR
    B[Böngésző] --> C[Böngésző-cache]
    C --> E[CDN élpont]
    E --> O[Eredeti szerver]
    O --> E
    E --> C
```

## A gyorsítótár rétegei

### Böngészőcache

Az első réteg gyakran maga a böngésző. A korábban letöltött képek, CSS- és JavaScript-fájlok, betűkészletek, sőt bizonyos HTTP-válaszok helyben maradhatnak. Ha a felhasználó visszatér egy oldalra, a böngésző akár hálózati kérés nélkül is előveheti a még friss másolatot. Ez nagyon gyors, de egyetlen felhasználóhoz kötődik: mások böngészőjét nem segíti.

A HTTP-válasz fejlécei közölhetik, meddig tekinthető frissnek egy válasz. A `Cache-Control: max-age=3600` például azt fejezi ki, hogy a válasz egy órán keresztül újra felhasználható. Nem azt jelenti, hogy az erőforrás biztosan nem változhat meg, hanem azt, hogy a szerver vállalja: egy órán át a korábbi változat elfogadható.

### Megosztott proxycache

> [!warning] Személyes válasz ne kerüljön megosztott gyorsítótárba
> Egy szervezet hálózatában vagy egy szolgáltató előtt közös cache is állhat. Ez sok felhasználó közös másolatait kezeli. Egy nyilvános hírportál képeit így nem minden munkaállomás külön-külön tölti le a távoli szerverről. A megosztott gyorsítótárnál különösen fontos, hogy személyes válasz ne kerüljön véletlenül közös tárolóba. Egy bejelentkezett felhasználó profiloldalát például általában nem szabad nyilvánosan cache-elni.

### Alkalmazás- és adatcache

A szerveroldalon is sok az ismétlődő munka. Egy népszerű kurzuslista előállítása adatbázis-lekérdezéseket és jogosultság-ellenőrzést igényelhet. Ha az eredmény öt percig elfogadható, az alkalmazás tárolhatja memóriában vagy külön gyorsítótárban. Itt nem feltétlenül HTTP-választ tárolunk: lehet egy számítás eredménye, adatbázis-lekérdezés, munkamenethez kapcsolódó adat vagy előre elkészített oldalrészlet.

Ez a réteg a felhasználó számára láthatatlan, de hibája gyakran látványos. Ha egy tanulmányi rendszerben a tárgyfelvétel után percekig régi létszám jelenik meg, az valószínűleg frissítési kérdés, nem „rossz internet”.

### CDN-edge cache

A Content Delivery Network, röviden CDN, világszerte vagy régiónként elhelyezkedő kiszolgálók hálózata. Az origin, azaz eredeti szerver lehet például Budapesten, míg egy londoni látogató a legközelebbi CDN-csomóponttól kapja meg a képet, videó-részletet vagy statikus fájlt. A CDN-csomópontot gyakran edge-nek nevezzük, mert a hálózat „szélén”, a felhasználóhoz közel szolgál ki.

## Friss, elavult és érvénytelen

A gyorsítótár megértéséhez három hasonló, de különböző fogalom kell. A **friss** válasz a beállított szabály szerint még közvetlenül felhasználható. Az **elavult** (`stale`) válasz frissességi ideje lejárt; rendszerint újraellenőrzésre szorul, de egyes szabályok átmenetileg elavult válasz kiadását is megengedik. Az **érvénytelenítés** (`invalidation` vagy purge) pedig aktív beavatkozás: azt mondjuk a cache-nek, hogy egy korábbi bejegyzést többé ne adjon ki.

Az ellenőrzéshez a szerver adhat azonosítót. Az `ETag` a válasz egy adott változatát jelöli. A böngésző később elküldheti: „Nálam ez az ETag-ű változat van; megváltozott?” Ha nem, a szerver `304 Not Modified` választ küldhet teljes tartalom nélkül. Így van hálózati kör, de nem kell újra letölteni a fájlt. Hasonló szerepe lehet a `Last-Modified` és `If-Modified-Since` fejléceknek.

Különösen jó gyakorlat a változatot a fájlnévben hordozni. Például a `main.4f8a2c.js` egy új kiadásnál `main.91bd77.js` lesz. A régi fájl így akár nagyon hosszú ideig cache-elhető, mert új tartalom esetén új URL keletkezik. Ezt cache bustingnak nevezik, bár pontosabb úgy gondolni rá, mint egy új, egyértelmű cím kiadására. Ezzel szemben a folyamatosan ugyanazon a `/aktuális-arfolyam` címen érkező adat rövid frissességi időt igényelhet.

## Mit számít a földrajzi távolság?

A digitális adat nem teleportál. A jel nagyon gyorsan halad, de kábelekben, hálózati eszközökön és több útválasztón keresztül jut el a célhoz. Egy kérésnél a késleltetés részben a fizikai távolságból, részben a sorban állásból és a feldolgozásból áll össze. Egyetlen nagyméretű fájl letöltésénél a sávszélesség is meghatározó; sok rövid kérésnél különösen fájdalmas lehet a sok oda-vissza út.

Egy CDN azért hasznos, mert a látogatóhoz közeli edge szerver válaszolhat. Egy magyar felhasználó egy európai csomóponttól kaphat egy képet ahelyett, hogy az amerikai originhez menne. Ez nem csak gyorsabb: az origin szervert is védi a hirtelen tömeges terheléstől. Egy sportközvetítés vagy népszerű termékbejelentés idején az edge-ek sok azonos kérést elnyelnek.

Nem minden tartalom cache-elhető azonosan. A nyilvános képek, verziózott JavaScript-fájlok és videó-részletek ideális jelöltek. Egy személyre szabott bankszámlaoldal, kosár vagy adminisztrációs felület viszont gyakran az origin alkalmazástól igényel friss, jogosultsághoz kötött választ. A CDN ilyenkor is lehet hasznos TLS-lezárásra, támadások szűrésére vagy statikus mellékletek kiszolgálására, de a dinamikus üzleti döntést nem veheti át gondolkodás nélkül.

## Végigvezetett példa: új egyetemi hirdetmény

Tegyük fel, hogy az intézmény egy PDF-et és egy hozzá tartozó nyilvános oldalt tesz közzé. A PDF neve `tajekoztato-2026-09.pdf`, és a CDN egy napra tárolja. Ez jó, mert a fájl a kiadás után nem változik. Ha elírás miatt javítani kell, kockázatos ugyanarra az URL-re új PDF-et tölteni: egyes látogatók még a régi változatot láthatják. Biztosabb megoldás új, egyértelmű név, például `tajekoztato-2026-09-v2.pdf`, majd a weboldal hivatkozásának módosítása.

Az oldal tetején lévő „utolsó frissítés” információ viszont rövid ideig cache-elhető, vagy publikáláskor célzottan érvényteleníthető. A jó megoldás tehát nem az, hogy „mindent kikapcsolunk”, hanem hogy a tartalom természetéhez választunk szabályt.

## Gyakori félreértések

**„A cache mindig gyorsabb, tehát mindent tároljunk.”** Nem. Személyes, érzékeny vagy gyorsan változó válasznál a régi adat veszélyes vagy zavaró lehet.

**„Ha feltöltöttem az új fájlt, mindenki azonnal azt látja.”** Csak akkor, ha a régi másolatok frissességi szabályai, érvénytelenítése vagy az új URL ezt biztosítja.

**„A CDN kizárólag nagy cégeknek való.”** Kis oldalak is profitálhatnak a földrajzilag közeli statikus kiszolgálásból és a tehermentesítésből, de az igény és a költség dönt.

**„A CDN minden weboldalt felgyorsít.”** A személyre szabott, adatbázis-igényes válasz lassúságát a CDN nem feltétlenül oldja meg. Előbb tudni kell, hol keletkezik a késés.
