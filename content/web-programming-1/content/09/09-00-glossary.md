---
type: resource
---
# Fogalomtár

## Akadálymentesség (accessibility)

Annak biztosítása, hogy eltérő képességekkel és segítő technológiákkal is használható legyen a tartalom. Célja, hogy a felhasználók érzékelni, megérteni és kezelni tudják a felületet, például billentyűzettel vagy képernyőolvasóval is.

## Inkluzív tervezés

Olyan tervezési szemlélet, amely már a kezdetektől számol a felhasználók sokféleségével. Nem egyetlen átlagos felhasználóra épít, hanem a képességek, eszközök, környezetek és élethelyzetek eltéréseit is figyelembe veszi.

## WCAG

A webtartalom akadálymentességére vonatkozó irányelvek rendszere. Ellenőrizhető sikerkritériumokkal írja le az érzékelhető, működtethető, érthető és robusztus tartalom feltételeit.

## Kontrasztarány

Az előtér és háttér relatív fénysűrűségéből számított arány, amely a vizuális elkülönülés egyik mérőszáma. Két eltérő szín önmagában nem garantál megfelelő kontrasztot, a szükséges érték pedig a tartalom jellegétől is függ.

## Alternatív szöveg (`alt`)

A kép szerepét közvetítő szöveges helyettesítés. A megfelelő szöveg a kép céljától és környezetétől függ, a tisztán díszítő képekhez pedig üres alt attribútum használható.

## Segítő technológia

Olyan eszköz vagy szoftver, amely fogyatékossággal élő felhasználók számára segíti a digitális tartalom érzékelését vagy vezérlését. Például képernyőolvasó, nagyító vagy alternatív beviteli eszköz használhatja a felület szemantikus és hozzáférhetőségi információit.

## Szemantikus HTML

A tartalom jelentéséhez és szerepéhez illő HTML-elemek használata, például címsoroké, listáké és gomboké. Segíti a böngészők és segítő technológiák értelmezését, és sok alapvető viselkedést egyedi megvalósítás nélkül biztosít.

## Fókusz

A billentyűzetes bevitel és vezérlés aktuális célpontját kijelölő állapot. Látható jelzése segít követni a navigációt, és nem szükségszerűen egyezik meg az egérmutató helyével vagy a kijelölt tartalommal.

## Fókuszsorrend

Az elemek bejárásának sorrendje billentyűzetes navigáció közben. A sorrendnek a feladat és a dokumentum logikáját kell követnie, hogy a felhasználó ne kerüljön váratlan vagy zsákutcás helyzetbe.

## Képernyőolvasó

Beszéddel vagy Braille-kijelzőn közvetítő segítő technológia. A hozzáférhetőségi fából közvetíti az elemek nevét, szerepét és állapotát, ezért a puszta vizuális elrendezés nem elég a használatához.

## Landmark

Nagyobb oldalrégiót jelölő szerkezeti elem, például `main` vagy `nav`. A megfelelően jelölt régiók között a segítő technológiák felhasználói gyorsan navigálhatnak, anélkül hogy minden elemet sorban bejárnának.

## ARIA

A dinamikus és összetett webes vezérlők akadálymentességi információit kiegészítő attribútumkészlet. A szerepek, nevek és állapotok közlését segíti, de nem valósítja meg automatikusan a billentyűzetes működést vagy az egyéb vezérlési viselkedést.

## Reszponzív webdesign

Olyan tervezés és megvalósítás, amely a rendelkezésre álló körülményekhez igazítja az elrendezést és interakciót. Az alkalmazkodás a képernyő mérete mellett a beviteli módot és a tartalom fontossági sorrendjét is figyelembe veheti.

## Viewport

A böngészőben az oldal számára rendelkezésre álló megjelenítési terület. Mérete és a nagyítás befolyásolja, mennyi tartalom látszik és milyen elrendezési szabályok lépnek működésbe.

## Töréspont (breakpoint)

Az a feltétel vagy méret, amelynél az elrendezés tudatosan megváltozik. A megfelelő töréspontot a tartalom és az elrendezés igénye határozza meg, nem kizárólag egy ismert eszköztípus szélessége.

## Mobile-first

Kisebb képernyőre épülő alapmegoldás, amely nagyobb helyen bővül. A megközelítés először a lényeges tartalmat és műveleteket teszi használhatóvá szűk helyen, majd ehhez ad nagyobb elrendezési lehetőségeket.

## Tartalmi prioritás

A tartalom és műveletek fontossági sorrendjének tudatos kezelése. Segít eldönteni, mi jelenjen meg először és mi kaphat kisebb hangsúlyt, amikor a hely vagy a figyelem korlátozott.

## Progresszív fejlesztés

Stabil alapélményre épülő, fokozatos képességbővítés. Ha egy fejlettebb képesség nem támogatott vagy hibásan töltődik be, az alapvető feladat továbbra is elvégezhető maradhat.

