---
chapter: "10.02"
tags: []
---
# Hibakezelés és felhasználói kommunikáció

Hiba esetén a webalkalmazásnak egyértelműen jeleznie kell, mi történt, mi biztosan nem történt meg, és hogyan folytatható a feladat. A HTTP-státusz, a szervernapló és a felhasználónak szóló üzenet eltérő nézőpontot szolgál.

## A hiba mint többnézőpontú esemény

Egy webes rendszerben a „hiba” több dolgot jelenthet. Lehet a böngésző és a szerver közötti kapcsolat hibája, lehet hibás felhasználói bevitel, lehet egy szerveroldali kivétel, vagy lehet külső szolgáltatás – például térkép, fizetés vagy beléptetés – átmeneti kiesése. Ugyanaz a jelenség másképp látszik a felhasználónak és másképp a rendszer fejlesztőjének. A felhasználó annyit érzékelhet: „nem ment át a rendelés”. A rendszer oldaláról ez lehet időtúllépés, elutasított fizetés, adatbázishiba vagy hálózati megszakadás.

Ezért a hibakezelés két feladatot fog össze. Egyrészt a rendszernek észlelnie kell, hogy a normál folyamat megszakadt, és lehetőleg biztonságos állapotba kell kerülnie. Másrészt kommunikálnia kell a felhasználóval. Az első technikai, a második emberi oldal; egyik sem helyettesíti a másikat. Egy részletes naplóbejegyzés nem segítség annak, aki éppen nem tudja leadni a jelentkezését, egy kedves üzenet pedig nem pótolja a hibás művelet tényleges kezelését.

```mermaid
flowchart LR
    H[Hiba] --> S[HTTP-válasz]
    H --> N[Napló és diagnózis]
    H --> F[Felhasználói magyarázat]
    F --> K[Biztonságos következő lépés]
```

## HTTP-státuszok: jelzések a gépek és a kliensek között

Az HTTP-válasz státuszkódja tömör jelzés arról, hogyan értelmezze a kliens a választ. A 2xx kódok sikeres feldolgozásra utalnak; a 3xx kódok átirányítást jeleznek; a 4xx tartományban a kérés valamilyen okból nem teljesíthető a kliens oldaláról; az 5xx csoport a szerver vagy valamely mögöttes szolgáltatás hibáját jelzi.

A 404 Not Found például azt jelenti, hogy a kért erőforrás nem található. Ez nem feltétlenül rendszerhiba: a látogató elgépelhetett egy címet, vagy egy régi linkre kattintott. A 401 Unauthorized azt jelzi, hogy hitelesítés szükséges vagy nem sikerült; a 403 Forbidden esetén a szerver érti a kérést, de nem ad hozzáférést. A 400 Bad Request hibás formátumú kérésre utalhat, a 429 Too Many Requests pedig arra, hogy a kliens túl sok kérést küldött rövid idő alatt. Az 500 Internal Server Error általános szerveroldali hiba, az 502 Bad Gateway és a 503 Service Unavailable gyakran azt jelzi, hogy a kiszolgáló mögött levő másik komponens vagy maga a szolgáltatás átmenetileg nem használható.

A státuszkód elsősorban a szoftveres szereplőknek szóló szabványos jelzés. A böngésző, egy mobilalkalmazás vagy egy másik szerver ennek alapján dönthet például újrapróbálkozásról vagy bejelentkezés kéréséről. A felhasználónak ennél több kell: érthető kontextus és következő lépés. Nem elég kiírni, hogy „Error 500”, mert ez igaz ugyan, de nem válaszol a legfontosabb kérdésekre.

## Milyen a jó hibaüzenet?

Egy jó üzenet négy kérdésre válaszol: mi nem sikerült; milyen következménye van; mit tehet most a felhasználó; és megmaradt-e a munkája. A hangnem legyen nyugodt és pontos. A „Valami hiba történt” jobb, mint a teljes hallgatás, de önmagában kevés. A „Nem sikerült elmenteni a jelentkezést. Az eddig kitöltött adatok megmaradtak. Ellenőrizze az internetkapcsolatát, majd próbálja újra. Ha a hiba fennmarad, használja a hibakódot: ABC-123” már segít a helyzet kezelésében.

Fontos, hogy az üzenet ne hibáztassa a felhasználót. A „Rossz adatokat adott meg!” helyett mondható: „Az irányítószám öt számjegyből áll.” A konkrét, mezőhöz kapcsolt visszajelzés gyorsabban javítható, mint egy általános figyelmeztetés az oldal tetején. Ugyanakkor a biztonság is korlát: nem célszerű a nyilvános oldalon adatbázisneveket, fájlútvonalakat, belső IP-címeket vagy programhibák részletes nyomkövetését megjeleníteni. Ezek támadónak is segítséget nyújthatnak.

