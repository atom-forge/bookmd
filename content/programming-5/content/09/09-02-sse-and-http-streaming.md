---
type: content
tags: []
---
# Server-Sent Events és HTTP streaming

Server-Sent Events, röviden SSE esetén a szerver egy HTTP-válaszban több szöveges eseményt küld a kliensnek. A kapcsolat egyirányú a szervertől a kliens felé. A kliens műveletei ettől független HTTP-kéréseken is történhetnek; sok állapotfigyelő felületnek ez elegendő.

## EventSource és eseményformátum

A böngésző natív `EventSource` API-ja eseményfolyamot fogad. A szerver `text/event-stream` tartalomtípussal, UTF-8 szövegként küldi az adatot. Az események között üres sor áll.

```text
id: evt-91
event: exportStateChanged
data: {"exportId":"x-4","status":"ready"}

```

Az `event` név külön handlerhez köthető, az `id` folytatási azonosítót adhat, a `data` az alkalmazási tartalom. A formátum önmagában nem írja elő, hogy JSON legyen benne. A szerver periodikus kommentet küldhet, ha a köztes infrastruktúra idle időkeretét életjellel kell kezelni.

## Újracsatlakozás és Last-Event-ID

Az EventSource megszakadás után általában újra kapcsolódik. Az utolsó eseményazonosító segítheti a folytatást, és új kérésnél `Last-Event-ID` információ jelenhet meg. A szervernek ehhez megőrzött eseményeket vagy más helyreállítási lehetőséget kell biztosítania.

Az automatikus reconnect nem garantálja a kimaradt események megérkezését. Ha a szerver nem tudja kiszolgálni a régi pozíciót, a kliensnek új snapshot kell. Az azonosító és a megőrzési idő a stream szerződéséhez tartozik.

## Hitelesítés és infrastruktúra

A natív EventSource nem kínál tetszőleges requestheader-beállítást úgy, mint a `fetch`. Cookiealapú kapcsolatnál a hitelesítés, a credentialkezelés és a cross-origin szabályok összehangolandók. Hosszú életű érzékeny tokent URL-be írni rossz választás lehet, mert a cím naplókba és más diagnosztikai felületekre kerülhet.

A reverse proxy bufferelése késleltetheti az eseményeket. A szervernek valóban fokozatosan kell kiírnia az adatot, és a proxyhoz megfelelő streamkezelés kell. A HTTP-verziótól és az infrastruktúrától függő kapcsolat- vagy streamkorlátot terhelés alatt is vizsgáljuk.

## Általános HTTP streaming

Egy `fetch` választeste is olvasható darabonként. Ez lehet NDJSON, bináris adat vagy más alkalmazási formátum. Az alkalmazásnak saját parsere van, és maga tervezi az eseményhatárt, a reconnectet és a folytatást.

Egy beérkező bájtdarab nem feltétlenül egy teljes JSON-rekord: az üzenet szétszakadhat, és több rekord össze is kerülhet. A parser tartson maradék puffert és ellenőrizze a maximális méretet. A streameldolgozás hibáját és a HTTP-válasz lezárását is kezelni kell.

## SSE vagy WebSocket?

Szerveroldali állapotfrissítéshez SSE egyszerűbb protokollt adhat. Ha a kliens is gyakran küld üzenetet ugyanazon tartós csatornán, WebSocket természetesebb lehet. Egy SSE-stream és külön POST-műveletek kombinációja teljes értékű megoldás, ha az igényekhez illik.

> [!important] Az egyirányúság nem alkalmazáskorlát
> Az SSE-csatorna egyirányú, de a teljes alkalmazás közben HTTP-n küldhet parancsokat. Az interakciók együttese alapján válassz transportot.

## Ellenőrző kérdések

1. Mit kell a szervernek biztosítania a `Last-Event-ID` használatához?
2. Miért késhet az SSE proxy mögött működő szervernél?
3. Mit kell saját magunknak megoldani `fetch`-alapú NDJSON-streamnél?

Formátum és API: [HTML Standard — Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html), [MDN SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).
