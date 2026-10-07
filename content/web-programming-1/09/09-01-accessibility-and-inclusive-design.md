# 09.01. Akadálymentesség és inkluzív tervezés

Egy egyetemi szolgáltatás akkor használható igazán, ha a különböző képességű, eszközű és helyzetű hallgatók is el tudják érni a szükséges információt és műveleteket. Az akadálymentesség nem külön felületet, hanem a tartalom, az interakció és a technológia tudatos kialakítását jelenti.

## Szükséges előismeretek

- [Dokumentumszerkezet és szemantika](../03/03-02-document-structure-and-dom.md) — a HTML-elemek jelentése.
- [Böngészőképességek](../03/03-06-browser-capabilities.md) — eltérő felhasználói környezetek.

## Miért beszélünk erről egy webes tárgyban?

Képzeljünk el egy egyetemi tárgyfelvételi oldalt. A hallgató nem látja a piros színnel kiemelt hibaüzenetet, mert színtévesztő. Egy másik hallgató kézsérülés miatt néhány hétig csak billentyűzettel tud dolgozni. Valaki zajos vonaton nézi meg a videós tájékoztatót, ezért feliratot szeretne. Egy negyedik lassú, régi telefonon próbálja elolvasni az oldalt erős napsütésben. A probléma nem az, hogy ezek az emberek „rendellenes” körülmények között használják a rendszert. A probléma az, ha a rendszer csak egy elképzelt, egérrel dolgozó, jó látású, gyors hálózaton ülő felhasználóra van tervezve.

A web eredeti ígérete az volt, hogy az információ eszköztől és helytől függetlenül elérhető. Az akadálymentesség ezt az ígéretet teszi komollyá. Jogszabályi, üzleti és etikai okai is vannak, de fejlesztői szemmel a legegyszerűbb indok az, hogy egy szolgáltatás csak akkor teljesíti a feladatát, ha a célközönség valóban használni tudja.

Az „inkluzív tervezés” kifejezés azt hangsúlyozza, hogy ne a végén próbáljuk egy szűk csoport számára kijavítani a rendszert. Már a tervezéskor kérdezzük meg: ki maradhat ki ebből a döntésből? Egy jól megválasztott, valódi gomb például alapból fókuszálható és billentyűzettel aktiválható. Egy kattintható `div` utólagos javítása ezzel szemben sok elfelejtett részletet hoz magával.

```mermaid
flowchart LR
    C[Tartalom] --> P[Észlelhetőség]
    C --> K[Kezelhetőség]
    C --> E[Érthetőség]
    C --> M[Robusztusság]
```

## Akadályok: nem csak fogyatékosságról van szó

Az akadály lehet tartós: vak vagy gyengénlátó ember képernyőolvasót használhat, siket felhasználónak felirat szükséges, egy mozgáskorlátozott ember pedig nem feltétlenül használ egeret. Lehet átmeneti is: eltört kar, szemészeti beavatkozás, migrén vagy egy ideiglenes hallásprobléma. És lehet helyzeti: napsütésben gyenge a kijelző kontrasztja, a felhasználó babát tart a kezében, vagy a videó hangját nem kapcsolhatja be egy könyvtárban.

Ezért hasznos a „képességek spektruma” szerint gondolkodni. Nem kell minden felhasználót személyesen ismerni ahhoz, hogy jobb döntéseket hozzunk. A felirat például a siket felhasználónak nélkülözhetetlen, de nyelvtanuláskor vagy hang nélküli videónézéskor sok más embernek is segítség. A megfelelő címsorstruktúra a képernyőolvasóval dolgozóknak navigációs eszköz, de mindenkinek áttekinthetőbb tartalmat eredményez.

## A WCAG szemlélete: POUR

A Web Content Accessibility Guidelines, röviden WCAG, a webes akadálymentesség széles körben használt irányelve. Nem ellenőrzőlista-varázslat, hanem gondolkodási keret. Négy elve a POUR betűszóval jegyezhető meg: perceivable, operable, understandable, robust.

**Észlelhető (perceivable):** az információt a felhasználó valamilyen érzékszervi vagy technikai módon fel tudja venni. Ha egy diagram csak színekkel különbözteti meg az adatokat, akkor nem mindenki számára észlelhető. Ha egy képen fontos szöveg van, annak szöveges megfelelője is kell. A videóhoz felirat, a hanganyaghoz leirat lehet szükséges. Ide tartozik az olvasható betűméret és a kellő kontraszt is.

**Működtethető (operable):** minden lényeges funkció kezelhető. Ne feltételezzük az egeret, az érintést vagy a gyors reakciót. A billentyűzetfókusz legyen látható, a navigáció logikus, az időkorlátok pedig indokolhatók vagy hosszabbíthatók. Egy automatikusan mozgó tartalom akkor is akadály lehet, ha látványos.

**Érthető (understandable):** a felület nyelve, viselkedése és visszajelzése legyen következetes. Egy űrlapnál a mező címkéje mondja meg, mit kérünk, a hibaüzenet pedig mondja el, mi romlott el és hogyan javítható. A „Hibás adat” nem segítség; az „Az e-mail-címben hiányzik a @ jel” már igen.

**Robusztus (robust):** a tartalom különféle böngészőkben és segítő technológiákkal is értelmezhető legyen. Ennek kiindulópontja a szabványos, szemantikus HTML. A képernyőolvasó nem a látványos CSS-t olvassa, hanem a dokumentum szerkezetét és az akadálymentességi információkat értelmezi.

