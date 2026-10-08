<script lang="ts">
  import { base } from '$app/paths';
  import { Icon } from '@atom-forge/ui';
  import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from 'lucide-svelte';
  import type { PortalPageData } from '$lib/server/page';
  let { previous, next, previousFromParent, nextFromParent, nextToChild }: Pick<PortalPageData, 'previous' | 'next' | 'previousFromParent' | 'nextFromParent' | 'nextToChild'> = $props();
  const href = (slug: string) => `${base}/${slug ? slug.split('/').map(encodeURIComponent).join('/') + '/' : ''}`;
</script>

{#if previous || next}
  <nav class="grid grid-cols-2 divide-x divide-frame border-t border-frame text-[13px] text-accent" aria-label="Reading order">
    {#if previous}
      <a class="flex min-w-0 items-center gap-2 cursor-pointer! [&_*]:pointer-events-none px-5 py-3 font-medium transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-accent min-[761px]:px-[clamp(24px,3vw,48px)]" href={href(previous.slug)} aria-label={`Previous: ${previous.title}`}><span class="shrink-0"><Icon icon={previousFromParent ? ArrowUpLeft : ArrowLeft} size="4"/></span><span class="truncate">{previous.title}</span></a>
    {:else}<div></div>{/if}
    {#if next}
      <a class="flex min-w-0 items-center justify-end gap-2 cursor-pointer! [&_*]:pointer-events-none px-5 py-3 text-right font-medium transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-accent min-[761px]:px-[clamp(24px,3vw,48px)]" href={href(next.slug)} aria-label={`Next: ${next.title}`}><span class="truncate">{next.title}</span><span class="shrink-0"><Icon icon={nextToChild ? ArrowDownRight : nextFromParent ? ArrowUpRight : ArrowRight} size="4"/></span></a>
    {/if}
  </nav>
{/if}
