---
chapter: "07.01"
tags: []
---
# Adatgazdák, tranzakciók és konzisztencia

Egy szolgáltatás adatgazdája felel az általa kezelt üzleti állapotért és a hozzá tartozó szabályokért. Ez az önállóság fontos része: a fogyasztó a szerződésen keresztül használja az adatot, és nem a másik szolgáltatás tábláit írja.

## Saját adatbázis jelentése

A „database per service” minta nem feltétlenül külön fizikai adatbázisszervert jelent. Lehet külön séma vagy logikai adatbázis ugyanazon infrastruktúrán, ha a jogosultság és a tulajdonosi határ elkülönül. A közös gép működési függőség, a közös táblamódosítás pedig adatmodellbeli csatolás; a kettő külön problémát jelent.

A fogyasztó tárolhat helyi adatmásolatot olvasásra, de meg kell mondani, honnan frissül és mennyit késhet. A másolat nem kapja meg automatikusan az eredeti adat módosításának jogát.

## Lokális tranzakció

Egy szolgáltatás saját tranzakciója együtt mentheti az összetartozó adatokat. A készletfoglalás ellenőrzése és rögzítése például egy tranzakció vagy atomi feltételes művelet határán belül maradhat. Ha az ellenőrzést másik szolgáltatás olvassa, majd később külön ír, versenyhelyzet keletkezhet.

Két önálló adatgazdát érintő műveletnél nem feltételezhetünk közös tranzakciót. A rendelés mentése és a fizetési szolgáltató terhelése külön végrehajtási határ. Az egyik sikere mellett a másik eredménye ismeretlen lehet.

## Strong és eventual consistency

Strong consistency különböző modelleket takarhat; a követelményben pontosan meg kell mondani, milyen olvasási és sorrendi garanciát várunk. Például szükséges lehet, hogy sikeres foglalás után ugyanazon szolgáltatás olvasása már az új állapotot mutassa.

Eventual consistency esetén a másolatok megfelelő feltételek mellett később utolérik a változásokat. Ez nem jelent korlátlan, követhetetlen késést és nem oldja meg magától az ellentmondásokat. A felhasználó számára fontos lehet a read-your-writes élmény: az általa most végrehajtott művelet ne tűnjön azonnal eltűntnek egy késő olvasási nézetben.

## Hol szükséges azonnali döntés?

A „még van készlet” keresési találat lehet késő. A tényleges foglaláskor viszont a készletgazda dönt a rendelkezésre állásról. A vásárláskor az árat és egyéb szerződéses adatot pillanatképként rögzíthetjük, hogy a későbbi katalógusváltozás ne írja át a régi rendelés jelentését.

Nem minden adatmásolat hibás: az üzleti dokumentumok gyakran történeti tényt őriznek. A kérdés az, hogy a másolat aktuális állapotot vagy adott időpontban érvényes tényt jelent-e.

> [!important] Az adat tulajdonosa hozza meg a végleges döntést
> Egy cache-ben látott elérhetőség tájékoztatás lehet. A készletfoglalás szabályát a készletgazda érvényesíti a módosítással együtt.

## CAP és a követelmények nyelve

Hálózati szétválás esetén bizonyos elosztott rendszerekben választani kell a minden kérésre adott válasz és a szigorú konzisztenciagarancia között. Ezt nem érdemes „a rendszer két betűt választ” egyszerűsítéssel kezelni. Konkrét műveletre kell eldönteni, fogadható-e módosítás bizonytalan kapcsolat mellett, és hogyan rendeződik az állapot.

## Ellenőrző kérdések

1. Miért nem azonos a közös adatbázisszerver a közös adatgazdával?
2. Melyik adat lehet késő egy termékoldalon, és melyik döntés nem támaszkodhat pusztán erre?
3. Hogyan mutatnád meg a felhasználó saját friss módosítását egy késő read model mellett?
