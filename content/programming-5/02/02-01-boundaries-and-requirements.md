# 02.01. Követelményektől a szolgáltatáshatárokig

A rendszertervezés elején nem végpontokat és adatbázistáblákat osztunk szét. Azt keressük, melyik üzleti felelősség milyen szabályokat érvényesít, milyen adatok fölött dönt, és milyen más felelősségekkel működik együtt. Az eredmény lehet moduláris monolit vagy több szolgáltatás; a logikai határok mindkettőhöz szükségesek.

## Tervezés ellenőrizhető lépésekben

Először nevezzük meg a rendszer szereplőit és az általuk indított műveleteket. Ezután írjuk le a megőrzendő szabályokat: például egy helyet ne lehessen kétszer eladni, vagy egy könyvelési tétel ne tűnhessen el utólag. A szabályból megállapítható, melyik komponensnek kell a döntést és a módosítást együtt kezelnie.

A funkciók mellé minőségi követelmények kerülnek. Más felbontás lehet indokolt, ha a keresés különösen nagy terhelést kap, ha a számlázás szabályozási szempontból elkülönítendő, vagy ha két csapat külön kiadási ritmusban dolgozik. A szolgáltatáshatár tehát üzleti és működési döntés egyszerre.

## Kohézió és csatolás

A **kohézió** azt fejezi ki, mennyire tartoznak össze egy egység felelősségei. Az ülőhely lefoglalása, felszabadítása és a foglalási állapot vizsgálata közös szabályokhoz kapcsolódik. Jó jel, ha ezek együtt változnak és egy adatgazda kezelheti őket.

A **csatolás** az egységek közötti függés mértéke. Ha egy szolgáltatás csak egy stabil üzleti műveletet hív, kevésbé kötődik a másikhoz, mint ha annak belső tábláit és állapotát is ismeri. A cél magas belső kohézió és kezelhető külső csatolás; a teljes függésmentesség nem reális.

A bounded context egy modell érvényességi határa. A „termék” a katalógusban leírást és képet jelenthet, a raktárban készletazonosítót és mozgásokat, a számlázásban adózási adatokat. Nem kell minden kontextusra egyetlen óriási közös objektumot ráerőltetni. Egy kontextus nem szükségképpen egyetlen mikroszerviz, de hasznos kiindulás a határkereséshez.

## Adatgazda és műveletgazda

Minden módosítható üzleti adathoz jelöljünk ki gazdát. A fogyasztó kérdezhet vagy másolatot tarthat, de az eredeti állapot szabályait a gazda érvényesíti. Ha több szolgáltatás egymástól függetlenül írja ugyanazt a táblát, a felelősség elmosódik, és a séma változtatása közös kiadást igényelhet.

A műveletgazda felel a folyamat állapotáért. Egy rendelés több szolgáltatást érinthet, de tudni kell, ki tartja nyilván a teljesítés előrehaladását. A „mindenki küld eseményt” megfogalmazás önmagában nem válasz arra, hol látható a folyamat végeredménye.

> [!important] Ne az entitásnevekből gyárts szolgáltatásokat
> A `UserService`, `AddressService` és `EmailService` elnevezés nem bizonyít jó felbontást. A határt a felelősség, a szabályok és a változási minták indokolják.

## Határvizsgálat

Írjuk fel egy kiválasztott művelethez az összes szükséges adatot és hívást. Ha két szolgáltatás minden kérésben sokszor oda-vissza kommunikál, vizsgáljuk meg, nem túl apró-e a felbontás. Ha szinte minden módosítás három szolgáltatást érint, a határ nem követi a változások természetét.

A túl nagy szolgáltatás több, eltérő életciklusú felelősséget fog össze. A túl kicsi túl sok hálózati függőséget hoz létre. A méret helyett az együtt változás, az adatgazda és a tranzakciós igény ad használható mércét.

## Tervezési feladat

Egy jegyértékesítő rendszerben különítsd el a programkatalógust, a helyfoglalást és a fizetést. Minden egységhez adj felelősséget, adatgazdát és publikus műveletet. Ezután vizsgáld meg, a foglalás és a végleges eladás szabályát melyik egység tudja következetesen érvényesíteni.
