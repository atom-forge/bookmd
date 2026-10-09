<script lang="ts">
  import { usePageHref } from '../page-href';
  import { Icon } from '@atom-forge/ui';
  import { ArrowRight, ChevronsRight } from 'lucide-svelte';
  import type { PortalPageData } from '$lib/portal-page';
  let { page, path, language }: { page: PortalPageData['page']; path: PortalPageData['breadcrumb']; language?: string } = $props();
  const parentPath = $derived(page.inTree ? path.slice(0, -1) : path);
  const ancestors = $derived(parentPath.slice(0, -1));
  const immediateParent = $derived(parentPath.at(-1));
  const href = usePageHref();
</script>

<nav class="mx-[clamp(24px,3vw,48px)] mt-3.5 mb-[18px] hidden flex-col gap-2 text-xs min-[900px]:flex text-muted-contrast [&_a]:truncate [&_a:hover]:text-canvas-contrast [&_span[aria-hidden]]:shrink-0" aria-label="Breadcrumb">
  {#if ancestors.length}
    <div class="flex min-w-0 items-center gap-2 overflow-x-auto text-[11px] font-normal text-muted-contrast [&_a]:max-w-[min(40ch,50vw)] [&_a]:shrink-0 [&_a]:opacity-70 [&_a:hover]:opacity-100 [&_a:focus-visible]:opacity-100">
      {#each ancestors as item}
        <a href={href(item.slug)} title={item.title}>{#if item.chapter !== undefined}<span class="mr-1.5 text-[10px] font-normal text-muted-contrast">{item.chapter}</span>{/if}{item.title}</a>
        <span aria-hidden="true"><Icon icon={ArrowRight} size="4"/></span>
      {/each}
    </div>
  {/if}
  {#if immediateParent}
    <div class="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-canvas-contrast">
      <a href={href(immediateParent.slug)} title={immediateParent.title}>{#if immediateParent.chapter !== undefined}<span class="mr-1.5 text-[10px] font-normal text-muted-contrast">{immediateParent.chapter}</span>{/if}{immediateParent.title}</a>
      <span aria-hidden="true"><Icon icon={ArrowRight} size="4"/></span>
    </div>
  {/if}
  <div class="mt-1.5 flex items-baseline gap-3 text-canvas-contrast">
    {#if !page.inTree}
      <span class="shrink-0 text-muted-contrast" aria-hidden="true"><Icon icon={ChevronsRight} size="5"/></span>
      <span class="sr-only">Document outside the tree: </span>
    {/if}
    <p class="m-0 min-w-0 text-base leading-snug font-semibold tracking-tight text-balance" aria-current="page" lang={language}>{#if page.chapter !== undefined}<span class="mr-1.5 text-[10px] font-normal text-muted-contrast">{page.chapter}</span>{/if}{page.title}</p>
  </div>
</nav>
