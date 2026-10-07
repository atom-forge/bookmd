# 10.01. Szolgáltatásminőség és rendelkezésre állás

Egy webes szolgáltatásnak nem elég válaszolnia: a megfelelő feladatot a megfelelő pillanatban kell megbízhatóan támogatnia. A rendelkezésre állás, a helyes működés és a helyreállás különböző, de összekapcsolódó tulajdonságok.

## Szükséges előismeretek

- [A minőségi web](../09/09-01-accessibility-and-inclusive-design.md) — felhasználói használhatóság.
- [Egy kérés teljes útja](../04/04-05-complete-web-request.md) — a szolgáltatás rétegei.

## Mit jelent a „minőség” a weben?

Amikor valaki azt mondja, hogy „rossz volt a weboldal”, gyakran több, egymástól különböző problémát sűrít egy mondatba. Lehet, hogy az oldal nem nyílt meg. Lehet, hogy megnyílt, de a fizetésnél megállt. Az is lehet, hogy a főoldal gyorsan megjelent, de a képernyőolvasóval használó látogató nem tudott továbblépni. A webes szolgáltatás minősége ezért nem egyetlen mérőszám, hanem egymással összefüggő tulajdonságok együttese.

Ide tartozik a funkcionális helyesség: azt teszi-e a rendszer, amit ígér? Egy mozijegyet foglaló alkalmazásban a kiválasztott előadásra, a kiválasztott helyre kell foglalásnak létrejönnie. Ide tartozik a teljesítmény: mennyi idő alatt válaszol a rendszer, és mennyi idő után tud a látogató valóban cselekedni? Fontos a használhatóság, az akadálymentesség, a biztonság és az adatvédelem is. Végül a megbízhatóság azt fejezi ki, hogy a rendszer mennyire kiszámíthatóan viselkedik időben, nem csak egyetlen sikeres próbánál.

Ez a szemlélet segít elkerülni azt a hibát, hogy kizárólag a szerver állapotáról beszéljünk. Egy „zöld” szerver még nem garantál jó felhasználói élményt. A szerver lehet elérhető, miközben egy külső fizetési szolgáltató kiesett; az oldal visszaadhat 200-as HTTP-választ, miközben a JavaScript-hiba miatt a kosár gomb nem működik; vagy a rendszer lehet gyors Budapestről, de használhatatlan egy lassú mobilhálózaton.

```mermaid
flowchart LR
    U[Felhasználói feladat] --> K{Sikerül?}
    K -->|igen| H[Helyes eredmény]
    K -->|nem| V[Hiba és helyreállás]
    H --> M[Szolgáltatásminőség mérése]
    V --> M
```

## Rendelkezésre állás: elérhető-e a szolgáltatás?

A rendelkezésre állás azt írja le, hogy egy szolgáltatás a vizsgált időszakban milyen arányban használható rendeltetésszerűen. A megfogalmazásban két szó különösen fontos: a „használható” és a „rendeltetésszerűen”. Nem elég, hogy egy gép válaszoljon a hálózaton. Egy online tanulmányi rendszer akkor elérhető, ha a hallgató be tud lépni, meg tudja nézni a tárgyait, és a szükséges műveleteket végre tudja hajtani.

Az elérhetőséget gyakran százalékban adják meg. A 99,9% első látásra szinte tökéletesnek tűnik, de egy harmincnapos hónapban körülbelül 43 perc kiesést enged meg. A 99,99% már csak nagyjából 4 percet. A több „kilences” ezért nem pusztán marketing: egyre szigorúbb elvárást jelent. Ugyanakkor az elérhetőségi százalék önmagában nem mondja meg, mikor történt a kiesés. Egy ötperces hiba hajnali háromkor más következményű, mint ugyanaz a vizsgajelentkezés nyitásakor.

Az is kérdés, mi számít kiesésnek. Ha a nyilvános főoldal működik, de bejelentkezés után egyetlen felhasználó sem tud menteni, akkor a szolgáltatás részlegesen kiesett. Ha csak az ajánlórendszer nem működik, de vásárolni lehet, az még mindig hiba, de más súlyú. A jó minőségi célok ezért a kritikus felhasználói utakból indulnak ki: bejelentkezés, keresés, fizetés, jelentkezés, feltöltés vagy éppen ügyintézés.

## Megbízhatóság, ellenállóképesség, helyreállás

A rendelkezésre állás rokon, de nem azonos a megbízhatósággal. A megbízható rendszer várhatóan hosszabb időn át helyesen működik. Az ellenállóképes, más néven reziliens rendszer pedig hiba esetén is igyekszik a fontos szolgáltatást fenntartani vagy értelmesen korlátozni. A helyreállíthatóság azt fejezi ki, milyen gyorsan és mennyire biztonságosan tér vissza a rendszer a megfelelő állapotba.

Képzeljünk el egy könyváruházat. Ha az ajánló modul hibás, a reziliens rendszer továbbra is megmutathatja a könyveket és lehetővé teheti a vásárlást, csak az ajánlások helyén őszintén jelzi, hogy ez a funkció átmenetileg nem elérhető. Ha viszont az ajánló hibája miatt a teljes főoldal üres marad, a rendszer túl szorosan kötötte össze a kevésbé fontos és a létfontosságú funkciókat. A cél nem az, hogy semmi ne romolhasson el; az a cél, hogy egy hiba hatása ne legyen nagyobb, mint feltétlenül szükséges.

