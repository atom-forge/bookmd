# Katalóguskártya elkülönített műveletsorral

## Mikor használjuk?

Azonos magasságú kártyarácsban, ahol opcionális kép, cím, leírás és egyetlen metaadat-/címkesor után teljes szélességű művelet zárja a kártyát. A működő alkalmazáskompozíció a `src/routes/(+lib)/DocumentPage/CourseCatalog.svelte`; a normál és a hibakatalógus ugyanazt használja. Külön megosztott kártyakomponens nem szükséges pusztán a minta miatt.

## Szerkezet és térközök

- A dokumentált `@atom-forge/ui` 0.0.37 `Card` adja a keretet, felületet, lekerekítést és elevációt. Nincs külön header/footer API vagy belső padding; a kompozíció az alkalmazásé. Referencia: `node_modules/@atom-forge/ui/docs/controls/display/card.md`.
- A `Card` `flex h-full flex-col`; opcionális képe közvetlen gyermek, `aspect-video w-full object-cover`, így széltől szélig ér.
- A törzs külső konténere `flex flex-1 flex-col`, padding nélkül. Belső gyermeke `mx-4 my-4 flex flex-1 flex-col`, 761 px-től `mx-5 my-5`. Ez a gyermek birtokolja az összes külső insetet; a flex layout megakadályozza a margóösszeomlást.
- A cím alatt `mb-3`, a leírás alja `mb-4`. Az opcionális címkesor `mt-auto flex flex-wrap gap-1.5`, így a változó tartalom mellett a törzs aljához igazodik. Címke és leírás nélkül is megmarad a törzs alsó margója.
- A műveletsor külön `border-t border-frame` konténer, nem kap insetet. A teljes szélességű link saját `px-4 py-2` paddingja a vezérlő része. Navigációhoz linket, alkalmazásművelethez dokumentált gombot használjunk.
- A rács 1 oszlopos, 761 px-től 2, 1201 px-től 4; `gap-4`. A katalógus nem kapja meg az olvasócikk 880 px-es korlátját.
- Opcionális: kép, metaadat, leírás, címkék és műveletsor. A hosszú kártyatartalom nem kap saját scrollbar-t: az oldal görgethető. A teljes kártyát ne tegyük linkké, ha belül más interaktív elem is van.

## Katalóguskereső a rács előtt

A közös `CourseCatalog` (a hibakatalógusban is) saját `$state` keresőkifejezést és `$derived` találatokat kezel. A dokumentált `Input` szöveges bindingot és lucide `Search` ikont használ; nincs külön kereső-/szűrőmotor a csomagban. A szűrés az alkalmazás feladata: `name`, `author`, `intro`, `tags`, `contentTags`, nem a teljes tananyag vagy a dokumentumok `author` mezője. Azonnali, kis-/nagybetű- és ékezetfüggetlen keresés; minden szó szükséges, külön mezőkben is előfordulhatnak.

A keresősor `mb-4 flex flex-col gap-2`, a vezérlősor `flex flex-wrap items-center gap-2`, padding nélkül. Az Input `min-w-0 flex-1`; mellette feliratos, üres értéknél letiltott `Button` töröl és visszaadja a fókuszt az Inputnak. A látható label egyedi inputazonosítóra mutat. A találatszám és az eltérő üres/nincs-találat üzenet közös `role="status" aria-atomic="true"` régióban jelenik meg, amelyet az input `aria-describedby` attribútuma is hivatkozik. A rács szélessége és oszlopszámai változatlanok.

Minimális vezérlőkompozíció (a szűrés a fogyasztó felelőssége):

```svelte
<script lang="ts">
  import { Button, Input } from '@atom-forge/ui';
  import { Search } from 'lucide-svelte';
  let query = $state('');
  let input: Input | undefined = $state();
  const id = $props.id();
</script>

<div class="mb-4 flex flex-col gap-2">
  <label for={id} class="text-sm font-medium">Keresés</label>
  <div class="flex flex-wrap items-center gap-2">
    <Input {id} bind:this={input} bind:value={query} icon={Search} class="min-w-0 flex-1"/>
    <Button label="Törlés" ghost disabled={!query.length} onclick={() => { query = ''; input?.focus(); }}/>
  </div>
</div>
```

## Minimális, üzleti logika nélküli példa

