<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { portalPage } from '$lib/portal-page';
  import DocumentPage from '../(+lib)/DocumentPage.svelte';
  import { providePageHref } from '../(+lib)/page-href';
  import Diagnostics from './Diagnostics.svelte';
  import EntryChooser from './EntryChooser.svelte';
  import PreviewBar from './PreviewBar.svelte';
  import StartScreen from './StartScreen.svelte';
  import { describeFileError, scanDirectory, type DirectoryHandle, type DirectoryIndex } from './directory-index';
  import { entryCandidates, preselected } from './entry-candidates';
  import { loadPreview, type LoadedPreview } from './load-preview';
  import { parsePreviewHash, previewHash } from './preview-hash';
  import { loadStored, saveStored, type StoredPreview } from './handle-store';

  type Picker = (options: { mode: 'read'; id: string }) => Promise<DirectoryHandle>;

  const route = `${base}/@dev/`;
  const link = (slug: string, _query: string, fragment: string) => {
    let heading: string | null = null;
    try { heading = fragment ? decodeURIComponent(fragment.slice(1)) : null; } catch { /* keep the page link */ }
    return route + previewHash(slug, heading);
  };

  let supported = $state(true);
  let phase = $state<'start' | 'scanning' | 'choosing' | 'processing' | 'ready'>('start');
  let busy = $state(false);
  let error = $state<string | null>(null);
  let handle: DirectoryHandle | null = null;
  let index = $state.raw<DirectoryIndex | null>(null);
  let loaded = $state.raw<LoadedPreview | null>(null);
  let stale = $state(false);
  let chosen = $state<string | null>(null);
  let currentSlug = $state('');
  /** A folder from the previous visit that still needs the user's permission. */
  let restorable = $state.raw<StoredPreview | null>(null);
  // Each operation owns a token; a newer operation makes older results obsolete.
  let token = 0;

  providePageHref(slug => slug === '' ? route + previewHash(loaded?.courseSlug ?? '') : link(slug, '', ''));
  onMount(() => {
    supported = isSecureContext && 'showDirectoryPicker' in window;
    if (supported) void restore();
  });
  onDestroy(() => { token++; loaded?.dispose(); });

  const candidates = $derived(index ? entryCandidates(index.files.keys()) : []);
  const data = $derived(loaded ? portalPage(loaded.graph, currentSlug || loaded.courseSlug) : null);

  async function release(old: LoadedPreview | null) {
    // The DOM must stop using the old blob URLs before they are revoked.
    await tick();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    old?.dispose();
  }

  async function restore() {
    const run = ++token;
    const stored = await loadStored();
    if (!stored || run !== token) return;
    let permission: PermissionState = 'prompt';
    try { permission = await stored.handle.queryPermission?.({ mode: 'read' }) ?? 'prompt'; } catch { /* ask again */ }
    if (run !== token) return;
    if (permission === 'granted') await open(stored.handle, run, stored.entry, true);
    else restorable = stored;
  }

  async function continueRestored() {
    const stored = restorable;
    if (!stored) return;
    const run = ++token;
    error = null;
    let permission: PermissionState = 'denied';
    try { permission = await stored.handle.requestPermission?.({ mode: 'read' }) ?? 'denied'; } catch { /* reported below */ }
    if (run !== token) return;
    if (permission !== 'granted') { error = 'Read permission was not granted. Choose the folder again.'; restorable = null; return; }
    restorable = null;
    await open(stored.handle, run, stored.entry, true);
  }

  async function pickFolder() {
    const run = ++token;
    error = null;
    let picked: DirectoryHandle;
    try {
      picked = await (window as unknown as { showDirectoryPicker: Picker }).showDirectoryPicker({ mode: 'read', id: 'bookmd-preview' });
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return; // Cancelling is a normal action.
      error = describeFileError(cause);
      return;
    }
    if (run !== token) return;
    restorable = null;
    await open(picked, run, null);
  }

  /** Scans the folder, then renders `entry` or asks for one. Keeps the previous preview on failure. */
  async function open(directory: DirectoryHandle, run: number, entry: string | null, keepLocation = false) {
    busy = true;
    const previous = phase;
    if (!loaded) phase = 'scanning';
    try {
      const scanned = await scanDirectory(directory, { get aborted() { return run !== token; } });
      if (run !== token) return;
      handle = directory;
      index = scanned;
      const options = entryCandidates(scanned.files.keys());
      if (entry && scanned.files.has(entry)) { await render(entry, run, keepLocation); return; }
      chosen = preselected(options);
      if (entry) error = `Entry file ${entry} no longer exists. Choose another one.`;
      phase = 'choosing';
    } catch (cause) {
      if (run !== token) return;
      error = describeFileError(cause);
      phase = loaded ? 'ready' : previous === 'ready' ? 'ready' : 'start';
    } finally {
      if (run === token) busy = false;
    }
  }

  async function render(entry: string, run = ++token, keepLocation = false) {
    if (!index) return;
    busy = true;
    error = null;
    if (!loaded) phase = 'processing';
    try {
      const next = await loadPreview(index, entry, link);
      if (run !== token) { next.dispose(); return; }
      const old = loaded;
      loaded = next;
      stale = false;
      phase = 'ready';
      if (handle) void saveStored({ handle, entry });
      if (!keepLocation && (!old || old.entry !== entry || old.index.name !== index.name)) await goto(route, { replaceState: true, noScroll: true });
      void release(old);
    } catch (cause) {
      if (run !== token) return;
      error = cause instanceof Error ? cause.message : String(cause);
      stale = loaded !== null;
      phase = loaded ? 'ready' : 'choosing';
    } finally {
      if (run === token) busy = false;
    }
  }

  async function reload() {
    if (!handle || !loaded) return;
    const run = ++token;
    error = null;
    await open(handle, run, loaded.entry);
  }

  function changeEntry() { chosen = loaded?.entry ?? null; error = null; phase = 'choosing'; }
  function cancelChoice() { error = null; phase = 'ready'; }

  // The URL hash selects the page; ordinary fragments keep the current page.
  $effect(() => {
    const location = parsePreviewHash(page.url.hash);
    if (!loaded || location.slug === null) return;
    if (!loaded.graph.pages.some(candidate => candidate.slug === location.slug)) {
      error = `Page ${location.slug} is not part of this book; showing the book start page.`;
      currentSlug = '';
      void goto(route, { replaceState: true, noScroll: true });
      return;
    }
    currentSlug = location.slug;
  });
  $effect(() => {
    const { slug, heading } = parsePreviewHash(page.url.hash);
    if (!loaded || (slug === null && !heading)) return;
    void scrollTo(heading);
  });
  // A reload that removed the open page returns to the book start.
  $effect(() => {
    if (loaded && currentSlug && !loaded.graph.pages.some(candidate => candidate.slug === currentSlug)) {
      error = `Page ${currentSlug} no longer exists; showing the book start page.`;
      currentSlug = '';
    }
  });

  async function scrollTo(id: string | null) {
    await tick();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView();
    else if (!id) window.scrollTo({ top: 0 });
  }

  /** In-page anchors (table of contents, skip link, #fragments) must keep the page in the hash. */
  function keepPage(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest?.('a[href^="#"]');
    const raw = anchor?.getAttribute('href') ?? '';
    if (!anchor || raw.startsWith('#page=')) return;
    event.preventDefault();
    let id = '';
    try { id = decodeURIComponent(raw.slice(1)); } catch { /* ignore a malformed fragment */ }
    void goto(previewHash(currentSlug || loaded!.courseSlug, id), { noScroll: true });
    void scrollTo(id || null);
  }
</script>

{#if phase === 'ready' && loaded && data}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div onclickcapture={keepPage}>
    <PreviewBar folder={loaded.index.name} entry={loaded.entry} {stale} {busy} onreload={reload} onentry={changeEntry} onfolder={pickFolder}/>
    <Diagnostics items={loaded.diagnostics} {error}/>
    <DocumentPage {data}/>
  </div>
{:else if phase === 'choosing' && index}
  <Diagnostics items={[]} {error}/>
  <EntryChooser folder={index.name} {candidates} bind:value={chosen} truncated={index.truncated} onconfirm={() => chosen && render(chosen)} oncancel={loaded ? cancelChoice : undefined}/>
{:else}
  <Diagnostics items={[]} {error}/>
  <StartScreen {supported} restore={restorable ? { folder: restorable.handle.name, entry: restorable.entry } : null} oncontinue={continueRestored} busy={busy || phase === 'scanning' || phase === 'processing'} onpick={pickFolder}/>
{/if}
