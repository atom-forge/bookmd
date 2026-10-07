---
tags:
  - hypotheses
  - decision-log
  - evidence
---
# 09.01. Hipotézisek és döntési napló

## Célok

A hallgató képes lesz a kutatási vagy tesztleletből ellenőrizhető tervezési hipotézist megfogalmazni. Tudja, miért nem emlékezetből kell a döntéseket magyarázni, és döntési naplóban tudja rögzíteni a bizonyítékot, a változtatást, a várt hatást, valamint a megmaradó bizonytalanságot.

## A leletből hipotézis

> [!note] Kulcsgondolat
> Egy tesztlelet még nem mondja meg automatikusan, mit kell megépíteni. Ha a résztvevők nem veszik észre a lemondási feltételt, több lehetséges ok is van: túl későn jelenik meg, rossz a címkéje, túl hosszú a szöveg, vagy a felhasználó nem ezen a ponton várja. A javítás előtt fogalmazd meg, mit gondolsz az okról és milyen hatást vársz a változtatástól.

Hasznos forma: **Ha [változtatás], akkor [felhasználói viselkedés vagy megértés] javul, mert [feltételezett ok].** Például: „Ha a lemondási feltételt az időpont kiválasztása mellett, rövid összefoglalóban jelenítjük meg, akkor a résztvevők a fizetés előtt helyesen meg tudják mondani a szabályt, mert a döntéshez szükséges információ a választás pillanatában lesz látható.” Ez nem garantálja a sikert, de tesztelhető állítást ad.

## Mire való a döntési napló?

Projekt közben gyorsan elvész, miért került át egy elem, miért hagytunk el egy funkciót, és milyen bizonyíték alapján választottunk két megoldás között. A döntési napló ezt nem adminisztrációként, hanem tanulási eszközként kezeli. Egy bejegyzésben szerepeljen a döntés dátuma vagy iterációja, a kiinduló bizonyíték, a hipotézis, a választott változtatás, az elvetett alternatíva, a várt hatás és a nyitott kérdés.

Ez segít a későbbi prezentációban is. Nem azt kell mondanod, hogy „így jobbnak tűnt”, hanem meg tudod mutatni, melyik résztvevői viselkedésből indultál ki, mit változtattál, és milyen korlát maradt. Ha az új verzió mégsem működik, a napló akkor is érték: nem ugyanazt a zsákutcát futod újra.

## Bizonyíték és bizonytalanság

Ne adj nagyobb bizonyosságot az eredménynek, mint amennyit a kutatás megenged. Három tesztelő ismétlődő elakadása erős jel a prototípus javítására, de nem bizonyítja, hogy minden felhasználó ugyanígy viselkedik éles rendszerben. A naplóban jelöld, hogy egy döntés kutatási adat, szakmai alapelv, korlát vagy feltételezés alapján született-e.

## Végigvezetett példa

Lelet: két résztvevő azt hitte, a kiválasztott időpont automatikusan lefoglalódott. Hipotézis: ha a kiválasztás után egyértelmű összefoglaló és „Foglalás elküldése” művelet jelenik meg, a résztvevők megkülönböztetik a kiválasztást a véglegesítéstől. Döntés: a képernyő tetején látható státusz és a gomb címkéjének módosítása. Nyitott kérdés: mobilon elég hangsúlyos marad-e az összefoglaló? A következő teszt ezt vizsgálhatja.

## Gyakori tévhitek

| Állítás | Pontosítás |
| --- | --- |
| „A döntési napló csak a végén kell.” | A döntéshez közeli rögzítés pontosabb, és a következő iterációt is segíti. |
| „A hipotézis azt jelenti, hogy már tudjuk a megoldást.” | Éppen ellenkezőleg: kimondja, mit kell még ellenőrizni. |

## Ellenőrző kérdések

1. Melyik leletedből tudsz ma hipotézist írni?
2. Mi az a bizonyíték, amely a legerősebb döntésedet alátámasztja?
3. Melyik változtatásod mögött maradt a legtöbb bizonytalanság?

## Fogalomtár

**Hipotézis:** ellenőrizhető feltevés egy változtatás várható hatásáról.  
**Döntési napló:** a tervezési döntések indokát és következményét rögzítő dokumentum.  
**Iteráció:** a terv módosítása új bizonyíték alapján.  
**Nyitott kérdés:** olyan bizonytalanság, amely további vizsgálatot igényel.
