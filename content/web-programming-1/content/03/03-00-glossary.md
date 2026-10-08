---
type: resource
---
# Fogalomtár

## HTML

A webes dokumentum szerkezetét és elemeinek jelentését jelölő leíró nyelv. A böngésző ebből építi fel a dokumentum feldolgozható modelljét.

## CSS

A dokumentum megjelenését meghatározó szabályrendszer. A színek mellett az elrendezést, méretezést és különböző környezetekhez való alkalmazkodást is kezeli.

## JavaScript

Programozási nyelv, amellyel a böngészőben futó viselkedés megvalósítható. Felhasználói eseményekre reagálhat és módosíthatja a dokumentumot.

## Szemantika

Egy dokumentumelem jelentése és szerepe. A helyes szemantika a gépi feldolgozást és a hozzáférhetőséget is segítheti.

## Fokozatos fejlesztés

Olyan tervezési megközelítés, amely használható alapfunkciókra építi a fejlettebb megjelenést és interakciót. Ha egy kiegészítő képesség hiányzik vagy hibásan működik, az alapvető feladat ettől még elvégezhető maradhat.

## DOM

A HTML-dokumentum böngésző által létrehozott, faalakú objektummodellje. Az aktuális dokumentumállapotot reprezentálja, és programból módosítható.

## Csomópont

A DOM-fa egy eleme, például HTML-elem vagy szöveg. Más csomópontokkal szülő–gyermek kapcsolatban állhat.

## HTML-forrás

A böngészőnek átadott szöveges jelölés, amelyből a dokumentummodell épül. Nem feltétlenül azonos a később módosult DOM-mal.

## Szemantikus HTML

A tartalom jelentésének megfelelő elemek használata. Segíti a dokumentum értelmezését és hozzáférhetőségét.

## Elements/Inspector nézet

A böngésző fejlesztői eszközének felülete az aktuális DOM és a hozzá kapcsolódó jellemzők vizsgálatára. Más megfigyelési pontot ad, mint a Network panel.

## Renderelés

A dokumentum és stílusok látható megjelenítéssé alakításának folyamata. Több feldolgozási lépésből áll, és későbbi változásokkor ismét részben lefuthat.

## CSSOM

A CSS feldolgozott, programozható stílusmodellje. A böngésző ezt használja a stílusok értelmezésében és alkalmazásában.

## Elrendezés

A látható elemek méretének és képernyőbeli helyének kiszámítása. Változhat új tartalom, stílus vagy erőforrás érkezésekor.

## Kirajzolás

A megjelenítendő elemek vizuális tulajdonságainak, például hátterének, szegélyének és szövegének feldolgozása a megjelenítési folyamatban. A böngésző a rajzolási utasítások raszterizálásával és a rétegek összeállításával hozza létre a képernyőn látható képet.

## Elrendezésváltozás

A látható elemek helyének váratlan vagy későbbi megváltozása. Például egy méret nélküli kép betöltése eltolhatja a környező szöveget.

## Webes erőforrás

A böngésző által külön címen lekérhető dokumentum, kép, stíluslap, programfájl, betűkészlet vagy adat. Több erőforrás együtt alkothat egy oldalt.

## Erőforrásfüggőség

Olyan kapcsolat, amelyben egy dokumentum vagy más erőforrás további tartalomra hivatkozik. A függőség új kérést válthat ki.

## Kritikus erőforrás

Az első használható vagy lényeges megjelenítéshez szükséges erőforrás. Késése közvetlenül befolyásolhatja a felhasználói élményt.

## Lusta betöltés

Bizonyos erőforrások letöltésének elhalasztása addig, amíg várhatóan szükség lesz rájuk. Csak megfelelő helyzetben javítja a felhasználói élményt.

## Részhiba

Olyan helyzet, amikor az oldal egyes kérései sikerülnek, mások nem. A felület ettől részben még használható maradhat.

## Böngészőkompatibilitás

A webes tartalom és alapvető feladatok használhatósága a célzott böngészőkben és környezetekben. Az ellenőrzés a használt funkciók, a megjelenítés és az alapvető felhasználói műveletek tényleges működésére terjed ki.

## Képességvizsgálat

Annak ellenőrzése, hogy a szükséges böngészőfunkció ténylegesen elérhető és használható-e. A program az eredmény alapján választhat fejlettebb megoldást vagy tartalék működést, nem kizárólag a böngésző nevére támaszkodik.

## Támogatottsági táblázat

Böngészők és verziók szerint összegzett információ egy webes technológia ismert támogatásáról. Tervezési támpont, nem helyettesíti a tényleges működés ellenőrzését.

## Tartalék megoldás

A hiányzó vagy hibás fejlettebb funkció mellett követhető alternatív út az alapvető felhasználói célhoz. Lehet egyszerűbb interakció vagy világos helyettesítő információ, amely elkerüli a használhatatlan végállapotot.

## Böngésző API

A böngésző által a webes programnak kínált programozható felület, amely meghatározott feltételekkel tesz elérhetővé funkciókat. Például fájlkezelést, hálózati adatlekérést vagy helyi tárolást biztosíthat, esetenként felhasználói engedélyhez kötve.

## File API

A felhasználó által kiválasztott fájlok adatainak böngészőbeli kezelésére szolgáló felület. A kiválasztás nem azonos a feltöltéssel.

## IndexedDB

Webhely eredetéhez kötött böngészős adatbázis-API, amely strukturált adatok helyi tárolását és tranzakciós kezelését teszi lehetővé. Aszinkron működése nagyobb adathalmazok kezelését is lehetővé teszi a felület közvetlen blokkolása nélkül.

## Canvas 2D

A `canvas` elemen programból létrehozott kétdimenziós rajzolás felülete. A rajzot vonalakból, alakzatokból, képekből és szövegből lehet összeállítani, de ezekhez nem keletkeznek automatikusan szemantikus HTML-elemek.

## WebGL

Böngészős grafikus API, amely `canvas` felületen interaktív, grafikus hardvert használó 2D és 3D megjelenítést tesz lehetővé. A grafikai műveletekhez a program a grafikus feldolgozón futó árnyalóprogramokat és rajzolási parancsokat használ.
