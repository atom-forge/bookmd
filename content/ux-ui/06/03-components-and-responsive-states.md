---
tags:
  - components
  - responsive-design
  - ui-states
---
# 06.03. Komponensek és reszponzív állapotok

## Célok

A hallgató megérti, hogy a komponens ismétlődő szereppel és szabályokkal bíró felületi egység, nem csak másolható grafikai doboz. Képes egy komponens lényeges állapotait és egy képernyő reszponzív viselkedését a feladat szempontjából megtervezni.

## Mi a komponens?

> [!note] Kulcsgondolat
> Komponens lehet gomb, keresőmező, eseménykártya, értesítés vagy időpontválasztó. Akkor érdemes komponensként kezelni, ha ugyanazt a célt több helyen, következetes szabályokkal szolgálja. Egy jó komponenshez nemcsak alapállapot tartozik: tudni kell, mi történik fókuszban, billentyűzetes használatkor, kiválasztva, tiltva, betöltéskor, hibánál vagy hosszú szöveggel.

Az ismétlés nem öncél. Ha két kártya más feladatot támogat, nem kell erőltetni az azonos formát. Ha viszont egy „Foglalás” gomb három helyen más következményt jelez, a felhasználó nem tudja korábbi tudását használni.

## Állapotok dokumentálása

Készíts állapotlistát minden kritikus komponenshez. Egy szövegmezőnél például: alap, fókusz, kitöltött, érvényes, hibás, tiltott és betöltő. Ne csak színváltozást tervezz: legyen látható, érthető és képernyőolvasóval is közvetíthető a változás. Tiltott gombnál mondd el, milyen feltétel hiányzik; hibaállapotnál a javítás módja is legyen világos.

## Reszponzív viselkedés

A reszponzivitás nem az, hogy a desktop elrendezés kisebb lesz. Kis képernyőn megváltozhat a prioritás, a sorrend, a beviteli mód és a rendelkezésre álló figyelem. Először azt döntsd el, mi a nem elveszíthető feladat- és információmag, majd erre építsd a nagyobb nézet bővítéseit. A nagyítás is reszponzív helyzet: ha 200%-on a tartalom levágódik vagy a művelet elérhetetlenné válik, a felület nem eszközfüggetlen.

## Végigvezetett példa

Egy eseménykártya desktopon kép, cím, leírás, címkék és két gomb mellett jelenik meg. Mobilon a két gomb és a hosszú leírás elnyomja az időt és helyet, amelyek a gyors döntéshez kellenek. A reszponzív változat megtartja a címet, időt, helyet, árat és fő műveletet; a részletes leírás és másodlagos művelet külön megnyitható. Ez nem tartalomvesztés, hanem feladat szerinti priorizálás.

## Ellenőrző kérdések

1. Melyik komponens használata ismétlődik a projektedben?
2. Mely állapotát nem tervezted még meg?
3. Mi a képernyőd nem elveszíthető információmagja mobilon?
4. A sorrend nagyításkor is a feladatot támogatja?

## Fogalomtár

**Komponens:** ismétlődő szerepű, dokumentált viselkedésű felületi egység.  
**Állapot:** a komponens adott helyzethez tartozó megjelenése és működése.  
**Reszponzív viselkedés:** a felület feladathoz igazított alkalmazkodása képernyőhöz és használati körülményhez.  
**Információmag:** a feladat elvégzéséhez elengedhetetlen tartalom és művelet.
