---
type: content
tags:
  - accessibility
  - inclusive-design
  - wcag
---
# Inkluzív tervezés és WCAG

## Célok

Az anyag végére a hallgató megérti, hogy a hozzáférhetőség nem különleges felhasználók utólagos kedvezménye, hanem a jó digitális szolgáltatás alapfeltétele. Ismeri a WCAG POUR elveit, és képes alapvető kockázatokat felismerni szín, kontraszt, billentyűzet, szöveg és visszajelzés területén.

## Kinek tervezünk?

> [!note] Kulcsgondolat
> Az akadály lehet tartós, átmeneti vagy helyzeti. Képernyőolvasót használhat vak vagy gyengénlátó ember; ideiglenesen csak billentyűzettel dolgozhat valaki kézsérülés után; feliratot kérhet egy hallgató zajos vonaton; nagyobb betűméretre lehet szükség erős napsütésben vagy fáradt szemmel. A felhasználói képességek és körülmények nem kivételek, hanem a valós használat részei.

Az inkluzív tervezés kérdése ezért nem az, hogy „hogyan készítsünk külön verziót”, hanem az, hogy ki maradhat ki a jelenlegi döntésből. A valódi gomb alapból fókuszálható és billentyűzettel működtethető; a kattintható `div` utólagos javítása sok további, könnyen elfelejtett részletet igényel. A hozzáférhetőség gyakran az egyszerűbb, robusztusabb megoldást erősíti.

## A WCAG POUR szemlélete

A Web Content Accessibility Guidelines négy alapelve könnyen megjegyezhető a POUR betűszóval.

**Észlelhető (perceivable):** az információ valamilyen módon felvehető. A képhez értelmes alternatív szöveg, a videóhoz felirat vagy leirat, a csak színnel jelzett állapothoz további jelzés szükséges lehet. A szövegnek kontrasztosnak és nagyíthatónak kell maradnia.

**Működtethető (operable):** minden lényeges funkció kezelhető. Nem feltételezhetünk egeret, érintést vagy gyors reakciót. A fókusz legyen látható, a billentyűzetes sorrend logikus, a mozgás vagy időkorlát pedig ne akadályozza a feladatot.

**Érthető (understandable):** a szöveg, a viselkedés és a hibaüzenet világos. A „Hibás adat” nem elég; az „Az e-mail-címben hiányzik a @ jel” segít javítani. A váratlan állapotváltozás és a következetlen elnevezés is érthetőségi probléma.

**Robusztus (robust):** a felület szabványos, különféle böngészőkben és segítő technológiákkal is értelmezhető szerkezetre épül. A szemantikus elemek és a helyesen használt címkék ezért fontosak.

## Kontraszt, szín és jelzés

Normál méretű szövegnél a gyakran hivatkozott WCAG AA cél legalább 4,5:1 kontrasztarány; nagy szövegnél 3:1. Ezek nem dekorációs szabályok. Rossz kijelzőn, napfényben vagy fáradt szemmel a gyenge kontraszt mindenki számára problémát okozhat.

A szín legyen kiegészítő jelzés, ne az egyetlen. Hibás, ha egy űrlapmező csak piros keretet kap. Jobb, ha a kerethez szöveges hibaüzenet, ikon és programozott kapcsolat is tartozik. Grafikonon a színek mellett felirat, minta vagy közvetlen címke segíthet.

## Billentyűzet és fókusz

Egy gyors kézi ellenőrzéshez tedd félre az egeret, és Tab billentyűvel járd végig a felületet. Látszik-e mindig, hol jársz? Logikus-e a sorrend? Elérhető-e a menü, az űrlap és a bezárás? Felugró ablaknál a fókusznak az ablakba kell kerülnie, a háttér elemei nem maradhatnak véletlenül bejárhatók, bezáráskor pedig ésszerű helyre kell visszatérnie.

## Végigvezetett példa: eseményoldal

Egy kari előadás oldalán az időpont csak naptárikonként, a helyszín csak térképen, a jelentkezés pedig „Kattints ide!” feliratú dobozként szerepel. Inkluzívabb változatban a dátum és cím szövegben is ott van; a jelentkezés valódi, egyértelmű feliratú gomb vagy link; a térképhez szöveges útvonalinformáció tartozik. Nem külön oldalt készítettünk egy csoportnak: ugyanazt a feladatot tettük érthetőbbé mindenki számára.

## Gyakori tévhitek

| Állítás | Pontosítás |
| --- | --- |
| „Az automatikus ellenőrző mindent megtalál.” | Eszköz jelezhet hiányzó címkét vagy kontrasztot, de nem tudja megítélni, hogy az alternatív szöveg vagy a feladatfolyam értelmes-e. |
| „Az ARIA megoldja a szemantikát.” | Az ARIA kiegészítő eszköz; első választás a megfelelő natív elem. |
| „Az akadálymentesség korlátozza a kreativitást.” | Inkább olyan keretet ad, amelyben a látvány egyben érthető és kezelhető marad. |

## Ellenőrző kérdések

1. Mit jelent a POUR négy betűje?
2. Miért nem elég csak színnel jelölni egy hibát?
3. Mit figyelnél Tab-billentyűvel történő bejáráskor?
4. Melyik információ a projektedben jelenik meg kizárólag vizuálisan?

## Fogalomtár

**Akadálymentesség:** annak biztosítása, hogy eltérő képességekkel és segítő technológiákkal is használható legyen a tartalom.  
**Fókusz:** a billentyűzet által éppen vezérelt interaktív elem állapota.  
**Kontrasztarány:** előtér és háttér fényességkülönbségének mérőszáma.  
**WCAG:** a webtartalom akadálymentességére vonatkozó irányelvek rendszere.
