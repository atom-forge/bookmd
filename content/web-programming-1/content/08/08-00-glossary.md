---
type: resource
---
# Fogalomtár

## Fenyegetési modell

A védendő értékek, szereplők, támadói lehetőségek és feltételek rendezett leírása. A várható támadások és hibák alapján segít kijelölni, hol és milyen ellenőrzésre van szükség.

## Bizalmi határ

Olyan pont, ahol egy adat vagy kérés más bizalmi feltételek közé kerül. A határon átlépő adatot az új környezet szabályai szerint kell ellenőrizni, még akkor is, ha a rendszer másik komponensétől érkezik.

## Védendő érték

Adat, művelet vagy szolgáltatási tulajdonság, amelynek sérülése kárt okoz. Például személyes adat, pénzügyi művelet vagy rendelkezésre állás lehet, és fontossága meghatározza a védelem célját.

## Rétegzett védelem

Több, egymást kiegészítő ellenőrzés alkalmazása eltérő hibák és támadások ellen. Egy ellenőrzés hibája mellett más védelmek csökkenthetik a kárt, de az egymásra épülő intézkedések hatását külön értékelni kell.

## Origin

A séma, hosztnév és port hármasa. A webes HTTP- és HTTPS-címek eredetét ez a három összetevő határozza meg, az útvonal különbsége nem hoz létre új eredetet.

## Same-origin policy

A böngésző eredetek közötti hozzáférést korlátozó alapelve. Elsősorban más eredetű adatok programozott olvasását korlátozza, és nem tilt automatikusan minden kereszt-eredetű kérést vagy beágyazást.

## CORS

A szerver által HTTP-fejlécekkel jelzett, böngészőben érvényesülő kereszt-eredetű olvasási engedélyrendszer. Nem helyettesíti a szerveroldali hitelesítést és jogosultságkezelést, mert a böngészőn kívüli klienseket nem korlátozza ugyanígy.

## Preflight

Bizonyos kereszt-eredetű kéréseket megelőző `OPTIONS` ellenőrző kérés. A böngésző ezzel ellenőrzi, hogy a szerver engedi-e a tervezett metódust és fejléceket, mielőtt elküldi az adott tényleges kérést.

## XSS

Olyan támadás, amelyben nem megbízható adatból az oldal környezetében végrehajtható kód lesz. A kontextusnak megfelelő kimenetkódolás és a biztonságos DOM-műveletek megakadályozhatják, hogy a bemenet szkriptként értelmeződjön.

## CSRF

Olyan támadás, amely a felhasználó böngészőjét egy másik oldalról nem szándékolt művelet kérésére készteti. Kihasználhatja az automatikusan küldött hitelesítő adatokat, ezért a szervernek a művelet eredetét vagy megfelelő CSRF-tokent is ellenőriznie kell.

## Injekció

Amikor egy értelmező az adatot az utasítás szintaxisaként kezeli. Az adatok és az utasításszerkezet elválasztása megakadályozhatja, hogy a támadó bemenet új műveletté alakuljon.

## Paraméterezett lekérdezés

Lekérdezési szerkezet és felhasználói érték külön továbbítása az adatbázisnak. A paraméterérték adat marad, nem SQL-szintaxis, de a dinamikusan választott táblaneveket és más szerkezeti elemeket külön kell szabályozni.

## Jelszó-hash

Jelszó ellenőrzéséhez tárolt, költséges eljárással képzett érték. A sózott, erre tervezett eljárás lassítja az offline találgatást, de gyenge jelszó esetén nem teszi lehetetlenné a visszafejtés helyett végzett próbálgatást.

## Salt

Egyedi, a jelszó-hash előállításakor használt érték. Nem titok, hanem jelszavanként eltérő, véletlenszerű érték, amely megakadályozza az azonos jelszavakhoz tartozó azonos hash-eket és a közös előszámítás hatékony használatát.

## MFA

Egymástól független tényezőcsaládokra támaszkodó hitelesítés. Két jelszó nem két külön tényező, de egy jelszó és egy birtokolt hitelesítő eszköz együtt többtényezős folyamat része lehet.

## Munkamenet-eltérítés

Egy érvényes munkamenet-azonosító jogosulatlan használata. A támadó a megszerzett azonosítóval a felhasználó nevében indíthat kéréseket, amíg a munkamenet érvényes és a további ellenőrzések ezt nem akadályozzák meg.

## Munkamenet-érvénytelenítés

Az azonosítóhoz tartozó szerveroldali hozzáférés megszüntetése. A kliens cookie-jának törlése önmagában nem elegendő, ha a szerver a korábban kiadott azonosítót továbbra is elfogadja.

## HTTPS

HTTP-forgalom TLS-sel védett kapcsolaton. A kapcsolat titkosságát és sértetlenségét, valamint a szerver hitelesítését támogatja, de alkalmazási jogosultságot vagy megbízható tartalmat nem garantál.

## TLS-végpont

A hálózati hely, ahol a védett kapcsolat véget ér. Ha a TLS-t egy reverse proxy zárja le, az alkalmazásszerver felé vezető további kapcsolat védelmét külön kell kialakítani.

## Vegyes tartalom

HTTPS-oldal által nem védett HTTP-kapcsolaton betöltött erőforrás. A böngészők az ilyen kéréseket az erőforrás típusától függően blokkolhatják vagy védett kapcsolatra módosíthatják.

## Tanúsítvány-ellenőrzés

A kapcsolódó név és a kiszolgáló igazolásának ellenőrzése. A kliens a kért névhez illeszkedést, a tanúsítvány érvényességét és a megbízható láncot vizsgálja, nem a szolgáltatás jóindulatát.

## OWASP

Webalkalmazás-biztonsági tudást és útmutatókat közzétevő nyílt szakmai közösség. Anyagai fejlesztőknek és ellenőröknek adnak támpontot, de alkalmazásukhoz az adott rendszer fenyegetéseit és környezetét is ismerni kell.

## OWASP Top 10

Fontos webalkalmazás-biztonsági kockázatokat összefoglaló, időről időre frissülő lista. A kockázatok megértését segíti, de nem teljes ellenőrzőlista és nem bizonyítja egy alkalmazás biztonságát.

## Cheat Sheet Series

Konkrét biztonsági témákhoz adott gyakorlati OWASP-útmutatók. A javaslatok konkrét megvalósítási döntéseket támogatnak, például a jelszótárolás vagy a munkamenet-kezelés területén.

## Biztonsági áttekintés

Adatfolyamok és ellenőrzések vizsgálata meghatározott fenyegetési modell alapján. Megvizsgálja, hogy a védelmek a fontos határokon valóban érvényesülnek-e, és milyen kockázat marad sikertelen ellenőrzés esetén.
