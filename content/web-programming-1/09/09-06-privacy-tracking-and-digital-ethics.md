# 09.06. Adatvédelem, követés és digitális etika

A webes szolgáltatás működés közben adatokat kezelhet a felhasználóról, a készülékéről és a viselkedéséről. A technikai lehetőség nem válaszolja meg, hogy mit indokolt gyűjteni, milyen célból, mennyi ideig és milyen valódi választási lehetőséggel. Az adatvédelem tervezési és felhasználói bizalmi kérdés is.

## Szükséges előismeretek

- [Cookie-k és munkamenetek](../07/07-02-cookies-and-sessions.md) — tárolás és kéréshez csatolás.
- [Böngészős tárolás és tokenek](../07/07-03-browser-storage-and-tokens.md) — eltérő helyi tárolók.
- [Fenyegetési modell](../08/08-01-threat-models-and-trust-boundaries.md) — védendő személyes adatok.

## Mit jelent adat a weben?

Adat lehet a név, e-mail-cím vagy születési dátum, de a látszólag jelentéktelen részletek is összekapcsolhatók emberhez vagy eszközhöz. Ilyen lehet egy bejelentkezési azonosító, egy állandó hirdetési azonosító, egy IP-cím, egy pontos helyadat, vásárlási előzmény vagy az, hogy mely cikkeket olvasta valaki. Egyetlen adat önmagában néha kevés, több adat együtt azonban részletes profilt alkothat.

Érdemes három nézőpontból kérdezni. **Milyen adat** keletkezik? **Ki** kapja meg: csak az üzemeltető, vagy elemző, hirdetési, beágyazott videós és közösségi szolgáltató is? **Milyen célból és meddig** őrzik? Ha ezekre nincs világos válasz, a felhasználó nem tud értelmes döntést hozni.

Egy időpontfoglaló oldalon például az e-mail-cím az értesítéshez ésszerűen szükséges lehet. A böngésző nyelve segíthet a felület megjelenítésében. Az érdeklődési profil építése azonban már más cél: nem következik automatikusan a foglalásból. A cél megváltoztatása különösen fontos tervezési pillanat.

```mermaid
flowchart LR
    U[Felhasználó] --> S[Szolgáltatás]
    S -->|szükséges adat| M[Működés]
    S -->|külön cél és döntés| A[Elemzés vagy követés]
    A --> T[Adatmegőrzés és törlés]
```

## Cookie-k: kicsi állományok, nagy szerep

A HTTP alapvetően állapotmentes: két egymást követő kérésből a szerver nem tudja biztosan, hogy ugyanattól a böngészőtől érkezett-e. A cookie egy név–érték pár, amelyet a szerver a válaszban küldhet, a böngésző pedig a megfelelő későbbi kérésekhez visszaküld. Így például fennmaradhat a bejelentkezett munkamenet, a kosár tartalma vagy a választott nyelv.

Egy cookie attribútumai meghatározzák a viselkedést. A `Secure` azt jelzi, hogy csak titkosított kapcsolaton küldhető; a `HttpOnly` csökkenti annak esélyét, hogy böngészőoldali JavaScript olvassa; a `SameSite` a más oldalról induló kéréseknél való küldést korlátozza. A lejárat nélkül létrehozott munkamenet-cookie jellemzően a böngészés végéig él, a tartós cookie későbbi látogatáskor is megmaradhat. Ezek biztonsági és működési tulajdonságok, nem automatikus adatvédelmi felmentések.

Nem minden cookie követés, és nem minden követés cookie. Egy első féltől származó bejelentkezési cookie sokszor a felhasználó által kért funkcióhoz kell. Ugyanakkor azonosítás történhet `localStorage`-ban tárolt értékkel, URL-paraméterrel, bejelentkezéssel, szerveroldali naplókkal vagy több böngészőjellemző összekapcsolásával is. Utóbbi példája az eszköz- vagy böngészőujjlenyomat: képernyőméret, nyelv, betűkészletek, grafikus képességek és más jelek kombinációja valószínűsítheti a visszatérő eszközt. Ez gyakran kevésbé látható, mint egy cookie.

## Első és harmadik fél; mérés és profilalkotás

Az **első fél** az a webhely, amelyet a felhasználó felkeresett. **Harmadik fél** lehet az oldalba betöltött analitikai szkript, hirdetési hálózat, térkép, betűtípus, chatmodul vagy közösségi beágyazás. A böngésző hálózati nézetében ezek külön kérésekként jelenhetnek meg. Egy kényelmes beágyazás tehát adatáramlási döntés is.

Az összesített, rövid ideig megőrzött látogatási statisztika és az egyének közötti, hosszan épített viselkedési profil között nagy a különbség. A termékfejlesztéshez hasznos lehet megtudni, hogy egy űrlap melyik lépésénél akadnak el sokan. Ehhez nem feltétlenül szükséges névhez kötni minden kattintást, vagy ugyanazt az embert más webhelyeken is felismerni. A célhoz illő mérés gyakran kevesebb adatból is lehetséges.

## Hozzájárulás: valódi választás, nem dekoráció

Sok oldalon felbukkan a cookie-sáv. Jó esetben ez nem csupán akadály, hanem rövid és érthető döntési pont: mi szükséges a működéshez, mi opcionális, milyen célokra menne adat, és hogyan lehet később módosítani a választást. A felületnek a visszautasítást sem szabad indokolatlanul elrejtenie vagy nehezítenie. A „mindent elfogadok” nagy, színes gombja mellett apró, több lépéses elutasítás rossz felhasználói élmény és etikailag is problémás tervezési minta lehet.

