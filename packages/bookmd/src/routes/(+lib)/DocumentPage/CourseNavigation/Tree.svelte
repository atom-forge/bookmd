<script lang="ts">
  import { usePageHref } from '../../page-href';
  import { ChevronDown, ChevronRight } from 'lucide-svelte';
  import type { CourseNode } from '$lib/course-menu';
  let { nodes, openPath, activeSlug, select, prefix }: {
    nodes: CourseNode[]; openPath: string[]; activeSlug: string;
    select: (slug: string) => void; prefix: string;
  } = $props();
  const href = usePageHref();
</script>

{#snippet list(items: CourseNode[])}
  <ul class="m-0 min-w-0 list-none">
    {#each items as item (item.slug)}
      {@const expanded = openPath.includes(item.slug)}
      {@const id = `${prefix}-${encodeURIComponent(item.slug)}`}
      <li class="min-w-0">
        <a class="group my-0.5 grid min-w-0 grid-cols-[20px_minmax(0,1fr)] items-start rounded px-2 py-1.5 text-[13px] leading-[1.6] text-muted-contrast [overflow-wrap:anywhere] hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-accent aria-[current=page]:bg-surface aria-[current=page]:font-semibold aria-[current=page]:text-accent" href={href(item.slug)} aria-current={item.slug === activeSlug ? 'page' : undefined} aria-expanded={item.children.length ? expanded : undefined} aria-controls={item.children.length ? id : undefined} onclick={() => select(item.slug)}>
          {#if item.children.length}
            {#if expanded}
              <ChevronDown size={16} class="mt-0.5" aria-hidden="true"/>
            {:else}
              <ChevronRight size={16} class="mt-0.5" aria-hidden="true"/>
            {/if}
          {:else}<span aria-hidden="true"></span>{/if}
          <span class="flex min-w-0 items-baseline gap-1.5">
            {#if item.chapter !== undefined}
              <span class="shrink-0 whitespace-nowrap text-[10px] font-normal text-muted-contrast">{item.chapter}</span>
            {/if}
            <span class={item.slug === activeSlug ? 'min-w-0' : 'min-w-0 line-clamp-2 group-hover:line-clamp-none group-focus:line-clamp-none'}>{item.title}</span>
          </span>
        </a>
        {#if item.children.length}
          <div id={id} hidden={!expanded} class="ml-2.5 min-w-0">
            {#if expanded}{@render list(item.children)}{/if}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

{@render list(nodes)}
