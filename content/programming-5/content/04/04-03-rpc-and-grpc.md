---
chapter: "04.03"
tags: []
---
# RPC, JSON-RPC és gRPC

RPC, azaz remote procedure call esetén az interfész központjában a távolról meghívható művelet áll. A hívó azt fejezi ki, hogy `ReserveSeats` vagy `CalculatePrice` műveletet szeretne végrehajtani. A protokoll továbbítja a paramétereket, az eredményt és a hibát.

## Műveletközpontú modell

Egy REST-szemléletű foglalási API-nál `POST /reservations` szerepelhet. RPC-ben `ReserveSeats(eventId, seatIds, requestId)` műveletet publikálunk. Az üzleti cél hasonló lehet, de az interfész szervezése eltér. Az RPC sem jogosít fel korlátlanul finom belső metódusok publikálására: a hálózati határhoz megfelelő műveletméret kell.

JSON-RPC-ben például a műveletnév, a paraméterek és a kérésazonosító kerül JSON-üzenetbe:

```json
{
  "jsonrpc": "2.0",
  "method": "ReserveSeats",
  "params": {"eventId": "e-12", "seatIds": ["a-1", "a-2"]},
  "id": "call-17"
}
```

A kérésazonosító a válasz összerendelésére szolgál. Nem automatikusan üzleti idempotenciakulcs: ugyanazon azonosítóval újraküldött módosítás csak akkor biztonságos, ha a szerver ilyen szabályt is implementál. A „notification”, amelyhez nem várunk választ, szintén nem bizonyít sikeres végrehajtást.

## gRPC és szerződésvezérelt fejlesztés

gRPC esetén gyakran Protocol Buffers nyelven írjuk le a szolgáltatást és az üzeneteket. Ebből generálható kliens- és szerveroldali kód. A típusos szerződés segít a nyelvek közötti együttműködésben, és nem kell kézzel megírni minden dekódolást.

```protobuf
syntax = "proto3";

service Stock {
  rpc Reserve(ReserveRequest) returns (ReserveReply);
}

message ReserveRequest {
  string request_id = 1;
  string product_id = 2;
  int32 quantity = 3;
}

message ReserveReply {
  string reservation_id = 1;
}
```

A mezőszámok a wire-szerződés részei. Egy eltávolított mező számát nem szabad új, más jelentésű mezőhöz újrahasználni; a fenntartására `reserved` jelölés használható. A generált típusok mellett is szükséges üzleti validáció, például pozitív mennyiség és érvényes termékazonosító.

## Hívási formák

Unary hívásnál egy kéréshez egy válasz tartozik. Server streaming esetén a szerver több választ küld, client streaming esetén a kliens küld több üzenetet. Bidirectional streamingben mindkét fél önállóan küldhet üzeneteket egy hívás keretében. A streamhez külön le kell írni, mikor van vége és mely üzenet mit nyugtáz.

A deadline a hívás teljes időkeretét jelöli. A cancellation segíthet a már nem szükséges munka megszakításában, de nem teheti meg nem történtté a már tartósan végrehajtott üzleti módosítást. A szervernek a megszakításjelzést ténylegesen figyelnie kell.

## Előnyök és korlátok

Belső szolgáltatáskapcsolatnál előny lehet a típusos szerződés, a kompakt reprezentáció és a streaming. Cserébe a fejlesztéshez generálási és verziókezelési eszközök társulnak. A hibakódok alkalmazási jelentését is meg kell tervezni. Böngészős kliensnél a szokásos natív gRPC-transport nem használható közvetlenül úgy, mint a szerverek között; gRPC-Web vagy más közvetítő megoldás jöhet szóba.

> [!warning] A szép metódusszintaxis elrejtheti a költséget
> A `client.reserve()` távoli művelet. Nem célszerű ciklusban ezerszer hívni úgy, mintha egy helyi tömb elemét olvasnánk.

## Ellenőrző kérdések

1. Mi különbözteti meg a korrelációs azonosítót az idempotenciakulcstól?
2. Mikor indokolt unary helyett streaming hívás?
3. Mit kell ellenőrizni egy protobuf-séma változtatásakor?

Szerződésformátumok: [JSON-RPC 2.0](https://www.jsonrpc.org/specification), [Protocol Buffers](https://protobuf.dev/programming-guides/proto3/). Részletek: [gRPC core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/), [gRPC deadlines](https://grpc.io/docs/guides/deadlines/).
