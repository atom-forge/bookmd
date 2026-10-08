---
type: content
tags: []
---
# Szemantika, billentyűzet és képernyőolvasó

A szemantikus HTML az oldal elemeinek szerepét is leírja, nem csupán a kinézetét. A billentyűzettel navigáló és képernyőolvasót használó ember számára különösen fontos, hogy a címsorok, linkek, gombok, űrlapok és visszajelzések értelmezhető szerkezetet alkossanak.

## A szemantika: mit jelent egy elem?

Nézzünk két megoldást egy navigációs elemre. Az egyik egy `div`, amelyre kattintáskezelő került, a másik egy valódi `button` vagy `a` elem. A képernyőn mindkettő lehet kék, lekerekített téglalap. A böngésző és a segítő technológia számára azonban eltérnek. A link egy másik helyre vagy erőforráshoz navigál; a gomb műveletet indít, például megnyit egy párbeszédablakot vagy elküld egy űrlapot.

A szemantikus HTML azt jelenti, hogy a dokumentum jelentéséhez illő elemet választjuk. A `header`, `nav`, `main`, `article`, `aside` és `footer` tájékozódási pontokat ad. A `h1`–`h6` címsorok hierarchiát fejeznek ki. A `p` bekezdés, az `ul` és `ol` lista, a `table` táblázatos adat, a `label` pedig űrlapmezőhöz tartozó megnevezés.

Ez a szerkezet több csatornán hasznos. A képernyőolvasó felhasználó címsorok szerint ugorhat. A keresőmotor jobban érti, mi a fő tartalom. A böngésző és a későbbi karbantartó számára is olvashatóbb lesz a kód. A szemantika ezért nem díszítő szabály, hanem újrahasznosítható jelentés.

```mermaid
flowchart LR
    H[HTML szemantika] --> A[Akadálymentességi fa]
    A --> R[Képernyőolvasó]
    H --> B[Billentyűzetes fókusz]
    B --> U[Felhasználói művelet]
```

## Címsorok: nem betűméretek

Gyakori hiba, hogy egy címnek szánt felirat csak nagyobb, félkövér `div` vagy `span`. Ettől vizuálisan címszerű, de a dokumentumban nem lesz címsor. Ugyanilyen hiba, ha a `h1`–`h6` elemeket csak méretük miatt választjuk.

Egy oldalon általában van egy főcím, a `h1`, majd annak témáit `h2`-k, azok részeit `h3`-ak tagolják. Nem a szám kihagyása a legfontosabb szabály, hanem az értelmes hierarchia. Képzeljük el az oldalt tartalomjegyzékként: ha abból nem érthető a gondolatmenet, a címsorszerkezeten javítani kell.

## A billentyűzet nem másodlagos beviteli mód

Sokan egérrel használják a webet, de nem mindenki. Van, aki fizikai okból, van, aki munkafolyamat vagy személyes preferencia miatt billentyűzettel navigál. A Tab billentyű jellemzően a következő fókuszálható elemre lép, a Shift+Tab visszafelé. Enterrel egy link vagy gomb aktiválható; a Space gyakran gombot, jelölőnégyzetet vagy kapcsolót működtet. A nyílbillentyűk szerepe vezérlőtípustól függhet, például rádiógomb-csoportban vagy menüben.

> [!warning] Maradjon látható a billentyűzetfókusz
> A fókusz azt jelzi, hogy a billentyűzet következő művelete hová fog érkezni. Ennek látszania kell. A CSS-ben olykor esztétikai okból eltüntetik a körvonalat, például `outline: none` használatával. Ez súlyos hiba, ha nincs helyette egyértelmű, jól kontrasztos fókuszjelzés. A felhasználó ilyenkor nem tudja, melyik gombot fogja aktiválni.

A fókuszsorrendnek a tartalom logikus sorrendjét kell követnie. Ha a képernyőn egy űrlap mezői egymás alatt vannak, Tab-bal ne ugráljunk a láblécbe, majd vissza. A látvány CSS-sel átrendezhető, de a HTML sorrendje továbbra is meghatározza, hogyan halad a billentyűzet és a képernyőolvasó.

## Kihagyó link és ismétlődő navigáció

Egy hosszú, minden oldalon ismétlődő menü kényelmes lehet egérrel. Billentyűzettel azonban minden oldalmegnyitáskor végig kellene lépni rajta, mielőtt a fő tartalomhoz érne a felhasználó. Erre szolgál a „Ugrás a fő tartalomra” link. Általában vizuálisan rejtett, de fókuszba kerüléskor láthatóvá válik. Nem látványos funkció, mégis sok ismétlődő műveletet takarít meg.

## Hogyan „lát” a képernyőolvasó?

A képernyőolvasó olyan segítő technológia, amely beszéddel vagy Braille-kijelzőn közvetíti a digitális felületet. Nem a képernyő pixeleit értelmezi úgy, ahogyan az emberi szem, hanem a böngésző által rendelkezésre bocsátott akadálymentességi fát. Ebben szerepel az elem szerepe, neve, állapota és értéke.