```svelte
<script lang="ts">
  import { Card, Chip } from '@atom-forge/ui';
</script>

<div class="grid grid-cols-1 gap-4 min-[761px]:grid-cols-2 min-[1201px]:grid-cols-4">
  <Card elevate={1} class="flex h-full flex-col overflow-hidden">
    <div class="flex flex-1 flex-col">
      <div class="mx-4 my-4 flex flex-1 flex-col min-[761px]:mx-5 min-[761px]:my-5">
        <h2 class="mb-3 text-xl font-semibold min-[761px]:text-2xl">Kártyacím</h2>
        <p class="mb-4 text-sm leading-relaxed text-muted-contrast">Rövid leírás.</p>
        <div class="mt-auto flex flex-wrap gap-1.5" aria-label="Címkék">
          <Chip class="text-[10px] uppercase bg-accent text-accent-contrast">hu</Chip>
          <Chip class="text-[10px] uppercase bg-primary text-primary-contrast">Szerző</Chip>
          <Chip class="text-[10px] uppercase">Címke</Chip>
          <Chip class="text-[10px] uppercase bg-muted text-muted-contrast">Tartalomcímke</Chip>
        </div>
      </div>
    </div>
    <div class="border-t border-frame">
      <a class="flex w-full items-center justify-center px-4 py-2 text-center text-xs font-medium text-accent hover:bg-surface hover:underline" href="/">Megnyitás</a>
    </div>
  </Card>
</div>
```


## Egyetlen metaadat-/címkesor

A cím és leírás UTÁN, nem a cím előtt: nyelv (accent), szerző (inverse/primary), saját kurzuscímkék (alap Chip), majd összesített tartalomcímkék (muted, `text-muted-contrast`, nem opacity). Hiányzó mező nem kap helykitöltőt; nincs külön szerzősor vagy év. A sorrendet a megosztott `CourseMetadata` tartja. A katalógus megtartja a nyelvet és a szerzőt a böngészéshez. A kurzusnyitó oldal törzsében a `CourseMetadata showIdentity={false}` csak saját és összesített címkéket mutat; a nyelv és a kurzusszerző a `DocumentHeader` kurzuscíme ALATT, együtt jelenik meg. Más dokumentumok törzsében nincs nyelvjelvény vagy ismételt kurzusszerző; az eltérő saját dokumentumszerző megmarad, majd a saját címkék következnek. Nincs szerző- vagy címkeöröklés.

Minden metaadat-Chip `text-[10px] uppercase` osztályt kap a dokumentált, `twMerge`-elt `class` propján: az uppercase csak vizuális, nem módosítja az adatokat. A saját/összesített színek és a kibontógomb megmaradnak.

A fejléc desktopon továbbra is 76 px magas, így a 76 px-es sticky offsetek változatlanok. Mobilon a meglévő 64 px-es BookMD/sötétmód sor és a hamburger helye megmarad; alatta külön 56 px-es kurzussor tartalmazza a címet és a nyelv/szerző sort. A cím és a szerző truncationt és teljes szöveges `title` attribútumot kap, a nyelv nem zsugorodik. A mobil törzs navigációja nem sticky, ezért nem kap új önkényes offsetet.

A telepített 0.0.37 csomagban nincs Tag API: a dokumentált `Chip` `class` propját használjuk szemantikus háttér/kontraszt párokkal, függőségfrissítés nélkül. Referencia: `node_modules/@atom-forge/ui/docs/controls/general/chip.md`. A Chip nem interaktív; a kibontás alkalmazástulajdonú natív gomb.

Az első négy összesített címke látható, a többit `+N további` gomb nyitja; `Kevesebb` visszazárja. A saját metaadat mindig látható, nincs sorlevágás. A gomb billentyűzettel kezelhető, fókuszjelölést, kurzusnévvel kiegészített accessible nevet, `aria-expanded` és egyedi `aria-controls` kapcsolatot kap. A rejtett címkék nem kerülnek a fókusz-/olvasási sorrendbe. Hosszú címkék tördelődnek; kibontáskor az oldal görgethető.

Az aggregálás a feldolgozóban történik a végleges `page.course` alapján, minden generált oldalból, nem csak a navigációs fából. Más kurzus és katalógus címkéi kizártak. A csak beillesztett `sources` fájlok nem önálló oldalak: metaadataik nem öröklődnek. Normalizálás: trim, magyar kisbetűsítés, NFD ékezeteltávolítás és belső whitespace összevonása. Az első előfordulás írásmódját és feldolgozási sorrendjét őrizzük; a saját kurzuscímkékkel egyező összesített címkék kimaradnak. A saját lista változatlan. A kereső minden összesített címkét indexel, a becsukottakat is.
