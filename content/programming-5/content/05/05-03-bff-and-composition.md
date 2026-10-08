---
type: content
tags: []
---
# BFF, aggregáció és API composition

A Backend for Frontend, röviden BFF egy adott kliens igényeihez igazított szerveroldali réteg. A mobilalkalmazás és a nagy webes adminfelület eltérő adatformátumot, műveletet és válaszméretet igényelhet. A BFF ezeket a különbségeket kezeli a belső szolgáltatások stabilabb szerződései előtt.

## Mit csinál az aggregátor?

Egy termékoldalhoz katalógusadat, ár, készlet és értékelés kellhet. Ha a kliens közvetlenül mind a négy szolgáltatást hívja, ismernie kell a belső topológiát, a hibákat és a részleges eredmény összeállítását. Egy aggregátor ezt a munkát szerveroldalra helyezheti.

API composition során több forrás válaszából állítunk össze eredményt. A hívások lehetnek párhuzamosak, de a teljes időkeretnek, a részleges hibának és a kritikus adatoknak világos szabályuk van. A komponálás nem ad közös adatbázistranzakciót a források fölé.

## Részleges eredmény

A katalógusadat és az ár kötelező, az értékelés opcionális lehet. Az aggregátor az értékelés kiesésekor jelölt részleges választ adhat. Ezt a szerződésnek láthatóvá kell tennie, különben a kliens összekeverheti a „nincs értékelés” és a „nem tudjuk lekérni” állapotot.

Az összefoglalt adatok eltérő időpillanatból származhatnak. A készlet már megváltozhat, mire a felhasználó vásárol. Az olvasási válasz nem helyettesíti a végleges készletfoglalást. Az API-nak nem szabad több szolgáltatásból összerakott pillanatképre olyan konzisztenciát ígérnie, amelyet nem biztosít.

## Klienshez igazított szerződés

A BFF átalakíthatja a belső hibákat a kliens számára kezelhető állapotokká, csökkentheti a payloadot, és egy képernyőhöz igazított válaszokat adhat. A webes és mobilos BFF külön is változhat, de közös üzleti szabályt ne másoljon le mindkettő.

A jogosultsági döntés és a személyre szabott cache külön figyelmet igényel. Azonos útvonal nem feltétlenül jelent azonos választ két felhasználónál. A cache-kulcsban a válaszra ható kontextusnak szerepelnie kell, vagy a megosztott cache-t tiltani kell.

> [!important] Az aggregáció nem új adatgazda
> A BFF összeállít és fordít. A forrásadat helyességét és módosítását a felelős szolgáltatás biztosítja. Ha a BFF üzleti táblákat közvetlenül ír, a határ elmosódik.

## GraphQL mint aggregációs felület

GraphQL használható a BFF interfészeként, ha a kliens változó mezőigényt küld. A resolverek mögött ugyanazok a fan-out- és részlegeshiba-problémák maradnak. REST-szemléletű, képernyőre szabott összefoglaló végpont is megfelelő lehet, ha az adatigény stabil és a cache egyszerűbb.

## Összehasonlítás read modellel

Az API composition kérésidőben kéri össze az adatokat. Egy materializált read model előre feldolgozott adatmásolatot tart fenn eseményekből, így az olvasásnak kevesebb közvetlen függősége lehet. Cserébe a nézet késhet és újraépítést igényelhet. A választás a frissességi és rendelkezésre állási követelménytől függ.

## Tervezési feladat

Egy rendelésösszesítő képernyőhöz kell rendelésállapot, fizetési állapot és szállítási becslés. Jelöld a kötelező és opcionális adatokat. Írd le a részleges válasz formáját és a teljes időkeretet. Ezután mutass egy olyan követelményt, amely read model irányába terelné a megoldást.
