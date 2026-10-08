<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import { base } from '$app/paths';
  import { Menu, X } from 'lucide-svelte';
  import type { NavItem } from '../../../../scripts/content';
  import { courseMenu, courseOpenPath } from '$lib/course-menu';
  import Tree from './CourseNavigation/Tree.svelte';
  let { items, courseSlug, courseName, activeSlug, contextSlug }: {
    items: NavItem[]; courseSlug: string; courseName: string; activeSlug: string; contextSlug: string;
  } = $props();
  const root = $derived(courseMenu(items, courseSlug));
  let openPath = $state<string[]>(untrack(() => courseOpenPath(items, contextSlug, courseSlug)));
  let dialog: HTMLDialogElement;
  let trigger: HTMLButtonElement;
  let opened = $state(false);
  const prefix = $props.id();
  $effect(() => { openPath = courseOpenPath(items, contextSlug, courseSlug); });
  $effect(() => { activeSlug; untrack(() => { if (opened) close(); }); });
  function select(slug: string, mobile: boolean) {
    // A repeated click on the active link must also restore its open path.
    openPath = courseOpenPath(items, slug, courseSlug);
    if (mobile) close();
  }
  function close() { dialog?.close(); }
  function closed() { opened = false; if (trigger?.getClientRects().length) trigger.focus(); }
  async function show() {
    openPath = courseOpenPath(items, contextSlug, courseSlug);
    opened = true;
    dialog.showModal();
    await tick();
    dialog.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' });
  }
  $effect(() => {
    if (!opened) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previous; };
  });
  onMount(() => {
    const media = window.matchMedia('(min-width: 900px)');
    const resize = () => { if (media.matches) close(); };
    media.addEventListener('change', resize);
    return () => media.removeEventListener('change', resize);
  });
</script>

{#snippet navigation(mobile: boolean)}
  <nav class="mx-3 my-6 min-w-0" aria-label="Kurzusnavigáció">
    {#if root}
      <a class="mb-3 flex min-w-0 items-baseline gap-1.5 rounded px-2 py-2 text-[13px] leading-relaxed font-semibold text-canvas-contrast [overflow-wrap:anywhere] hover:text-accent focus-visible:outline-2 focus-visible:outline-accent aria-[current=page]:bg-surface aria-[current=page]:text-accent" href={`${base}/${courseSlug.split('/').map(encodeURIComponent).join('/')}/`} aria-current={activeSlug === courseSlug ? 'page' : undefined} onclick={() => select(courseSlug, mobile)}>
        {#if root.chapter !== undefined}
          <span class="shrink-0 whitespace-nowrap text-[10px] font-normal text-muted-contrast">{root.chapter}</span>
        {/if}
        <span class="min-w-0">{root.title}</span>
      </a>
      <Tree nodes={root.children} {openPath} {activeSlug} select={(slug) => select(slug, mobile)} prefix={`${prefix}-${mobile ? 'mobile' : 'desktop'}`}/>
    {/if}
  </nav>
{/snippet}

<button bind:this={trigger} class="fixed top-3 left-3 z-40 grid size-10 place-items-center rounded text-canvas-contrast hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent min-[900px]:hidden" aria-label="Kurzusmenü" aria-haspopup="dialog" aria-expanded={opened} aria-controls={`${prefix}-panel`} onclick={show}><Menu size={24} aria-hidden="true"/></button>
<aside class="sticky top-[76px] col-start-1 row-start-1 hidden h-[calc(100dvh-116px)] min-w-0 self-start overflow-y-auto overscroll-contain border-r border-frame min-[900px]:block">
  {@render navigation(false)}
</aside>
<dialog bind:this={dialog} id={`${prefix}-panel`} aria-label="Kurzusmenü" class="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent text-canvas-contrast backdrop:bg-black/50" onclose={closed} onclick={(event) => { if (event.target === dialog) close(); }}>
  <div class="flex h-full w-[min(360px,calc(100vw-32px))] flex-col border-r border-frame bg-canvas shadow-xl">
    <div class="mx-4 mt-4 mb-2 flex shrink-0 items-start justify-between gap-3">
      <h2 class="min-w-0 text-base font-semibold [overflow-wrap:anywhere]">{courseName}</h2>
      <button class="grid size-10 shrink-0 place-items-center rounded hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent" aria-label="Kurzusmenü bezárása" onclick={close}><X size={24} aria-hidden="true"/></button>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">{@render navigation(true)}</div>
  </div>
</dialog>
