# Phase 2 — AtomForge BookMD fejlesztői app és Git-integráció

## Cél

Az AtomForge BookMD második fázisa egy Electron-alapú, TinyJS-szel készülő asztali fejlesztői app. Az app helyi kurzusokat szerkeszt és előnézetben megjelenít, a publikált portál pedig Git-repozitóriumokból is be tudja tölteni a kurzusokat. A helyi preview és a statikus build ugyanazt a feldolgozó- és megjelenítőmotort használja.

## Megmaradó tartalommodell

- A `courses.md` saját Markdown-tartalma mellett a frontmatter `courses` wikilinklistájában hivatkozott kurzusokat jeleníti meg.
- A `course.md` frontmatterében vannak a kurzus metaadatai: név, oktató, év, nyelv, címkék, rövid bevezető és opcionális kép.
- Minden dokumentum saját, opcionális `children` listája deklarálja a közvetlen aloldalakat, relatív wikilinkekkel vagy egyedi című Markdown-linkekkel.
- A lista sorrendje adja a menüt és a közvetlen testvérek előző/következő navigációját. Minden gyermeknek lehet saját `children` és `sources` listája.
- A breadcrumb ebből a hierarchiából épül. Nincs központi fa, `tree` vagy `series` mező; a `***` egyszerű Markdown-elválasztó.
- A `sources` a dokumentum saját tartalma után fűz hozzá tartalmakat, nem hoz létre szülő–gyermek kapcsolatot.
- Egy dokumentumnak egy szülője lehet. Ismételt gyermek, több szülő vagy hierarchikus kör buildhiba.
- A törzsben lévő belső linkek követhetők, de nem módosítják a hierarchiát.
- A nyelv kurzusadat; a katalógus nyelv és címkék alapján szűrhető.

```yaml
children:
  - "[[01/overview.md]]"
  - "[Chapter 2](02/overview.md)"
```

## Kurzusok Git-forrásból

A katalógus helyi és Gitben tárolt kurzusokat is fogadhat. A Git-forrás egy repót, egy referenciát és azon belül a kurzus belépési pontját jelöli. Egy repó több kurzusmappát is tartalmazhat.

```md
---
courses:
  - "[[another-course/course.md]]"
  - "[[https://github.com/example/course-materials/blob/main/courses/web-programming-1/course.md]]"
---
# Courses

Available course materials.
```

- A helyi kurzusokat a `courses` frontmatterlista idézőjelezett wikilinkjei jelölik.
- A távoli kurzust a belépési pontjára mutató Git-szolgáltatói hivatkozás jelölheti; a repo, referencia és belső útvonal feloldását a Git-integráció vezeti be. A fenti távoli link tervezett, még nem támogatott formátum.
- A kurzus stabil webes azonosítójának megadási módját a Git-integráció során véglegesítjük.
- A kurzus metaadatai továbbra is kizárólag a `course.md` fájlban vannak.
- A helyi és távoli források közös belső formára kerülnek: helyi tartalomgyökér, belépési pont és stabil kurzusazonosító.
- A build a szükséges repókat helyi cache-be tölti, és ott dolgozza fel a fájlokat. Azonos repó és referencia egy builden belül egyszer kerül feloldásra.
- A build rögzíti a ténylegesen használt commitot, hogy a publikált tartalom forrása visszakereshető legyen.
- A Markdown, képek és egyéb helyi mellékletek együtt kerülnek feldolgozásra. A böngészőnek nem kell közvetlenül a Git-szolgáltatótól letöltenie őket.
- A tartalom nem hivatkozhat a kijelölt forrásgyökéren kívüli helyi fájlokra.

## Electron/TinyJS fejlesztői app

Az asztali app Electron és TinyJS alapú. A kurzus megnyitása, szerkesztése, mentése, preview-ja és Git-műveletei egy alkalmazásban érhetők el. A felület az AtomForge UI alapértelmezett megjelenését használja.

### Kurzus megnyitása

- Helyi kurzusmappa vagy `course.md` kiválasztása.
- Git-repó, referencia és kurzusmappa megadása; helyi munkapéldány létrehozása vagy meglévő checkout megnyitása.
- Egyetlen kurzus önálló preview-ja katalógus nélkül is működik.
- A megnyitott munkapéldányban végzett változtatások addig helyiek, amíg a felhasználó nem commitolja és pusholja őket.

### Kurzus editor

- A kurzus metaadatainak szerkesztése űrlapon: név, oktató, év, nyelv, címkék, rövid bevezető és opcionális kép.
- A deklarált fa vizuális szerkesztése: dokumentum hozzáadása, eltávolítása a fából, átrendezése és másik szülő alá mozgatása.
- A dokumentumonkénti `children` frontmatterlisták szerkesztése és sorrendezése. A vizuális editor ugyanazokat a fájlokat módosítja.
- Egyedi navigációs cím megadása vagy visszaállítás az első H1-ből következő címre.
- Markdown-dokumentumok létrehozása, megnyitása és szerkesztése.
- `sources` összefűzés szerkesztése és a források sorrendjének módosítása.
- A `course.md` nyers szerkesztése is elérhető. Az űrlap és a vizuális fa a fájl tartalmából épül fel, nincs külön szerkesztői adatbázis.
- Az editor megőrzi a Markdown-törzset és az ismeretlen frontmattermezőket. A faelemek eltávolítása önmagában nem törli a dokumentumfájlt.
- Mentetlen változások jelzése, visszavonás/újraalkalmazás és külső fájlváltozások kezelése. Külső módosítást nem írunk felül észrevétlenül.

