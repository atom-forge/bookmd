---
type: resource
---
# Fogalomtár

## Erőforrás

Weben azonosítható tartalom vagy alkalmazási célpont. Lehet dokumentum, kép, strukturált adat vagy egy művelethez kapcsolódó cím.

## URL

Erőforrás elérését leíró cím. Tartalmazhat sémát, hosztnevet, portot, útvonalat, lekérdezési részt és fragmentumot.

## Séma

Az URL elején álló jelölés, amely az elérés módját határozza meg. A webes példákban gyakori a `http` és a `https`.

## Hosztnév

A szolgáltatás név szerinti azonosítója az URL-ben. Nem azonos egy fizikai szerverrel vagy egy IP-címmel.

## Port

Számozott hálózati végpont egy szolgáltatás eléréséhez. Az alapértelmezett port az URL-ben gyakran nincs külön feltüntetve.

## Útvonal

A szolgáltatáson belüli erőforrást megjelölő URL-rész. Értelmezése az alkalmazástól függ.

## Lekérdezési rész

A `?` után álló, gyakran név–érték párokból álló URL-rész. További információt adhat a kiválasztáshoz vagy szűréshez.

## Fragmentum

Az URL # utáni része, amely például dokumentumrészt vagy kliensoldali nézetet azonosíthat. HTTP-lekéréskor nem kerül a kiszolgálónak küldött kéréscélba, a megkapott erőforrás kontextusában a kliens értelmezi.

## HTTP

A webes kliens és szerver közötti alkalmazási kommunikáció szabályrendszere. Meghatározza a kérések és válaszok jelentését.

## HTTP-kérés

A kliens által küldött üzenet, amely erőforrást vagy műveletet céloz. Metódust, célt, fejléceket és esetenként törzset tartalmaz.

## HTTP-válasz

A szerver által küldött üzenet a kérés eredményéről. Státuszkódot, fejléceket és szükség esetén törzset tartalmaz.

## Metódus

A HTTP-kérés szándékát jelző elem, amelyet a szerver a célzott erőforrással együtt értelmez. Például a GET reprezentáció lekérésére, a POST pedig a küldött tartalom erőforrásspecifikus feldolgozására szolgál.

## Fejléc

A HTTP-üzenethez tartozó mező, amely nevet és értéket hordoz, például a tartalom típusáról vagy a gyorsítótárazás feltételeiről. Az üzenet jelentésének értelmezését segíti, függetlenül az adott HTTP-verzió szöveges vagy bináris átvitelétől.

## Törzs

A HTTP-üzenet opcionális tartalmi része, amely kérésben elküldött adatot, válaszban pedig az eredmény tartalmát hordozhatja. Jelenléte és jelentése a metódustól és a válasz státuszától is függ, ezért nem minden üzenetben megengedett vagy szükséges.

## Státuszkód

A HTTP-válasz háromjegyű kódja, amely a kérés protokollszintű eredményét jelzi. Első számjegye kódcsaládot határoz meg, a teljes kód pedig pontosabb értelmezést ad a siker, átirányítás vagy hiba jellegéről.

## GET

Erőforrás lekérésére szolgáló, rendeltetése szerint üzleti állapotot nem módosító HTTP-metódus. Gyakori böngészős navigációnál.

## POST

Adat feldolgozására vagy művelet indítására használt HTTP-metódus. Ismétlése nem feltétlenül vezet ugyanahhoz az üzleti állapothoz.

## Biztonságos metódus

Olyan metódus, amelynek rendeltetése nem a szerver alkalmazási állapotának módosítása. A fogalom nem a kapcsolat titkosítottságát jelenti.

## Idempotencia

Olyan műveleti tulajdonság, amelynél az ismételt végrehajtás a kívánt szerverállapot szempontjából ugyanarra az eredményre vezet, mint az egyszeri végrehajtás. Azonos kérés ismétlésekor a válasz és a naplózás eltérhet, de a kért művelet szándékolt hatása nem halmozódik.

## Sikeres válasz

A 2xx családba tartozó HTTP-válasz, amely a kérés protokollszintű teljesítését jelzi. Nem garantálja, hogy a felhasználó minden üzleti célja megvalósult.

## Átirányítás

Olyan válasz, amely további kérésre vezethet egy másik cím felé. Az új címet jellemzően a `Location` fejléc adja meg.

## Hitelesítés

A kérés küldőjének identitására vagy hitelesítő adataira vonatkozó ellenőrzés. A 401-es válasz azt jelzi, hogy a célzott erőforráshoz hiányzik az érvényes hitelesítés, és a válasz hitelesítési felszólítást is tartalmaz.

## Jogosultság

Annak szabálya, hogy egy szereplő milyen erőforrást érhet el vagy milyen műveletet végezhet. A 403-as válasz a kérés teljesítésének megtagadását jelzi, és nem bizonyítja önmagában, hogy a kliens előzőleg sikeresen hitelesített.

## Szolgáltatási hiba

Olyan szerveroldali vagy háttérbeli probléma, amely miatt a kérés nem teljesíthető megfelelően. A HTTP-ben jellemzően 5xx kód jelzi.

## Médiatípus

A továbbított tartalom formátumát jelölő azonosító, például `text/html` vagy `application/json`. A fogadó fél ennek alapján választhat feldolgozási módot.

## Content-Type

A küldött üzenettörzs médiatípusát jelző fejléc. Kérésben és válaszban is előfordulhat.

## Accept

A kliens által kívánt vagy elfogadható válaszformátumokat jelző kérésfejléc. Nem azonos a ténylegesen kapott tartalom típusával.

## Cache-Control

A gyorsítótárazásra vonatkozó utasításokat hordozó fejléc. Hatása a válasz és a gyorsítótár teljes működésének kontextusában értelmezhető.

## Network panel

A böngésző fejlesztői eszközeinek hálózati nézete. A böngésző által indított kérések és a kapott válaszok megfigyelését támogatja.

## Hálózati kérés sora

Egy kéréshez tartozó bejegyzés a panel listájában. Azonosítható rajta a cél, a metódus, a státusz és több kapcsolódó adat.

## Kérésrészlet

A kiválasztott bejegyzéshez tartozó URL, metódus, fejlécek és esetleges törzs. A kliens által küldött üzenet megértését segíti.

## Válaszrészlet

A szervertől kapott státusz, fejlécek és esetleges törzs. A szerver által visszaadott eredmény megfigyelését segíti.

## Átirányítási lánc

Egymást követő kérések sorozata, amikor egy 3xx válasz új címre vezeti a klienst. Nem azonos a dokumentum további erőforrásainak lekérésével.
