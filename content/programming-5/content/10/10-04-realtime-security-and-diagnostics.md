---
type: content
tags: []
---
# Valós idejű kapcsolatok védelme és hibakeresése

Tartós kapcsolatnál a hitelesítés nem egyszeri, minden jövőbeli üzenetre érvényes felmentés. A kapcsolat hosszabb ideig élhet, mint a token vagy a felhasználó jogosultsága. A feliratkozást, a beérkező műveleteket és a kimenő adatokat is védeni kell.

## Handshake és Origin

Böngészős WebSocketnél a szerver vizsgálhatja az Origin headert egy explicit engedélyezett originlista alapján. Cookiealapú hitelesítésnél ez különösen fontos a más webhelyről indított jogosulatlan socketkapcsolatok ellen. Az Origin nem erős kliensazonosság: nem böngészős kliens tetszőleges értéket is küldhet.

A natív böngészős WebSocket konstruktor nem ad tetszőleges headerbeállítási felületet. Használható megfelelően védett cookie, rövid életű kapcsolati ticket vagy más dokumentált megoldás. Hosszú életű érzékeny tokent ne tegyünk naplózható URL-be. Ha az első alkalmazási üzenet végzi a hitelesítést, addig szigorúan korlátozott állapot és rövid határidő szükséges.

## Feliratkozási jogosultság

Egy `orders:customer-42` csatornanév ismerete nem ad hozzáférést. A szerver a hitelesített felhasználó és tenant alapján ellenőrzi a feliratkozást. A továbbított események szűrése ne csak a kliens kérésére támaszkodjon.

Jogosultságváltozáskor a kapcsolat hozzáférését frissíteni vagy a kapcsolatot bontani kell. A token lejáratát és az újrahitelesítés módját a protokoll írja le. A hosszú ideig nyitott socket nem tarthat életben korábban visszavont jogosultságot korlátlanul.

## Üzenetkorlátok és visszaélés

Sémavalidáció, maximális üzenetméret, műveleti sebességkorlát és feliratkozásszám-korlát szükséges. Egy apró üzenet is drága lehet, ha ezer belső hívást indít. A terheléskorlát ezért nem csupán bájtszámot vizsgál.

A tömörítés és a nagy payload erőforrásköltségét mérni kell. Hibás vagy túlméretes üzenet ne jusson korlátlanul a parserhez és az üzleti réteghez. A hibaválasz legyen kezelhető, de ne adjon részletes belső információt a támadónak.

## Hibakeresés több rétegen

Kapcsolati hiba lehet handshake-elutasítás, proxytimeout, hitelesítési hiba, üzleti elutasítás vagy lassú fogyasztó. A naplóban ezek külön kódot kapjanak. A kapcsolat azonosítója, a felhasználó biztonságos azonosítója és a műveletazonosító segít összekötni az eseményeket.

HTTP- és RPC-hívásoknál a trace context a hívási láncot köti össze. Üzenetküldésnél a producer és consumer közötti kapcsolatot továbbvitt kontextus vagy trace link jelölheti. Nem minden háttérmunka ugyanazon rövid életű kérés folytatása: a hosszú idő és több fogyasztó eltérő megfigyelési modellt igényel.

A metrikákból látszódjon a kapcsolatok száma, az üzenetütem, a reconnectarány, a puffer és az elutasítás oka. Ne használjunk minden kapcsolat vagy felhasználó azonosítóját metrikacímkeként, mert korlátlan kardinalitás keletkezhet. Az egyedi részletek inkább logba vagy trace-be kerüljenek.

> [!important] A diagnosztika segítse a jelentés megértését
> A „socket closed” kevés. Tudni kell, hogy a művelet végrehajtódott-e, a kliens lemaradt-e, és milyen helyreállítási út következik.

## Összefoglaló ellenőrzési helyzetek

Vizsgáld a lejárt tokent, tiltott origint, más tenant csatornáját, túl nagy üzenetet, túl gyors parancsokat és a lassú klienst. Ezután kapcsolatszakítással ellenőrizd a resyncet és a tartós műveleteredmény lekérdezését. Ezek a protokoll helyességének vizsgálatai, nem külön deploymenttananyag.

## Ellenőrző kérdések

1. Miért nem helyettesíti az Origin a hitelesítést?
2. Hogyan szűnik meg egy visszavont jogosultság egy tartós kapcsolatban?
3. Milyen adat alapján különítenéd el a proxyhibát és az üzleti elutasítást?

Irányelvek: [OWASP WebSocket Security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html), [W3C Trace Context](https://www.w3.org/TR/trace-context/).
