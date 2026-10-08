---
type: resource
---
# Kurzus Repository

Ez a dokumentum összefoglalja a félév során használandó szoftvereket, technológiákat, valamint a beadandók, házi feladatok és az egyéni projekt technikai kereteit. A kurzus során a feladatok elkészítése és menedzselése egy egységes GitHub repository-ban történik.

## Szükséges eszközök és ismeretek

A félév sikeres teljesítéséhez elengedhetetlen az alábbi eszközök magabiztos használata. Javasoljuk, hogy minél előbb szánj időt ezek megismerésére:

- Tanuld meg, hogyan kell a **[GitHub](https://docs.github.com/en/get-started/using-github/hello-world)**-ot használni!
- Töltsd le és telepítsd az **[Obsidian](https://obsidian.md/)** nevű szoftvert, és ismerkedj meg vele!
- Sajátítsd el a **[MarkDown](https://www.markdownguide.org/)** dokumentumok írásának rejtelmeit!
- Tanuld meg a **[PowerMD](https://pwmd.atom-forge.eu/)** használatát a Markdown alapú prezentációkhoz!
- Ismerkedj meg a **[Mermaid](https://mermaid.js.org/)** diagramok készítésével!
- A kurzusprojekt menedzseléséhez a [**GitHub Projects**](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) (Kanban táblák) működését is érdemes tanulmányoznod!

## A kurzus GitHub Repository felépítése

Hozz létre egy GitHub repót a tárgynak, és az alábbiak szerint használd a félév során. A repository egy helyen teszi követhetővé a házi feladatokat, az egyéni projektet és a prezentációkat. Az oktató innen találja meg az ellenőrizhető eredményeket és a beadott verziókat, te pedig később is visszakeresheted, hogyan haladt a munkád. 

*A repository láthatóságát és az oktatói hozzáférést a kurzus beadási szabályai szerint állítsd be.*

### Mappaszerkezet

```text
/ (Repository gyökér)
├── README.md
├── homework/
│   └── 01/
│       └── README.md
├── presentation/
│   └── 01-01/
│       ├── README.md
│       ├── presentation.md
│       └── handout.md
└── project/
    ├── README.md
    └── docs/
```

---

## 1. Gyökér (Root) mappa
A projekt főkönyvtárában elhelyezett `README.md` fájl azonosít téged (Név, Neptun).

**Sablon: `/README.md` (részlet)**
```markdown
---
name:
neptun:
---
Ez a repository egy helyen teszi követhetővé a házi feladatokat, az egyéni projektet és a prezentációkat. Az oktató innen találja meg az ellenőrizhető eredményeket és a beadott verziókat...
```

---

## 2. Homework (Házi feladatok)
- Ha kapsz házi feladatot, annak lesz egy sorszáma (általában az oktatási hét száma).
- Hozz létre a `homework` mappába egy ennek a számnak megfelelő mappát, pl. `01` (bevezető **0**-val, ha csak 1 számjegyű).
- Legyen benne egy `README.md` fájl, illetve ide kerülhetnek a további megoldást tartalmazó fájlok is.

**Sablon: `homework/01/README.md`**
```markdown
---
week:
neptun:
---
{{Röviden: mit készítettél el ezen a héten?}}

{{Írd le a megoldás lényegét, és hivatkozz az ellenőrizhető fájlokra vagy külső eredményre. A linkek a repositoryn belül relatívak legyenek.}}
```

---

## 3. Presentation (Előadások)
- Az előadásaidat tedd a `presentation` mappába.
- Hozz létre minden előadásnak egy külön mappát a hét és a téma azonosítójából (pl. `presentation/01-01/`).

**Sablon: `presentation/01-01/README.md`**
```markdown
---
week:
id:
---
# {{PREZENTÁCIÓ_CÍME}}

{{Egy-két mondatban hogy miről szól az előadás?}}
```

**Sablon: `presentation/01-01/presentation.md` (PowerMD fájl)**
```markdown
<!--@slide Nyitás-->
# {{PREZENTÁCIÓ_CÍME}}

{{Rövid nyitó kérdés vagy probléma.}}

---

<!--@slide A téma lényege-->
# {{ELSŐ_FŐ_GONDOLAT}}

- {{KULCSSZÓ_VAGY_RÖVID_ÁLLÍTÁS}}
- {{KULCSSZÓ_VAGY_RÖVID_ÁLLÍTÁS}}

<!-- Ha folyamatot vagy kapcsolatot mutatsz be, a felsorolás helyett használhatsz ```mermaid nyelvű kódblokkot. -->

---

<!--@slide Tanulság-->
# {{LEGFONTOSABB_TANULSÁG}}

{{Egy rövid záró mondat.}}

<!-- A kész fájl PWMD-prezentáció. Töltsd ki a mezőket, szükség szerint ismételd a középső diát, és távolítsd el a szerkesztői megjegyzéseket. A `---` önálló sorban új diát kezd. YAML frontmattert ne használj, mert a PWMD nem támogatja. Szintaxis: https://pwmd.atom-forge.eu/syntax.md -->
```

**Sablon: `presentation/01-01/handout.md` (Opcionális)**
```markdown
# {{PREZENTÁCIÓ_CÍME}}

<!-- Csak akkor készíts handoutot, ha a kurzus kiírása kéri. Önállóan olvasható magyarázat legyen, nem a diák másolata. -->

**Előadó:** {{HALLGATÓ_NEVE}}  
**Hét és téma:** {{HÉT_ÉS_TÉMA}}  
**Prezentáció:** [PWMD-forrás](presentation.md)

## Rövid összefoglaló

{{Miről szól a téma, és miért hasznos?}}

## A lényeg magyarázata

{{Teljes mondatokban magyarázd el a fő fogalmakat, összefüggéseket és egy releváns példát.}}

## Fő tanulságok

{{Mit érdemes megjegyezni?}}

## Megismert fogalmak

- **{{FOGALOM}}:** {{Pontos, önállóan érthető meghatározás.}}
```

---

## 4. Project (Egyéni Projekt)
- A projekt fájljait a `project/` mappában tartsd a választott technológiának megfelelő szerkezetben.
- Készíts egy `README.md`-t a rövid leírással, az eredményekkel és a heti timeline-nal.
- További dokumentumok (ha vannak) a `project/docs/` alá kerüljenek.

**Sablon: `project/README.md`**
```markdown
# {{PROJEKT_CÍME}}

{{Rövid leírás: milyen problémát old meg a projekt, kinek készül, és mi a jelenlegi állapota?}}
## Timeline

| Hét | Cél / mérföldkő | Ellenőrizhető eredmény |
| --- | --------------- | ---------------------- |
| 01  | {{HETI_CÉL}}    | {{RÉSZEREDMÉNY}}       |
<!-- A táblázatot minden releváns hétre bővítsd. A konkrét feladatok aktuális állapotát a GitHub Projects Kanban-táblán kövesd, ne egy második kézi státuszlistában. -->
## GitHub Projects
- [PROJECT]({{GITHUB_PROJECT_URL}})
- A tábla a konkrét feladatok **Todo → In progress → Done** állapotát mutatja, és az oktató számára is elérhető.
## További dokumentumok
- Ha a kurzus vagy a projekt külön dokumentumot igényel, azt a `project/docs/` mappában tartsd, és itt linkeld.
- A kész repositoryban csak a ténylegesen szükséges dokumentumok és linkek maradjanak.
```