A gyakorlatban a hozzájárulást érdemes célok szerint bontani, például szükséges, beállítások, mérés és személyre szabott hirdetés. A szükséges kategória elnevezése nem varázsszó: csak az a technika tartozhat ide, amely nélkül a kifejezetten igényelt szolgáltatás nem működik ésszerűen. A választást később ugyanúgy elérhetővé kell tenni, mint az elfogadást. Egy érthető adatkezelési tájékoztató pedig nem a banner helyett van, hanem annak részletes háttere.

## GDPR mint szemléleti keret

Az európai adatvédelmi szabályozás, benne a GDPR, az érintettek jogait és az adatkezelők felelősségét hangsúlyozza. Oktatási szempontból különösen hasznos alapelvek a célhoz kötöttség, az adattakarékosság, az átláthatóság, a pontosság, a megőrzési idő korlátozása, valamint a megfelelő biztonság. Ezek nem csak dokumentációs feladatok. Tervezési kérdések: tényleg kell-e a telefonszám? Miért őrizzük az eseménynaplót? Ki fér hozzá? Hogyan tájékoztatjuk az embert?

A személynek általánosságban lehetnek tájékoztatáshoz, hozzáféréshez, helyesbítéshez, törléshez, tiltakozáshoz vagy hordozhatósághoz kapcsolódó jogai. Hogy egy konkrét esetben ezek pontosan hogyan alkalmazandók, az adatkezelés céljától és körülményeitől függ. Ezért nem helyes egy tárgy keretében kész jogi ítéletet mondani arról, hogy egy valós oldal „GDPR-kompatibilis-e”. A fejlesztő felelőssége inkább az, hogy időben felismerje az adatáramlást, kérdezzen, és ne késői utómunkaként kezelje a védelmet.

## Digitális etika: amit a szabály még nem rendez el

Lehet valami technikailag megengedettnek gondolt, mégis tisztességtelen. A sötét minták erre jó példák: előre bepipált opciók, félrevezető megfogalmazás, szégyenérzetet keltő elutasító gomb, vagy olyan folyamat, amely ráveszi a felhasználót a több adat átadására. Hasonló kérdés az algoritmikus személyre szabás: ha egy rendszer ismeri a sérülékeny pillanatokat és ezeket kihasználva próbál több időt vagy pénzt kicsikarni, a „növeli a konverziót” nem elégséges indok.

Az etikus rendszer tervezője nem csak azt kérdezi, meg tudjuk-e szerezni az adatot. Azt is, hogy a felhasználó érti-e a következményt, arányos-e az előny a beavatkozással, és ki viseli a kockázatot hiba vagy visszaélés esetén. Az adatminimalizálás gyakran egyben biztonsági előny: ami nincs begyűjtve, az nem szivároghat ki ugyanúgy.

## Végigvezetett példa: hírlevél és látogatási mérés

Képzeljünk el egy egyetemi rendezvényoldalt. A hírlevélhez e-mail-címet kér, az eseményoldalon látogatottságot mér, és beágyazott videót jelenít meg. Első lépésként fel kell térképezni az adatfolyamot. Az e-mail a feliratkozás kezelőjéhez jut; a mérőkód eseményeket küld; a videó betöltése külső szolgáltatóhoz kapcsolódhat. Második lépés a célok elválasztása: a hírlevél kezelése, a szolgáltatás működtetése és az opcionális elemzés nem ugyanaz.

> [!tip] Csökkentsd a szükségtelen adatkitettséget
> Ezután a tervező csökkentheti a kitettséget. A videó csak kattintás után töltődjön be, így a szolgáltató nem kap azonnal kérést. A mérés készülhet kevésbé részletes, rövidebb ideig tárolt adatokkal. A feliratkozásnál világos legyen, milyen levelek várhatók és hogyan lehet leiratkozni. A hozzájáruló felület legyen billentyűzettel kezelhető, és az elutasítás egyértelmű. Az eredmény nem „nulla adat”, hanem megfontolt adatkezelés.

## Gyakori félreértések

**„Minden cookie tiltott, amíg nincs kattintás.”** Nem a cookie neve vagy technikai formája dönti el egyedül a kérdést. Vannak a kért funkció működéséhez kapcsolódó tárolások; a pontos megítélés körülményfüggő.

**„Az inkognitó mód teljesen anonim.”** Az inkognitó elsősorban helyi böngészési nyomokat kezel másként. A hálózati szolgáltatók és a felkeresett oldalak ettől még láthatnak adatokat.

**„Ha nem kérünk nevet, nincs személyes adat.”** Egy tartós azonosító vagy több jel együtt továbbra is kapcsolható lehet emberhez vagy eszközhöz.

**„Az adatvédelmi tájékoztató megoldja az etikai problémát.”** A hosszú, érthetetlen tájékoztató nem teszi tisztességessé a manipulatív vagy aránytalan gyakorlatot.

## Megismert fogalmak

**Adatminimalizálás:** csak a célhoz szükséges adatok kezelése.  
**Cookie:** a böngésző által tárolt, kérésekhez kapcsolható kis adat.  
**Első fél / harmadik fél:** a felkeresett oldal üzemeltetője, illetve a beágyazott külső szolgáltató.  
**Hozzájárulás:** a felhasználó tájékozott, önkéntes döntése egy adott célról.  
**Nyomkövetés:** viselkedés vagy eszköz ismételt felismerése és összekapcsolása.  
**Sötét minta:** megtévesztő vagy aránytalan felületi megoldás, amely befolyásolja a döntést.  
**Ujjlenyomat:** több böngésző- és eszközjellemzőből képzett azonosítási jel.