Egy jó gombnál például a felhasználó azt hallhatja, hogy „Kosár megnyitása, gomb”. Egy hibás `div` esetén csak annyit, hogy „Kosár megnyitása”, vagy még azt sem. Egy beviteli mezőnél a `label` kapcsolja össze a mezőt annak kérdésével: „E-mail-cím, szerkesztőmező”. A csak helykitöltőként megjelenő `placeholder` nem helyettesíti ezt: gépeléskor eltűnik, kontrasztja gyenge lehet, és nem minden helyzetben ad megbízható nevet.

A képernyőolvasó felhasználó nem feltétlenül lineárisan olvassa végig az oldalt. Listázhatja a címsorokat, linkeket, űrlapmezőket vagy tájékozódási pontokat. Ezért különösen zavaró a sok „Tovább” és „Kattints ide” link: egy listában egymás után csak azonos, jelentés nélküli címkék jelennek meg. A link szövege önmagában is mondja el a célját: „A felvételi határidők megnyitása”.

## Űrlapok és hibák

Az űrlapokban a látható címke mellett a kapcsolat legyen gépileg is megfogalmazott. A `label` `for` attribútuma a mező `id` értékére mutat. Így a címkére kattintva is a mező aktiválódik, és a segítő technológia helyesen nevezi meg.

Hiba esetén ne csak piros színt használjunk. A hibaüzenet mondja meg, melyik mezőről van szó, mi a gond, és lehetőleg a javítás módját is. Beküldés után a fókuszt célszerű a hibák összegzésére vagy az első hibás mezőre irányítani, hogy a felhasználó ne keresgéljen. Dinamikusan változó állapotoknál fontos, hogy a képernyőolvasó is értesüljön a változásról, de ne árasszuk el felesleges bemondásokkal.

## ARIA: fontos eszköz, de nem első választás

Az ARIA attribútumok szerepeket, neveket és állapotokat adhatnak olyan összetett vezérlőkhöz, amelyekhez nincs natív HTML-megfelelő. Például egy saját készítésű, összecsukható panelnél az `aria-expanded` jelezheti, hogy a tartalom nyitott-e. Egy ikonból álló gomb `aria-label` segítségével kaphat beszédes nevet.

Az alapelv: először használjunk natív HTML-t. A `button` már eleve gomb; nem kell `div role="button"`, majd külön programmal pótolni a billentyűzetes működést, fókuszt és letiltott állapotot. Az ARIA nem tesz automatikusan működőképessé egy elemet, csak információt közöl róla. Ha rossz szerepet adunk meg, a képernyőolvasót megtéveszthetjük. Az „ARIA csak indokoltan” azt jelenti, hogy valódi hiányt pótolunk vele, nem a szabványos szerkezetet írjuk felül.

## Végigvezetett példa: egy modal párbeszédablak

Egy „Bejelentkezés” gomb megnyit egy párbeszédablakot. Egérrel ez egyszerűnek tűnik, de billentyűzettel több kérdés merül fel. Megnyitáskor a fókusznak a párbeszédablak értelmes első elemére kell kerülnie, például a címre vagy az e-mail mezőre. Tab-bal a fókusz maradjon a megnyitott ablakon belül; ne vándoroljon a háttéroldal menüjére. Esc billentyűvel lehessen bezárni, ha ez nem okoz adatvesztést. Bezáráskor a fókusz térjen vissza arra a „Bejelentkezés” gombra, amelyik megnyitotta.

A párbeszédablaknak egyértelmű neve kell, és az állapotváltozást a segítő technológiának is értenie kell. Látható, hogy ez nem „képernyőolvasós extra”: egy jó fókuszkezelés egérrel és billentyűzettel egyaránt kiszámíthatóbbá teszi a felületet.

## Egyszerű ellenőrzési rutin

Már fejlesztés közben sok hiba felfedezhető különleges eszköz nélkül. Tegyük félre az egeret, töltsük újra az oldalt, majd kizárólag Tab, Shift+Tab, Enter, Space és Esc segítségével próbáljuk elvégezni a fő feladatot. Látszik-e minden pillanatban a fókusz? Eljutunk-e minden lényeges vezérlőhöz? Nem ragadunk-e egy megnyitott komponensben, és nem tudunk-e véletlenül a háttérben lévő tartalomra lépni?

Érdemes a böngésző beépített fejlesztői eszközeivel az akadálymentességi fát is megnézni. Itt gyakran azonnal kiderül, ha egy ikonos gombnak nincs neve, egy mező címkéje nincs összekötve vele, vagy egy címsornak tűnő felirat valójában csak formázott szöveg. Ez nem helyettesíti a képernyőolvasóval végzett próbát, de gyors visszajelzés a dokumentum tényleges jelentéséről.

## Gyakori félreértések

**„Ha rákattintható, akkor hozzáférhető.”** A kattinthatóság nem jelenti, hogy billentyűzettel elérhető, fókuszálható és helyesen bejelentett vezérlő.

**„A `tabindex` rendbe teszi a sorrendet.”** A pozitív `tabindex` értékek gyakran kiszámíthatatlan sorrendet hoznak létre. A helyes HTML-sorrend az alapmegoldás.

**„A placeholder a mező címkéje.”** Nem az. Rövid segítség lehet, de nem pótolja az állandó, programból is azonosítható címkét.

**„Mindenhez ARIA kell.”** A túlzott vagy rossz ARIA éppenséggel ronthat a helyzeten. A szemantikus HTML sok feladatot eleve megold.
