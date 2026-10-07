# 06.03. Szerveroldali renderelés

Szerveroldali rendereléskor a szolgáltatás a kéréshez HTML-t állít elő, amely már tartalmazza a nézet fontos tartalmát. A böngésző ezt dokumentumként tudja feldolgozni, miközben a JavaScript később további interakciót adhat hozzá. A szerveroldali renderelés nem azonos a többoldalas alkalmazással: az első HTML-t egy később kliensoldalon navigáló alkalmazás is kaphatja így.

## Szükséges előismeretek

- [Többoldalas és egyoldalas modellek](06-01-multi-page-and-single-page-apps.md) — a navigáció különbsége.
- [Kliensoldali renderelés](06-02-client-side-rendering.md) — a böngészőben végzett felületépítés.

## Friss kurzusadatból HTML

A hallgató megnyitja egy kurzus részleteit. A szerver lekérheti a kurzus aktuális adatait, majd ezekből HTML-dokumentumot állít elő. A böngésző már az első válaszban megtalálhatja a címet, leírást és hivatkozásokat. A HTML nem feltétlenül korábban tárolt fájl; kérésenként is előállhat.

```mermaid
flowchart LR
    Q[Kurzusoldal kérése] --> S[Szerver: adat + HTML-előállítás]
    S --> H[HTML-válasz]
    H --> B[Böngésző: feldolgozás]
```

A böngészőnek továbbra is le kell töltenie a stílusokat és más erőforrásokat. A szerveroldali renderelés nem „kész képet” küld, hanem készebb dokumentumot. Ha az oldal interaktív működése JavaScriptre épül, az a HTML megjelenése után válhat használhatóvá.

## A szerver munkája és az első tartalom

Az SSR előnye lehet, hogy a lényeges tartalom már az első HTML-válaszban szerepel. Ezt olyan oldalnál értékeljük, ahol az olvasás és a közvetlen URL-megnyitás fontos. Nem automatikus gyorsulásról van szó. A szervernek adatot kell lekérnie és HTML-t előállítania; ha ez lassú, a válasz is késik. A kliens későbbi JavaScript-futtatása szintén terhelheti az eszközt.

> [!warning] A személyre szabott HTML gyorsítótárazása körültekintést igényel
> Ha sokan ugyanazt a nyilvános kurzusleírást kérik, a szerveroldali HTML megfelelő feltételek mellett gyorsítótárazható is lehet. Ha a tartalom személyre szabott, a cache szabályai körültekintőbbek. Az SSR nem helyettesíti a teljesítménytervezést, csak más helyre helyezi az első nézet előállításának munkáját.

## Interaktivitás és hidratálás

Egy szerver által előállított HTML-oldal önmagában is tartalmazhat működő hivatkozásokat és űrlapokat. Ha a felület bonyolultabb kliensoldali interakciót kíván, a böngészőben futó JavaScript a meglévő HTML-hez eseménykezelést és alkalmazási állapotot kapcsolhat. Ezt gyakran **hidratálásnak** nevezik. A látható szöveg és a teljes interaktivitás megjelenési ideje így elválhat.

A hidratálásnak is van költsége: a programot letölteni és futtatni kell, és a szerveroldali HTML-nek illeszkednie kell a kliens által várt állapothoz. Ha a két oldal eltér, hibás megjelenés vagy fölösleges újrarajzolás keletkezhet. A részletes keretrendszer-mechanizmusok itt nem célok; a fogalmi tanulság az, hogy a kész HTML és a működő kliensoldali program két külön állapot.

## SSR és navigáció

Többoldalas alkalmazásnál minden navigáció kaphat új, szerveroldalon előállított HTML-t. Egyoldalas alkalmazásnál a legelső kérés érkezhet SSR-rel, a későbbi nézetváltás pedig történhet kliensoldalon. A navigációs modell és a renderelési stratégia kombinálható. A döntésnél a felhasználói cél, a frissesség és az interakció számít.

## Gyakori félreértések

| Állítás | Pontosítás |
| --- | --- |
| „SSR esetén a szerver képernyőképet küld.” | HTML-t állít elő, amelyet a böngésző renderel. |
| „SSR oldalon nincs JavaScript.” | Később interaktív program is kapcsolódhat a HTML-hez. |
| „A látható HTML minden gombot azonnal működőképessé tesz.” | A JavaScriptre épülő műveletek később válhatnak elérhetővé. |
| „SSR csak MPA-ban létezik.” | Egy SPA kezdeti oldalához is használható. |

## Megismert fogalmak

- **Szerveroldali renderelés (SSR):** A nézet fontos HTML-tartalmának a szerveren, a kérés kiszolgálása közben történő előállítása.
- **Hidratálás:** A már meglévő HTML felülethez kliensoldali JavaScript-állapot és eseménykezelés kapcsolása.
- **Első HTML-válasz:** Az oldal fő dokumentumának HTTP-válasza, amely SSR esetén a fontos tartalmat is tartalmazhatja.
