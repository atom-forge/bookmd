<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { Icon, Switch, getThemeManager } from '@atom-forge/ui';
  import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, ChevronsRight, Sun, Moon, Boxes, Box } from 'lucide-svelte';
  import Article from '$lib/Article.svelte';
  import type { PortalPageData } from '$lib/server/page';
  import CourseCatalog from '$lib/CourseCatalog.svelte';
  import CourseMetadata from '$lib/CourseMetadata.svelte';
  import CourseNavigation from '../routes/(+lib)/CourseNavigation.svelte';
  let { data }: { data: PortalPageData } = $props();
  const theme = getThemeManager();
  const href = (slug: string) => `${base}/${slug ? slug.split('/').map(encodeURIComponent).join('/') + '/' : ''}`;
  const sections = $derived(data.page.headings.filter(heading => heading.depth <= 3));
  let mounted = $state(false);
  let contextSlug = $state('');
  onMount(() => { mounted = true; });
  $effect(() => {
    if (!mounted) return;
    const key = `portal:tree-context:${base}`;
    if (data.page.inTree) {
      contextSlug = data.page.slug;
      try { sessionStorage.setItem(key, contextSlug); } catch {}
    } else {
      try { contextSlug = sessionStorage.getItem(key) || data.course?.slug || ''; } catch { contextSlug = ''; }
    }
  });
  const contextPath = $derived(Object.hasOwn(data.treePaths, contextSlug) ? data.treePaths[contextSlug] : data.breadcrumb);
  const displayedPath = $derived((data.page.inTree ? data.breadcrumb : contextPath).filter(item => item.slug !== ''));
  const parentPath = $derived(data.page.inTree ? displayedPath.slice(0, -1) : displayedPath);
  const ancestors = $derived(parentPath.slice(0, -1));
  const immediateParent = $derived(parentPath.at(-1));
  const navigationContext = $derived(data.page.inTree ? data.page.slug : displayedPath.at(-1)?.slug || data.course?.slug || '');
  const columns = 'min-[900px]:grid-cols-[clamp(240px,18vw,360px)_minmax(0,1fr)] min-[1280px]:grid-cols-[clamp(240px,18vw,360px)_minmax(0,1fr)_clamp(220px,16vw,320px)]';
</script>

<svelte:head>
  <title>{data.page.title} · BookMD</title>
  <meta name="description" content={data.page.text.slice(0, 160)} />
</svelte:head>