### Élő preview

- A szerkesztő mellett a kurzus tényleges portálnézete jelenik meg.
- Fájlmentés után a preview automatikusan frissül; a szerkesztőből ideiglenes, mentetlen tartalom előnézete is megjeleníthető.
- Ugyanaz a Markdown-feldolgozás, matematika-, Mermaid-, kódblokk-, YouTube- és Obsidian-callout-megjelenítés működik, mint a statikus portálon.
- A breadcrumb, a fán kívüli dokumentumok jelölése, a bal oldali egyszintű, kontextusfüggő kurzusmenü, a jobb oldali oldaltartalom-jegyzék és a sticky előző/következő navigáció is ellenőrizhető.
- A kurzus katalóguskártyája külön előnézetben ellenőrizhető, a rövid bevezetővel és az opcionális képpel együtt.
- A preview navigációja a helyi munkapéldányt használja; nem igényel publikálást.

### Ellenőrzés és Git-műveletek

- Hibás frontmatter, hiányzó dokumentum vagy kép, ismételt faelem, útvonalütközés és körkörös `sources` kapcsolat jelzése.
- A diagnosztikák a hibás fájlra és lehetőség szerint a sorára mutatnak; az editorból megnyithatók.
- A Markdown-hivatkozások körei megengedettek, a feldolgozás nem fut végtelen ciklusba.
- A Git-állapot és a módosítások diffje megtekinthető.
- A felhasználó az appból commitolhat és pusholhat. A feltöltés explicit művelet, a preview frissítése nem indít push-t.
- A build/publikálás állapota a bekötött GitHub Actions futásra mutató hivatkozással követhető.

## Közös motor és statikus build

A jelenlegi portál feldolgozóját újrahasználható BookMD-motorrá választjuk le. A motor feladata a forrásfeloldás, a frontmatter és fa ellenőrzése, a linkek feldolgozása, az összefűzés, az eszközfájlok kezelése és a megjelenítéshez szükséges adatok előállítása.

A preview és a build azonos szabályokat használ. A GitHubon készülő statikus kimenet ugyanazt a tartalmat és navigációt adja, mint a fejlesztői app. A parancssori build önállóan futtatható, Electron nélkül, hogy CI-ben is használható legyen. A végleges csomag- és parancsneveket az implementáció során határozzuk meg.

Az Electron főfolyamata kezeli a fájlrendszert, a Git-műveleteket és a hitelesítést. A szerkesztő és preview szűk IPC-felületen kapcsolódik hozzá; a tananyag megjelenítője nem kap közvetlen fájlrendszer- vagy parancsfuttatási hozzáférést.

## GitHub build és publikálás

### Kurzusrepó

- A bekötött kurzusmappát érintő push validációt és próbabuildet indít GitHub Actionsben.
- Pull request esetén ugyanezek az ellenőrzések futnak a publikálás előtt.
- A publikálási ágra érkező, sikeresen ellenőrzött változás értesíti a bekötött portálrepót az új tartalomról.
- A közös validáció és build újrahasználható workflow-ba vagy actionbe kerül, hogy a kurzusrepókban csak rövid konfiguráció legyen.

### Portálrepó

- A katalógus vagy a portál módosítása új buildet indít.
- Külső kurzusrepó változásakor explicit kapcsolat indít új buildet, például `repository_dispatch` eseménnyel. A Git-link felvétele önmagában nem hoz létre automatikus változásfigyelést.
- A build feloldja a katalógus Git-forrásait, feldolgozza a kurzusokat, majd elkészíti a teljes statikus portált.
- Csak sikeres ellenőrzés és build után történik GitHub Pages publikálás. Hibánál az előző publikált változat marad elérhető.
- Privát repók és a repók közötti buildindítás hozzáférését a fejlesztői app és a CI konfigurációja kezeli; hitelesítési adat nem kerül a Markdownba vagy a statikus kimenetbe.

## Javasolt megvalósítási sorrend

1. A közös BookMD-motor leválasztása és a stabil kurzusazonosítók bevezetése.
2. Helyi/Git-források feloldása a katalógushoz, cache és commitnyilvántartás.
3. Electron/TinyJS app helyi kurzusmegnyitással és élő preview-val.
4. Kurzus editor: metaadatok, dokumentumonkénti `children`, Markdown és `sources` szerkesztése.
5. Git-állapot, diff, commit és push integráció.
6. GitHub Actions validáció, portál-buildindítás és Pages publikálás.

## Elfogadási feltételek

- Egy helyi kurzus katalógus nélkül megnyitható, szerkeszthető és preview-ban bejárható az asztali appban.
- A vizuális editor változtatásai a `course.md` fájlba menthetők, és újranyitáskor ugyanaz a struktúra áll helyre.
- A Markdown-törzs és az editor által nem kezelt frontmattermezők mentéskor megmaradnak.
- A testvérek előző/következő navigációja és a breadcrumb a `children` hierarchiát követi.
- Git-repó egy mappájából betöltött kurzus a katalógusban saját stabil útvonalon jelenik meg, és szűrhető a metaadatai szerint.
- Az opcionális kép és az összefűzött források helyi preview-ban és statikus buildben is megfelelően jelennek meg.
- A hibás tananyag diagnosztikát ad; sikertelen build nem kerül publikálásra.
- Bekötött kurzusrepó megfelelő ágára történő push után GitHubon lefut az ellenőrzés és a portál új buildje.
- A publikált oldal külön alkalmazásszerver nélkül működik.
