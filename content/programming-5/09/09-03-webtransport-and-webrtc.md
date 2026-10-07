# 09.03. WebTransport és WebRTC DataChannel

Bizonyos valós idejű alkalmazásoknak nem egyetlen megbízható, rendezett üzenetcsatorna kell. Lehetnek külön adatfolyamok, amelyek egymástól függetlenül haladnak, vagy gyorsan elavuló állapotüzenetek, amelyeknél az újraküldés rosszabb, mint az elvesztés. WebTransport és WebRTC DataChannel ilyen igényekhez is ad eszközöket, eltérő kapcsolati modellel.

## WebTransport

A böngészős WebTransport API kliens–szerver kapcsolatban megbízható egy- és kétirányú streameket, valamint datagramokat kínálhat. A használatos HTTP/3-alapú környezet QUIC-ra épül. A streamen belüli sorrend és megbízhatóság nem jelenti minden külön stream közös sorrendjét.

Datagramnál előfordulhat elvesztés és eltérő sorrend. Ez hasznos lehet például sűrűn frissített pozícióhoz, ahol a régi adat kevésbé fontos. Egy vásárlási parancsot nem szabad ugyanilyen „ha elveszett, nem baj” jelentéssel küldeni. Megbízható és nem megbízható csatorna együtt is használható, ha az alkalmazási protokoll megkülönbözteti a célokat.

A több stream csökkentheti az egymástól független adatfolyamok közötti blokkolást, de nem hoz korlátlan kapacitást. Minden streamnek kell méret-, sebesség- és életciklusszabály. A streamhez tartozó backpressure segíthet a fogyasztói ütem kezelésében.

## Támogatás és szerveroldali követelmény

A WebTransport használatához megfelelő böngésző, szerver és hálózati infrastruktúra kell. Nem elegendő egy szokásos WebSocket-végpont URL-jét átírni. A célkörnyezet támogatását és fallbackigényét külön kell ellenőrizni, mert a platformképességek változhatnak.

A támogatás vizsgálata mellett az üzleti szerződés változatlanul szükséges. Egy datagramküldés API-szintű sikere nem jelent tartós üzleti feldolgozást. A fontos művelethez külön eredmény és ismétlésvédelem kell.

## WebRTC DataChannel

A WebRTC DataChannel két peer között vihet alkalmazási adatot. A kommunikáció kapcsolódhat böngészők közötti együttműködéshez, játékhoz vagy médiaalkalmazáshoz. A peer nem szükségképpen másik böngésző, de ez eltér a hagyományos központi HTTP-szolgáltatásmodellből.

A kapcsolat létrehozásához signaling szükséges: a felek kicserélik a kapcsolatleírást és a hálózati információkat. A signaling szállítását a WebRTC nem adja meg egyetlen kötelező alkalmazási protokollként; HTTP vagy WebSocket is használható.

ICE segít a kapcsolati út megtalálásában, STUN a hálózati címhelyzet feltárásában, TURN közvetíthet, ha közvetlen út nem jön létre. A „peer-to-peer” ezért nem garantálja, hogy minden adat közvetítő nélkül megy. A relay kapacitása és költsége a terv része.

## Rendezés és megbízhatóság

A DataChannel beállítható rendezett vagy rendezetlen, illetve korlátozott újraküldésű működésre. A `maxRetransmits` és `maxPacketLifeTime` jellegű beállítások alkalmazási jelentést igényelnek. Nem megfelelő minden üzenethez ugyanaz a szabály: egy aktuális kurzorpozíció és egy dokumentummódosítás eltérően kezelendő.

> [!warning] Alacsony késleltetés nem helyettesíti az adatgazdát
> Kliens által közölt állapotot nem fogadunk el automatikusan hiteles üzleti tényként. A végleges döntés és a jogosultság továbbra is kijelölt felelősség.

## Választási feladat

Vizsgálj három adatot: kurzorpozíció, dokumentummódosítás és fizetési eredmény. Döntsd el, kell-e rendezés, újraküldés és tartós állapot. Ezután indokold, kliens–szerver vagy peerkommunikáció illik-e a feladathoz.

Részletek: [WebTransport API](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport), [WebTransport specification](https://www.w3.org/TR/webtransport/), [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel).
