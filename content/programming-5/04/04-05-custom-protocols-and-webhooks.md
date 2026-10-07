# 04.05. Egyedi API, webhook és alkalmazási protokoll

Egyedi API-ról beszélhetünk, ha az interfész saját műveleteket és üzenetszabályokat definiál, akár HTTP, akár más transport fölött. A „custom” nem jelent dokumentálatlanságot. Éppen ellenkezőleg: amit egy kész protokoll nem határoz meg, azt nekünk kell pontosan rögzítenünk.

## Egyedi HTTP API

Egy `POST /calculate-shipping` műveletközpontú HTTP-végpont lehet. Nem szükséges REST-nek nevezni ahhoz, hogy jó API legyen. Használhat szabványos HTTP-metódust, státuszokat és hitelesítést, miközben a payload és a művelet jelentése saját szerződés.

A választás indokolt lehet speciális üzleti művelethez, örökölt rendszerhez vagy egyszerű integrációhoz. A korlát az, hogy a közös eszközök kevesebbet tudhatnak az alkalmazási jelentésről. Kliensgenerálás, dokumentáció és interoperabilitás csak akkor marad jó, ha a szerződést géppel is feldolgozhatóan írjuk le.

## Üzenetboríték

Tartós socketkapcsolaton vagy saját üzenetcsatornán hasznos egy következetes boríték:

```json
{
  "version": 1,
  "type": "reserveSeats",
  "messageId": "m-18",
  "correlationId": "request-7",
  "payload": {"eventId": "e-12", "seatIds": ["a-1"]}
}
```

A `type` megmondja a jelentést, a `version` a szerződés változatát, a `messageId` az egyedi üzenetet, a `correlationId` a kapcsolódó beszélgetést jelölheti. Meg kell különböztetni az üzenetazonosítót, az üzleti műveletazonosítót és a trace-azonosítót. Egyik sem helyettesíti automatikusan a másikat.

## Keretezés és bájtfolyam

TCP bájtfolyamot ad, nem alkalmazási üzeneteket. Egy `write` nem feltétlenül egy `read` eseményként érkezik meg. A saját protokollnak ezért keretezést kell definiálnia: például hosszprefixet, elválasztót vagy rögzített méretű fejlécet.

Hosszprefix esetén meg kell adni a szám kódolását, byte orderét, maximális értékét és a hiányos üzenet kezelését. Egy túl nagy bejelentett hossz ellenőrzés nélkül memóriakimerülést okozhat. A parsernek részleges beérkezést és egymás után több üzenetet is kezelnie kell. WebSocketnél a transport üzenetkeretezést ad, de az alkalmazási borítékot és jelentést továbbra is mi definiáljuk.

## Webhook: a szolgáltató hívja a fogyasztót

Webhook esetén az esemény forrása HTTP-kérést küld a fogyasztó regisztrált végpontjára. A kezdeményezés iránya fordított egy lekérdezéshez képest. A fogyasztónak elérhető végpont, hitelesítés, duplikációkezelés és feldolgozási állapot szükséges.

A fogadó gyakran gyorsan tartósan elmenti az ellenőrzött eseményt, majd később feldolgozza. A sikeres HTTP-válasz ilyen szerződésben átvételt jelez, nem feltétlenül teljes üzleti feldolgozást. A szolgáltató újraküldhet, ezért az eseményazonosítóhoz tartós deduplikáció kapcsolódik.

Az aláírást a megállapodott nyers tartalom alapján kell ellenőrizni. A payload újbóli JSON-szerializációja megváltoztathatja a bájtokat. Időbélyeg és korlátozott elfogadási időablak védhet visszajátszás ellen, de az ablak és a szolgáltató retryrendje összehangolandó.

> [!warning] A webhook nem megbízható tény csak azért, mert HTTP-n érkezett
> Ellenőrizni kell a küldőt, a szerződést és az ismétlést. A publikus végpont bármilyen kérelmet kaphat.

## Saját protokoll ellenőrzőlistája

Rögzítsd a kódolást, a maximális méretet, a verziókat, a kötelező mezőket, a hibaválaszokat, a nyugták jelentését és a sorrendi szabályokat. Legyen példa hiányos, ismeretlen és ismételt üzenetre is. A protokoll csak akkor teljes, ha két, egymástól független fejlesztő ugyanúgy értelmezi.