A hibák nem kivételes események. Hálózatok lassulnak, külső szolgáltatások késnek, konfigurációk tévesek lehetnek, és emberek is hibáznak. A minőségi gondolkodás ezért nem az „örök hibátlanság” ígéretére épít, hanem arra, hogy a rendszer felismeri, kezeli és érthetően kommunikálja a hibát. Ez a nézőpont később a teljesítmény, biztonság és felhasználói élmény tárgyalásakor is visszatér.

## SLI, SLO és SLA: három hasonló rövidítés, három különböző szerep

Az **SLI** (Service Level Indicator) megfigyelhető mutató: azt mérjük vele, hogy a szolgáltatás egy adott szempontból hogyan viselkedik. Példa lehet a sikeres bejelentkezések aránya, a keresések 95. percentilis válaszideje, vagy az arány, amellyel egy oldal betöltésekor az elsődleges tartalom megjelenik. Az SLI tehát mérés, nem ígéret.

Az **SLO** (Service Level Objective) belső célérték ugyanarra a mutatóra. Például: „a sikeres fizetési kezdeményezések aránya havi szinten legalább 99,95%”, vagy „a keresési kérések 95%-a két másodpercen belül kap választ”. Egy jó SLO konkrét: kijelöli, mit mérünk, milyen küszöbbel és milyen időablakban. Nem szükséges minden lehetséges dologra SLO-t alkotni; a felhasználó számára fontos utakra érdemes.

Az **SLA** (Service Level Agreement) külső, szerződéses vállalás. Egy szolgáltató és ügyfele közötti megállapodás lehet arról, milyen szintű rendelkezésre állást garantál a szolgáltató, és milyen következménye van, ha ezt nem teljesíti. Ez lehet díjjóváírás vagy más szerződéses rendezés. Az SLA általában kevésbé részletes és óvatosabb vállalás, mint a belső SLO, mert jogi és üzleti jelentősége van.

Egy hasznos mondat a különbség megjegyzéséhez: az SLI azt mondja meg, **mi történt**; az SLO azt, **mit szeretnénk elérni**; az SLA pedig azt, **mit vállalunk mások felé**. Nem jó gyakorlat, ha a külső szerződéses minimum azonos a belső minőségi céllal: akkor már a legkisebb eltérés is szerződésszegés, és nincs mozgástér a romló tendencia észlelésére.

## Példa: egy egyetemi tárgyfelvételi rendszer

Tegyük fel, hogy a tárgyfelvétel hétfőn 10 órakor nyílik. A rendszer üzemeltetője csak azt ellenőrzi, hogy a nyitóoldal válaszol-e. Ez kevés: a hallgatónak be kell lépnie, meg kell találnia a tárgyat, és végül el kell mentenie a jelentkezést. Ha az első két lépés működik, de a mentés időtúllépés miatt hibát ad, akkor a felhasználó szempontjából a kritikus szolgáltatás nem elérhető.

Jó SLI lehet a „sikeresen befejezett tárgyfelvételek aránya”. Ehhez SLO-ként kimondható például, hogy a nyitást követő két órában a kezdeményezett tárgyfelvételek legalább 99,5%-a sikeresen záruljon. Ebből nem következik, hogy minden hiba elfogadható: a maradék arány vizsgálata továbbra is szükséges. A mutató csak abban segít, hogy a minőség megítélése ne kizárólag anekdotákból vagy egyetlen szerverjelzésből történjen.

## Gyakori félreértések

**„A 100%-os rendelkezésre állás reális alapelv.”** Bizonyos szűk időablakokban előfordulhat, de hosszú távon a nullaperces kiesés rendkívül drága és sokszor értelmetlen cél. A helyes kérdés az, mely funkcióknál mekkora kiesés milyen kárt okoz.

**„Ha a szerver 200 OK-t küld, minden rendben van.”** A HTTP-státusz csak egy kommunikációs jelzés. A válasz mögötti üzleti művelet lehet hibás, hiányos vagy a felhasználó számára használhatatlan.

**„A magas rendelkezésre állás egyenlő a jó felhasználói élménnyel.”** Egy lassú, zavaros vagy akadálymentesítés nélküli szolgáltatás technikailag elérhető lehet, mégis kudarcot vall a céljánál.

**„Az SLA technikai mérőszám.”** Az SLA szerződéses vállalás; tartalmazhat mérőszámot, de nem azonos sem a méréssel, sem a belső céllal.

## Megismert fogalmak

- **Rendelkezésre állás:** annak aránya, hogy a szolgáltatás rendeltetésszerűen használható.
- **Megbízhatóság:** a helyes működés kiszámíthatósága időben.
- **Reziliens rendszer:** hiba esetén is igyekszik a fontos funkciókat fenntartani vagy korlátozottan biztosítani.
- **SLI:** mért szolgáltatási mutató.
- **SLO:** belső célérték egy SLI-re.
- **SLA:** külső fél felé tett szerződéses szolgáltatási vállalás.
- **Kritikus felhasználói út:** a felhasználó céljához szükséges, kiemelten fontos lépéssor.
