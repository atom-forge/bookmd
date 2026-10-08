# Fogalomtár

## Többoldalas alkalmazás (MPA)

Olyan webalkalmazási modell, amelyben a különböző nézetekhez jellemzően külön HTML-dokumentumok tartoznak. A fő nézetek közötti váltás rendszerint teljes dokumentumlekéréssel történik, miközben az egyes oldalak JavaScript segítségével interaktívak is lehetnek.

## Egyoldalas alkalmazás (SPA)

Olyan modell, amelyben a már betöltött kliensalkalmazás gyakran a jelenlegi dokumentumon belül vált nézetet és kér új adatot. A kliensoldali útvonalválasztás csökkentheti a teljes újratöltések számát, de az induláshoz szükséges kód és a közvetlen URL-megnyitás kezelését meg kell tervezni.

## Kliensoldali navigáció

Nézetváltás, amelyet a böngészőben futó program kezel új teljes dokumentum betöltése nélkül. Az alkalmazásnak össze kell hangolnia a megjelenő nézetet az URL-lel és a böngésző vissza-előre műveleteivel.

## Mély link

Egy alkalmazás konkrét belső nézetét közvetlenül megnyitó URL. Az URL friss böngészőlapból vagy megosztott hivatkozásból is az adott nézethez kell vezetnie, ezért a kiszolgálónak is támogatnia kell az útvonalat.

## Kliensoldali renderelés (CSR)

A felület jelentős részének böngészőben, JavaScript segítségével történő előállítása. A kezdeti HTML kevés tényleges tartalmat tartalmazhat, ezért az első használható nézet a program betöltésére és az adatok megérkezésére várhat.

## HTML-váz

Kezdeti dokumentum, amely a kliensoldali alkalmazás számára kiinduló szerkezetet ad. Tartalmazhat gyökérelemet, betöltésjelzést és programhivatkozásokat, de önmagában nem feltétlenül adja a teljes használható nézetet.

## Betöltési állapot

A felület olyan állapota, amelyben a szükséges program vagy adat még nem áll rendelkezésre. Világos visszajelzéssel különíti el a folyamatban lévő műveletet a hibától vagy az üres eredménytől.

## Kliensoldali adatmodell

A böngészőben kezelt adatok és állapot, amelyek alapján a program megjeleníti a felületet. A helyi másolat és a szerveren tárolt állapot eltérhet, ezért frissítési és hibakezelési szabályokra is szükség van.

## Szerveroldali renderelés (SSR)

A nézet fontos HTML-tartalmának a szerveren, a kérés kiszolgálása közben történő előállítása. A böngésző így már az első válaszból megjeleníthet érdemi tartalmat, az interaktív működéshez azonban további klienskód kapcsolódhat.

## Hidratálás

A már meglévő HTML felülethez kliensoldali JavaScript-állapot és eseménykezelés kapcsolása. A kezdeti kliensállapotnak illeszkednie kell a kiszolgált HTML-hez, különben megjelenítési eltérés vagy újrarenderelés jelentkezhet.

## Első HTML-válasz

Az oldal fő dokumentumának HTTP-válasza, amely SSR esetén a fontos tartalmat is tartalmazhatja. A további képek, stílusok és programok betöltése ettől külön folyamat, ezért az első válasz megérkezése nem egyenlő a teljes használhatósággal.

## Statikus oldalgenerálás (SSG)

A HTML közzététel előtti előállítása és kész dokumentumként történő kiszolgálása. A kiszolgálás nem igényel minden kéréshez új HTML-előállítást, de a forrásadatok változása friss generálást tehet szükségessé.

## Hibrid renderelés

Több renderelési stratégia együttes alkalmazása eltérő oldalakhoz vagy oldalelemekhez. Például a nyilvános tartalom előre generált HTML-ként, a személyes adatok pedig későbbi kliensoldali lekéréssel jelenhetnek meg.

## Közzétételi folyamat

A tartalmi forrásból a kiszolgálható statikus állományokat létrehozó és kiadó lépések sora. A build, ellenőrzés és telepítés sorrendje határozza meg, melyik forrásváltozatból lesz ténylegesen elérhető oldal.

## Kliensoldali állapot

A böngészőben kezelt pillanatnyi adat, amely meghatározhatja a megjelenő nézetet és interakciót. Ilyen lehet a kijelölt fül vagy egy még el nem küldött űrlap, amelyek nem szükségszerűen kerülnek a szerverre.

## Szerveroldali állapot

A szolgáltatás által kezelt, több kérés vagy felhasználó számára jelentős alkalmazási adat. Például az elfogadott jelentkezés vagy készletadat hiteles változata itt található, ezért a böngésző csak szabályozott műveletekkel módosíthatja.

## Navigációs állapot

Az a rész, amely meghatározza, melyik nézet és URL aktuális a böngészőben. Az útvonal, a lekérdezési paraméterek és a böngésző előzményei együtt segítik a nézet megosztását és helyreállítását.

## History API

Böngészőfelület a munkamenet előzményeinek programozott kezelésére, például kliensoldali navigáció támogatására. A pushState és replaceState módosíthatja az előzménybejegyzést teljes dokumentumlekérés nélkül, de az új nézet megjelenítését az alkalmazás végzi.

## Service worker

Elkülönülő böngészős háttérprogram, amely a saját hatókörében többek között hálózati kérésekhez kapcsolódó eseményeket kezelhet. Eseményvezérelt életciklusa miatt nem folyamatosan fut, és nem fér hozzá közvetlenül az oldal DOM-jához.

## Cache API

Kérés–válasz párok helyi tárolására szolgáló böngészős felület. A tárolt válaszok frissítéséről és törléséről az alkalmazás dönt, ezért nem működik automatikusan úgy, mint a HTTP-gyorsítótár.

## Offline stratégia

Annak tervezett szabálya, mely erőforrás és művelet használható hálózat nélkül, és hogyan történik a későbbi frissítés. Az olvasás és a módosítás eltérő kezelést igényelhet, például helyi megjelenítést vagy később szinkronizált műveleti sort.

## Hatókör

Az a URL-tartomány, amelynek dokumentumait az adott service worker vezérelheti. A vezérelt dokumentum kérései más címeket is elérhetnek, ezért a hatókör nem egyszerűen az összes kezelhető erőforrás URL-jeinek listája.

## Alkalmazásmodell

A felület navigációját és kliens–szerver felelősségeit szervező megközelítés, például MPA vagy SPA. A választás meghatározza a nézetváltások kezelését, de önmagában nem dönti el, hol történik a renderelés.

## Renderelési stratégia

Annak megválasztása, hol és mikor áll elő a felület fontos tartalma. A döntés az első megjelenésre, az interaktivitás kezdetére, a kiszolgálói terhelésre és a tartalom frissességére is hat.

## Hibrid architektúra

Eltérő oldalak vagy elemek számára különböző navigációs, renderelési és adatkezelési megoldások együttese. Az összekapcsolt megoldások határainál a navigációt, az állapotátadást és a hozzáférési szabályokat következetesen kell kezelni.

## Első használható tartalom

A felhasználó alapvető céljához szükséges, megjelent és értelmezhető információ a felületen. Nem feltétlenül azonos az első kirajzolt képponttal, mert egy betöltésjelző még nem teszi elvégezhetővé a feladatot.
