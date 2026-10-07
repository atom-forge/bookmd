# 09.03. Reszponzív és eszközfüggetlen megjelenés

Egy webes oldal kis telefonon, nagy monitoron, nagyított nézetben és eltérő beviteli módokkal is használható kell legyen. A reszponzív tervezés a tartalomhoz igazodó elrendezésről szól, nem néhány készülékméret mechanikus lemásolásáról.

## Szükséges előismeretek

- [HTML, CSS és JavaScript](../03/03-01-html-css-and-javascript.md) — szerkezet és megjelenés kapcsolata.
- [Akadálymentesség és inkluzív tervezés](09-01-accessibility-and-inclusive-design.md) — eltérő használati helyzetek.

## Miért nincs egyetlen normál képernyő?

Egy webhelyet ma lehet 27 hüvelykes monitoron, keskeny telefonon, nagyított böngészőablakban, fekvő táblagépen, tévén vagy képernyőolvasóval használni. A felhasználó elforgathatja a telefont, megosztott képernyőn nyithatja meg a lapot, vagy 200%-os nagyítást állíthat be. Még ugyanazon telefonmodell esetén is különbözhet a rendelkezésre álló hely a böngésző kezelőfelülete, az osztott nézet vagy a betűméret-beállítás miatt.

Ezért az eszközfüggetlenség nem azt jelenti, hogy mindenhol pixelre azonos a látvány. Azt jelenti, hogy az alapvető információ és feladat minden releváns helyzetben elérhető. Egy étterem weboldalán például mobilon elsődleges lehet a cím, a nyitvatartás és a foglalás; széles képernyőn több fotó és részletes történet is kényelmesen megfér. A cél nem a kisebb képernyő „lebutítása”, hanem a fontossági sorrend tudatos kezelése.

```mermaid
flowchart LR
    T[Tartalmi prioritás] --> R[Rugalmas elrendezés]
    R --> S[Szűk viewport]
    R --> N[Nagy viewport]
    R --> Z[Nagyított nézet]
```

## A viewport és a rugalmas tér

A viewport a böngésző azon területe, amelyben a weboldal megjelenik. A reszponzív oldalak nem feltételezik, hogy ez mindig egy előre rögzített szélesség. A rugalmas elrendezés százalékos, `fr`, `minmax()` vagy más relatív egységekkel dolgozhat, hogy a rendelkezésre álló helyhez alkalmazkodjon. A CSS Flexbox és Grid olyan eszközök, amelyekkel a dobozok elosztása nem merev, kézzel számolt koordinátákon alapul.

A merev megközelítésben egy háromoszlopos oldal mindhárom oszlopa fix szélességű. Keskeny képernyőn ebből vízszintes görgetés, összenyomott szöveg vagy levágott tartalom lesz. A rugalmas megközelítésben az oszlopoknak van kívánatos és minimális mérete, majd ahol már nincs elég hely, egymás alá rendeződnek. A döntést nem maga a telefonmodell, hanem a tartalom olvashatósága indokolja.

## Töréspontok: a tartalom törik meg, nem a készülék

A media query lehetővé teszi, hogy bizonyos rendelkezésre álló szélességnél vagy felhasználói beállításnál más elrendezés lépjen életbe. Ezeket a határokat töréspontoknak hívjuk. Rossz kérdés: „milyen szélességű az iPhone?”. Jobb kérdés: „melyik szélességnél nem olvasható már kényelmesen ez a három oszlop, vagy mikor fér el a navigáció?”

Ez a különbség tartósabb megoldást ad. Új készülékek mindig érkeznek, de az a tény, hogy egy kártyának bizonyos minimális szélesség kell, nem változik. Töréspont lehet ott, ahol a navigáció több sorba törne, egy táblázat értelmezhetetlenné válna, vagy a fő művelet eltűnne a hajtás alatt.

## Mobile-first és content-first gondolkodás

A mobile-first megközelítésben az alap stílus a kisebb, egyszerűbb helyzetre készül, majd nagyobb helyen egészül ki. Ez nem azt jelenti, hogy a telefon a fontosabb felhasználó, hanem azt, hogy először kényszerítjük magunkat a lényeg kiválasztására. Ha egy funkció csak óriási kijelzőn fér el, fel kell tenni a kérdést: valóban nélkülözhetetlen-e, vagy át kell szervezni?

A content-first ennél is mélyebb elv. Először a tartalom és a feladat sorrendjét tervezzük meg, és csak utána a dobozokat. Például egy állásajánlatnál a pozíció neve, helye, jelentkezési határidő és jelentkezési lehetőség legyen gyorsan elérhető. Nem érdemes az első képernyőt egy hatalmas dekoratív képpel elfoglalni, ha a felhasználó valójában azt szeretné tudni, még nyitott-e a pályázat.

## Képek, tipográfia és érintési célok

A reszponzív kép nem egyszerűen kicsinyített kép. A nagy felbontású fotó telefonon feleslegesen lassíthatja a betöltést, miközben a mobilhálózat korlátozott. A böngészőnek megfelelő méretű és formátumú erőforrást kell kapnia, ahol ez megoldható. Fontos, hogy a kép aránya megmaradjon, a fontos részlet ne vágódjon le rossz helyen, és a tartalmi jelentés alternatív szövegben is hozzáférhető maradjon.

