# 10.03. Válaszidő, betöltés és erőforrásigény

A rendszer teljesítményét nem lehet egyetlen szerveroldali idővel leírni. A hálózat, a szerver, a letöltött erőforrások és a böngésző munkája együtt határozza meg, mikor tud a felhasználó értelmesen cselekedni.

## Szükséges előismeretek

- [Felhasználói szempontú teljesítmény](../09/09-04-user-perceived-performance.md) — LCP, INP és CLS.
- [Késleltetés és hibák](../04/04-06-latency-and-failures.md) — a kommunikáció részei.
- [Böngészős renderelés](../03/03-03-browser-rendering.md) — a megjelenítés folyamata.

## Mit érzékel a felhasználó?

Egy látogató nem milliszekundumokat kér, hanem eredményt. Amikor megnyit egy menetrendi oldalt, azt várja, hogy gyorsan megjelenjen az indulási információ; amikor elküld egy űrlapot, azt, hogy világos visszajelzést kapjon; amikor rákattint egy gombra, azt, hogy a felület reagáljon. A technikai teljesítménymérés célja végső soron ennek az élménynek a megértése és javítása.

Az „oldal betöltődött” kifejezés félrevezetően egyszerű. A böngészőnek előbb meg kell találnia a szervert, kapcsolatot kell létrehoznia, le kell kérnie a HTML-t, majd abból további erőforrásokat kell felfedeznie: stíluslapokat, JavaScript-fájlokat, képeket, betűtípusokat, videókat és adatkéréseket. Ezek egy része párhuzamosítható, más része egymásra vár. Ezután a böngésző feldolgozza a dokumentumot, felépíti a megjelenítést, futtatja a szkripteket, és a felhasználó csak akkor tud ténylegesen dolgozni, amikor az interakciók is működnek.

Ezért három külön kérdésre érdemes gondolni: milyen gyorsan válaszol a szerver; milyen gyorsan jelenik meg a hasznos tartalom; és milyen gyorsan reagál a felület a beavatkozásra. Egy jó mérés megnevezi, melyik kérdésre válaszol.

```mermaid
flowchart LR
    B[Böngésző] --> H[Hálózat]
    H --> S[Szerver válasza]
    S --> L[Erőforrások letöltése]
    L --> R[Renderelés és interakció]
```

## Válaszidő és hálózati késleltetés

A **válaszidő** egyszerűen az az idő, amely egy kérés indításától a válasz megérkezéséig eltelik. Ez azonban több szakaszból áll. A kérésnek el kell jutnia a szerverig, a szervernek feldolgoznia kell, majd a válasznak vissza kell érkeznie. A hálózati késleltetés részben fizikai adottság: a nagy távolság, a mobilkapcsolat vagy a zsúfolt hálózat időt ad hozzá. A szerveroldali feldolgozás függhet adatbázis-lekérdezéstől, más szolgáltatás válaszától vagy a számítás bonyolultságától.

Ha egy API a szerver nézőpontjából 80 ezredmásodperc alatt elkészíti a választ, a felhasználó még tapasztalhat fél vagy egy másodpercet, mire a kérés oda-vissza megteszi útját és a kliens feldolgozza az eredményt. Ez nem feltétlenül hiba, hanem a rendszer elosztott természetének következménye. Emiatt a „nálam gyors” állítás nem elegendő: ugyanaz az oldal más hálózatról, más eszközről és más földrajzi helyről egészen másként viselkedhet.

## Betöltési idő: nem egyetlen pillanat

A betöltési időt gyakran egyetlen számmal próbálják jellemezni, pedig a látogató fokozatosan alkot véleményt. Az első néhány pillanatban azt érzékeli, hogy történt-e bármi. Később azt, hogy látható-e a fő tartalom. Végül azt, hogy működnek-e a vezérlők. Egy oldal üres fehér képernyője és egy gyorsan megjelenő, de még kiegészülő elrendezés nem ugyanazt az élményt adja.

A teljesítményről szóló modern beszélgetésekben ezért olyan felhasználóközpontú jelzésekkel találkozunk, mint a legnagyobb látható tartalmi elem megjelenése, az elrendezés váratlan elmozdulása vagy a felület reakciókészsége. Nem szükséges ezeket egy adott eszköz vizsgájának tekinteni; a mögöttük levő kérdés a fontos. Mikor válik az oldal hasznossá? Ugrik-e el a gomb, miközben a felhasználó éppen kattintana? A kattintás után azonnal visszajelez-e a rendszer?

Egy hírportál esetén a cím és a cikk kezdete legyen hamar látható. Egy vásárlási oldalon a termék ára, elérhetősége és kosárgombja kritikus. Egy adminisztrációs felületnél a táblázat első hasznos része lehet fontosabb, mint minden díszítő ikon betöltése. A gyorsaság tehát nem csupán byteszám, hanem prioritás kérdése is.

## Erőforrásigény: mit kérünk a látogatótól?

Minden letöltött kép, betűtípus, szkript és reklám vagy elemző komponens adatforgalmat, memóriát, processzoridőt és néha akkumulátort is igényel. Korszerű asztali gépen egy nagy alkalmazás csupán lassabbnak tűnhet; régebbi telefonon vagy energiatakarékos hálózaton ugyanaz teljesen használhatatlanná válhat. A teljesítmény ezért méltányossági kérdés is: ki tudja ténylegesen használni a szolgáltatást?

Az erőforrások közül a JavaScript különösen fontos, mert nem csak letöltődik: a böngészőnek fel kell dolgoznia és futtatnia is kell. Egy túl sok kódot betöltő oldalnál előfordulhat, hogy a képernyőn már látszik a tartalom, de a felület még nem reagál, mert az eszköz a háttérben hosszú feladatokat végez. A nagy képek és videók elsősorban hálózati terhet jelentenek; a túl sok stílus és szkript pedig a megjelenítés és a feldolgozás útját is nehezítheti.

