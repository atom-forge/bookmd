---
type: resource
---
# Fogalomtár

## Domainnév

Hierarchikus névtérben szereplő, ember számára kezelhető azonosító. A webes hosztnév része lehet.

## IP-cím

Hálózati cím, amelyet az IP-alapú kommunikáció a végpontok eléréséhez használ. Formátuma lehet IPv4 vagy IPv6.

## DNS

Elosztott névrendszer, amely a domainnevekhez többek között hálózati címeket rendel. A címfeloldás lehetővé teszi, hogy a kliens név alapján találjon elérhető szolgáltatási végpontot, miközben a névhez tartozó címek változhatnak.

## Rekurzív feloldó

A kliens DNS-kérdését feldolgozó szolgáltatás, amely szükség esetén további névszerverektől kérdez. A korábban kapott rekordokat a megengedett ideig gyorsítótárazhatja, ezért nem minden kéréshez indít új teljes feloldást.

## Autoritív névszerver

Egy DNS-zóna hiteles rekordjait szolgáltató névszerver. Az általa kezelt zóna adataiból válaszol, nem más névszerverek általános gyorsítótáraként működik.

## TTL

A DNS-válasz megengedett gyorsítótárazási idejét jelző érték. Lejárata után a rekordot ismét le kell kérni ahhoz, hogy a feloldó friss adatként használhassa.

## TCP

Kapcsolatorientált szállítási protokoll, amely megbízható, sorrendezett bájtfolyamot nyújt a végpontok között. Az elveszett adatok újraküldését kezeli, de önmagában nem titkosítja az átvitt tartalmat.

## TLS

A kommunikáció titkosságát, sértetlenségét és a másik fél hitelesítését támogató protokoll. Webes kapcsolatban jellemzően a szerver igazolja magát tanúsítvánnyal, a kliens tanúsítványos hitelesítése külön lehetőség.

## TLS-kézfogás

A védett kapcsolat kezdeti egyeztetése, amelyben a felek többek között a szerver tanúsítványát és a titkosítás feltételeit kezelik. Az egyeztetés eredményeként létrejövő kulcsokkal védik a később átvitt alkalmazási adatokat.

## Tanúsítvány

Digitálisan igazolt adat, amely a weben a szerver kulcsát a megnevezett domainhez köti. A kliens a tanúsítványláncot, az érvényességet és a kért névhez való illeszkedést ellenőrzi, nem a webhely tartalmának megbízhatóságát.

## HTTP/3

A HTTP egyik változata, amely QUIC-on keresztül működik, ezért nem a klasszikus TCP-re épülő útvonalat követi. A QUIC megbízható adatfolyamokat és TLS-alapú védelmet biztosít UDP felett, miközben a HTTP-metódusok és státuszkódok jelentése megmarad.

## HTTPS

A HTTP TLS által védett használata, amely a kommunikáció bizalmasságát, sértetlenségét és a szerver hitelesítését szolgálja. A kapcsolat védelme nem garantálja, hogy maga a szolgáltatás jóindulatú vagy az alkalmazás hibamentes.

## Titkosság

Az átvitt tartalom illetéktelen olvasása elleni védelmi tulajdonság. A titkosítás a kapcsolat végpontjai között védi az adatot, a végpontokon feldolgozott vagy tárolt adatokhoz külön védelem szükséges.

## Sértetlenség

Az üzenet észrevétlen módosítása elleni védelmi tulajdonság. A fogadó fél észlelheti, ha a védett adat az átvitel során megváltozott, de ettől a küldött adat még lehet tartalmilag hibás.

## Szerver hitelesítése

Annak ellenőrzése, hogy a kapcsolat a megnevezett szolgáltatás megfelelő végpontjával jött létre. HTTPS esetén ezt a névhez illeszkedő tanúsítvány és a hozzá tartozó magánkulcs birtoklásának igazolása támogatja.

## Vegyes tartalom