A WCAG a megfelelést A, AA és AAA szintekben fogalmazza meg. A gyakorlatban az AA szint gyakori cél, de a lényeg nem a matrica megszerzése. Egy formálisan megfelelő oldal is lehet nehezen használható, ha a valós felhasználói feladatokat nem próbáltuk ki.

## Kontraszt, szín és olvashatóság

A design egyik gyakori hibája a túl halvány szürke szöveg, a csak színnel jelzett állapot vagy a dekoratív háttér előtt eltűnő felirat. A kontraszt azt fejezi ki, mennyire különül el a szöveg a háttértől. Általános irányelvként a normál méretű szövegnél legalább 4,5:1, nagy szövegnél legalább 3:1 kontrasztarány a gyakran hivatkozott WCAG AA cél. Ez nem ízléskérdés: egy rossz kijelzőn, fáradt szemmel vagy gyenge fényben a jól látó felhasználó is elveszítheti az információt.

> [!tip] Ne csak színnel közvetíts jelentést
> A szín legyen kiegészítő jelzés, ne az egyetlen. Hibás, ha egy űrlapmezőt csak vörös keret jelöl. Jobb, ha a keret mellett szöveges üzenet és jól felismerhető ikon is megjelenik. Ugyanez igaz grafikonokra: a kategóriák kapjanak feliratot, mintázatot vagy egyéb megkülönböztető jelet is.

## Alternatív szöveg: a kép jelentését írjuk le

Az `alt` attribútum nem a fájlnév ismétlésére való. A `chart-final-v2.png` képernyőolvasóval semmit sem mond. Az alternatív szöveg a kép adott kontextusban betöltött szerepét közvetíti.

Egy termékkatalógusban a `alt="Kék hátizsák elülső nézetben"` hasznos. Egy cikkben szereplő, a szöveget tényleg kiegészítő grafikon esetén az `alt` röviden összefoglalhatja a fő üzenetet: `alt="A regisztrációk száma januártól júniusig folyamatosan nő"`. Ha a kép pusztán dekoráció, gyakran az üres `alt=""` a helyes: így a képernyőolvasó átugorja, nem zajjal terheli a felhasználót. Bonyolult ábránál a rövid alternatív szöveg nem elég; a részletes adatot vagy magyarázatot a környező szövegben is adjuk meg.

## Végigvezetett példa: egy javított eseményoldal

Tegyük fel, hogy egy kari előadás oldalán az időpont egy apró naptárikon mellett szerepel, a jelentkezés egy „Kattints ide!” feliratú színes doboz, a helyszín pedig egy beágyazott térképen látszik. Egy inkluzívabb változatban az oldal valódi címsorokkal tagolt; az időpont szövegként is olvasható; a jelentkezés valódi, egyértelmű feliratú gomb vagy link: „Jelentkezés a szeptember 18-i előadásra”; és a térkép alatt szöveges cím, valamint útvonalinformáció van.

Nem készítettünk külön „vakoknak való” oldalt. Ugyanazt az oldalt tettük érthetőbbé mindenkinek. Ez a jó akadálymentességi döntések tipikus mintája.

## Hogyan kezdjünk hozzá a gyakorlatban?

Egy meglévő oldal javítását érdemes a legfontosabb felhasználói útvonalakkal kezdeni: megtalálható-e az információ, el lehet-e indítani a fő műveletet, és sikerül-e elküldeni az űrlapot? Ezután jöhet egy egyszerű kézi próba: Tab-billentyűvel járjuk végig az oldalt, nagyítsuk fel a böngészőt, kapcsoljuk ki a hangot egy videónál, és nézzük meg, marad-e érthető a felület. Automatizált ellenőrzők ilyenkor jó társak: gyorsan jelezhetnek hiányzó címkéket vagy elégtelen kontrasztot. A találataikat azonban mindig emberi mérlegeléssel kell értelmezni.

Különösen fontos, hogy az akadálymentesség ne egyetlen ellenőrzési nap legyen a projekt végén. Egy új komponens tervezésekor a csapat rögtön dönthet a megfelelő HTML-eleméről, a fókuszállapotról, a hibaüzenetekről és a kis képernyős viselkedésről. Így sokkal kevesebb utólagos javításra van szükség.

## Gyakori félreértések

**„Az akadálymentesség csak a vak felhasználóknak fontos.”** Nem. Látás, hallás, mozgás, figyelem, nyelv, eszköz és környezet is befolyásolhatja a használatot.

**„Egy automatikus ellenőrző eszköz mindent megmond.”** Az eszközök értékesek, de nem tudják megítélni, hogy egy alternatív szöveg valóban értelmes-e, vagy egy folyamat érthető-e.

**„Az ARIA megoldja a problémákat.”** Az ARIA kiegészítheti a szemantikát, de rosszul használva félrevezeti a segítő technológiát. Első választás a megfelelő natív HTML-elem.

**„A hozzáférhetőség korlátozza a kreativitást.”** Inkább keretet ad: a látvány akkor jó, ha közben világos, kezelhető és stabil marad.

## Megismert fogalmak

**Akadálymentesség (accessibility):** annak biztosítása, hogy eltérő képességekkel és segítő technológiákkal is használható legyen a tartalom.

**Inkluzív tervezés:** olyan tervezési szemlélet, amely már a kezdetektől számol a felhasználók sokféleségével.

**WCAG:** a webtartalom akadálymentességére vonatkozó irányelvek rendszere.

**Kontrasztarány:** a két szín fényességkülönbségének mérőszáma; az olvashatóság egyik fontos tényezője.

**Alternatív szöveg (`alt`):** a kép szerepét közvetítő szöveges helyettesítés.

**Segítő technológia:** például képernyőolvasó, nagyító vagy alternatív beviteli eszköz.
