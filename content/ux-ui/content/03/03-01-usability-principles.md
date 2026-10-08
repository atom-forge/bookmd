---
type: content
tags:
  - usability
  - heuristics
  - mental-models
---
# Használhatósági alapelvek

## Célok

Az anyag végére a hallgató érti, hogy a használhatóság nem azonos a gyors kattintással vagy a látványossággal. Képes egy feladatfolyamatban azonosítani az állapotláthatóság, a következetesség, a hibamegelőzés és a felhasználó nyelvének problémáit, majd ezekre indokolt javítási hipotézist megfogalmazni.

## Mitől használható egy felület?

> [!note] Kulcsgondolat
> Egy felület akkor használható, ha a célfelhasználó a saját helyzetében eredményesen, elfogadható erőfeszítéssel és kellő biztonsággal végre tudja hajtani a feladatot. Ez több, mint az, hogy a felhasználó végül valahogy eljut a célhoz. Ha húsz perc keresés, sok visszalépés és folyamatos bizonytalanság után sikerül foglalni, akkor a rendszer technikailag működött, de az élmény gyenge lehet.

A használhatóságot mindig feladatban vizsgáljuk. Egy adminisztrációs rendszerben a ritka, bonyolult funkció lehet elfogadható, ha szakértő használja és nagy a kockázat; egy napi többször végzett rutinfeladatnál ugyanennyi lépés már komoly teher. Nem létezik minden helyzetben „egyszerű” felület: a kérdés az, hogy a feladat, az ember és a következmény arányában érthető-e.

## A rendszer állapota legyen látható

A felhasználónak tudnia kell, mi történik és mi történt. Mentés után ne maradjon néma a rendszer; betöltéskor ne úgy tűnjön, mintha a gomb nem reagált volna; hosszabb folyamatnál legyen érzékelhető az előrehaladás. Az állapotjelzés különösen fontos, amikor a felhasználó időt, pénzt vagy személyes adatot kockáztat.

Egy foglalás elküldése után a „Sikeres” üzenet kevés, ha nem mondja el, mi lett sikeres. Erősebb visszajelzés: „A foglalásod létrejött június 12., 16:30-ra. Visszaigazolást küldtünk erre az e-mail-címre. Lemondani legkésőbb 24 órával előtte lehet.” Ez nem több díszítés, hanem a feladat lezárása.

## A felhasználó nyelve és mentális modellje

A rendszer belső kategóriái gyakran nem egyeznek a felhasználó fejében lévő fogalmakkal. Egy egyetemi oldalon a „kreditelismerési eljárás” lehet hivatalosan pontos, de egy elsőéves lehet, hogy „korábbi tárgy beszámítása” kifejezést keres. A megfelelő címke nem leegyszerűsítés, hanem kapcsolat a felhasználó célja és a rendszer működése között.

Ezért ne csak azt kérdezd, helyes-e a szöveg. Azt is kérdezd, mit vár az ember egy címkére kattintva, és honnan tudja, hogy jó helyen jár. A metaforákkal is óvatosan kell bánni: az ikon vagy elnevezés csak akkor gyorsít, ha közös jelentésre épül.

## Következetesség, szabadság és hibamegelőzés

Az azonos szerepű elemek viselkedjenek hasonlóan. Ha egy kék, aláhúzott szöveg mindenhol link, ne legyen egyetlen helyen csak dekoráció. Ha a vissza nyíl egy lépést visz vissza, ne törölje közben a kitöltött adatot. A következetesség csökkenti a tanulási terhet, mert a felhasználó a korábbi tapasztalatát alkalmazhatja.

A felhasználói szabadság azt jelenti, hogy van biztonságos visszaút: visszavonás, szerkesztés, mentett piszkozat vagy egyértelmű kilépés. Ez nem minden esetben lehetséges – például végleges banki átutalásnál más szabályok vannak –, de éppen ezért a rendszernek a művelet előtt kell megelőznie a hibát. Jó hibamegelőzés lehet az értelmes alapérték, a nem lehetséges opció elrejtése vagy magyarázott tiltása, illetve a kritikus adatok összefoglalása a beküldés előtt.

## Felismerés előnyben a felidézéssel szemben

Az emberi rövid távú memória korlátozott. Ne várd el, hogy a felhasználó egy előző képernyőről megjegyezzen azonosítót, szabályt vagy összeget. A releváns információ legyen ott a döntés helyén. Ez nem azt jelenti, hogy minden képernyőre minden adatot ki kell írni; a feladat szempontjából szükséges részletet kell elérhetővé tenni, világos csoportosításban.

## Végigvezetett példa: hibás díjfizetés

Egy rendezvényoldal fizetéskor csak annyit jelez: „Sikertelen tranzakció.” A használhatósági probléma nem kizárólag a szöveg rövidsége. A felhasználó nem tudja, terhelték-e a kártyáját, megmaradt-e a helye, újra próbálhat-e fizetni, és ha igen, hogyan. A javítási tervnek ezt a bizonytalanságot kell kezelnie: egyértelmű státusz, megőrzött foglalás vagy annak hiánya, következő lépés és elérhető segítség. A hibaüzenet így a folyamat része lesz, nem a folyamat vége.

## Gyakori tévhitek

| Állítás | Pontosítás |
| --- | --- |
| „A kevesebb elem mindig egyszerűbb.” | Ha a szükséges információ hiányzik, a felhasználó külső kereséssel vagy találgatással pótolja; ez összességében bonyolultabb. |
| „A felhasználó hibázott, ezért elég jelezni.” | A rendszer feladata, hogy a hiba esélyét, következményét és javítási költségét csökkentse. |
| „A következetesség egyformán kinéző komponenseket jelent.” | Elsősorban azonos jelentést és viselkedést jelent. |

## Ellenőrző kérdések

1. Hol kell a projektedben állapot-visszajelzést adni?
2. Melyik belső vagy szakmai kifejezésedet kellene felhasználói nyelvre fordítani?
3. Milyen kritikus hibát tudnál megelőzni, nem csak utólag jelezni?
4. Melyik információt kényszeríted ma emlékezésre a felhasználónál?

## Fogalomtár

**Állapotláthatóság:** annak jelzése, hogy a rendszer mit csinál és milyen eredményre jutott.  
**Hibamegelőzés:** a hibás művelet lehetőségének vagy következményének csökkentése.  
**Mentális modell:** a felhasználó elképzelése arról, hogyan működik a rendszer.  
**Használhatóság:** a feladat eredményes, hatékony és elégedettséget támogató elvégezhetősége.