A tipográfia is alkalmazkodik. A túl hosszú sorok széles monitoron fárasztóak; a túl kis betű telefonon olvashatatlan. A jó olvashatóság nem kizárólag a betűméret kérdése: számít a sorköz, a kontraszt, a bekezdések tagolása és a sorhossz is. A felhasználó saját nagyítását tiszteletben kell tartani; az oldal ne törjön szét attól, hogy valaki nagyobb betűt kér.

Érintőképernyőn nincs egérmutató, a pontatlan ujj pedig nagyobb célfelületet igényel. Egy apró, egymás mellé zsúfolt ikonsor használata frusztráló. A fontos vezérlők legyenek kellően nagyok, egymástól elválasztottak és egyértelműen feliratozottak. Ugyanakkor ne feltételezzük, hogy a mobil csak érintéses: telefonhoz is csatlakozhat billentyűzet vagy kisegítő beviteli eszköz.

## Eszközfüggetlen interakció

> [!warning] Ne a rámutatás legyen az egyetlen elérési mód
> Az egérrel működő „hover” állapot hasznos vizuális visszajelzés lehet, de nem lehet az egyetlen módja egy tartalom vagy funkció elérésének. Érintőképernyőn nincs tartós rámutatás, billentyűzetnél pedig a fókusz a megfelelő párja. A „húzd ide” feladatnak is legyen alternatívája, például gombokkal történő átrendezés. A gesztusok gyorsak lehetnek, de nem szabad kizárólagosan rájuk építeni.

Ugyanez érvényes az orientációra. Ritkán indokolt, hogy egy szolgáltatás csak fekvő vagy csak álló módban használható legyen. Ha egy összetett adatvizualizáció valóban több helyet kér, adjunk világos tájékoztatást, de a többi tartalom akkor is maradjon hozzáférhető.

## Teljesítmény mint inkluzív kérdés

A reszponzivitás nem csak elrendezés. Egy gyors irodai Wi-Fi-n és új laptopon alig észrevehető, ha egy oldal több tucat nagy képet, külső betűtípust és követőkódot tölt be. Lassú mobilhálózaton vagy olcsóbb készüléken ez perceknek tűnhet. A lassú oldal valójában nem hozzáférhető oldal azoknak, akiknek kevés adatkeretük, gyenge kapcsolatuk vagy kisebb teljesítményű eszközük van.

Ezért a tartalmi prioritás teljesítménydöntés is. A fő információ és a fő művelet töltődjön be először. A díszítő, képernyő alatti vagy ritkán szükséges elemek később is érkezhetnek. A fokozatos fejlesztés elve szerint az alapélmény egyszerű, szabványos funkciókkal működik, a fejlettebb képességek pedig javítják, de nem kizárólagosan teszik lehetővé a használatot.

## Végigvezetett példa: egy egyetemi eseményoldal átrendezése

Képzeljünk el egy eseményoldalt asztali nézetben: bal oldalon a program, középen egy nagy előadói fotó, jobb oldalon a jelentkezési doboz. Keskeny helyen a három oszlop nem maradhat meg. A tartalmi prioritás alapján először a cím, időpont, helyszín és „Jelentkezem” gomb jelenik meg. Utána következik a rövid leírás és a program; az előadói fénykép és a kapcsolódó hírek később. A gomb teljes szélességben, jól érinthető méretben látszik, de billentyűzettel is elérhető. A navigáció összehúzódhat, de minden menüpont továbbra is hozzáférhető, nem csak hoverre jelenik meg.

Nagy képernyőn visszatérhet a háromoszlopos elrendezés, mert ott az segíti az áttekintést. Nem két külön webhelyet készítettünk, hanem ugyanazon információ több térben is értelmes megjelenését terveztük meg.

## Gyakori félreértések

**„Reszponzív = mobilbarát.”** A mobil fontos eset, de a feladat ennél tágabb: változó méret, nagyítás, bemenet és hálózat.

**„Elég két töréspont: telefon és desktop.”** A tartalom köztes szélességeken is törhet vagy zsúfolttá válhat. A töréspontokat a konkrét elrendezés alapján válasszuk.

**„Mobilon csak elrejtjük a nehéz részeket.”** Ha a rejtett rész a feladat teljesítéséhez kell, akkor inkább más formában legyen elérhető. A kevesebb nem jelenthet információvesztést.

**„A hover menü modern, tehát jó.”** Kizárólag hoverrel nem mindenki éri el; szükséges billentyűzetes és érintéses működés is.

## Megismert fogalmak

**Reszponzív webdesign:** olyan tervezés és megvalósítás, amely a rendelkezésre álló körülményekhez igazítja az elrendezést és interakciót.

**Viewport:** a böngészőben az oldal számára rendelkezésre álló megjelenítési terület.

**Töréspont (breakpoint):** az a feltétel vagy méret, amelynél az elrendezés tudatosan megváltozik.

**Mobile-first:** kisebb képernyőre épülő alapmegoldás, amely nagyobb helyen bővül.

**Tartalmi prioritás:** a tartalom és műveletek fontossági sorrendjének tudatos kezelése.

**Progresszív fejlesztés:** stabil alapélményre épülő, fokozatos képességbővítés.
