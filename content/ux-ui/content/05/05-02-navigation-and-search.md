---
chapter: "05.02"
tags:
  - navigation
  - search
  - filtering
---
# Navigáció és keresés

## Célok

A lecke végére a hallgató képes lesz megfogalmazni, milyen kérdésekre kell a navigációnak válaszolnia, mikor jelent valódi értéket a keresés, és hogyan kell a találati, szűrési és nulla találatos állapotokat a felhasználói feladathoz igazítani.

## Orientáció a rendszerben

> [!note] Kulcsgondolat
> A jó navigáció folyamatosan segít megválaszolni három kérdést: hol vagyok, mi található itt, és merre mehetek tovább? Ezekre nem csak kenyérmorzsa vagy menü adhat választ. A lap címe, a kiválasztott állapot, a tartalom szerkezete és a visszalépés lehetősége együtt teremt orientációt.

Az elsődleges navigáció a gyakori, nagy értékű belépési pontokat mutassa. A másodlagos navigáció adhat helyet ritkább, de szükséges részleteknek. Ne egyetlen óriási menüben próbálj minden tartalmat egyformán láthatóvá tenni. A navigáció célja nem az, hogy a teljes rendszer szerkezetét bemutassa, hanem hogy a következő értelmes döntést támogassa.

## Mikor kell keresés?

A keresés különösen hasznos, ha sok az egyedi tartalom, a felhasználó ismert nevet vagy kifejezést keres, vagy több azonosan fontos út létezik. Nem gyógyítja azonban a rossz címkézést. Ha a felhasználó nem tudja, mi a keresett dolog neve, a keresőmező önmagában kevés; ilyenkor kategóriák, példák, ajánlások vagy kérdésalapú belépési pontok segíthetnek.

Tervezd meg, mi történik gépeléskor, hibás írásmódnál, túl sok találatnál és nulla találatnál. A szűrés akkor jó, ha a felhasználó által valóban használt döntési szempontokra épül. Egy eseménykeresőben a dátum, helyszín, ár és hozzáférhetőség lehet releváns; a belső adatbázis-kategória kevésbé.

## Találati lista és szűrők

A találatnak annyi információt kell mutatnia, hogy a felhasználó meg tudja ítélni, érdemes-e megnyitnia. A cím önmagában ritkán elég. Jelöld a keresés vagy szűrés aktív feltételeit, és legyen egyszerű visszavonni őket. Ha a rendszer személyre szabott vagy rendezett eredményt ad, azt is kommunikálja: a rejtett logika bizalomvesztést okozhat.

## Végigvezetett példa

Egy könyvtári kereső nulla találatot ad a „pszichó” kifejezésre. A rossz állapot csak azt írja: „Nincs eredmény.” A jobb változat megőrzi a kifejezést, javasol hasonló keresést, felajánlja a szűrők törlését, és megmutatja, kihez lehet fordulni speciális igény esetén. Nem talál ki hamis találatokat, de nem hagyja a felhasználót zsákutcában.

## Gyakori tévhitek

| Állítás | Pontosítás |
| --- | --- |
| „Ha van kereső, nincs szükség jó navigációra.” | A kereső ismert célra jó; a felfedezéshez és a fogalmak megtanulásához a szerkezet is kell. |
| „Minél több szűrő, annál pontosabb találat.” | A túl sok vagy rosszul érthető szűrő növeli a terhet és elrejtheti a jó eredményt. |

## Ellenőrző kérdések

1. Hol, miért és merre tovább: hogyan válaszol ezekre a projekted navigációja?
2. Melyik feladatban keresne a felhasználó ismert nevet, és melyikben inkább böngészne?
3. Mit mutatna a találati listád a cím mellett?
4. Milyen következő lépést adna a nulla találatos állapot?

## Fogalomtár

**Elsődleges navigáció:** a rendszer legfontosabb belépési pontjait mutató navigáció.  
**Szűrő:** a találatok egy vagy több tulajdonság szerinti szűkítésére szolgáló vezérlő.  
**Nulla találatos állapot:** olyan keresési eredmény, amikor a feltételekhez nincs megjeleníthető tartalom.  
**Orientáció:** a felhasználó tudása saját helyéről és lehetséges következő lépéseiről.
