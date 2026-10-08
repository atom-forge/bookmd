# Reszponzív navigáció és mobil oldalsó panel

## Mikor használjuk?

Olvasófelületen, ahol desktopon állandó navigáció kell, mobilon viszont a tartalom élvez elsőbbséget. Az alkalmazás saját faállapota külön marad a panel életciklusától. A működő kompozíció: `src/routes/(+lib)/DocumentPage/CourseNavigation.svelte`, rekurzív listája: `CourseNavigation/Tree.svelte`.

## Szerkezet és térközök

- 900 px alatt fejlécbeli nyitógomb és modális bal panel; felette sticky oldalsáv.
- 900–1279 px: bal navigáció és tartalom. 1280 px-től jobb oldali tartalomjegyzék is látható.
- A desktop keret legfeljebb 2040 px. Bal oszlop: `clamp(240px,18vw,360px)`, jobb oszlop: `clamp(220px,16vw,320px)`. A fejléc ugyanazokat az oszlopokat használja. Az olvasószélesség nagy monitoron legfeljebb 880 px.
- A panel `100dvh` magas, legfeljebb 360 px széles, és legalább 32 px látható hátteret hagy. Fejléce nem görgethető; a `min-h-0 flex-1 overflow-y-auto overscroll-contain` törzs önállóan görgethető.
- A layoutkonténerek nem kapnak paddingot. A fejléc `mx-4 mt-4 mb-2`, a navigáció `mx-3 my-6` margókat birtokol. A gombok és linkek belső paddingja a vezérlő része.
- Beágyazott `ul`/`li`; minden teljes sor egyetlen natív link, külön kibontógomb nélkül. A link egyszerre navigál és megnyitja a kiválasztott oldal ágútvonalát, nem toggle: az aktív link ismételt kattintása sem zárja be az ágat. Másik ág kiválasztása leváltja a párhuzamos útvonalat; ős kiválasztása elhagyja a mélyebb ágakat. Az ág linkjén `aria-expanded`/`aria-controls` jelzi a leszármazottak állapotát; levélen nincs ilyen jelölés. Nincs ARIA tree szerepkör. Behúzás: 10 px/szint, dekoratív lucide-svelte `ChevronRight`/`ChevronDown`: a linken belüli 20 px-es oszlopban, első sorhoz igazítva.
- Opcionális frontmatter `chapter`: a cím előtt, ugyanazon linken belül, 10 px-es `text-muted-contrast`, normál súlyú, nem zsugorodó jelölés. A numerikus `0` is látható; hiányzó értéknek nincs helyőrzője. A cím külön `min-w-0` elemként tördelődik, a jelöléstől `gap-1.5` távolságra. Mobilon és desktopon ugyanaz a fa jeleníti meg.
- Címek: 13 px, 1.6-os sorköz, `overflow-wrap:anywhere`. Inaktív cím legfeljebb két sor; hoverre és linkfókuszra teljes tördelés. Aktív cím mindig teljes, `aria-current="page"` jelöléssel.
- A valódi generált kurzusfában két 75 karakternél hosszabb cím van (a web szereplőiről szóló magyar és angol lecke); a számozott, eltérő címkezdések miatt a kétsoros változat megtartható. Vizuális ellenőrzés böngészőben még szükséges.

## Panel-viselkedés és csomagkorlátok

A telepített `@atom-forge/ui` **0.0.37** csomagban elérhető a gyökérbeli `README-AI.md` és a részletes `docs/` dokumentáció. Ezek fájlrendszerbeli Markdown-fájlok, nem importálható csomagalútvonalak. A külön `@atom-forge/svelte-helpers` csomag nincs telepítve, de az UI nyilvános gyökérexportjai tartalmazzák a `ChildrenProp`, `ClassProp`, `XOR`, `AtLeastOne` típusokat és a helper függvényeket. A layout `ChildrenProp` típusa type-only importtal az UI-ból érkezik; ehhez nem kell új függőség.

A telepített drawer, közös overlay és tooltip forrását és szerződéseit ellenőriztük (`node_modules/@atom-forge/ui/docs/controls/overlays/drawer.md`, `docs/guides/overlays.md`; az utóbbi útvonal is a csomag gyökeréhez képest értendő). A `SharedOverlayContainer.svelte` kezeli az Escape-et és háttérkattintást, de nem ad modális szemantikát, fókuszcsapdát, fókusz-visszaállítást vagy teljes háttérgörgetés-zárolást. A `Tooltip.svelte` csak egéreseményeket kezel, billentyűzetes fókuszt nem. Ezért itt natív `dialog.showModal()` biztosítja a modális szemantikát, a háttér inert állapotát és a böngésző fókuszkorlátozását; az alkalmazás kezeli a görgetészárolást és szükség esetén visszaállítja a fókuszt a nyitógombra. A teljes címet nem kizárólag tooltip teszi elérhetővé: a cím helyben kibomlik.

Megnyitáskor az alkalmazás szinkronizálja a fa útvonalát és az aktív linket láthatóvá görgeti. Minden linkválasztás bezárja a mobil panelt, az aktív link és a kurzus nyitóoldalának ismételt kiválasztása is. A kattintáskezelő az útvonalat közvetlenül beállítja, nem csak az oldalváltozást figyelő effektusra támaszkodik. Bezárás: külön gomb, Escape (natív `cancel`), háttérkattintás, navigáció vagy desktop töréspont átlépése. A görgetészárolás korábbi értéke cleanup során visszaáll. Modern, natív modális dialogot támogató böngésző szükséges.

### Kontrollált navigációs fa

