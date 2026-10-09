# Működés és változtatások

A portál működésére és felületére vonatkozó, diktálás alapján összegyűjtött követelmények. Ez a dokumentum a portál megvalósított működését és a további diktált követelményeket rögzíti.

## Kurzuslista

- A kurzuslista a `courses.md` összefoglaló oldala.
- A Markdown-törzs adja a bevezetőt; a frontmatter `courses` listája tartalmazza a kurzusok belépési pontjait.
- A `courses`, `sources` és `children` listákban idézőjelezett wikilinkek használatosak: `- "[[kurzus/course.md]]"`.
- A kurzuskártyák a hivatkozott `course.md` metaadatait jelenítik meg.
- Ezen az oldalon nincs „Ezen az oldalon” / „On this page” tartalomjegyzék.

## Kurzus és tananyagoldalak

### Hierarchia és olvasási sorrend

- Nincs központi kurzusfa, `series` vagy `tree` mező.
- Minden dokumentum frontmatterében lehet rendezett `children` lista.
- Cím nélkül `"[[dokumentum.md]]"`, egyedi címhez `"[Cím](dokumentum.md)"` használatos.
- Minden útvonal a deklaráló dokumentumhoz képest relatív.
- Minden gyermek rendelkezhet saját `children` és `sources` listával.
- A `children` egyszerre adja a hierarchiát, a menüsorrendet és a közvetlen testvérek előző/következő navigációját.
- A breadcrumb a helyi listákból felépített hierarchiát követi.
- Egy dokumentumnak egy szülője lehet. Ismételt gyermek, több szülő vagy hierarchikus kör buildhiba.
- A `sources` kizárólag tartalmat fűz össze, nem ad hierarchikus kapcsolatot.
- A Markdown-törzs linkjei követhetők, de nem módosítják a hierarchiát.
- A `***` egyszerű Markdown-elválasztó, nincs strukturális szerepe.

```md
---
name: Web Programming 1
language: en
children:
  - "[Syllabus](syllabus.md)"
  - "[[01/overview.md]]"
---
# Web Programming 1

Course introduction.
```

A `01/overview.md`:

```md
---
children:
  - "[[web-as-a-platform.md]]"
  - "[Web evolution](web-evolution.md)"
---
# 01 – Introduction

Weekly introduction.
```

### Bal oldal: kontextusfüggő kurzusmenü

- A bal oldalon a kurzus navigációs menüje jelenik meg.
- A menü az aktuális dokumentum helyzetéhez igazodik a kurzus deklarált fájában.
- Mindig csak az aktuális szintet mutatja: áttekintő oldalon a közvetlen aloldalakat, levéloldalon az azonos szülő alatti oldalakat.
- A szint címére kattintva az áttekintő/szülő oldal érhető el; magasabb szintekre a breadcrumb vezet.
- Egyszintű lista; nem jelenít meg egyszerre több hierarchiaszintet vagy teljes, kinyitható kurzusfát.

### Jobb oldal: oldaltartalom-jegyzék

- Az „Ezen az oldalon” / „On this page” tartalomjegyzék a jobb oldalra kerül.
- Az aktuális dokumentum címsoraira mutat, a kurzusmenütől függetlenül.
- Keskeny képernyőn a menü és a tartalomjegyzék a cikk fölé kerül.

## A felület nyelve

- A portál felülete angol: menük, szűrők, metaadatcímkék, tartalomjegyzék, előző/következő navigáció és üzenetek.
- A kurzusok és a tananyagok tartalma a saját nyelvén marad.
