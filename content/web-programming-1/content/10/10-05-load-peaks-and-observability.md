---
chapter: "10.05"
tags: []
---
# Terhelési csúcs és megfigyelhetőség

Csúcsforgalomnál a szolgáltatásnak fel kell ismernie a korlátait, és a legfontosabb műveleteket kell előnyben részesítenie. A várakozási sor, a forgalom korlátozása, a fokozatos szolgáltatáscsökkentés és a megfigyelhetőség különböző eszközök a felhasználók és a rendszer védelmére.

## A terhelés nem egyetlen szám

Egy webáruház normál hétköznapon másodpercenként néhány tucat kérést fogad. Akció kezdetekor vagy egy népszerű koncert jegyértékesítésekor azonban néhány perc alatt ezrek próbálhatják ugyanazt a műveletet elvégezni. Nemcsak az oldalletöltések száma nő: sokan frissítenek, bejelentkeznek, kosárba tesznek, fizetést indítanak. A rendszer különböző részei másként reagálnak erre.

A **terhelés** jelenthet beérkező kérésszámot, aktív felhasználókat, feldolgozandó üzeneteket, adatbázis-műveleteket vagy hálózati forgalmat. A **kapacitás** az a mennyiség, amelyet egy rendszer az elvárt minőség mellett kezelni tud. A határ közelében a válaszidő rendszerint nem lineárisan romlik: a komponensek sorban állnak egymásra várva, a lassú adatbázis több foglalt kapcsolatot okoz, az új kéréseknek pedig még tovább kell várniuk. Emiatt egy kis többlet is látványos összeomlást válthat ki.

Fontos különbség van az átlag és a rossz élmény között. Lehet, hogy az átlagos válaszidő 300 ms, miközben a felhasználók néhány százaléka tíz másodpercig vár. Ezért gyakran percentiliseket figyelnek: a p95 azt mutatja, hogy a kérések 95%-a mennyi időn belül készült el. Egy szolgáltatás minősége sokszor a lassú farokban, nem az átlagban derül ki.

```mermaid
flowchart LR
    U[Sok egyidejű kérés] --> G[Belépési korlát]
    G --> Q[Várakozási sor]
    Q --> S[Elsődleges művelet]
    S --> M[Mérőszámok és naplók]
    M --> D[Döntés a kapacitásról]
```

## Csúcsforgalom: miért súlyosbodik magától a hiba?

Egy lassú oldalra a felhasználó gyakran újra rákattint vagy frissít. Egy kliens automatikusan újrapróbálhat egy sikertelen kérést. Ez érthető viselkedés, de egy már túlterhelt rendszert tovább terhel. Ha a háttérszolgáltatás lassú, az alkalmazásszerver több megnyitott kérést tart életben, több memóriát fogyaszt, és végül más, még működő funkciók is lelassulnak.

> [!tip] Új szerverek előtt keresd meg a szűk keresztmetszetet
> Ezért terhelési helyzetben nem elegendő „több szervert indítani”. Előbb meg kell érteni a szűk keresztmetszetet. Ha a probléma egyetlen adatbázis-zár vagy egy külső fizetési szolgáltató lassulása, a webkiszolgálók számának növelése még több, ugyanoda érkező munkát generálhat. A cache, a sorba állítás, a terheléskorlátozás és a funkciók visszafogása mind azt szolgálja, hogy a rendszer ne saját magát terhelje túl.

## Rate limit: igazságos és védhető hozzáférés

A **rate limit** annak szabályozása, hogy egy kliens, felhasználó, IP-cím vagy hozzáférési token adott idő alatt hány kérést küldhet. Erre nem csak támadások miatt van szükség. Egy hibás programozott kliens percenként ezerszer is meghívhat egy API-t; egy népszerű nyitási pillanatban pedig ugyanaz a személy folyamatos frissítéssel ronthatja mások esélyeit.

