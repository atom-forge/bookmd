---
chapter: "09.04"
tags: []
---
# Socket.IO és a valós idejű megoldások összehasonlítása

A valós idejű technológia kiválasztásához először azt kell eldönteni, milyen irányú és gyakoriságú kommunikációra van szükség. Ezt követi a késleltetés, a megbízhatóság, a folytathatóság és az infrastruktúra vizsgálata. A legismertebb eszköz nem feltétlenül a legegyszerűbb megfelelő megoldás.

## Socket.IO helye

Socket.IO magasabb szintű kommunikációs megoldás saját protokollal, kliens- és szerverkönyvtárral. Támogat eseményneveket, nyugtákat, reconnectet és csatornaszerű csoportosítást; transportként WebSocket és HTTP long polling is szerepet kaphat.

Nem azonos a natív WebSockettel. Egy egyszerű WebSocket-kliens nem tud automatikusan Socket.IO-szerverrel beszélni, mert az alkalmazási és kapcsolati protokoll eltér. A könyvtár kényelme együtt jár a protokoll és a verziók közös használatával.

A reconnect és a szobák nem adnak automatikusan tartós, végponttól végpontig egyszeri üzleti kézbesítést. A kézbesítési és helyreállítási képességet a konkrét beállítások és megőrzés szerint kell vizsgálni. Több szerverpéldánynál adapter és adott transporthoz megfelelő routing is szükséges lehet.

## Összehasonlító táblázat

| Megoldás | Irány és modell | Fő előny | Fő tervezési költség |
| --- | --- | --- | --- |
| Polling | Ismételt klienskérés | Egyszerű HTTP-működés | Üres kérések, periódusnyi késés |
| Long polling | Nyitva tartott kérés, majd új kérés | Kisebb észlelési késés | Kérésciklus, kurzor, timeout |
| SSE | Szerver → kliens stream | Eseményformátum és EventSource | Proxy, folytatás, egyirányú csatorna |
| HTTP streaming | Fokozatos választest | Rugalmas formátum | Saját parser és reconnect |
| WebSocket | Kétirányú üzenetkapcsolat | Gyakori kétirányú adat | Saját protokoll, kapcsolatállapot |
| WebTransport | Streamek és datagramok | Több adatfolyam, eltérő megbízhatóság | Támogatás és speciális infrastruktúra |
| WebRTC DataChannel | Peeradatcsatorna | Peerkommunikáció, konfigurálható szállítás | Signaling, ICE, relay |
| Socket.IO | Saját magasabb szintű eseményprotokoll | Kész kliensoldali kapcsolati eszközök | Könyvtárfüggés, adapter és saját garanciák |

A támogatás és a pontos képesség környezetfüggő. A táblázat architekturális különbségeket mutat, nem helyettesít böngészős és infrastruktúrás vizsgálatot.

## Döntési kérdések

Elég a legfrissebb állapot, vagy minden köztes esemény kell? A kliens csak fogad, vagy sűrűn küld is? Elfogadható néhány másodperc késés? A kapcsolat központi szerverrel vagy peerrel jön létre? Kell a kimaradt adatok visszajátszása? Ezekből már sok választás kizárható.

Egy exportállapothoz polling is elég lehet. Egy szerveroldali értesítési feedhez SSE természetes. Chathez WebSocket vagy magasabb szintű könyvtár használható. Gyorsan elavuló játékpozícióhoz datagram- vagy részlegesen megbízható modell indokolt lehet. A példák nem kizárólagos receptek, hanem eltérő igények szemléltetései.

## Fallback és ugyanaz a jelentés

Ha WebSocket helyett long pollingra váltunk, az alkalmazási szerződésnek továbbra is ugyanazt az eredményt kell jelentenie. Ne legyen más jogosultság vagy ismétlésvédelem csak a transport különbsége miatt. A kapcsolatállapotot és a teljesítménykorlátokat viszont mindkét úton ellenőrizni kell.

> [!tip] A protokoll és a könyvtár két külön döntés
> A WebSocket transportválasztás. A Socket.IO egy saját protokollt és kész eszközöket ad. Először a szükséges kommunikációs tulajdonságot döntsd el, utána az implementációt.

## Összehasonlító feladat

Válassz megoldást rendelési státuszhoz, élő adminriasztáshoz, chathez és többfelhasználós játékhoz. Mindegyikhez adj egy elvetett alternatívát, indokolj késleltetést és megbízhatóságot, és írd le a kapcsolatvesztés utáni helyreállítást.

Könyvtárszerződés: [Socket.IO introduction](https://socket.io/docs/v4/), [delivery guarantees](https://socket.io/docs/v4/delivery-guarantees/).
