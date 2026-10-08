---
type: content
tags: []
---
# Felhasználói szempontú teljesítmény

A gyorsaság nem egyetlen szerverválaszidő. A felhasználót az érdekli, mikor jelenik meg a fontos tartalom, mikor reagál a felület, és mennyire marad stabil az elrendezés. A különböző hálózatok és eszközök miatt ugyanaz az oldal nagyon eltérő élményt adhat.

## Mit jelent az, hogy „gyors”?

Képzeljünk el két webáruházat. Az első rögtön kirajzol egy látványos, de még üresnek ható felületet: a betűk, a termékképek és a kosár gombja csak később érkeznek meg. A második nem mutat minden díszítőelemet azonnal, viszont egy pillanat alatt megjelenik a keresett termék neve, ára és egy működő „Kosárba” gomb. Lehetséges, hogy az első oldal valamely technikai mérték szerint rövidebb idő alatt „befejezi” a betöltést, mégis a második tűnik gyorsabbnak. A felhasználó ugyanis nem egy hálózati naplót él át, hanem egy feladat elvégzését.

Ezért fontos elkülöníteni a **mért teljesítményt** és az **érzékelt teljesítményt**. A mért teljesítmény időtartamokat, méreteket, processzorhasználatot vagy egyes böngészőeseményeket ír le. Az érzékelt teljesítmény azt fejezi ki, hogy a látogató mikor érzi úgy: „az oldal már használható”, „a kattintásomra válaszolt”, illetve „nem kell attól félnem, hogy a gomb arrébb ugrik”. A kettő kapcsolódik, de nem azonos.

Egy oldal sebességét több szakasz alakítja. A böngészőnek előbb meg kell találnia a szervert, kapcsolatot kell létrehoznia, el kell kérnie a dokumentumot, majd további képeket, stíluslapokat, betűkészleteket és programkódokat tölthet le. Ezek után az eszköznek fel is kell dolgoznia az érkezett anyagot: felépíteni a dokumentumot, kiszámítani az elrendezést, megrajzolni a képernyőt, és futtatni a szükséges JavaScriptet. Egy gyenge telefonon ugyanaz a JavaScript sokkal tovább tarthat, mint egy fejlesztő nagy teljesítményű laptopján.

```mermaid
flowchart LR
    N[Hálózat] --> L[LCP: fő tartalom]
    J[JavaScript terhelés] --> I[INP: interakció]
    M[Méretezetlen média] --> C[CLS: elmozdulás]
    L --> E[Felhasználói élmény]
    I --> E
    C --> E
```

## Késleltetés: nem csak a fájlméret számít

A **késleltetés** az az idő, amely egy kérés elindítása és a válasz megérkezése között eltelik. Ebben benne van a fizikai távolság, a hálózat útvonala, a szerver terhelése és az is, ha valahol várakozni kell. Egy kis méretű válasz is lehet lassú, ha a szerver csak sok idő után kezd válaszolni. Fordítva: egy nagyobb kép is elfogadhatóan érkezhet meg, ha közelről, gyors hálózaton és jól szervezett letöltéssel szolgálják ki.

Hasznos külön gondolni a válasz első bájtjára és a teljes válaszra. Ha egy dinamikus oldal az adatbázisra vár, a böngésző sokáig nem kap semmit: ekkor a látogató üres képernyőt lát. Ha az első, érdemi HTML-rész hamar megérkezik, a böngésző már elkezdhet tartalmat mutatni akkor is, ha a lap távolabbi elemei még töltődnek. Ez különösen fontos mobilhálózaton, ahol az átvitel és a kapcsolatfelépítés kevésbé kiszámítható.

A hálózat azonban csak az egyik fele a történetnek. Egy oldalon futó sok, nagy vagy rosszul ütemezett szkript lefoglalhatja a böngésző fő végrehajtási szálát. Ilyenkor a fájlok akár le is töltődhettek, de a felület még nem reagál gördítésre, gépelésre vagy kattintásra. A teljesítményről szóló beszélgetésben ezért veszélyes kizárólag a „megabájtok számát” nézni.

