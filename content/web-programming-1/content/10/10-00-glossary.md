# Fogalomtár

## Rendelkezésre állás

Annak aránya, hogy a szolgáltatás rendeltetésszerűen használható. Méréséhez meg kell határozni a vizsgált időablakot és a sikeres használat feltételét, például a helyes válaszok arányát.

## Megbízhatóság

A helyes működés kiszámíthatósága időben. A hibamentes vagy elvárt viselkedés a rendelkezésre állás mellett az adatok helyességét és a műveletek következetességét is érintheti.

## Reziliens rendszer

Olyan rendszer, amely hibák vagy kedvezőtlen körülmények mellett is fenntartja a fontos működést, illetve képes helyreállni. A hibák elkülönítése és a kontrollált működéskorlátozás csökkentheti a kiesés hatását, de nem jelent teljes hibamentességet.

## SLI

Mért szolgáltatási mutató. Például a sikeres kérések aránya vagy a válaszidő eloszlása mutathatja, hogyan teljesít ténylegesen a rendszer.

## SLO

Belső célérték egy SLI-re. Meghatározott időablakra jelöli ki az elvárt szolgáltatási szintet, amelyhez a mért teljesítmény összevethető.

## SLA

Külső fél felé tett szerződéses szolgáltatási vállalás. A megállapodás a mérés módját és a vállalás megsértésének következményeit is rögzítheti, ezért eltér a puszta belső céltól.

## Kritikus felhasználói út

A felhasználó céljához szükséges, kiemelten fontos lépéssor. A szolgáltatás minőségét ennek végigjárhatóságával is mérni kell, mert a komponensek külön-külön működése még nem garantál sikeres feladatvégzést.

## Hibakezelés

A rendellenes helyzet felismerése, biztonságos kezelése és kommunikációja. A belső diagnosztikai részleteket el kell különíteni a felhasználónak szánt, érthető és biztonságos tájékoztatástól.

## HTTP-státuszkód

A válasz feldolgozási eredményét jelző szabványos számkód. A háromjegyű kód a kérés protokollszintű kimenetelét jelzi, de az üzleti eredmény értelmezéséhez a válasz tartalma is szükséges lehet.

## Időtúllépés

A várt válasz egy meghatározott időn belül nem érkezik meg. A válasz hiánya nem bizonyítja, hogy a szerver nem hajtotta végre a műveletet, ezért ismétlés előtt ezt a bizonytalanságot is kezelni kell.

## Újrapróbálkozás

Egy sikertelennek látszó művelet ismételt kezdeményezése. Az ismétlés növelheti a terhelést és nem idempotens műveletnél a mellékhatásokat, ezért korlátozás és megfelelő várakozás szükséges.

## Status page

Szolgáltatásállapotot és üzemzavarokat közlő tájékoztató oldal. Elérhető tájékoztatással segíti a felhasználót akkor is, amikor a fő felület hibás vagy csak részben használható.

## Részleges kiesés

Amikor csak a szolgáltatás egyes funkciói nem működnek. Ilyenkor a hiba terjedésének korlátozása és a működő részek világos jelzése fontosabb lehet, mint a teljes szolgáltatás leállítása.

## Válaszidő

A kérés indításától a válasz megérkezéséig eltelt idő. A mérésnél pontosítani kell, hogy az első bájt, a teljes válasz vagy az alkalmazási eredmény megérkezéséig számolunk.

## Késleltetés

Az adat továbbításához, a feldolgozás megkezdéséhez vagy egy műveleti szakasz befejezéséhez kapcsolódó időbeli késés. A teljes kérési út több ilyen késést tartalmazhat, ezért a mérésnél meg kell nevezni a vizsgált kezdő- és végpontot.

## Betöltési idő

Az oldalbetöltés egy meghatározott kezdőpontja és választott készültségi állapota között eltelt idő. Külön mérhető az első megjelenés, a fő tartalom elkészülte és az interaktív használhatóság, ezért nincs minden helyzetre egyetlen teljes betöltési idő.

## Interakciós késés

A felhasználói művelet és az érzékelhető reakció közötti idő. A várakozásban az esemény sorban állása, a feldolgozás és a következő kirajzolás ideje is szerepet játszhat.

## Backend-mérés

Szerveroldali működést leíró mérés. A kiszolgálás okainak feltárásához hasznos, de nem tartalmazza automatikusan a hálózat és a böngésző összes késését.

## UX-mérés

A felhasználó böngészőben tapasztalt élményéhez közeli mérés. A felhasználói eszközön és hálózaton mért betöltés vagy reakció eltérhet a kiszolgáló önmagában kedvező eredményétől.

## Percentilis

Az eloszlást leíró érték; például a 95. percentilis alatt van a mérések 95%-a.

## Cache / gyorsítótár

Korábbi válasz vagy számítás eredményének ideiglenes tárolása újrafelhasználás céljára. A gyorsítás a korábbi eredmény újbóli felhasználásából származik, ezért a frissességet és az eltérő felhasználók adatait megfelelően el kell különíteni.

## Cache hit