<a class="fixed -top-20 left-5 z-[100] bg-canvas p-3 focus:top-2.5" href="#main">Skip to content</a>
<header class="sticky top-0 z-30 border-b border-frame bg-canvas">
  <div class={`mx-auto grid h-16 items-center min-[900px]:h-[76px] ${data.course ? `max-w-[2040px] grid-cols-[56px_minmax(0,1fr)_auto] ${columns}` : 'max-w-[2040px] grid-cols-[minmax(0,1fr)_auto]'}`}>
  <div class={`${data.course ? 'col-span-2 ml-16 mr-3 min-[900px]:col-span-1 min-[900px]:mx-5' : 'mx-5'} flex min-w-0 items-center gap-3 text-lg font-semibold tracking-tight text-canvas-contrast min-[900px]:text-[21px]`}>
    <a class="grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)] bg-accent text-accent-contrast hover:opacity-90" href={href('')} aria-label="Courses"><Icon icon={Boxes} size="6"/></a>
    <span class="truncate">BookMD</span>
  </div>
  {#if data.course}
    <div class="hidden min-w-0 items-center gap-2 text-sm font-semibold text-canvas-contrast min-[900px]:mx-[clamp(24px,3vw,48px)] min-[900px]:flex min-[900px]:text-lg">
      <span class="shrink-0 text-muted-contrast" aria-hidden="true"><Icon icon={Box} size="5"/></span>
      <span class="truncate" title={data.course.name}>{data.course.name}</span>
    </div>
  {/if}
  <div class="flex items-center justify-end mx-5">
    <Switch bind:value={theme.dark} icons={{ on: Moon, off: Sun }} label="Dark mode" class="[&>span:last-child]:sr-only"/>
  </div>
  </div>
</header>

<div class={data.page.slug === '' ? 'mx-auto min-h-[calc(100dvh-76px)] max-w-[2040px]' : `mx-auto min-h-[calc(100dvh-76px)] max-w-[2040px] min-[900px]:grid ${data.course ? columns : 'min-[1280px]:grid-cols-[minmax(0,1fr)_clamp(220px,16vw,320px)]'}`}>

  {#if data.course}
    <CourseNavigation items={data.courseTree} courseSlug={data.course.slug} courseName={data.course.name} activeSlug={data.page.slug} contextSlug={navigationContext}/>
  {/if}
  <main class={`flex w-full min-w-0 flex-col ${data.course ? 'min-[900px]:col-start-2' : ''} min-[900px]:row-start-1 ${data.page.slug === '' ? '' : 'bg-surface'}`} id="main" tabindex="-1">

    {#if data.page.slug !== ''}
    <div class="z-20 flex flex-col border-b border-frame bg-canvas min-[900px]:sticky min-[900px]:top-[76px]">

      <nav class="mx-[clamp(24px,3vw,48px)] mt-3.5 mb-[18px] hidden flex-col gap-2 text-xs min-[900px]:flex text-muted-contrast [&_a]:truncate [&_a:hover]:text-canvas-contrast [&_span[aria-hidden]]:shrink-0" aria-label="Breadcrumb">
        {#if ancestors.length}
          <div class="flex min-w-0 items-center gap-2 overflow-x-auto text-[11px] font-normal text-muted-contrast [&_a]:max-w-[min(40ch,50vw)] [&_a]:shrink-0 [&_a]:opacity-70 [&_a:hover]:opacity-100 [&_a:focus-visible]:opacity-100">
            {#each ancestors as item}
              <a href={href(item.slug)} title={item.title}>{item.title}</a>
              <span aria-hidden="true"><Icon icon={ArrowRight} size="4"/></span>
            {/each}
          </div>
        {/if}
        {#if immediateParent}
          <div class="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-canvas-contrast">
            <a href={href(immediateParent.slug)} title={immediateParent.title}>{immediateParent.title}</a>
            <span aria-hidden="true"><Icon icon={ArrowRight} size="4"/></span>
          </div>
        {/if}
      <div class="mt-1.5 flex items-baseline gap-3 text-canvas-contrast">
        {#if !data.page.inTree}
          <span class="shrink-0 text-muted-contrast" aria-hidden="true"><Icon icon={ChevronsRight} size="5"/></span>
          <span class="sr-only">Document outside the tree: </span>
        {/if}
        <p class="m-0 text-base leading-snug font-semibold tracking-tight text-balance" aria-current="page" lang={data.course?.language}>{data.page.title}</p>
      </div>
      </nav>
    {#if data.previous || data.next}
      <nav class="grid grid-cols-2 divide-x divide-frame border-t border-frame text-[13px] text-muted-contrast" aria-label="Reading order">
        {#if data.previous}
          <a class="flex min-w-0 items-center gap-2 px-5 py-3 hover:text-accent min-[761px]:px-[clamp(24px,3vw,48px)]" href={href(data.previous.slug)} aria-label={`Previous: ${data.previous.title}`}><span class="shrink-0"><Icon icon={data.previousFromParent ? ArrowUpLeft : ArrowLeft} size="4"/></span><span class="truncate">{data.previous.title}</span></a>
        {:else}<div></div>{/if}
        {#if data.next}
          <a class="flex min-w-0 items-center justify-end gap-2 px-5 py-3 text-right hover:text-accent min-[761px]:px-[clamp(24px,3vw,48px)]" href={href(data.next.slug)} aria-label={`Next: ${data.next.title}`}><span class="truncate">{data.next.title}</span><span class="shrink-0"><Icon icon={data.nextFromParent ? ArrowUpRight : ArrowRight} size="4"/></span></a>
        {/if}
      </nav>
    {/if}
    </div>
    {/if}
    <div class={`mx-5 mt-6 mb-16 min-w-0 min-[900px]:mx-[clamp(24px,3vw,48px)] min-[900px]:mt-[34px] ${data.page.slug !== '' ? 'min-[1600px]:self-center min-[1600px]:w-[calc(100%-96px)] min-[1600px]:max-w-[880px]' : ''}`}>
    {#if data.course && data.page.slug === data.course.slug}
      {#if data.course.image}<img class="mb-6 aspect-video w-full rounded-[var(--radius-control)] object-cover" src={data.course.image} alt=""/>{/if}
      <CourseMetadata course={data.course}/>
    {/if}
    {#if data.page.author || (data.page.slug !== data.course?.slug && data.page.tags.length)}
      <div class="mb-6 text-[11px] text-muted-contrast">
        {#if data.page.author}<p class="mb-2"><span class="sr-only">Author: </span>{data.page.author}</p>{/if}
        {#if data.page.slug !== data.course?.slug && data.page.tags.length}
          <div class="flex flex-wrap gap-1.5" aria-label="Tags">
            {#each data.page.tags as tag}<span class="rounded-[var(--radius-control)] border border-frame px-2 py-[3px]">{tag}</span>{/each}
          </div>
        {/if}
      </div>
    {/if}
    <article class="w-full min-w-0 [&_.prose]:max-w-none" lang={data.course?.language}>
      <Article html={data.articleHtml} dark={theme.dark}/>
    </article>
    {#if data.page.slug === ''}
      <CourseCatalog courses={data.courses}/>

    {/if}
    </div>
  </main>
  {#if data.page.slug !== ''}
    <aside class={`sticky top-[76px] row-start-1 hidden h-[calc(100dvh-116px)] min-w-0 self-start overflow-y-auto overscroll-contain border-l border-frame min-[1280px]:flex min-[1280px]:flex-col ${data.course ? 'col-start-3' : 'col-start-2'}`}>

      <span class="mx-5 mt-9 text-[10px] font-bold tracking-[1.5px] text-muted-contrast">ON THIS PAGE</span>
      <nav class="mx-5 mt-5 mb-9" aria-label="Table of contents">
        {#each sections as section}
          <a class={`block py-[7px] text-[13px] leading-relaxed [overflow-wrap:anywhere] text-muted-contrast hover:text-accent ${section.depth === 3 ? 'ml-2.5' : ''}`} href={`#${section.id}`}>{section.title}</a>
        {/each}
      </nav>
    </aside>
  {/if}
</div>

<footer class="fixed inset-x-0 bottom-0 z-40 flex h-10 items-center justify-center border-t border-frame bg-canvas text-[10px] text-muted-contrast">Built with AtomForge BookMD</footer>
