# Task: Reszponzív kurzusnavigáció megújítása

## Cél

A kurzus teljes szerkezete legyen elérhető a bal oldali menüből, egyszerre egyetlen nyitott ágútvonallal. A navigáció kezelje jól a hosszú címeket, használja ki a nagy monitorok helyét, mobilon pedig az olvasott tartalom kapjon elsőbbséget.

## Hatókör

- Bal oldali kurzusmenü: teljes kurzusfa, egy nyitott útvonal.
- Hosszú navigációs címek megjelenítése.
- Bal és jobb oldali navigáció adaptív szélessége.
- Mobil kurzusmenü hamburgerrel nyitható panelben.
- Breadcrumb és jobb oldali oldaltartalom-navigáció elrejtése mobilon.

Kiindulópont: `src/routes/(+lib)/DocumentPage.svelte`, valamint az általa használt `src/lib/course-menu` modul. A megvalósítás előtt ellenőrizni kell az adatmodell és a kapcsolódó komponensek jelenlegi működését.

## Bal oldali kurzusfa

A felhasználói visszajelzés alapján módosított interakció: egy teljes sor egyetlen link; a sor navigál és megnyitja az ágat, külön kibontógomb és toggle-bezárás nélkül.

- A kurzus összes főága mindig jelenjen meg; a leszármazottak kibontással érhetők el.
- Egyszerre egyetlen összefüggő ágútvonal lehet nyitva.
- Másik ág kibontása zárja be az azzal párhuzamos ágat és annak leszármazottait; a közös ősök maradjanak nyitva.
- Ős kiválasztása zárja be a mélyebb nyitott leszármazottakat, de a kiválasztott ág maradjon nyitva. A kurzus nyitóoldalának kiválasztása törölje a nyitott útvonalat.
- Közvetlen oldalbetöltéskor és navigáció után az aktuális oldalhoz vezető útvonal nyíljon ki.
- Másik ág kiválasztása navigáljon annak oldalára és nyissa meg az ágútvonalát.
- A teljes kurzusfa-sor egyetlen natív link legyen: kattintásra egyszerre navigáljon és nyissa meg a kiválasztott oldal útvonalát. Ne legyen külön kibontógomb vagy toggle-bezárás.
- Ugyanazon aktív link ismételt kattintása is állítsa be a nyitott útvonalat; a már nyitott kiválasztott ágat ne csukja be.
- Ágaknál dekoratív lucide-svelte ChevronRight/ChevronDown ikon jelezze a nyitási állapotot; levélelemeknél ne legyen nyíl.
- Az aktív oldal kapjon egyértelmű kiemelést és `aria-current="page"` jelölést.
- Maradjon elérhető a kurzus nyitóoldala is.
- A jelenlegi, kurzusfán kívüli oldalakhoz tartozó navigációs kontextus működését vizsgálni kell, és meg kell őrizni, ahol releváns.

## Hosszú címek

- Alapállapotban a cím legfeljebb két sorban jelenjen meg, szükség esetén levágással.
- Az aktív oldal címe teljes hosszában tördelődjön.
- A levágott cím teljes szövege hoverre és billentyűzetes fókuszra is legyen elérhető. A tooltip csak kiegészítés, ne az egyetlen módja legyen az elemek megkülönböztetésének.
- Valós kurzuscímeken ellenőrizni kell a kétsoros korlát használhatóságát. Ha túl sok cím válik megkülönböztethetetlenné, inkább teljes tördelést használjunk.
- A behúzás legyen visszafogott, kiindulásként szintenként 8–12 px.
- A dekoratív nyílikon a sor linkjén belül, fix szélességű oszlopban legyen, a cím első sorához igazítva. A további sorok a cím alatt folytatódjanak.
- Ne a betűméret csökkentése oldja meg a helyhiányt: kiindulásként kb. 13 px, kényelmes sorköz, balra igazított szöveg.
- Hosszú, szóköz nélküli címek se okozzanak vízszintes túlcsordulást.
- A jobb oldali oldaltartalom-navigáció hosszú címei is tördelődjenek.

## Reszponzív desktop elrendezés

- A navigációs sávok szélessége a rendelkezésre álló helyhez igazodjon, ne egyetlen fix érték legyen.
- Kiinduló tartományok, valós tartalom alapján finomhangolva:
  - Bal oldali menü: kb. 240–360 px.
  - Jobb oldali oldaltartalom-navigáció: kb. 220–320 px.
- A jelenlegi 1600 px-es teljes keretet lazítani kell, hogy nagy monitoron a navigáció valóban több helyet kaphasson.
- A cikk olvasási szélessége maradjon korlátozott: a nagyobb képernyő ne indokolatlanul hosszú szövegsorokat eredményezzen.
- A fejléc és a tartalmi oszlopok igazodjanak egymáshoz.
- Közepes szélességnél először a jobb oldali navigáció tűnjön el; a bal menü és a cikk maradjon.
- Az oldalsávok hosszú tartalma önállóan görgethető legyen, a sticky fejléc figyelembevételével.
- A pontos töréspontokat a tartalom helyigénye alapján kell meghatározni és tesztelni.