A kért tartalom megtalálható a gyorsítótárban és felhasználható. A gyorsítótár kiszolgálhatja a megengedetten friss másolatot, így elkerülhető az eredeti számítás vagy letöltés.

## Cache miss

Nincs használható másolat, ezért az eredeti forráshoz kell fordulni. A hiány oka lehet első lekérés, eltávolított bejegyzés vagy nem megfelelő változat, ezért a rendszernek új eredményt kell beszereznie.

## Origin

Ebben a fejezetben az origin server, vagyis a CDN mögötti eredeti kiszolgáló rövid neve, amely az eredeti tartalomért felel. Nem azonos a böngészőbiztonságban használt origin fogalmával, amely a séma, hosztnév és port együttese.

## CDN

Földrajzilag elosztott kiszolgálóhálózat, amely alkalmas hálózati pontokról kézbesít tartalmat vagy közvetít kéréseket. A késleltetést és az eredeti kiszolgáló terhelését csökkentheti, de a megfelelő pont kiválasztását nem pusztán a földrajzi közelség határozza meg.

## Edge

CDN-csomópont a felhasználóhoz közel. A hálózatilag kedvező kiszolgálási pont csökkentheti a késést, de a tényleges előny a hálózati útvonaltól és a tartalom elérhetőségétől is függ.

## Frissesség

Az az időszak, amikor a tárolt válasz ellenőrzés nélkül felhasználható. A HTTP-ben például a Cache-Control és a válasz kora határozza meg, hogy szükséges-e újraellenőrzés.

## Érvénytelenítés

Korábbi cache-bejegyzés célzott eltávolítása vagy használatának megtiltása. Elosztott gyorsítótárakban a változás átvezetése több helyet érinthet, ezért a frissességi és verziózási szabályokkal együtt kell megtervezni.

## ETag

Egy válaszváltozat azonosítója, amely támogatja a feltételes újraellenőrzést. A kliens If-None-Match feltétellel kérhet újraellenőrzést, és változatlan tartalomnál 304-es válasz csökkentheti az adatátvitelt.

## Terhelés

A rendszerre érkező feldolgozási igény, például kérések vagy háttérfeladatok mennyisége. Az azonos kérési darabszám eltérő erőforrásigényt jelenthet, ha a műveletek költsége vagy az egyidejűség különbözik.

## Kapacitás

Az a terhelési szint, amelyet a rendszer elvárt minőség mellett kezelni tud. Határát a szűk keresztmetszetek és az elvárt válaszidő határozzák meg, ezért nem azonos egyetlen gép névleges teljesítményével.

## p95 válaszidő

Az az idő, amelyen belül a kérések 95%-a teljesül. A lassabb kérések felső öt százalékát nem jellemzi teljesen, ezért további percentilisekkel és hibaaránnyal együtt értelmezendő.

## Rate limit

Kérési gyakoriság tudatos korlátozása egy kliens vagy azonosító számára. A védelem mérsékli a túlterhelést és visszaélést, de a korlátozás kulcsát és időablakát az alkalmazás működéséhez kell igazítani.

## Queue / várakozási sor

Később feldolgozható feladatok pufferelt sorozata. A puffer elnyelhet átmeneti csúcsokat, de tartós kapacitáshiánynál a sor és a várakozási idő növekedhet.

## Graceful degradation

Kevésbé fontos funkciók kontrollált korlátozása a lényeges működés megőrzésére. Például az ajánlórendszer átmeneti kikapcsolása megőrizheti a keresés vagy vásárlás alapvető működését.

## Log

Részletes, eseményszintű naplóbejegyzés. Időbélyeggel és azonosítókkal segíti egy konkrét esemény vizsgálatát, de személyes és titkos adatok naplózását korlátozni kell.

## Metric

Összesített, időben követhető mérőszám. Például kérési darabszám, hibaarány vagy válaszidő-eloszlás használható trendek és riasztási feltételek megfigyelésére.

## Trace

Egy kérés teljes útjának összekapcsolt nyoma több komponensen át. Az összekapcsolt műveleti szakaszok időtartama segít megkülönböztetni a kiszolgálók saját munkáját és az egymásra várakozást.

## Riasztási fáradtság

Túl sok vagy rosszul célzott riasztás miatti figyelemvesztés. Az ismétlődő, nem cselekvést igénylő jelzések miatt a valóban fontos incidensek felismerése is késhet.

## Kompromisszum (trade-off)

Olyan tudatos döntés, amelyben egy cél javítása érdekében elfogadunk egy másik célhoz kapcsolódó korlátot vagy költséget. Az elfogadott következményt a felhasználói cél és az üzemeltetési feltételek alapján kell indokolni, nem csupán egyetlen mutató javulásával.

## Adatminimalizálás

Csak a szükséges személyes vagy üzleti adat gyűjtése, tárolása és továbbítása. A kevesebb adat csökkentheti a feldolgozási és tárolási terhet, valamint az adatvédelmi incidens lehetséges hatását.

## Teljes életciklus-költség

Az induláson túl a fejlesztés, üzemeltetés, felügyelet, javítás és módosítás összes költsége. Az összehasonlításba a hibák kezelése, a biztonsági frissítések és a későbbi technológiaváltás ráfordítása is beletartozik.