A korlátozás lehet egyszerű, például „percenként legfeljebb 60 kérés”, de fogalmi szinten érdemes két kérdést elválasztani: kit azonosítunk, és mit védünk. A bejelentkezési végpontnál gyakran szigorúbb a szabály, mert a jelszópróbálgatás kockázatos. Egy nyilvános képnél engedékenyebb lehet a rendszer. A megfelelő válasz is fontos: a kliensnek világos jelzést kell kapnia, például `429 Too Many Requests` státuszt, és lehetőleg tájékoztatást arról, mikor próbálkozhat újra.

A rate limit nem büntetés. A közös erőforrás használatának szervezése. Rossz kialakítás esetén azonban igazságtalan lehet: egy intézményi hálózat sok hallgatója ugyanazon külső IP-cím mögött jelenhet meg. Ezért a tervezőnek értenie kell a korlátozás következményét, nem csak bekapcsolnia egy kapcsolót.

## Várakozási sorok: nem minden feladatnak kell most elkészülnie

Egyes műveletekhez a felhasználó azonnali választ vár: belépés, termék kosárba helyezése vagy fizetés visszaigazolása. Mások késhetnek: számla e-mailben küldése, nagy kép feldolgozása, értesítések kiküldése, keresőindex frissítése. A **queue**, azaz várakozási sor ez utóbbi munkákat leválasztja a közvetlen kérésről. A webalkalmazás gyorsan elfogadja a feladatot, majd egy háttérfolyamat később, a saját tempójában dolgozza fel.

Például feltöltött videónál rossz élmény volna, ha a böngésző addig várna, amíg minden felbontású változat elkészül. A rendszer inkább visszajelezheti: „A feltöltés sikerült, a feldolgozás folyamatban van.” Ez javítja a válaszkészséget, és kisimítja a terhelést. Cserébe meg kell tervezni a késést, az esetleges sikertelen feldolgozást és azt, hogy egy feladat kétszer futva se okozzon kétszeres hatást.

## Fokozatos leállás: graceful degradation

A **graceful degradation**, magyarul fokozatos leállás vagy romlás, azt jelenti, hogy hiba vagy túlterhelés esetén a rendszer nem egyetlen pillanatban válik használhatatlanná. Először a kevésbé fontos funkciókat korlátozza, egyszerűbb nézetet ad, vagy későbbi feldolgozást ajánl. A legfontosabb feladatokat próbálja megőrizni.

Egy jegyértékesítő rendszernél például átmenetileg kikapcsolható a személyre szabott ajánlórendszer, kevesebb képet tölthet be az oldal, és a keresés helyett előre definiált kategóriák jelenhetnek meg. Az alapvető cél – a jegyek korrekt kiválasztása és megvásárlása – előnyt kap. Ha a készletinformáció nem garantálható, a rendszernek őszintén kell kommunikálnia, nem szabad hamis ígérettel elkérnie a fizetést.

Ez nem a minőség feladása, hanem a prioritások tudatosítása. A tervezéskor meg kell kérdezni: mi a szolgáltatás minimálisan elfogadható működése? Mely adatnak kell pontosnak lennie? Mi várhat? Mit lehet ideiglenesen elrejteni? A válasz üzleti, felhasználói és etikai kérdés is.

## Megfigyelhetőség: honnan tudjuk, mi történik?

Egy összetett webes rendszer állapota nem látható közvetlenül. A felhasználó annyit mond: „lassú az oldal” vagy „nem sikerült a fizetés”. A **megfigyelhetőség** (observability) azoknak a jeleknek, adatoknak és összefüggéseknek a kialakítása, amelyekből a rendszer belső állapotára következtetni tudunk. Nem egyetlen grafikonról van szó, hanem egymást kiegészítő nézőpontokról.