## Mobil

- A jobb oldali oldaltartalom-navigáció ne jelenjen meg.
- A breadcrumb ne jelenjen meg.
- A bal oldali kurzusmenü ne foglaljon helyet a cikk fölött: hamburgerrel nyitható oldalsó panelbe kerüljön.
- A kurzus neve maradjon a fejlécben.
- A menügomb akadálymentes neve legyen „Kurzusmenü”.
- A panel ugyanazt a kurzusfát és ugyanazokat a nyitási szabályokat használja, mint a desktop menü.
- Megnyitáskor az aktuális oldalhoz vezető útvonal legyen nyitva, az aktív elem pedig látható a panel görgethető részében.
- Link kiválasztása nyissa meg a kiválasztott útvonalat és zárja be a panelt, ugyanazon aktív link kattintásakor is.
- Legyen külön bezárógomb, háttérre kattintásos és Escape-es bezárás.
- Nyitott panelnél legyen megfelelő fókuszcsapda és háttérgörgetés-kezelés; bezáráskor a fókusz térjen vissza a nyitógombra, ahol ez megfelelő.
- A panel férjen el keskeny és alacsony képernyőn is, tartalma legyen görgethető.

## Megvalósítási szabályok

- Az `@atom-forge/ui` használata előtt el kell olvasni a telepített csomag `README-AI.md` fájlját és a releváns komponensdokumentációt.
- Előnyben kell részesíteni a csomag meglévő drawer/panel, tooltip és navigációs képességeit, amennyiben a dokumentált szerződésük illeszkedik. A helyi megoldást igénylő csomagkorlátot dokumentálni kell.
- A kurzusfa nyitási állapota alkalmazásszintű viselkedés; maradjon külön a UI-csomag panel- és fókuszkezelésétől.
- Követni kell az `AGENTS.md` komponenselhelyezési szabályait; a navigáció saját állapota és interakciói a felelős komponensbe kerüljenek.
- Tailwind utilityket használjunk, layoutkonténerek paddingja helyett a gyermekek explicit margóival.
- A desktop és mobil megjelenítés ne tartson fenn két, eltérően működő kurzusfa-implementációt.
- A bevált, újrahasználható navigáció/panel kompozíciót a projekt UI-dokumentációjában dokumentálni kell, üzleti logika nélküli minimális példával.
- Szemantikusan beágyazott navigációs listát és natív linkeket/gombokat használjunk. ARIA tree szerepkört csak a teljes hozzá tartozó billentyűzetes viselkedés megvalósítása esetén vezessünk be.

## Elfogadási feltételek

- [ ] Minden kurzusfőág látszik, a leszármazottak kibontással elérhetők.
- [ ] Soha nincs két párhuzamos nyitott ágútvonal.
- [ ] Mély oldal közvetlen megnyitása és oldalak közötti navigáció a megfelelő útvonalat nyitja ki.
- [ ] Másik ág kiválasztása navigál és megnyitja annak útvonalát, a párhuzamos ágak bezáródnak.
- [ ] A teljes sor egyetlen lucide ikonos link, kattintása navigál és megnyit; nincs külön kibontógomb.
- [ ] Az aktív link ismételt kiválasztása sem csukja be a kiválasztott ágat.
- [ ] Hosszú címek, több szintű fa és hosszú, szóköz nélküli szöveg sem töri el az elrendezést.
- [ ] Az aktív cím teljesen olvasható, az aktív oldal egyértelműen azonosítható.
- [ ] Nagy monitoron mindkét navigáció több helyet kap, a cikk olvasható szélességű marad.
- [ ] Közepes nézetben nincs jobb oldali nav, de a bal menü használható.
- [ ] Mobilon nincs breadcrumb vagy jobb oldali nav; a kurzusmenü hamburgerből nyílik.
- [ ] Mobilon minden linkválasztás bezárja a panelt, az aktív link ismételt kiválasztása is.
- [ ] Billentyűzetes használat, fókuszkezelés, Escape, háttérkattintás és görgetés megfelelően működik.
- [ ] Világos és sötét témában is jól olvasható minden állapot.

## Validáció

- A nyitott útvonal kezelésének célzott tesztjei: párhuzamos ág kiválasztása, közös ős megtartása, ős kiválasztásakor mélyebb ágak bezárása, navigáció utáni szinkronizálás, aktív ág és aktív levél ismételt kiválasztása.
- A projekt meglévő típusellenőrzési és build parancsainak futtatása.
- Manuális ellenőrzés keskeny mobilon, közepes képernyőn és széles desktopon, valós hosszú címekkel és mély kurzusfával.
- Billentyűzetes és érintéses használat ellenőrzése, különös tekintettel a panelre és a levágott címekre.
