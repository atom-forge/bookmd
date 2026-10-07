# 03.04. Kommunikációs szerződés és verziók együttélése

A kommunikációs szerződés több a JSON mezőinek listájánál. Megadja a művelet jelentését, a bemenet korlátait, a kimenetet, a hibákat és a megengedett ismétlést. A szolgáltatások önálló kiadásához a régi és új fogyasztóknak egy ideig együtt kell működniük.

## A szerződés rétegei

A szintaktikai szerződés a formátumot írja le: mezőtípusok, kötelező mezők, kódolás, dátum- és számformátum. A szemantikai szerződés megmondja, mit jelentenek ezek. A `price: 1200` jelenthet forintot, fillért vagy egy pénznem nélküli belső egységet; a típusból nem következik az értelmezés.

A viselkedési szerződés rögzíti az oldalsó hatásokat. Egy `reserve` művelet csak ellenőrzi a készletet vagy le is foglalja? Meddig érvényes a foglalás? Mi történik ismételt azonosítóval? A működési szerződéshez kapcsolódhat időkeret, maximális üzenetméret és terhelési korlát.

## Kompatibilis és törő változtatások

Egy új opcionális mező általában könnyebben bevezethető, mint egy régi kötelező mező átnevezése. De a kompatibilitás függ a fogyasztó viselkedésétől is: egy szigorú dekóder az ismeretlen mezőt is elutasíthatja. Egy új enumérték szintén problémát okozhat, ha a kliens minden lehetséges értéket lezártnak tekint.

A szemantikai változtatás különösen veszélyes. Ha a `total` korábban bruttó összeget jelentett, később pedig nettót, a séma változatlan maradhat, mégis törik az együttműködés. A szerződésellenőrzésnek ezért a viselkedést is vizsgálnia kell.

## Expand–migrate–contract

Fokozatos változtatáskor először bővítjük a szerződést úgy, hogy a régi fogyasztó működjön. Ezután átállítjuk a fogyasztókat, és mérjük a régi mező vagy művelet használatát. Végül eltávolítjuk a már nem használt részt. A három szakasz nem egyetlen közös kiadási pillanat.

Egy átnevezett mezőnél például átmenetileg mindkét mező jelen lehet. Meg kell adni, melyik az irányadó és mi történik ellentmondó értékeknél. Az új mező megjelenése nem indokolja azonnal a régi eltávolítását, amíg régi kliensek futnak.

## Szerződésellenőrzés

A provider ellenőrizheti, hogy a válasza megfelel a publikált sémának és példáknak. A consumer saját elvárásait is rögzítheti: milyen műveletet használ, mely mezőkre támaszkodik, mely hibákat kezeli. A consumer-driven contract teszt a tényleges fogyasztói igényeket teszi láthatóvá.

Ez nem helyettesíti az integrációs vizsgálatot. Egy séma szerint érvényes válasz lehet hibás üzleti eredmény, és a kompatibilis API is lehet elérhetetlen rossz routing miatt. A vizsgálat szintjét a kérdéshez választjuk.

> [!warning] A verziószám nem kompatibilitási bizonyíték
> A `/v2` útvonal vagy új topicnév csak elválasztja a változatokat. A migrációt, a párhuzamos működést és a régi fogyasztók kivezetését továbbra is meg kell tervezni.

## Szerződéstervezési feladat

Írj rövid szerződést egy `CreateExport` művelethez. Legyen benne bemeneti formátum, időzóna, műveletazonosító, elfogadási válasz, állapotlekérdezés, hibák és ismétléskezelés. Ezután tervezz meg egy új exportformátum bevezetését úgy, hogy a régi kliensek tovább működjenek.