A **log** vagy napló konkrét események időrendi feljegyzése. Például: egy adott kérés mikor érkezett, melyik felhasználóhoz vagy azonosítóhoz tartozott, milyen hiba történt. A napló részletes, de nagy mennyiségben nehéz átlátni. Személyes adatot vagy jelszót nem szabad felelőtlenül naplózni; a hasznosság és adatvédelem itt is egyensúly.

A **metric**, vagyis mérőszám összesített, rendszeresen gyűjtött érték. Ilyen a percenkénti kérésszám, a hibaarány, a p95 válaszidő, a várakozási sor hossza vagy a rendelkezésre álló memória. A metrikák kiválóak a trendek és rendellenességek észrevételére. Ha a hibaarány 0,1%-ról 8%-ra ugrik, az akkor is feltűnik, ha még nem tudjuk, melyik felhasználó melyik kérésénél volt a hiba.

A **trace** egyetlen kérés útját követi végig több komponensen. Egy rendelésnél megmutathatja, mennyi idő ment el a webes alkalmazásban, az adatbázisnál, a készletkezelőnél és a fizetési szolgáltatónál. Elosztott rendszerben ez különösen értékes, mert a felhasználó egyetlen műveletként él meg olyan folyamatot, amely valójában több szolgáltatáson halad át.

## Riasztás: nem minden grafikon kér figyelmet

A riasztásnak cselekvést kell kiváltania. Ha egy csapat percenként tucatnyi jelentéktelen üzenetet kap, megszokja és figyelmen kívül hagyja őket – ezt riasztási fáradtságnak nevezik. Jó riasztás ezért nem pusztán azt mondja, hogy egy gép processzora magas, hanem felhasználói hatáshoz kötődik: például tartósan nő a sikertelen fizetések aránya, vagy a bejelentkezések p95 válaszideje meghalad egy küszöböt.

Riasztást gyakran több jel együtt indokol. Egy rövid forgalmi csúcs lehet normális; a növekvő késleltetés, hibaarány és sorhossz együtt már erős figyelmeztetés. A küszöbök nem örök értékek: a rendszer és a felhasználói elvárás változásával felül kell vizsgálni őket.

## Végigvezetett példa: tárgyfelvételi nyitás

Kilenc órakor megnyílik a tárgyfelvétel. A főoldal statikus elemei CDN-ről érkeznek, így nem terhelik az alkalmazást. A belépés rate limitet használ, hogy a tömeges jelszópróba és az agresszív újrapróbálás ne blokkoljon mindenkit. A tárgylista és a férőhely viszont kritikus, ezért a rendszer ezeket pontosan kezeli; ha várakozás kell, azt egyértelmű tájékoztatással teszi.

Az e-mailes visszaigazolások várakozási sorba kerülnek: a hallgató előbb a képernyőn látja a sikeres műveletet, az e-mail később érkezik. Túlterhelés esetén kikapcsolható a nem létfontosságú ajánlás és statisztika. A felügyelet közben a hibaarányt, válaszidőt, adatbázis-kapcsolatok számát és a sor hosszát méri; egy problémás kérés nyomvonala trace-ben vizsgálható, a részletek naplóban kereshetők. Így a rendszer nem csak reagál, hanem diagnosztizálható is.

## Gyakori félreértések

**„Ha van monitoring, biztosan észrevesszük a hibát.”** Csak azt lehet észrevenni, amit mérünk, és csak akkor, ha a jel értelmezhető és valaki reagál rá.

**„A több szerver minden túlterhelést megold.”** Nem, ha az adatbázis, egy külső API vagy egy közös zárolás a szűk keresztmetszet.

**„A rate limit csak a rosszindulatú támadókat érinti.”** Jóindulatú, de hibás vagy túl gyakran újrapróbáló klienst is érinthet; ezért az üzenet és a szabály méltányossága számít.

**„A fokozatos leállás azt jelenti, hogy hibásan működhet a rendszer.”** Épp ellenkezőleg: előre meghatározott, biztonságos korlátozásokat jelent a kontrollálatlan hiba helyett.
