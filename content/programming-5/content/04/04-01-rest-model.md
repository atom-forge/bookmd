---
chapter: "04.01"
tags: []
---
# REST: erőforrás, reprezentáció és HTTP

REST-szemléletben a kliens erőforrásokkal dolgozik egy egységes interfészen keresztül. Az erőforrás fogalom lehet rendelés, foglalás, exportfeladat vagy gyűjtemény. A kliens az erőforrás reprezentációját kapja meg, nem a szerver belső objektumát vagy adatbázissorát.

## Erőforrás és reprezentáció

A `/reservations/r-42` egy foglalást azonosíthat. JSON-reprezentációja tartalmazhat állapotot, lejárati időt és hivatkozást a következő műveletre. Ugyanaz az erőforrás több formátumban is megjelenhet; a `Content-Type` és az elfogadott formátumokról szóló megállapodás teszi értelmezhetővé a tartalmat.

```http
GET /reservations/r-42 HTTP/1.1
Host: api.example.test
Accept: application/json
```

```json
{
  "id": "r-42",
  "status": "held",
  "expiresAt": "2026-10-07T14:30:00Z",
  "links": {
    "self": "/reservations/r-42",
    "payment": "/reservations/r-42/payment"
  }
}
```

A példában a JSON nyilvános szerződés. Nem szükséges, hogy megegyezzen a belső entitás mezőivel. Egy adatbázis-átalakításnak nem kell API-változtatássá válnia, ha az adapter fenntartja a reprezentáció jelentését.

## REST-korlátok

A REST nem egyszerűen „JSON HTTP fölött”. Kliens–szerver szétválasztást, stateless interakciót, cache-elhetőség jelölését, egységes interfészt és rétegezhető rendszert ír le; a code-on-demand opcionális korlát. Az egységes interfész része az erőforrás-azonosítás, a reprezentációkon keresztüli művelet, az önleíró üzenet és a hypermedia által vezérelt alkalmazási állapot.

A gyakorlatban sok „REST API” inkább REST-szemléletű HTTP API, kevés hypermediahasználattal. Érdemes pontosan megnevezni ezt, és a használt tulajdonságokat értékelni. A főnév alakú útvonal önmagában nem teljesíti az architekturális korlátokat.

A stateless itt azt jelenti, hogy a kérés feldolgozásához szükséges klienskontextus nem rejtett korábbi kérési beszélgetésből származik. A szervernek természetesen lehet tartós üzleti állapota, például foglalás és számla. A stateless nem „adatbázis nélküli” működés.

## Metódusok és szándék

A `GET` olvasási szándékot fejez ki. A `POST` az erőforráshoz tartozó feldolgozást kérhet, például új foglalás létrehozását. A `PUT` a cél reprezentációjának létrehozását vagy cseréjét célozza. A `PATCH` részleges módosítást ír le egy megállapodott patchformátummal. A `DELETE` a cél URI-hoz tartozó kapcsolat eltávolítását kéri; ez nem feltétlenül fizikai adatmegsemmisítés.

A biztonságos metódus esetén a kliens nem kér üzleti állapotmódosítást. Technikai naplózás ettől még történhet. Az idempotens metódus ismétlése a szándékolt hatás szempontjából ugyanazt az eredményt adja, mint egyszeri végrehajtása; nem követeli meg azonos státuszkód vagy választest visszaadását.

> [!warning] A GET ne végezzen vásárlást
> Böngészők, cache-ek és más köztes komponensek újrakérhetnek vagy előre betölthetnek olvasási útvonalakat. Az üzleti módosítást megfelelő művelettel és szerződéssel kell kifejezni.

## Miért hasznos ez szolgáltatások között?

A HTTP széles körben támogatott, a kérés és válasz jól megfigyelhető, a protokoll rendelkezik státuszokkal, cache- és feltételes kérési eszközökkel. Cserébe az erőforrásmodell nem minden művelethez természetes, és több összefüggő adat lekérdezése sok hívást okozhat. A modell és a fogyasztói igény együtt dönti el, megfelelő-e.

## Ellenőrző kérdések

1. Mi különbözteti meg a reprezentációt a belső entitástól?
2. Miért nem ellentmondás a stateless API és a tartós foglalás?
3. Miért lehet idempotens egy olyan törlés, amely először `204`, később `404` választ ad?

A REST-korlátok eredeti leírása: [Fielding — REST](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). A HTTP-fogalmak pontos jelentése: [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html).