Az üzenetnek igaznak kell lennie. Ha a fizetési szolgáltató válasza bizonytalan, káros azt írni, hogy „a rendelése biztosan sikertelen”, mert az összeg esetleg mégis levonásra került. Ilyenkor a helyes kommunikáció inkább: „A fizetés állapotát még ellenőrizzük. Ne indítson újabb fizetést; hamarosan e-mailben értesítjük.” A hibaüzenet nem díszítőelem, hanem a rendszer üzleti és emberi viselkedésének része.

## Helyreállás és újrapróbálkozás

Nem minden hibára ugyanaz a válasz. Ha a felhasználó elgépelte az e-mail-címét, a rendszernek meg kell mutatnia a javítás lehetőségét. Ha rövid hálózati zavar történt, az újrapróbálkozás értelmes lehet. Ha azonban egy pénzügyi tranzakció állapota bizonytalan, az automatikus vagy ismételt beküldés duplázott művelethez vezethet. Ezért a „próbáld újra” nem univerzális megoldás.

A jó rendszer igyekszik megőrizni a felhasználó munkáját. Hosszú űrlapnál különösen frusztráló, ha egy átmeneti hiba után minden kitöltött mező eltűnik. Ilyenkor az időszakos mentés, a tartalom helyi megőrzése vagy a szerveroldali vázlat mentése sokat javít az élményen. Fogalmi szinten itt azt érdemes látni, hogy a hibatűrés nemcsak szerverek többszörözését jelenti: a felhasználó munkájának védelmét is jelenti.

## Status page: nyilvános állapot, nem reklámfelület

A **status page**, vagyis szolgáltatásállapot-oldal olyan külön felület, ahol a szolgáltató tájékoztatja az érdeklődőket a fontos komponensek aktuális állapotáról, tervezett karbantartásokról és ismert üzemzavarokról. Különösen értékes, amikor a fő alkalmazás hibás: ha az állapotoldal ugyanazon a hibás rendszeren fut, éppen akkor válik elérhetetlenné, amikor a leginkább szükség lenne rá.

Egy jó status page nem azt ismételgeti, hogy „minden rendben”, hanem komponensekre bontva mutatja például a bejelentkezés, az API, a fájlfeltöltés vagy a fizetés állapotát. Időbélyeges, rövid frissítésekkel leírhatja: észleltük a hibát; vizsgáljuk; azonosítottuk az okát; javítást alkalmazunk; helyreállt; megfigyeljük az eredményt. Nem kell minden belső részletet nyilvánosságra hozni, de a homályos, változatlan „dolgozunk rajta” órákon át rombolja a bizalmat.

A status page nem váltja ki a személyes tájékoztatást azoknál, akiket közvetlenül érint egy hiba. Egy vizsgajelentkezési rendszerben például célszerű lehet a felületen belüli üzenet, e-mail vagy intézményi csatorna is. A megfelelő kommunikációs csatorna attól függ, mekkora az érintettség, milyen sürgős a helyzet és kiknek kell cselekedniük.

## Példa: fizetés közben megszakadó kapcsolat

Egy felhasználó rákattint a „Fizetés” gombra, majd a böngésző kapcsolata megszakad. A képernyő nem tudja biztosan, megtörtént-e a terhelés. Rossz megoldás azonnal azt írni: „Sikertelen fizetés”, majd visszaengedni a felhasználót újra fizetni. Ugyanilyen rossz lehet automatikusan újraküldeni a tranzakciót.

A felelős válasz az állapot tisztázására épít: a rendszer azonosítja a próbálkozást, ellenőrzi a fizetési szolgáltató válaszát, és közli az átmeneti bizonytalanságot. Az üzenet megmondja, hogy a felhasználó ne próbálja újra azonnal, és mikor, milyen csatornán kap eredményt. A folyamat közben az alkalmazás belsőleg rögzítheti, hogy melyik kéréshez tartozik az esemény, de a látogató számára csak a szükséges információt mutatja. Ez egyszerre védi a pénzügyi folyamatot és csökkenti a bizonytalanságot.

## Gyakori félreértések

**„A részletes technikai hibaüzenet mindig hasznos.”** A fejlesztőnek lehet hasznos, a felhasználónak gyakran nem, és biztonsági kockázatot is jelenthet. A belső részleteknek naplóban, a cselekvést segítő összefoglalónak a felületen a helye.

**„Minden 4xx hiba a felhasználó hibája.”** A 4xx a kérés problémáját jelzi, de a rossz felület, egy elavult kliens vagy félreérthető dokumentáció is okozhat hibás kérést.

**„A status page csak nagy cégeknek kell.”** Nem minden rendszernek indokolt, de bármely sok felhasználót érintő, kritikus szolgáltatásnál értékes bizalmi eszköz lehet.

**„Az újrapróbálkozás ártalmatlan.”** Bizonyos műveleteknél, például fizetésnél vagy foglalásnál ismételt végrehajtást okozhat.
