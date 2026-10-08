---
chapter: "01.04"
tags: []
---
# Mikroszervizek és az elosztott monolit csapdája

A mikroszervizes architektúrában a rendszer üzleti képességeit önállóan futtatható és kiadható szolgáltatások valósítják meg. Mindegyik szolgáltatásnak világos felelőssége, publikált szerződése és adatkezelési határa van. A „micro” nem sor- vagy osztályszámot jelent: a szolgáltatás mérete a felelősséghez és a csapat munkájához igazodik.

## Mit nyerünk az önállósággal?

A keresőszolgáltatás külön skálázható, a számlázás külön kiadható, a médiafeldolgozás más futtatási környezetet használhat. A csapatok szűkebb kódbázison dolgozhatnak. Egy jól elkülönített szolgáltatás implementációja megváltozhat úgy, hogy a fogyasztói szerződés változatlan marad.

Az önállóság több dimenzióban értendő: fejlesztés, kiadás, adatok és hibakezelés. Nem szükséges minden szolgáltatáshoz külön repó vagy külön fizikai adatbázisszerver. A lényeg a tulajdonosi határ és a változtatások függetlensége. Egy közös monorepó is tartalmazhat külön pipeline-okkal kiadható szolgáltatásokat.

## Mit fizetünk érte?

A helyi hívások hálózati hívásokká válhatnak. Kezelni kell a timeoutot, a részleges meghibásodást, a szerződésverziókat és a távoli jogosultságokat. A több adatgazdát érintő művelethez nem feltétlenül áll rendelkezésre egyetlen tranzakció. A hibakeresés több folyamat logjait és trace-eit kapcsolja össze.

Az üzemeltetés több kiadást, konfigurációt, végpontot és kapcsolatot tart fenn. Ehhez mérés és automatizálás kell. Kis csapatban a szolgáltatásokkal nyert fejlesztési önállóságot könnyen felülírhatja az infrastruktúra gondozásának költsége.

## Az elosztott monolit

Elosztott monolit alakul ki, ha a részek külön folyamatokban futnak, de nem tudnak érdemben külön változni vagy működni. Jele lehet a közös táblák közvetlen írása, a minden változtatásnál szükséges összehangolt kiadás, valamint a hosszú szinkron hívási lánc.

Egy kérés például öt szolgáltatáson halad át, és bármelyik kiesése az egész műveletet megállítja. A hálózati bonyolultság megjelent, de a hibatartomány nem lett kisebb. Az eseményküldés sem oldja meg automatikusan a csatolást: ha minden fogyasztó ugyanazon belső adatstruktúra pontos verzióját várja, továbbra is együtt kell frissíteni őket.

| Szempont | Monolit | Modulit | Mikroszervizek |
| --- | --- | --- | --- |
| Kiadható egység | Közös alkalmazás | Közös alkalmazás | Önálló szolgáltatások |
| Belső határ | Változó szigorúságú | Ellenőrzött modulinterfész | Hálózati szerződés |
| Több funkció tranzakciója | Gyakran helyi | Gyakran helyi | Külön tervezendő |
| Szelektív skálázás | Korlátozott | Korlátozott | Lehetséges szolgáltatásonként |
| Hibakeresés | Egy folyamatból indul | Modulokra bontható | Elosztott megfigyelés szükséges |
| Működtetési költség | Általában kisebb | Általában kisebb | Általában nagyobb |

A táblázat tipikus következményeket mutat, nem abszolút szabályokat. Egy rosszul működtetett monolit sem feltétlenül olcsó, és két egyszerű szolgáltatás sem szükségképpen bonyolultabb egy óriási alkalmazásnál.

> [!warning] Az önállóságot konkrét változtatással bizonyítsd
> A „külön service” címke helyett mutasd meg, hogy egy változtatás külön kiadható, a fogyasztókkal kompatibilis, és egy függőség kiesése kezelhető.

## Döntési szempontok

Mikroszervizt akkor érdemes választani, ha a külön életciklus, terhelési profil, adatgazda vagy csapatfelelősség valós igény. A döntéshez nevezzük meg a nyereséget, a hálózati és adatkezelési költséget, valamint azt, hogyan ellenőrizzük az önállóságot. A cél a változtatás és a működés kezelhetősége, nem a lehető legtöbb szolgáltatás.

## Ellenőrző kérdések

1. Miért nem bizonyítja az önállóságot a külön Git-repó?
2. Milyen jelek alapján neveznél egy rendszert elosztott monolitnak?
3. Milyen helyzetben választanál modulitot mikroszervizek helyett?
