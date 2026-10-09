<script lang="ts">
  import { usePageHref } from '../page-href';
  import { Chip, Icon, Switch, getThemeManager } from '@atom-forge/ui';
  import { Sun, Moon, Boxes, Box } from 'lucide-svelte';
  import type { PortalPageData } from '$lib/portal-page';
  let { course, columns, branding = '' }: { branding?: string; course: PortalPageData['course']; columns: string } = $props();
  const theme = getThemeManager();
  const href = usePageHref();
</script>

<header class="sticky top-0 z-30 border-b border-frame bg-canvas">
  <div class={`mx-auto grid grid-rows-[64px] items-center min-[900px]:grid-rows-1 min-[900px]:h-[76px] ${course ? `max-w-[2040px] grid-rows-[64px_56px] grid-cols-[56px_minmax(0,1fr)_auto] ${columns}` : 'max-w-[2040px] grid-cols-[minmax(0,1fr)_auto]'}`}>
    <div class={`${course ? 'col-start-1 row-start-1 col-span-2 ml-16 mr-3 min-[900px]:col-span-1 min-[900px]:mx-5' : 'col-start-1 row-start-1 mx-5'} flex min-w-0 items-center gap-3 text-lg font-semibold tracking-tight text-canvas-contrast min-[900px]:text-[21px]`}>
      <a class="grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)] bg-accent text-accent-contrast hover:opacity-90" href={href('')} aria-label="Courses"><Icon icon={Boxes} size="6"/></a>
      <div class="flex min-w-0 flex-col">
        <span class="truncate">BookMD</span>
        {#if branding}<span class="truncate text-[10px] font-normal leading-tight tracking-normal text-muted-contrast" title={branding}>{branding}</span>{/if}
      </div>
    </div>
    {#if course}
      <div class="col-span-3 row-start-2 mx-5 mb-2 flex h-12 min-w-0 flex-col justify-center gap-1 min-[900px]:col-span-1 min-[900px]:col-start-2 min-[900px]:row-start-1 min-[900px]:mx-[clamp(24px,3vw,48px)] min-[900px]:mb-0">
        <div class="flex min-w-0 items-center gap-2 text-sm font-semibold text-canvas-contrast min-[900px]:text-lg">
          <span class="shrink-0 text-muted-contrast" aria-hidden="true"><Icon icon={Box} size="5"/></span>
          <a class="truncate hover:text-accent" href={href(course.slug)} title={course.name}>{course.name}</a>
        </div>
        {#if course.language || course.author}
          <div class="flex min-w-0 items-center gap-1.5" aria-label="Course language and author">
            {#if course.language}<Chip class="shrink-0 text-[10px] uppercase bg-accent text-accent-contrast"><span class="sr-only">Language: </span>{course.language}</Chip>{/if}
            {#if course.author}<span class="truncate text-xs text-muted-contrast" title={course.author}><span class="sr-only">Author: </span>{course.author}</span>{/if}
          </div>
        {/if}
      </div>
    {/if}
    <div class={`${course ? 'col-start-3' : 'col-start-2'} row-start-1 mx-5 flex items-center justify-end`}>
      <Switch bind:value={theme.dark} icons={{ on: Moon, off: Sun }} label="Dark mode" class="[&>span:last-child]:sr-only"/>
    </div>
  </div>
</header>