## Core Web Vitals: három nézőpont a használhatóságra

A Core Web Vitals olyan, széles körben használt mutatók együttese, amelyek a betöltés, az interakció és a vizuális stabilitás oldaláról közelítik meg a felhasználói élményt. Nem teljes minősítések: nem mondják meg, hogy az oldal akadálymentes-e, érthető-e vagy jogszerűen kezel-e adatot. Viszont segítenek észrevenni néhány nagyon gyakori, bosszantó problémát.

### LCP – Largest Contentful Paint

Az **LCP** hozzávetőleg azt figyeli, mikor jelenik meg a képernyőn a legnagyobb, a felhasználó számára látható tartalmi elem. Ez sokszor a főcím, egy termékkép, egy kiemelt kép vagy egy nagy szövegblokk. A mutató azért hasznos, mert a látogató számára ez az a pillanat, amikor az oldal fő mondanivalója elkezd valóban megérkezni.

Egy hírportálon például a főcikk címe és nyitóképe lehet az LCP-elem. Ha a nyitókép túl nagy, rossz formátumú, csak későn kezd letöltődni, vagy a szerver lassan küldi a HTML-t, az LCP romolhat. Nem az a helyes következtetés, hogy „minden képet el kell hagyni”, hanem az, hogy a képet a megfelelő méretben, megfelelő formátumban és megfelelő prioritással kell szállítani. Egy apró, alig látható ikon optimalizálása keveset segít, ha közben a legfontosabb termékkép 8 MB-os.

### INP – Interaction to Next Paint

Az **INP** azt a tapasztalatot közelíti, hogy egy felhasználói művelet – például kattintás, érintés vagy billentyűleütés – után mennyi idő telik el a következő látható visszajelzésig. Ha a „Fizetés” gombra kattintva hosszú ideig semmi nem történik, a felhasználó újra megnyomhatja, azt hiheti, hibázott, vagy elhagyhatja az oldalt.

Az INP nem kizárólag a hálózati válaszidő mérőszáma. Sok esetben azért rossz, mert a böngésző éppen nagy mennyiségű JavaScriptet dolgoz fel. Egy hosszú feladat elfoglalhatja a fő szálat, így a kattintás feldolgozása várakozik. Jó tervezési elv, hogy a felület előbb adjon egyértelmű, azonnali visszajelzést – például betöltési állapotot vagy letiltott gombot –, és a költséges munkát lehetőség szerint ossza kisebb részekre.

### CLS – Cumulative Layout Shift

A **CLS** a váratlan elrendezés-ugrásokat írja le. Talán mindenki találkozott már azzal, hogy éppen megérintene egy linket, amikor egy későn betöltődő reklám vagy kép lejjebb tolja a tartalmat, és a kattintás egy másik elemre esik. Ez nem csak kényelmetlen; vásárlásnál, űrlapkitöltésnél vagy akadálymentes segédeszköz használatakor komoly hiba lehet.

Tipikus ok, hogy a képnek vagy beágyazott tartalomnak nincs előre lefoglalt helye. Amikor megérkezik, a böngésző utólag rendezi át az oldalt. A helyes megoldás a tartalom várható méretének megadása, illetve a dinamikus elemek számára stabil hely fenntartása. A felhasználó műveletére szándékosan megjelenő tartalom – például egy kibontott menü – természetesen változtathatja az elrendezést; a gond a váratlan változás.

## Képek, JavaScript és cache

A képek gyakran a lap által letöltött adatok nagy részét adják. A problémát okozhatja a feleslegesen nagy felbontás, a nem megfelelő tömörítés, vagy az, hogy egy mobiltelefon ugyanazt az óriásképet tölti le, amelyet egy széles asztali kijelzőhöz készítettek. A képet nem csak kisebbre lehet venni: a modern böngészőknek több változat is adható, így a készülék a számára ésszerű méretet kérheti. Fontos azonban a tartalom: a nyitóképet nem célszerű ugyanúgy késleltetni, mint a lap alján lévő, még nem látható galériát.

