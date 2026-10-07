# 06.03. Sorrend, retry és dead-letter feldolgozás

Az aszinkron üzenetek késhetnek, ismétlődhetnek, és párhuzamos fogyasztás miatt eltérő feldolgozási sorrendben érkezhetnek. A producer kibocsátási sorrendje, a broker tárolási sorrendje és az üzleti hatások sorrendje külön fogalom.

## Sorrend és partíció

Ha ugyanazon rendelés eseményeinek sorrendje fontos, használható rendelésazonosító szerinti partíciókulcs. Egy adott partíció feldolgozási rendje így követhetőbb lehet. Külön partíciók között általában nem feltételezünk közös teljes sorrendet.

A kulcsválasztás hat a terhelésre. Ha minden üzenet ugyanazt a kulcsot kapja, egy partíció szűk keresztmetszet lesz. Ha minden esemény véletlen kulcsot kap, az ugyanazon entitáshoz tartozó sorrend elveszhet. Az üzleti sorrendi igényt és a terheléselosztást együtt kell megtervezni.

## Verzió és késői esemény

Egy entitáshoz tartozó esemény hordozhat monoton növekvő verziót. Ha a read model már a 12-es verziót alkalmazta, a később érkező 11-est nem kezelheti friss állapotként. Egy deltaeseménynél a hiányzó 10-es verzió viszont jelentős lehet: a köztes művelet nem hagyható el ugyanúgy, mint egy teljes pillanatkép.

Az időbélyeg nem biztosít megbízható globális sorrendet, mert az órák eltérhetnek és az üzenetek külön utakon érkeznek. Ha sorrendre van szükség, az azonosító, a verzió és a forrás szerződése legyen az elsődleges támpont.

## Retry az ok alapján

Átmeneti adatbázis-elérési hiba később megszűnhet. Érvénytelen séma vagy hiányzó kötelező mező ugyanazon tartalom ismétlésétől nem javul meg. A consumer különítse el az átmeneti, tartós és üzleti elutasítást.

Késleltetett retry és backoff segít elkerülni, hogy egy kiesett függőséget folyamatosan ugyanazzal a munkával terheljünk. Legyen próbálkozási vagy időbeli felső korlát. Egy sikertelen üzenet ne akadályozza korlátlanul az összes többi feldolgozását, ha az üzleti sorrend ezt nem indokolja.

## Dead-letter queue

A dead-letter hely a sikertelen vagy nem kezelhető üzenetek elkülönítésére szolgál. Nem megoldás önmagában: kell ok, eredeti azonosító, próbálkozási információ és visszajátszási rend. A javított consumer után újra kell tudni indítani a munkát ellenőrzött módon.

A visszajátszás megismételheti a korábbi hatásokat, ezért idempotencia szükséges. Események átírása esetén meg kell őrizni a követhetőséget. Egy üzletileg fontos üzenet „DLQ-ba került” állapota felhasználói vagy működési következményt jelent, nem sikeres befejezést.

> [!important] A sorrendi igényt entitáshoz kösd
> A teljes rendszer globális sorrendje gyakran felesleges és drága. Nevezzük meg, mely műveleteknek kell ugyanazon üzleti adat körül rendezettnek lenniük.

## Hibafolyamat elemzése

Egy read model `Created`, `AddressChanged` és `Cancelled` eseményeket kap. A címváltozás hibás payload miatt elkülönítésre kerül, a törlés közben továbbhalad. Döntsd el, lehet-e folytatni, és mit kell megőrizni a későbbi helyreállításhoz. A válasz függ attól, hogy a törlés teljes állapotot vagy csak egy deltát hordoz.

## Ellenőrző kérdések

1. Milyen sorrendet biztosít és milyet nem biztosít egy partíciókulcs?
2. Miért veszélyes minden hibát korlátlan retryval kezelni?
3. Milyen feltétel mellett biztonságos a dead-letter üzenetek visszajátszása?