HTTPS-en megnyitott oldalhoz nem védett HTTP-n kért alerőforrás esete. A böngésző az erőforrás típusától függően blokkolhatja vagy HTTPS-re módosíthatja a kérést, mert a nem védett betöltés gyengítené az oldal biztonságát.

## Proxy

Kliensoldali közvetítő, amely egy kliens vagy klienscsoport nevében kommunikálhat más szolgáltatásokkal. Szűrheti, naplózhatja vagy továbbíthatja a forgalmat, így a kliens és a célkiszolgáló közötti út része lesz.

## Reverse proxy

Szolgáltatói belépési pont, amely fogadja és a belső rendszer felé irányítja a kéréseket. Többek között terheléselosztást, gyorsítótárazást és TLS-lezárást végezhet a háttérben működő alkalmazások előtt.

## CDN

Földrajzilag elosztott tartalomkézbesítő hálózat, amely bizonyos erőforrásokat a felhasználóhoz közelebbi ponton szolgálhat ki. Az alkalmas kiszolgálási pontot a hálózati út és a szolgáltatás döntései választják ki, nem feltétlenül a földrajzi távolság önmagában.

## Cache-találat

Olyan kérés, amelyre a gyorsítótárban már rendelkezésre áll megfelelően használható válasz. A tárolt válasz csak akkor adható vissza közvetlenül, ha a frissességi és egyéb gyorsítótárazási szabályok ezt megengedik.

## Eredeti szerver

A tartalom elsődleges forrása a kézbesítő vagy gyorsítótárazó rétegek mögött. A közvetítő rétegek ehhez fordulhatnak új tartalomért vagy egy tárolt változat érvényességének ellenőrzéséért.

## Webes kérés életciklusa

Az URL értelmezésétől a kapcsolat és HTTP-üzeneteken át a böngészőben használható eredményig tartó folyamat. A DNS-feloldás, a kapcsolatfelépítés és a kiszolgálás egy része meglévő kapcsolattal vagy gyorsítótárral elkerülhető.

## Szolgáltatói belépési pont

A nyilvános kérés első szolgáltatóoldali végpontja, amely közvetítőként vagy alkalmazásként tovább dolgozhat. Feladata lehet a TLS-lezárás, az útvonalválasztás és a kérések több háttérkiszolgáló közötti elosztása.

## Erőforráslánc

A fő dokumentum és az általa közvetlenül vagy közvetve igényelt további erőforrások kapcsolata. Egy CSS-fájl például betűkészletet hivatkozhat, ezért a fő HTML letöltése önmagában még nem jelenti a teljes oldal elkészültét.

## Megfigyelési pont

A rendszer működésének egy adott rétegét láthatóvá tevő nézet vagy adat, például Network-válasz vagy aktuális DOM. Eltérő pontok eltérő állapotot mutatnak, ezért a hálózaton kapott HTML és a később módosított DOM összevetése külön információt ad.

## Késleltetés

Az a várakozási idő, amely a kapcsolat, adatátvitel vagy feldolgozás egy szakaszához kapcsolódik. Több egymásra váró szakasz késése összeadódhat, ezért a teljes válaszidő okát szakaszonként érdemes vizsgálni.

## Kapcsolati hiba

Olyan probléma, amely miatt a kívánt végponttal nem jön létre a szükséges kapcsolat, akár HTTP-válasz nélkül. DNS-probléma, elérhetetlen hálózat vagy sikertelen TLS-egyeztetés esetén a kliens nem feltétlenül kap HTTP-státuszkódot.

## Részhiba

Egy oldal erőforrásláncának olyan hibája, amely mellett más részek továbbra is működhetnek. Például a dokumentum megjelenhet, miközben egy kép vagy egy külső szolgáltatás adatkérése sikertelen.

## Idővonal

A kérések, válaszok és feldolgozási események időbeli képe, amely segíthet a késés forrásának megtalálásában. A párhuzamos és egymásra váró műveletek elkülönítésével megmutatja, mely szakaszok hosszabbítják meg a felhasználó várakozását.
