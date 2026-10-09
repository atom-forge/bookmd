<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getThemeManager } from '@atom-forge/ui';
  import Article from './DocumentPage/Article.svelte';
  import type { PortalPageData } from '$lib/portal-page';
  import CourseCatalog from './DocumentPage/CourseCatalog.svelte';
  import CourseNavigation from './DocumentPage/CourseNavigation.svelte';
  import DocumentHeader from './DocumentPage/DocumentHeader.svelte';
  import DocumentBreadcrumb from './DocumentPage/DocumentBreadcrumb.svelte';
  import ReadingNavigation from './DocumentPage/ReadingNavigation.svelte';
  import DocumentMetadata from './DocumentPage/DocumentMetadata.svelte';
  import PageConcepts from './DocumentPage/PageConcepts.svelte';
  import TableOfContents from './DocumentPage/TableOfContents.svelte';
  let { data }: { data: PortalPageData } = $props();
  const theme = getThemeManager();
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
  const navigationContext = $derived(data.page.inTree ? data.page.slug : displayedPath.at(-1)?.slug || data.course?.slug || '');
  const columns = 'min-[900px]:grid-cols-[clamp(240px,18vw,360px)_minmax(0,1fr)] min-[1280px]:grid-cols-[clamp(240px,18vw,360px)_minmax(0,1fr)_clamp(220px,16vw,320px)]';
</script>

<svelte:head>
  <title>{data.page.title} · BookMD</title>
  <meta name="description" content={data.page.text.slice(0, 160)} />
</svelte:head>

<a class="fixed -top-20 left-5 z-[100] bg-canvas p-3 focus:top-2.5" href="#main">Skip to content</a>
<DocumentHeader branding={data.branding} course={data.course} {columns}/>

<div class={data.page.slug === '' ? 'mx-auto min-h-[calc(100dvh-64px)] max-w-[2040px] min-[900px]:min-h-[calc(100dvh-76px)]' : `mx-auto ${data.course ? 'min-h-[calc(100dvh-120px)]' : 'min-h-[calc(100dvh-64px)]'} max-w-[2040px] min-[900px]:min-h-[calc(100dvh-76px)] min-[900px]:grid ${data.course ? columns : 'min-[1280px]:grid-cols-[minmax(0,1fr)_clamp(220px,16vw,320px)]'}`}>

  {#if data.course}
    <CourseNavigation items={data.courseTree} courseSlug={data.course.slug} courseName={data.course.name} activeSlug={data.page.slug} contextSlug={navigationContext}/>
  {/if}
  <main class={`flex w-full min-w-0 flex-col ${data.course ? 'min-[900px]:col-start-2' : ''} min-[900px]:row-start-1 ${data.page.slug === '' ? '' : 'bg-surface'}`} id="main" tabindex="-1">

    {#if data.page.slug !== ''}
      <div class="z-20 flex flex-col border-b border-frame bg-canvas min-[900px]:sticky min-[900px]:top-[76px]">

        <DocumentBreadcrumb page={data.page} path={displayedPath} language={data.course?.language}/>
        <ReadingNavigation previous={data.previous} next={data.next} previousFromParent={data.previousFromParent} nextFromParent={data.nextFromParent} nextToChild={data.nextToChild}/>
      </div>
    {/if}
    <div class="mx-5 mt-6 mb-16 min-w-0 min-[900px]:mx-[clamp(24px,3vw,48px)] min-[900px]:mt-[34px]">
      <DocumentMetadata page={data.page} course={data.course}/>
      <article class="w-full min-w-0 [&_.prose]:max-w-none" lang={data.course?.language}>
        <Article html={data.articleHtml} dark={theme.dark}/>
      </article>
      {#if data.page.slug !== ''}<PageConcepts requires={data.page.requires} teaches={data.page.teaches} class="mt-10 min-[1280px]:hidden"/>{/if}
      {#if data.page.slug === ''}
        <CourseCatalog courses={data.courses}/>

      {/if}
    </div>
  </main>
  {#if data.page.slug !== ''}
    <TableOfContents headings={data.page.headings} requires={data.page.requires} teaches={data.page.teaches} hasCourse={data.course !== null}/>
  {/if}
</div>

<footer class="fixed inset-x-0 bottom-0 z-40 flex h-10 items-center justify-center border-t border-frame bg-canvas text-[10px] text-muted-contrast"><span>Built with AtomForge BookMD</span>
  <span class="mx-2" aria-hidden="true">·</span>
  <a class="hover:text-accent" href="https://github.com/sponsors/atom-forge" rel="noopener"><span aria-hidden="true">♥</span> Support AtomForge</a>
</footer>
