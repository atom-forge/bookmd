# Kurzusok írása (BookMD)

SvelteKit + Bun statikus tananyagportál, az AtomForge UI alapértelmezett témájával. A motor a repó gyökerében van; a példány (config, kurzusregiszter, tartalom) külön repóban él. A motor referenciája: [README](../README.md). Az alábbi leírás a korábbi, a motort és az első példányt együtt tartalmazó állapotból származik.

A motor privát, verziózott `@atom-forge/bookmd` csomag; saját alkalmazásforrással és generátorral rendelkezik, a `bookmd` CLI az ignorált `.bookmd/` munkatérben futtatja az alkalmazást, statikus kimenete `build/`. Bun 1.4+ és Node 22.12+ szükséges. Referencia: [README](../README.md).

```sh
bun install
bun run dev
```

A `portal.config.ts` egyetlen belépőpontot ad meg: `content/courses.md`. A törzs a katalógus bevezetője; a kurzusokat a frontmatter `courses` listája deklarálja:

```md
---
courses:
  - "[[web-programming-1/course.md]]"
  - "[[another-course/course.md]]"
---
# Courses

Available course materials.
```

A `courses` és `sources` rendezett listák, idézőjelezett wikilinkekkel. A `children` wikilinket és Markdown-linket is elfogad. Az idézőjel szükséges, különben a YAML beágyazott listaként értelmezné a szögletes zárójeleket. Az útvonalak a deklaráló dokumentumhoz képest értendők; a `.md` elhagyható. Korábbi egyszerű útvonalak is feldolgozhatók. A kártyák adatai a hivatkozott kurzus saját metaadataiból származnak.

A kurzusoldal tartalma és adatai a saját `course.md` fájljában vannak:

```md
---
name: Web Programming 1
author: Elvis
language: en
tags: [web, programming]
intro: How the web works.
image: cover.webp
children:
  - "[Syllabus](syllabus.md)"
  - "[[01/overview.md]]"
  - "[[02/overview.md]]"
---
# Web Programming 1

Course introduction.
```

A katalógus és a kurzusoldal ugyanazokat a metaadatokat használja. A `language` kötelező kurzusadat; nem külön nyelvi belépőpont. A `name` az első H1-ből is következhet. Az oktató, év, címkék, rövid bevezető és kép opcionális. A katalógusban nyelvre és több címkére lehet szűrni; a kiválasztott címkéknek mind szerepelniük kell a kurzuson.

## Dokumentumonkénti hierarchia

Nincs központi fa, `tree` vagy `series` mező. Minden dokumentum saját, opcionális `children` listájával deklarálja közvetlen aloldalait. Az útvonal mindig a deklaráló fájlhoz képest relatív. Minden gyermeknek lehet saját `children` és `sources` listája.

```md
---
children:
  - "[[web-as-a-platform.md]]"
  - "[Web evolution](web-evolution.md)"
---
# 01 – Introduction

Weekly introduction.
```

A cím nélküli wikilink az első H1-et használja; egyedi címhez Markdown-link adható meg. A `children` YAML-elemei idézőjelezett linkek, egyszerű útvonal nem használható. A listák sorrendje adja a menüsorrendet és az előző/következő navigációt a közvetlen testvérek között. A szülő nem része saját gyermeklistájának. A breadcrumb a helyi deklarációkból felépített hierarchiát követi. A `children` nem fűzi össze a dokumentumok tartalmát.

Egy dokumentumnak egy hierarchikus szülője lehet. Ismételt gyermek, több szülő vagy hierarchikus kör buildhiba. A régi `series` és `tree` mezők hibát okoznak, át kell írni őket `children`-re. A `***` egyszerű Markdown-elválasztó, nincs navigációs szerepe.

A katalógusban nincs oldaltartalom-jegyzék; a katalógus megtartja a széles, legfeljebb 2040 px-es keretet. Kurzuson belül 900 px-től balra rekurzív kurzusfa látható, 1280 px-től jobbra az aktuális dokumentum címsoraiból épülő tartalomjegyzék. Egyetlen ágútvonal nyitott: a teljes sor natív linkje navigál és megnyitja a kiválasztott útvonalat, nem toggle; az aktív link ismételt kattintása is visszaállítja az útvonalat. A breadcrumb külön mutatja az ősöket, a közvetlen szülőt és az aktuális dokumentumot. 900 px alatt a BookMD felirat bal oldalán hamburger nyit natív modális navigációs panelt, önállóan görgethető törzzsel; a tartalomjegyzék rejtett marad. A részletes működő kompozíciók: [navigációs panel](ui/navigation-panel.md) és [katalóguskártya](ui/catalog-card.md).

A dokumentum saját tartalma után a `sources` fájljai sorrendben jelennek meg:

```md
---
sources:
  - "[[01/overview.md]]"
  - "[[02/overview.md]]"
---
# Tematika

A kurzus bevezetője.
```

A források további forrásokat fűzhetnek hozzá. Minden forrás hivatkozása és képe a saját fájljához képest értendő. Körkörös összefűzés buildhibát okoz; az ismétlődő címsorazonosítók egyedi utótagot kapnak.

A rendszer követi a helyi Markdown-hivatkozásokat, köröket egyszer dolgoz fel. A dokumentumok egyéb linkjei nem módosítják a breadcrumb-fát. A fában nem szereplő dokumentumok az utoljára látogatott kurzuság breadcrumbját kapják, külön ikonnal jelölve saját címüket. Közvetlen megnyitáskor a kurzus gyökeréből indulnak. A tartalomgyökéren kívülre mutató útvonal buildhibát okoz.

A katalógus a `/` címen, a `web-programming-1/course.md` a `/web-programming-1/` címen, a többi Markdown az elérési útjának megfelelő címen érhető el. Nincs globális nyelvi vagy `/portal` prefix.

Támogatott: matematikai képletek, Mermaid, színezett kódblokkok, önálló YouTube-link beágyazása és Obsidian-calloutok. Nyers HTML nem kerül a kimenetbe.

```sh
bun run check
bun test
bun run build
```

A `build/` könyvtár statikus kimenet. A GitHub Pages workflow publikálja, külön szerver nélkül. Az URL-ek gyökérből indulnak; a Pages-domainnek ezt kell kiszolgálnia (például egyéni domain vagy felhasználói Pages-oldal).

## Obsidian-calloutok

```md
> [!note] Megjegyzés
> A tartalom támogatja a **Markdown** formázást és a helyi linkeket.

> [!tip]+ Alapból nyitva
> Összecsukható tartalom.

> [!warning]- Alapból csukva
> Kattintással vagy billentyűzettel nyitható.
```

Típusok: `note`, `abstract`, `info`, `todo`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`. Az Obsidian-aliasok is használhatók (`summary`, `tldr`, `hint`, `important`, `check`, `done`, `help`, `faq`, `caution`, `attention`, `fail`, `missing`, `error`, `cite`). A típus kis- és nagybetűtől független; az ismeretlen típus `note` megjelenítést kap.

Egyedi cím, cím nélküli és csak címet tartalmazó callout, illetve beágyazott callout is támogatott. A belső Markdown, képek, képletek és kódblokkok a szokásos feldolgozást kapják. A megjelenés az AtomForge alapértelmezett témaszíneit és Lucide ikonokat használja. A `+` és `-` változat natív HTML `details` elemmel működik a statikus oldalon, JavaScript nélkül is.

Szintaxis: [Obsidian callouts](https://obsidian.md/help/callouts). A Markdown-törzsben a `[[dokumentum.md]]`, `[[dokumentum]]` és `[[dokumentum#cimsor|Egyedi cím]]` wikilinkek is követhetők és renderelhetők. Cím nélkül a dokumentum első H1-ét használjuk. A kódblokkok és inline kód wikilinkjei szövegként maradnak meg. A törzs linkjei nem módosítják a navigációs fát. Az Obsidian `![[...]]` embed-szintaxisa nem támogatott.

## Hibás URL-ek

A hibás URL-ek a kurzuslistát jelenítik meg rövid „Page not found. Choose a course below.” jelzéssel. A build előre rendereli a hibakatalógust, majd `build/404.html` néven is elmenti; a GitHub Pages ezt HTTP 404 válasszal szolgálja ki. A kurzuskártyák JavaScript nélkül is benne vannak a HTML-ben. Az URL megmarad, nincs átirányítás. A SvelteKit kliensoldali hibái ugyanazt a katalóguskomponenst használják.

## Anyagrészek szerzője és címkéi

Bármely anyagrész frontmatterében megadható opcionális `author` és `tags`:

```yaml
---
author: Laborci Gergely
tags:
  - usability
  - saját címke
---
```

A megadott szerző és címkék az anyagrész tartalma előtt jelennek meg. A címkék szabadon választhatók. Ezek az adatok nem öröklődnek a kurzustól, a szülőfejezettől vagy a `sources` fájlokból; hiányzó mezőhöz nem jelenik meg üres helyőrző.

A kurzus szerzője az opcionális `author`; az elavult `instructor` és kurzus `year` mezők buildhibát okoznak. A katalógus a saját címkék mellett minden kurzushoz tartozó generált oldal címkéit is mutatja és keresi (`contentTags`), kis-/nagybetű-, ékezet- és whitespace-normalizált deduplikálással. Részletek és megjelenítési sorrend: [katalóguskártya](ui/catalog-card.md).
