<script lang="ts">
  import type { PortalPageData } from '$lib/server/page';
  let { headings, hasCourse }: { headings: PortalPageData['page']['headings']; hasCourse: boolean } = $props();
  const sections = $derived(headings.filter(heading => heading.depth <= 3));
</script>

<aside class={`sticky top-[76px] row-start-1 hidden h-[calc(100dvh-116px)] min-w-0 self-start overflow-y-auto overscroll-contain border-l border-frame min-[1280px]:flex min-[1280px]:flex-col ${hasCourse ? 'col-start-3' : 'col-start-2'}`}>

  <span class="mx-5 mt-9 text-[10px] font-bold tracking-[1.5px] text-muted-contrast">ON THIS PAGE</span>
  <nav class="mx-5 mt-5 mb-9" aria-label="Table of contents">
    {#each sections as section}
      <a class={`block py-[7px] text-[13px] leading-relaxed [overflow-wrap:anywhere] text-muted-contrast hover:text-accent ${section.depth === 3 ? 'ml-2.5' : ''}`} href={`#${section.id}`}>{section.title}</a>
    {/each}
  </nav>
</aside>