Nem az a cél, hogy minden oldal minimális méretű legyen. Egy térképes, oktatási vagy videós szolgáltatásnak jogosan lehetnek nagyobb igényei. A cél inkább az arányosság: a letöltött és futtatott tartalom szolgálja-e a felhasználó feladatát? Ha egy egyszerű eseményoldal több megabájtnyi követőt, animációt és használaton kívüli kódot tölt le, akkor nem a funkció, hanem a figyelmetlen tervezés terheli a látogatót.

## Backend-mérés és UX-mérés: miért mondanak mást?

A backend oldaláról sokszor egy kérés feldolgozási ideje látható: mikor érkezett meg, mennyi ideig dolgozott rajta az alkalmazás, milyen státuszkóddal válaszolt. Ez értékes adat, de csak a történet egyik része. Nem tartalmazza feltétlenül a DNS-feloldást, a kapcsolat létrejöttét, a rádiós hálózat ingadozását, az erőforrások utólagos letöltését, vagy azt, mennyit küzd a felhasználó telefonja a megjelenítéssel.

A UX-, illetve felhasználói élményhez közeli mérés ezzel szemben azt nézi, amit a böngészőben valóban megélnek: mennyi idő után jelent meg a releváns tartalom, mennyi ideig volt blokkolt az interakció, és tapasztaltak-e váratlan elrendezésváltozást. Egyetlen szervernapló alapján ezért veszélyes kimondani, hogy „a weboldal gyors”. Lehet, hogy a szerver gyorsan elküldi a kezdeti HTML-t, de az oldal további tíz külső szolgáltatásra vár, vagy a kliens eszközön túl sok szkript akadályozza a használatot.

A két nézőpont nem versenytárs. A backend-mérés segíthet megtalálni, ha egy adatbázis vagy külső API lassít; a UX-mérés pedig megmutatja, hogy a javítás valóban érzékelhető-e a felhasználónak. Ha a backend gyors, de a UX rossz, a vizsgálat a kliens, a hálózat és az erőforrások felé fordul. Ha a UX romlik és a szerveroldali idő is nő, valószínűleg közös ok vagy egymást erősítő probléma van.

## Átlagok helyett eloszlások

> [!note] Az átlag elfedheti a lassú eseteket
> Az átlagérték könnyen elfedhet rossz élményeket. Ha kilenc kérés 100 milliszekundum, egy pedig 10 másodperc, az átlag körülbelül 1,09 másodperc. Ez elfogadhatónak tűnhet, miközben a tizedik felhasználó számára a szolgáltatás egyértelműen rossz. Ezért gyakori, hogy a lassabb eseteket is vizsgálják, például azt kérdezik: a kérések 95%-a milyen idő alatt készült el? Ez a 95. percentilis jellegű gondolkodás közelebb visz ahhoz, hogy ne csak a szerencsés átlagfelhasználót lássuk.

Az időbeli mintázat is számít. A rendszer lehet gyors hétköznap délelőtt, és lassú akkor, amikor mindenki megpróbál jegyet venni. A teljesítmény értelmezése mindig kapcsolódjon terheléshez, eszközhöz, hálózathoz és felhasználói feladathoz. Ettől a mérés nem bonyolultabb kedvéért lesz részletesebb, hanem igazságosabb képet ad.

## Példa: a gyors API és a lassú webshop

Egy webáruház fejlesztői azt látják, hogy a termékadatokat adó API átlagosan 120 milliszekundum alatt válaszol. Ebből arra következtetnek, hogy a termékoldal gyors. A vásárlók mégis panaszkodnak: mobilon sok másodpercig tart, mire kiválaszthatják a méretet.

Vizsgálatkor kiderülhet, hogy a termékfotók túl nagyok, több külső mérőkód lassítja a betöltést, és a méretválasztó működéséhez nagy mennyiségű kliensoldali kódot kell feldolgozni. Az API-mérés nem volt hamis, csak nem az egész felhasználói folyamatot mérte. A megoldás sem egyetlen „gyorsítási trükk”: annak eldöntése, mely tartalom elsődleges, mely erőforrás szükséges azonnal, és mi halasztható későbbre.

## Gyakori félreértések

**„A betöltési idő ugyanaz, mint a szerver válaszideje.”** A szerver válaszideje csak egy komponens. A böngészőoldali feldolgozás és a hálózat sokat hozzáadhat.

**„A gyors internettel rendelkező fejlesztő gépén végzett próba elég.”** A felhasználók eszközei és kapcsolatai változatosak; különösen mobilon lehet nagy az eltérés.

**„Minél több tartalom van egyszerre az oldalon, annál jobb.”** A korai hasznosságot és a reakciót gyakran éppen a felesleges kezdeti terhelés rontja.

**„Az átlag válaszidő jól leírja a minőséget.”** Az átlag elrejtheti a lassú, de valós felhasználói eseteket.

## Megismert fogalmak

- **Válaszidő:** a kérés indításától a válasz megérkezéséig eltelt idő.
- **Késleltetés:** az adat továbbításából és feldolgozásából eredő időbeli késés.
- **Betöltési idő:** a weboldal megjelenésének és használhatóságának fokozatos folyamata.
- **Interakciós késés:** a felhasználói művelet és az érzékelhető reakció közötti idő.
- **Backend-mérés:** szerveroldali működést leíró mérés.
- **UX-mérés:** a felhasználó böngészőben tapasztalt élményéhez közeli mérés.
- **Percentilis:** az eloszlást leíró érték; például a 95. percentilis alatt van a mérések 95%-a.