## Késleltetés

A kérés és a válasz közötti várakozás ideje. A hálózati út, a kiszolgálói feldolgozás és az egymásra váró műveletek egyaránt növelhetik a felhasználó várakozását.

## LCP

A Largest Contentful Paint az oldalbetöltés során a látható terület legnagyobb, mérésre alkalmas tartalmi elemének kirajzolási idejét jellemzi. A fő tartalom megjelenéséről ad támpontot, de nem méri a teljes oldal minden elemének elkészültét.

## INP

Az Interaction to Next Paint az oldal használata során megfigyelt interakciók közül a leglassabbak egyikének késésével jellemzi a válaszkészséget. A bemenetre várás, az eseményfeldolgozás és a következő kirajzolás idejét is figyelembe veszi, ezért nem pusztán egy eseménykezelő futásideje.

## CLS

A Cumulative Layout Shift a váratlan elrendezésváltozások súlyosságát jellemző, mértékegység nélküli mutató. Az elmozdulásokkal érintett területet és távolságot veszi figyelembe, és meghatározott időablakok pontszámai közül a legnagyobbat használja.

## Fő szál

A böngésző azon végrehajtási útja, amely többek között a felület rajzolásáért és sok JavaScript-feladatért felel. Hosszú feladat esetén a felhasználói események kezelése és a következő képernyőfrissítés is várakozhat.

## Cache

Gyorsítótár, amely korábban letöltött erőforrásokat használhat újra. Használata csökkentheti a hálózati forgalmat és a várakozást, de a másolat frissességét a megfelelő szabályokkal kezelni kell.

## Feltérképezés (crawling)

Weboldalak automatikus felfedezése és lekérése. A robot hivatkozásokból és más jelzésekből jut el az oldalakhoz, de a lekérés még nem garantálja az indexbe kerülést.

## Indexelés

A feldolgozott tartalom felvétele kereshető rendszerbe. A rendszer a tartalmat és kapcsolódó jellemzőit feldolgozza, hogy később lekérdezésekre találatként kínálhassa.

## Rangsorolás

A találatok sorrendjének meghatározása egy adott kérdésre. A relevancia mellett több más jelzést is mérlegelhet, ezért az indexben szereplés nem garantál előkelő helyet.

## Metaadat

A dokumentumot leíró, jellemzően a `head` részben található információ. Például a cím, a nyelv és a leírás segítheti az értelmezést, de nem helyettesíti a tényleges oldal tartalmát.

## Strukturált adat

Szabványos formában megadott, gépileg értelmezhető tényhalmaz. A mezők és kapcsolatok egy közös szókészlet szerint írhatók le, így a feldolgozó könnyebben azonosíthat például terméket vagy eseményt.

## AIO

A tananyagban az AI-alapú keresők és asszisztensek számára is érthető tartalom kialakítására használt gyűjtőfogalom. Nem egységes webes szabvány vagy garantált rangsorolási módszer, az elérhető és hiteles tartalom pedig önmagában sem garantál megjelenést egy AI-válaszban.

## Adatminimalizálás

Csak a célhoz szükséges adatok kezelése. Az adatgyűjtés körét, részletességét és megőrzési idejét a meghatározott célhoz kell igazítani, nem a lehetséges későbbi felhasználáshoz.

## Cookie

A böngésző által tárolt, kérésekhez kapcsolható kis adat. Munkamenethez és preferenciákhoz is használható, ezért a jelenléte önmagában nem jelenti, hogy nyomkövetés történik.

## Első fél / harmadik fél

A felkeresett oldal üzemeltetője, illetve a beágyazott külső szolgáltató. A megkülönböztetés az adott felkeresett webhelyhez viszonyított szerepet írja le, nem a szolgáltató általános megbízhatóságát.

## Hozzájárulás

Meghatározott adatkezelési célra adott önkéntes, konkrét, tájékozott és egyértelmű felhasználói döntés. Visszavonhatónak kell lennie, és nem helyettesíti automatikusan az adatkezelés többi követelményét.

## Nyomkövetés

Viselkedés vagy eszköz ismételt felismerése és összekapcsolása. Történhet cookie-val vagy más azonosítóval is, ezért a cookie-k tiltása nem szüntet meg szükségszerűen minden követést.

## Sötét minta

Megtévesztő vagy aránytalan felületi megoldás, amely befolyásolja a döntést. Például nehezítheti az elutasítást vagy a lemondást, miközben a szolgáltató számára kedvező választást hangsúlyozza.

## Ujjlenyomat

Több böngésző- és eszközjellemzőből képzett azonosítási jel. A jellemzők együtt azonosításra vagy összekapcsolásra használhatók, de pontosságuk nem feltétlenül teljes, és időben is változhat.
