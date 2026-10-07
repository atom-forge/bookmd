---
children:
  - "[[08-01-websocket-protocol.md]]"
  - "[[08-02-application-messages.md]]"
  - "[[08-03-reconnect-and-resume.md]]"
  - "[[08-04-scaling-and-slow-clients.md]]"
---
# 08 – WebSocket – protokoll, kapcsolatok és skálázás

A tartós kétirányú kapcsolat felépítése csak az első lépés. Alkalmazási üzeneteket, nyugtákat, heartbeatet és újracsatlakozást is tervezni kell. A fejezet a protokoll alapjaitól a snapshot és stream összehangolásán át a több szerverpéldányig halad.


- [08.01. WebSocket: kapcsolatfelépítés és kétirányú üzenetek](08-01-websocket-protocol.md) — a tartós kapcsolat felépítése és a protokoll üzenetkezelése.
- [08.02. WebSocket fölötti alkalmazási protokoll](08-02-application-messages.md) — a kérések, az eredmények, a feliratkozások és a nyugták szerződése.
- [08.03. Heartbeat, újracsatlakozás és állapot-visszaszinkronizálás](08-03-reconnect-and-resume.md) — a megszakadás és a kimaradt események utáni helyreállítás.
- [08.04. WebSocket skálázása és lassú kliensek kezelése](08-04-scaling-and-slow-clients.md) — a kapcsolatok elosztása és a korlátozott klienskapacitás kezelése.
