---
type: content
tags:
  - microinteractions
  - transitions
  - feedback
---
# Mikrointerakciók és átmenetek

## Célok

A hallgató képes lesz megkülönböztetni a feladatot segítő mikrointerakciót a puszta dekorációtól. Tudatosan tervezi meg, mit jelez egy átmenet, mennyi ideig tart, és hogyan marad kezelhető mozgásérzékeny vagy figyelemben korlátozott felhasználók számára is.

## Kis visszajelzések, nagy bizonytalanságok

> [!note] Kulcsgondolat
> A mikrointerakció rövid, egy célhoz kötött visszajelzés: mező érvényessége, mentés, kiválasztás, sikeres művelet vagy módosult mennyiség. Értéke nem a látványosságban, hanem abban van, hogy a felhasználó érti-e belőle a rendszer állapotát. Egy „Mentve” jelzés, amely röviden megjelenik és közben az adat is láthatóan frissül, csökkenti az ismételt kattintást és a kételyt.

Az átmenet segíthet a változás követésében: például egy kártya részleteinek megnyitásakor jelzi, hogy ugyanannak az elemnek a mélyebb nézete érkezik. Ha azonban túl hosszú, túl gyakori vagy nem kihagyható, lassítja a rutinfeladatot és zavaró lehet. A mozgás soha ne legyen a tartalom egyetlen közvetítője.

## Időzítés és vezérlés

A jó átmenet rövid, kiszámítható és arányos a művelettel. Kerüld azokat az animációkat, amelyek alatt nem lehet továbblépni, vagy amelyek minden apró választásnál elvonják a figyelmet. Automatikusan induló mozgásnál, villogásnál vagy folyamatosan változó tartalomnál különösen fontos a szüneteltetés és a csökkentett mozgás beállításának tisztelete.

## Végigvezetett példa

Egy foglaló felületen időpontválasztás után a rendszer csak a gomb színét változtatja. A felhasználó nem biztos benne, hogy a választás tényleg bekerült-e az összefoglalóba. A jobb visszajelzés egyszerre frissíti a kiválasztott időpont állapotát, az összefoglalót és a továbblépés lehetőségét. Az animáció itt csak a kapcsolatot segítheti láthatóvá tenni; nem helyettesítheti a szöveges állapotot.

## Ellenőrző kérdések

1. Melyik mikrointerakció csökkentene valódi bizonytalanságot a projektedben?
2. Van-e olyan mozgás, amely nélkül a felhasználó nem értené a változást?
3. Melyik átmenet lassítja inkább a feladatot, mint segíti?

## Fogalomtár

**Mikrointerakció:** rövid, egyetlen felhasználói művelethez vagy állapothoz kötött visszajelzés.  
**Átmenet:** két felületi vagy rendszerállapot közötti vizuális változás.  
**Csökkentett mozgás:** olyan beállítás, amely a felhasználó számára mérsékli a nem szükséges animációt.  
**Időzítés:** a visszajelzés vagy átmenet hossza és megjelenésének pillanata.