A csomag `TreeView` komponense saját kibontott állapotot tart, az ág sorára kattintás toggle, és nincs nyilvános expanded-ID prop vagy binding (`node_modules/@atom-forge/ui/docs/controls/layout/tree.md`, `dist/controls/layout/tree/TreeView.svelte.d.ts`). A sor-snippet nem írja felül ezt a működést. Ezért az alkalmazás natív linklistája megmarad: az egyetlen nyitott ágútvonalat az alkalmazás határozza meg, ismételt aktív kattintáskor is. A desktop és a mobil ugyanazt a `Tree.svelte` implementációt használja.

### Breadcrumb és tartalom

Az opcionális `chapter` az ősök, a közvetlen szülő és az aktuális dokumentum címe előtt jelenik meg: `text-[10px] font-normal text-muted-contrast`, `mr-1.5` térközzel. A linkeken belül marad, így a teljes címke kattintható és a meglévő truncation megmarad; az aktuális cím továbbra is tördelődik. `chapter !== undefined` alapján renderelünk, ezért a `0` látható, hiányzó értékhez nincs helyőrző. Az aktuális cím a dokumentum saját metaadatát használja fán kívüli oldal esetén is.

A `DocumentPage/DocumentBreadcrumb.svelte` külön ős-, kattintható közvetlen szülő- és aktuális dokumentumsort jelenít meg, a fán kívüli dokumentumot külön jelöli. A csomag `Breadcrumb` egyetlen `/`-el választott sort ad, utolsó eleme mindig szöveg, és nincs item/separator snippet (`node_modules/@atom-forge/ui/docs/controls/layout/breadcrumb.md`). A session-alapú közös navigációs kontextust a `DocumentPage.svelte` shell koordinálja; a breadcrumb saját megjelenítési felosztását a gyermek számolja.

A generált Obsidian-calloutokat a `DocumentPage/Article.svelte` formázza. A csomag `ProseCallout` hat variánst és string cím/tartalom propokat ad, de nincs rich-title/body snippet, előállított HTML-törzs vagy fold/open API (`node_modules/@atom-forge/ui/docs/controls/content/prose.md`, `dist/controls/content/prose/ProseCallout.svelte.d.ts`). A helyi Markdown-transzformáció megőrzi a bővebb típusokat, aliasokat, beágyazott tartalmat, képleteket és JavaScript nélkül működő `details` állapotot. A nem interaktív cím `mx-4 my-3` margót kap; a `flow-root` törzs közvetlen gyermekei `mx-4` és utolsóként `mb-3.5` margót birtokolnak. A keret is `flow-root`, ezért a margók nem omlanak át rajta. A `summary` belső `px-4 py-3` paddingja az interaktív hit area része. Az üres törzs `min-h-3.5` megtartja a korábbi alsó helyet.

A `ProseMarkdown` dokumentált children API-ját használjuk a buildkor előállított HTML-hez. A YouTube-transzformáció statikus, lazy `youtube-nocookie.com` iframe-et ad, explicit autoplay nélkül. A csomag `ProseYoutubeEmbed` thumbnailt tölt az `img.youtube.com` címről, majd kattintásra autoplay iframe-et a `www.youtube.com` címről; nincs host/autoplay prop. Ez nem viselkedésazonos csere, ezért a meglévő embed megmarad. A no-cookie host sem jelent harmadik fél nélküli működést.

## Minimális, üzleti logika nélküli példa

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  let panel: HTMLDialogElement;
  let trigger: HTMLButtonElement;
  let open = $state(false);
  function close() { panel.close(); }
  function show() { open = true; panel.showModal(); }
  $effect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previous; };
  });
  onMount(() => {
    const query = matchMedia('(min-width: 900px)');
    const resize = () => { if (query.matches) close(); };
    query.addEventListener('change', resize);
    return () => query.removeEventListener('change', resize);
  });
</script>

{#snippet links()}
  <nav class="mx-4 my-6" aria-label="Navigáció">
    <ul class="m-0 list-none">
      <li><a class="block rounded px-2 py-2 text-[13px] text-canvas-contrast hover:text-accent focus-visible:outline-2 focus-visible:outline-accent" href="/" onclick={close}>Kezdőlap</a></li>
    </ul>
  </nav>
{/snippet}

<button bind:this={trigger} class="rounded px-3 py-2 min-[900px]:hidden" aria-label="Navigáció" aria-haspopup="dialog" aria-controls="navigation-panel" aria-expanded={open} onclick={show}>☰</button>
<aside class="hidden min-[900px]:block">{@render links()}</aside>
<dialog bind:this={panel} id="navigation-panel" aria-label="Navigáció"
  class="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent backdrop:bg-black/50"
  onclick={(event) => { if (event.target === panel) close(); }}
  onclose={() => { open = false; if (trigger.getClientRects().length) trigger.focus(); }}>
  <div class="flex h-full w-[min(360px,calc(100vw-32px))] flex-col border-r border-frame bg-canvas">
    <header class="mx-4 mt-4 mb-2 flex shrink-0 items-center justify-between gap-3">
      <h2 class="text-base font-semibold">Navigáció</h2>
      <button class="size-10 rounded" aria-label="Bezárás" onclick={close}>✕</button>
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">{@render links()}</div>
  </div>
</dialog>
```

A cím és a bezárógomb kötelező. Opcionális lábléc a görgethető törzs után helyezhető el, saját gyermekmargókkal. Ha műveletek is vannak, a másodlagos művelet legyen balra, az elsődleges jobbra, `flex justify-between gap-3` sorban. Ne készítsünk külön desktop és mobil faimplementációt: csak a megjelenítési hely különbözzön.
