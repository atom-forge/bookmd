# Fogalomtár

## Állapotmentes HTTP

A HTTP azon tulajdonsága, hogy a kérésekhez nem jár automatikusan korábbi kérésekből örökölt alkalmazási beszélgetésállapot. Az alkalmazás cookie-val, tokennel vagy más mechanizmussal teremtheti meg a kérések közötti összefüggést.

## Alkalmazási állapot

A szolgáltatás működéséhez szükséges, időben változó adat, például kiválasztás vagy elfogadott jelentkezés. Tárolási helye és élettartama alapján lehet böngészőbeli, szerveroldali vagy tartós adatbázis-állapot.

## Munkamenet

Egymáshoz kapcsolt felhasználói műveletek és kérések alkalmazási szintű összefüggése. Összekötheti például a bejelentkezést és a későbbi műveleteket, de időkorlát és megszüntetési szabály tartozik hozzá.

## Cookie

A böngésző által tárolható kis adat, amely a szabályai szerint későbbi HTTP-kérésekhez csatolható. Tárolhat munkamenet-azonosítót vagy más értéket, a küldés feltételeit a domain, útvonal és biztonsági attribútumok befolyásolják.

## Munkamenet-azonosító

Olyan érték, amely alapján a szolgáltatás egy kérést a megfelelő munkamenethez köthet. Értékének kiszámíthatatlannak kell lennie, és megszerzése esetén a támadó a munkamenet jogosultságaival visszaélhet.

## Szerveroldali munkamenet

A szolgáltatásnál kezelt, azonosítóval elérhető felhasználói állapot. A böngészőnek ilyenkor rendszerint az azonosítót kell elküldenie, a kapcsolódó adatok hiteles változata a szolgáltatásnál marad.

## Cookie-attribútum

A cookie kezelését korlátozó vagy leíró beállítás, például `Secure`, `HttpOnly` vagy `SameSite`. A Secure a HTTPS-en való küldést, a HttpOnly a JavaScript-hozzáférés korlátozását, a SameSite pedig a webhelyek közötti küldési feltételeket szabályozza.

## Web Storage

A böngésző eredethez kötött, egyszerű kulcs–érték tárolófelületeinek gyűjtőneve. A localStorage és sessionStorage sztringértékeket tárol, amelyek a cookie-któl eltérően nem kerülnek automatikusan a HTTP-kérésekbe.

## localStorage

A böngészőben későbbi használatra is megőrizhető kulcs–érték adatokat kezelő felület. Az adat nem jár le automatikusan a böngészőlap bezárásakor, de a felhasználó törölheti, és a böngésző szabályai is korlátozhatják a tárolást.

## sessionStorage

Egy böngészőlap munkamenetéhez kapcsolódó kulcs–érték tárolófelület. Az adatok eredet és böngészőlap szerint elkülönülnek, és a lap munkamenetének befejezésekor rendszerint törlődnek.

## Token

Meghatározott protokollbeli célra kiadott és ellenőrizhető érték, például erőforráshoz való hozzáférés képviseletére. Lehet átlátszatlan azonosító vagy strukturált üzenet, ezért ellenőrzésének módja és felhasználási hatóköre a protokolltól függ.

## Hozzáférési token

Olyan token, amelyet a kliens egy védett erőforrás eléréséhez adhat át a megfelelő erőforrás-szervernek. A szerver ellenőrzi az érvényességet, a neki szánt célközönséget és a szükséges engedélyeket, nem csupán a token jelenlétét.

## Hitelesítés

Egy szereplő identitására vonatkozó állítás ellenőrzése és elfogadása. A sikeres azonosítás nem jelenti automatikusan azt, hogy a szereplő bármely erőforráshoz hozzáférhet.

## Jogosultságkezelés

Annak eldöntése és érvényesítése, hogy egy szereplő elvégezhet-e egy műveletet egy erőforráson. A döntést a szerveren is érvényesíteni kell, mert a felületi gomb elrejtése önmagában nem védi a műveletet.

## Szerepkör

A felhasználóhoz rendelt, több jogosultsági döntésben használható kategória. Például az oktatói szerep általános képességeket adhat, de egy konkrét kurzus módosításához további erőforrásszintű ellenőrzés kellhet.

## Erőforrásszintű engedély

Konkrét adatra vagy objektumra vonatkozó hozzáférési döntés, például egy oktató saját kurzusának módosítása. Megakadályozza, hogy az általánosan megfelelő szerepkörű felhasználó más személyhez tartozó objektumokat is elérjen.

## OAuth 2.0

Delegált hozzáféréshez használt keretrendszer, amelyben a kliens korlátozott jogosultságot kaphat egy védett erőforrás használatához. Önmagában nem felhasználói bejelentkezési protokoll, az identitás ellenőrzését az OpenID Connect egészítheti ki.

## OpenID Connect (OIDC)

OAuth 2.0-ra épülő hitelesítési protokoll, amely ellenőrizhető felhasználói identitásinformációt adhat a kliensnek. A hitelesítésről ID token ad információt, amelyet a kliensnek a protokoll szerinti ellenőrzésekkel kell elfogadnia.

## Erőforrás-szerver

A védett API-adatot vagy műveletet kínáló szolgáltatás, amely a megfelelő hozzáférési tokent ellenőrzi. A tokenhez tartozó hozzáférési hatókör mellett az adott művelet és objektum engedélyezési szabályait is érvényesíti.

## ID token

OIDC-ben a kliensnek szánt, a hitelesítés eredményét kifejező token. A kliens ellenőrzi többek között a kibocsátót, a célközönséget, az aláírást és a lejáratot, és nem kezeli általános API-hozzáférési tokenként.

## Delegált hozzáférés

Olyan engedélyezés, amelyben egy alkalmazás a felhasználó jelszavának megismerése nélkül kap korlátozott hozzáférést más szolgáltatás erőforrásához. A kapott engedély meghatározott hatókörre és időre korlátozható, és a felhasználó vagy a szolgáltatás visszavonhatja.

## Egyszeri bejelentkezés (SSO)

Több alkalmazásban használható identitás-ellenőrzési elrendezés, amely csökkentheti az ismételt hitelesítési lépéseket. A közös identitásszolgáltatónál meglévő munkamenet több alkalmazás belépését segítheti, miközben az alkalmazások saját munkamenetei különállóak maradnak.

## Identitásszolgáltató

A felhasználó hitelesítését végző, erről más alkalmazások számára ellenőrizhető információt adó szolgáltatás. A támaszkodó alkalmazásnak ellenőriznie kell az igazolás eredetét és célját, mielőtt helyi felhasználói munkamenetet hoz létre.

## Külső bejelentkezés

Olyan belépési folyamat, amelyben az alkalmazás egy másik szervezet identitásszolgáltatójára támaszkodik. A külső hitelesítés után a helyi alkalmazás dönti el a felhasználó hozzárendelését és saját jogosultságait.

## Helyi munkamenet

Egy adott alkalmazás által a sikeres belépés után fenntartott saját felhasználói állapot. Lejárata és kijelentkeztetése eltérhet az identitásszolgáltató munkamenetétől, ezért a két állapot nem kezelhető automatikusan azonosként.