A JavaScript képes gazdag interakciót adni, de letöltése, feldolgozása és futása terhelést jelent. Egy külső mérőkód, chat-ablak, hirdetési rendszer vagy fölösleges felhasználói felület-könyvtár mind növelheti a költséget. A kérdés nem az, hogy „szabad-e JavaScriptet használni”, hanem az, hogy minden kód szolgál-e valós felhasználói célt, és mikor szükséges betölteni. Ha egy funkció csak a bejelentkezett felhasználók kis részének kell, nem biztos, hogy jó ötlet minden látogatónak az induláskor elküldeni.

A **cache** – gyorsítótár – a korábban letöltött, még érvényes erőforrások újrafelhasználása. Egy stíluslap, logó vagy betűkészlet nem feltétlenül szükséges minden oldalletöltéskor újra a hálózatról. A gyorsítótár csökkentheti a várakozást és a forgalmat, de körültekintést igényel: a ritkán változó fájlok sokáig tárolhatók, a személyes vagy gyorsan változó tartalom viszont nem kerülhet véletlenül megosztott cache-be. A cache nem „automatikus varázslat”, hanem HTTP-szabályokkal vezérelt, tervezendő viselkedés.

## Mit és hogyan mérjünk?

> [!tip] A saját eszközödön túl is mérj
> Egy fejlesztői gépen, gyors irodai hálózaton végzett mérés hasznos, de nem elég. Laboratóriumi méréskor azonos, beállított környezetben ismételhető eredményt kapunk; ez jó egy változtatás összehasonlítására. A valós használatból gyűjtött adatok viszont azt mutatják meg, hogy a látogatók tényleges eszközein és hálózatain mi történik. A két nézőpont együtt erős: az egyik segít hibát keresni, a másik jelzi, mekkora a valós hatás.

A böngésző fejlesztői eszközeinek hálózati nézete megmutathatja, melyik kérés mennyi ideig tartott, mekkora választ adott, gyorsítótárból érkezett-e, és mi indította el. A teljesítményprofil megmutathatja, ha egy hosszú JavaScript-feladat blokkolja a felületet. Ezeket a képernyőket nem értelmezhetjük elszigetelten: mindig tegyük fel a kérdést, melyik felhasználói feladat sérül, és melyik változtatás javítana rajta a legnagyobbat.

## Példa: a lassú termékoldal

Egy termékoldal nyitásakor a látogató sokáig fehér képernyőt lát, majd egyszerre megjelenik egy óriási fotó, több külső szkript és egy hirdetési sáv. A fotó megérkezése után a „Kosárba” gomb lejjebb ugrik. Amikor a látogató rákattint, a gomb csak későn jelez vissza.

Ebben a történetben az LCP-n valószínűleg a fő kép késői megjelenése ront; a CLS-en az előre nem foglalt kép- és hirdetési hely; az INP-n pedig a kezdetkor futó sok programkód. Ésszerű javítás lehet a fő kép megfelelő változatának elsőbbsége, a képek és beágyazások méretének rögzítése, valamint a nem azonnal szükséges szkriptek későbbi betöltése. A cél nem a mutatók kozmetikázása, hanem hogy a látogató gyorsan megtalálja és biztonsággal használja a vásárlási műveletet.

## Gyakori félreértések

- **„A teljesítmény csak a szerver dolga.”** A szerver fontos, de a képek, a böngészőoldali kód, a betűkészletek és a harmadik féltől származó elemek is döntőek.
- **„A gyors interneten minden oldal gyors.”** A kapcsolat sebessége nem oldja meg a lassú szerverválaszt, a túl sok kérést vagy a blokkoló JavaScriptet.
- **„A jó Core Web Vitals pontszám egyenlő a jó webhellyel.”** Csak néhány fontos dimenzióról ad jelzést; nem helyettesíti a használhatósági, akadálymentességi és tartalmi vizsgálatot.
- **„Mindent cache-elni kell.”** A hibás cache-szabály régi vagy akár más felhasználónak szóló tartalmat szolgáltathat ki.
