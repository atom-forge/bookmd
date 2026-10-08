---
type: content
tags:
  - problem-framing
  - success-criteria
  - assumptions
---
# Problémakeretezés és sikerkritérium

## Célok

A lecke végére képes leszel megoldási ötlet helyett felhasználói problémát megfogalmazni, a problémát bizonyítékra épülő feltételezésekre bontani, és olyan sikerkritériumot írni, amelyet prototípuson vagy teszten valóban ellenőrizni lehet.

## A megoldás nem probléma

> [!note] Kulcsgondolat
> Tervezési beszélgetésben gyakran hangzanak el ilyen mondatok: „Kell egy mobilapp”, „tegyünk be chatbotot”, „legyen egy modernebb dashboard”. Ezek javaslatok egy lehetséges megoldásra. Nem mondják meg, ki a használó, mit próbál elérni, mi akadályozza, és mekkora a hiba következménye. Ha túl korán ragaszkodunk hozzájuk, a kutatás csak azt keresi majd, miért jó a már kiválasztott ötlet.

Hasznos keret: **[felhasználó] [helyzetben] [célt] szeretné elérni, de [akadály] miatt [következmény] éri.** Például: „Az elsőéves hallgató tárgyfelvételkor össze szeretné hasonlítani az ütköző kurzusokat, de az időpontok több külön nézetben jelennek meg, ezért bizonytalan döntést hoz.” Ez még nem megoldás. Viszont kijelöli a vizsgálatot: tényleg ez okozza-e a gondot, kiknek, milyen gyakran, és milyen információ segítene.

## A probléma elemei

Egy erős problémamegfogalmazásnak van szereplője, helyzete, célja, akadálya és következménye. A **helyzet** azért fontos, mert ugyanaz az ember mást igényelhet akkor, amikor először tájékozódik, és mást közvetlenül egy határidő előtt. A **következmény** segít priorizálni. Egy félreérthető címke bosszantó lehet, de egy rossz lemondási feltétel pénzügyi veszteséget vagy elveszett időpontot okozhat.

Ne próbálj túl nagy problémát megoldani. „Az egyetemi ügyintézés bonyolult” igaz lehet, de egy féléves projekt számára nem kezelhető. A „hallgató nem tudja megállapítani, kell-e még dokumentumot feltöltenie a kérvény elküldése előtt” már egy vizsgálható, tervezhető feladat.

## Feltételezések és bizonyítékok

A kezdeti problémakeret szükségszerűen tartalmaz feltevést. Ez nem hiba, ha láthatóvá teszed. Készíts **feltételezési térképet**: melyik állításod származik megfigyelésből, melyik a briefből, és melyik csak logikusnak tűnik. Jelöld a kockázatot is: ha az állítás téves, mennyire változik meg a terv?

Például azt feltételezheted, hogy a felhasználók telefonon intézik a foglalást. Ha ez nem igaz, akkor a reszponzív nézet még mindig fontos lehet, de nem biztos, hogy az lesz a fő tervezési kérdés. Ezzel szemben ha azt feltételezed, hogy mindenki érti a szolgáltatás szakzsargonját, és ez téves, az a teljes navigációt és tartalmat érintheti.

## Sikerkritérium: miből tudjuk, hogy jobb lett?

A sikerkritérium ne legyen esztétikai ítélet, például „legyen letisztult” vagy „a tesztelő szeresse”. Kapcsolódjon viselkedéshez és következményhez. Egy jó kritérium egyértelműen leírja a feladatot, a siker jelét és lehetőség szerint a hibát vagy ráfordítást is.

Példák:

- A résztvevő külső segítség nélkül kiválaszt egy számára megfelelő időpontot, és meg tudja mondani a lemondás feltételét.
- A résztvevő első próbálkozásra helyesen tölti ki a kötelező mezőket, vagy a hibaüzenetből javítani tudja az adatot.
- A résztvevő a foglalás után biztosan meg tudja mondani, hogy a foglalás létrejött-e, mikor, hol és mi a következő lépés.

Kis kutatásnál nem kell statisztikailag általánosítható mérőszámot ígérni. Az is értékes eredmény, ha három releváns résztvevő ugyanazon a ponton elakad, és a módosított prototípusban ez az elakadás megszűnik. A fontos az, hogy az állítást a minta korlátaihoz igazítsd.

## Végigvezetett példa: helyi esemény keresése

Kiinduló ötlet: „kell egy térképes eseményapp”. Kutatási kérdés: hogyan talál a hallgató ma esti, hozzá illő programot? A beszélgetésekből kiderülhet, hogy nem a helyszín hiánya a fő gond, hanem az, hogy az eseményoldalakból nem derül ki gyorsan az ár, a kezdési idő, a nyelv vagy az előzetes regisztráció. A probléma új kerete: „A spontán programot kereső hallgató kevés idő alatt szeretné összehasonlítani a ma esti eseményeket, de a döntéshez szükséges alapadatok szétszórtan vagy hiányosan jelennek meg, ezért feladja a keresést vagy rossz programot választ.”

Ebből még nem következik, hogy térkép kell. Első prototípus lehet egy jól szűrhető lista, amelyben az összehasonlításhoz fontos adatok előre láthatók. A teszt sikerkritériuma: a résztvevő két perc alatt találjon saját feltételeinek megfelelő eseményt, és tudja megmagyarázni, miért felel meg neki.

## Gyakori tévhitek

| Állítás | Pontosítás |
| --- | --- |
| „Minél részletesebb a problémamondat, annál jobb.” | A részlet akkor hasznos, ha kutatható vagy döntést befolyásol. A költött háttértörténet nem bizonyíték. |
| „A sikerkritérium azonos a projektcélunkkal.” | A projektcél tág lehet; a sikerkritérium a konkrét tervezett feladat ellenőrzési módja. |
| „Ha a résztvevő megoldotta, nincs probléma.” | Figyeld a kerülőutakat, bizonytalanságot, hibákat és azt is, hogy értette-e a következményt. |

## Ellenőrző kérdések

1. Miért nem problémafelvetés a „készítsünk letisztult felületet”?
2. Melyik sikerkritérium lenne megfigyelhető a saját projektedben?
3. Melyik feltételezésed lenne a legkockázatosabb, ha tévesnek bizonyulna?
4. Hogyan szűkítenéd egy túl nagy problémát egyetlen tesztelhető feladatra?

## Fogalomtár

**Feltételezés:** még nem ellenőrzött állítás, amely tervezési döntést befolyásolhat.  
**Problémakeretezés:** a felhasználó, helyzet, cél, akadály és következmény világos megfogalmazása.  
**Sikerkritérium:** megfigyelhető jel, amelyből eldönthető, elérte-e a felhasználó a célt.  
**Tervezési hipotézis:** ellenőrizhető állítás arról, hogy egy változtatás milyen felhasználói hatást okoz.
