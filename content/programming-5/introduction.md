# Programozás 5. — Mikroszervizes architektúra és kommunikáció

A tárgy azt vizsgálja, hogyan szervezünk egy alkalmazást modulokba vagy önálló szolgáltatásokba, hogyan kommunikálnak ezek a részek, és milyen következménye van a hálózati határoknak. A központi témák a monolit, a moduláris monolit és a mikroszervizek; a REST, RPC, GraphQL és egyedi API-k; a routing és az üzenetküldés; valamint a WebSocket és alternatívái.

## Miről szól a tárgy?

A több szolgáltatásból álló rendszerben az együttműködés szerződés. Meg kell határozni a felelősségeket, az adatgazdákat, az üzenetek jelentését, az időkeretet és a hibák következményét. Egy távoli hívás végrehajtódhat úgy, hogy a válasz nem érkezik meg. Egy üzenet ismétlődhet. Egy tartós kapcsolat megszakadhat. A jó terv ezeket a normál működés részeként kezeli.

Nem az a cél, hogy minden rendszert mikroszervizekre bontsunk. Megtanuljuk felismerni, mikor előnyös a monolit egyszerűsége, mikor segít a modulit belső határa, és mikor indokolható önálló szolgáltatás. Az előnyöket a fejlesztés, skálázás, adatkezelés és hibaterjedés költségeivel együtt értékeljük.

## A tananyag felépítése

Az első három fejezet a szerkezetet, a tervezést és a kommunikáció alapmodelljeit tisztázza. A negyedik egy közös egységben tárgyalja a fő API-stílusokat. Ezután a routing, az aszinkron üzenetküldés és az elosztott adatkezelés következik. Két fejezet foglalkozik a WebSockettel és alternatíváival, a záró rész pedig a hibatűrést és biztonságot kapcsolja össze a szolgáltatáshatárokkal.

A fejezetek nem rögzített órarendi heteket jelölnek. A tervezés, az API-k és az elosztott adatkezelés több alkalmat igénylő egységek. Az anyag olvasásához programozási, alapvető HTTP- és adatbázis-ismeret szükséges; egyetlen keretrendszerhez vagy felhőplatformhoz sem kötődik.

## Tervezés és diagramok

A rendszerkörnyezetet, a komponenseket és a futtatási helyeket strukturális diagramokkal írjuk le. Folyamatábra mutatja a döntési ágakat, szekvencia az üzenetek sorrendjét, állapotdiagram az életciklust. Mermaid-forrásokból készítünk verziókezelhető ábrákat, és ellenőrizzük, hogy a rajz nem állít-e többet a működés garanciáiról, mint amit a rendszer biztosít.

## Hogyan használd?

A leckék önálló fogalmi egységek rövid példákkal. A példák nem egy végigvezetett terméktörténet részei: mindig az adott architekturális kérdést magyarázzák. A kód- és üzenetrészletek szerződést szemléltetnek, nem teljes demonstrációs alkalmazások.

A calloutok fontos különbségeket és gyakori tévedéseket emelnek ki. Az ellenőrző kérdések, számítások és tervezési feladatok segítik a megértést; nem írnak elő új beadási vagy értékelési szabályt. Az eszközfüggő részletekhez a leckék hivatalos dokumentációt és szabványleírást is hivatkoznak.

> [!important] A végére indokolni tudj
> Egy architektúráról ne csak a technológiáit sorold fel. Tudd megmutatni a határait, a kommunikációját, a hibafolyamatait és azt, miért vállalhatóak a kompromisszumai.

[Teljes tartalomjegyzék](summary.md)
