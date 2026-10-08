---
type: resource
---
# Fogalomtár

## API

Programok közötti kapcsolódási felület, amely meghatározott műveleteket és adatformákat tesz elérhetővé. A használó programnak a felület szerződését kell ismernie, a szolgáltató belső megvalósítását nem.

## Webes API

Hálózaton, jellemzően HTTP-n elérhető API, amelyhez kliensprogramok kéréseket küldenek. A működéshez az adatformátum mellett a hitelesítési, hibakezelési és hálózati feltételeket is ismerni kell.

## API-szerződés

A kérések, válaszok, hibák és feltételek dokumentált megállapodása a szolgáltatás és kliensei között. Segít abban, hogy a felek egymástól függetlenül fejlődhessenek, amíg a megállapodott viselkedést megőrzik.

## Kliens

Az API-t használó program, például böngészős felület, mobilalkalmazás vagy másik szerver. Feladata a megfelelő kérés elkészítése és a válasz, valamint a hálózati vagy alkalmazási hibák értelmezése.

## JSON

Objektumokat, listákat és alapvető értéktípusokat szövegként leíró adatcsere-formátum. A szintaxis önmagában nem határozza meg az üzleti mezők jelentését, ezért a fogadó félnek a szerkezetet és az értékeket is ellenőriznie kell.

## XML

Elemekből és attribútumokból felépülő, hierarchikus jelölőnyelv, amely adatot és dokumentumszerű tartalmat is leírhat. A névterek segítenek eltérő szókészletek megkülönböztetésében, a megengedett szerkezet külön sémával is leírható.

## Strukturált adat

Meghatározott szerkezetű és jelentésű információ, amelyet a program mezők és típusok szerint dolgoz fel. Például egy termék ára külön numerikus mezőben szerepelhet, így a programnak nem kell folyószövegből kinyernie.

## Reprezentáció

Egy erőforrás adott formátumú, átadható megjelenése, például HTML-dokumentum vagy JSON-adat. Ugyanahhoz az erőforráshoz több reprezentáció tartozhat, ezért a kapott adat alakja nem feltétlenül egyezik a belső tárolási szerkezettel.

## Adatséma

Az adatok alakját, típusait és megengedett kapcsolatait leíró szabályrendszer. Az ellenőrzésével kiszűrhető a hibás adat alakja, de az üzleti szabályok egy része további vizsgálatot igényelhet.

## REST

Erőforrásokra, reprezentációkra és meghatározott kliens–szerver korlátokra épülő architekturális stílus. A korlátok közé tartozik az állapotmentes kommunikáció, az egységes interfész és a gyorsítótárazhatóság meghatározása, ezért nem minden JSON-t használó HTTP API REST-alapú.

## Erőforrás-azonosító

Az erőforrást megnevező webes cím, amelyhez különböző HTTP-műveletek kapcsolódhatnak. Az azonosító nem feltétlenül tárja fel a tárolás fizikai helyét vagy az alkalmazás belső adatszerkezetét.

## Állapotmentes kérés

Olyan kérés, amely az értelmezéséhez szükséges információt maga hordozza, előző alkalmazásszintű beszélgetésállapot nélkül. A szerveren ettől még lehet adatbázis és erőforrásállapot, az értelmezés azonban nem támaszkodhat a klienssel fenntartott rejtett beszélgetési előzményre.

## GraphQL

Sémára épülő API-lekérdezési nyelv és futtatási modell, amelyben a kliens a kívánt mezőket nevezi meg. A szolgáltatás feloldófüggvényekkel állítja elő a kért adatot, miközben a hozzáférést és a lekérdezés költségét külön szabályoznia kell.

## Séma

A GraphQL-szolgáltatás által kínált típusok, mezők és műveletek meghatározása. A kliens csak a sémában megengedett szerkezetű lekérdezést küldhet, ami gépileg ellenőrizhető szerződést ad.

## Lekérdezés

Adatkérés, amely GraphQL esetén a kívánt mezők szerkezetét is megadja. A kiszolgáló a séma alapján ellenőrzi a kérés alakját, majd a feloldók segítségével elkészíti a megfelelő válaszadatot.

## RPC

Távoli eljáráshívási szemlélet, amelyben a kliens megnevezett műveletet kezdeményez és választ kap. A művelet hálózati határon át történik, ezért késés, időtúllépés és bizonytalan végrehajtási eredmény is felléphet.

## Polling

Ismételt kliensoldali lekérdezés, amely időközönként friss adatot kér a szervertől. Egyszerűen megvalósítható, de frissességét a lekérdezések gyakorisága korlátozza, és változatlan adatért is forgalmat generálhat.

## Server-Sent Events (SSE)

HTTP-alapú, szervertől kliens felé tartó eseményfolyam. A böngésző EventSource felülete szöveges eseményeket fogad és támogatja az újrakapcsolódást, a kliens visszirányú műveletei külön kérések lehetnek.

## WebSocket

Tartós, kétirányú üzenetváltást támogató webes kommunikációs protokoll. A csatorna üzeneteinek üzleti jelentését, jogosultságát és újrakapcsolódási kezelését az alkalmazás határozza meg.

## Webhook

Esemény által kiváltott HTTP-kérés egyik szolgáltatástól egy másik előre megadott végponthoz. A fogadó félnek a küldő hitelességét és az ismételten kézbesített események kezelését is meg kell oldania.

## Visszafelé kompatibilitás

Az új API-változat olyan tulajdonsága, amely mellett a korábbi szerződésre épülő kliensek tovább működhetnek. Például egy opcionális mező hozzáadása megőrizheti a kompatibilitást, ha a régi kliensek megfelelően kezelik az ismeretlen mezőket.

## Törő változás

Olyan módosítás, amely a korábbi szerződést használó kliensek működését megsértheti. Mező eltávolítása, típusának módosítása vagy egy hiba jelentésének megváltoztatása is okozhat ilyen eltérést.

## API-verzió

A szolgáltatás szerződésének megkülönböztetett változata, amelyhez kliens és szolgáltató ugyanazt az elvárást társítja. Segítségével elkülöníthetőek az eltérő szerződések, de a régi változat támogatását és kivezetését ettől még meg kell tervezni.

## API-dokumentáció

A műveletek, adatok, hibák és változások követhető leírása a kliensek készítői számára. Használható példákkal és pontos feltételekkel teszi egyértelművé, hogy a kliens milyen működésre számíthat.

## OpenAPI

HTTP API-k képességeinek szabványos, géppel is feldolgozható leírási formája. Leírásából dokumentáció, klienskód és ellenőrző eszközök készülhetnek, de a működő szolgáltatás megfelelőségét külön kell vizsgálni.
