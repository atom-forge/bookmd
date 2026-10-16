<script lang="ts">
  import { usePageHref } from '../page-href';
  import { Chip, Icon, Switch, getThemeManager } from '@atom-forge/ui';
  import { Sun, Moon, Boxes, Box } from 'lucide-svelte';
  import logoLight from '$lib/logo/bookmd-lightbg.svg';
  import logoDark from '$lib/logo/bookmd-darkbg.svg';
  import type { PortalPageData } from '$lib/portal-page';
  let { course, columns, branding = '' }: { branding?: string; course: PortalPageData['course']; columns: string } = $props();
  const theme = getThemeManager();
  const href = usePageHref();
</script>

<header class="sticky top-0 z-30 border-b border-frame bg-canvas">
  <div class={`mx-auto grid grid-rows-[64px] items-center min-[900px]:grid-rows-1 min-[900px]:h-[76px] ${course ? `max-w-[2040px] grid-rows-[64px_56px] grid-cols-[56px_minmax(0,1fr)_auto] ${columns}` : 'max-w-[2040px] grid-cols-[minmax(0,1fr)_auto]'}`}>
    <div class={`${course ? 'col-start-1 row-start-1 col-span-2 ml-16 mr-3 min-[900px]:col-span-1 min-[900px]:mx-5' : 'col-start-1 row-start-1 mx-5'} flex min-w-0 items-center gap-3 text-lg font-semibold tracking-tight text-canvas-contrast min-[900px]:text-[21px]`}>
      <a class="flex min-w-0 items-center gap-3 hover:opacity-90" href={href('')} title="All Books">
        <span class="grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)] bg-accent text-accent-contrast"><Icon icon={Boxes} size="6"/></span>
        <span class="flex min-w-0 flex-col">
          <img src={logoLight} alt="BookMD" class="h-7 w-auto self-start dark:hidden min-[900px]:h-8"/>
          <img src={logoDark} alt="BookMD" class="hidden h-7 w-auto self-start dark:block min-[900px]:h-8"/>
          {#if branding}<span class="truncate text-[10px] font-normal leading-tight tracking-normal text-muted-contrast" title={branding}>{branding}</span>{/if}
        </span>
      </a>
    </div>
    {#if course}
      <div class="col-span-3 row-start-2 mx-5 mb-2 flex h-12 min-w-0 flex-col justify-center gap-1 min-[900px]:col-span-1 min-[900px]:col-start-2 min-[900px]:row-start-1 min-[900px]:mx-[clamp(24px,3vw,48px)] min-[900px]:mb-0">
        <div class="flex min-w-0 items-center gap-2 text-sm font-semibold text-canvas-contrast min-[900px]:text-lg">
          <span class="shrink-0 text-muted-contrast" aria-hidden="true"><Icon icon={Box} size="5"/></span>
          <a class="truncate hover:text-accent" href={href(course.slug)} title={course.name}>{course.name}</a>
          {#if course.subtitle}<span class="hidden min-w-0 truncate text-sm font-normal text-muted-contrast min-[900px]:inline" title={course.subtitle}>{course.subtitle}</span>{/if}
        </div>
        {#if course.language || course.authors.length}
          <div class="flex min-w-0 items-center gap-1.5" aria-label="Course language and author">
            {#if course.language}<Chip class="shrink-0 text-[10px] uppercase bg-accent text-accent-contrast"><span class="sr-only">Language: </span>{course.language}</Chip>{/if}
            {#if course.authors.length}<span class="truncate text-xs text-muted-contrast" title={course.authors.join(', ')}><span class="sr-only">Author: </span>{course.authors.join(', ')}</span>{/if}
          </div>
        {/if}
      </div>
    {/if}
    <div class={`${course ? 'col-start-3' : 'col-start-2'} row-start-1 mx-5 flex items-center justify-end`}>
      <Switch bind:value={theme.dark} icons={{ on: Moon, off: Sun }} label="Dark mode" class="[&>span:last-child]:sr-only"/>
    </div>
  </div>
</header>
