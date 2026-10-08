---
chapter: "08.02"
tags: []
---
# WebSocket fölötti alkalmazási protokoll

Egy működő WebSocket-rendszernek üzenettípusokat, válaszokat, hibákat és sorrendi szabályokat kell megállapítania. A `send(JSON.stringify(data))` csak a továbbítás technikája; a fogadó ettől még nem tudja, milyen műveletet kell végeznie.

## Művelet, válasz és esemény

Három alapvető üzenetkategória lehet: a kliens által indított kérés, az erre adott eredmény, és a szerver által kezdeményezett esemény. A típusmező különböztesse meg őket. Egy kéréshez rendelt `requestId` összekapcsolja a választ, míg az `eventId` a szerveroldali tény egyedi azonosítója.

```json
{
  "version": 1,
  "type": "subscribe",
  "requestId": "req-31",
  "payload": {"channel": "orders", "afterEventId": "evt-90"}
}
```

```json
{
  "version": 1,
  "type": "subscriptionAccepted",
  "requestId": "req-31",
  "payload": {"subscriptionId": "sub-8"}
}
```

A feliratkozás elfogadása nem azonos az összes korábbi esemény kézbesítésével. A szerződés jelölheti külön a visszajátszás végét és az élő stream kezdetét. Ha az állapotból indulunk, meg kell határozni a snapshot és az utána következő események közös verzióhatárát.

## Hibák és érvénytelen üzenetek

Ismeretlen típus, hibás JSON, túl nagy payload és nem megengedett művelet esetén stabil hibakód szükséges. Nem minden hiba indokolja a kapcsolat bontását. Egy hibás kérésre válaszolhatunk, ismételt szabálysértés vagy protokollinkompatibilitás esetén viszont indokolt lehet lezárni.

A sémát a szerver is ellenőrzi. A TypeScript-típus vagy a kliensoldali validáció nem bizonyítja a beérkező adat helyességét. Az üzenetben szereplő felhasználóazonosítót ne tekintsük hitelesnek csak azért, mert JSON-mezőként érkezett.

## Nyugták jelentése

A „megérkezett”, „elfogadtuk” és „végrehajtottuk” eltérő nyugta. Egy hosszú műveletnél a szerver először feladatazonosítót adhat, majd később eredményt küld. A kliensnek kapcsolatvesztés után más úton is le kell tudnia kérdezni az állapotot, ha a művelet tartós üzleti jelentőségű.

Ha a kliens nem kap végleges eredményt, az ismétlésnek ugyanazon logikai művelethez kell kapcsolódnia. Új `requestId` önmagában új parancsnak látszhat; külön idempotenciakulcs vagy dokumentált újrafelhasználási szabály szükséges.

## Sorrend és párhuzamos feldolgozás

Egy kapcsolat adatfolyama rendezett, de a szerver külön feladatokban indított műveletei eltérő sorrendben fejeződhetnek be. A válaszokat ezért azonosítóval párosítjuk, nem azzal, hogy „az első válasz az első kéréshez tartozik”. Több kapcsolat vagy szerverpéldány között külön sorrendi szerződés kell.

Az üzenetverzió és az entitásverzió más jelentésű. Az első a payload formátumát, a második az üzleti állapot előrehaladását jelzi. A kapcsolat újraépítésekor az entitásverzió segíthet felismerni a régi vagy hiányzó eseményt.

> [!warning] A transport sorrendje nem üzleti sorbarendezés
> A párhuzamos handler, a broker és az újracsatlakozás megváltoztathatja a feldolgozási sorrendet. Az üzleti függést explicit módon kell kezelni.

## Protokolltervezési feladat

Definiálj `subscribe`, `unsubscribe`, `commandResult`, `stateChanged` és `error` üzeneteket. Mindegyiknél add meg az azonosítót, a kötelező mezőket és az ismétlés következményét. Írj le egy kapcsolatvesztést két elküldött kérés és egy beérkezett válasz között.
