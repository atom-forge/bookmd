<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { replaceState } from '$app/navigation';
  import { usePageHref } from '../page-href';
  import { Button, Card } from '@atom-forge/ui';
  import { SlidersHorizontal } from 'lucide-svelte';
  import { emptySelection, filterCourses, isEmpty, options, selectionFromQuery, selectionSize, selectionToQuery, toggle, type Group, type Selection } from './course-filter';
  import CourseFilters from './CourseFilters.svelte';
  import CourseMetadata from '../CourseMetadata.svelte';
  import type { Course } from '../../../core/content';
  let { courses, intro }: { courses: Course[]; intro?: Snippet } = $props();
  const href = usePageHref();
  const panelId = $props.id();
  let selection = $state<Selection>(emptySelection());
  let ready = $state(false);
  let open = $state(false);
  const results = $derived(filterCourses(courses, selection));
  const available = $derived(options(courses, selection));
  const size = $derived(selectionSize(selection));

  // The selection lives in the address (?lang=hu&tag=web), so a filtered list can be shared.
  onMount(() => {
    selection = selectionFromQuery(new URLSearchParams(location.search), courses);
    open = !isEmpty(selection);
    ready = true;
  });
  $effect(() => {
    const query = selectionToQuery(selection, new URLSearchParams(ready ? location.search : '')).toString();
    if (!ready || query === location.search.slice(1)) return;
    try { replaceState(`${location.pathname}${query ? `?${query}` : ''}${location.hash}`, {}); } catch { /* the filter still works without the address */ }
  });
  const change = (group: Group, key: string) => { selection = toggle(selection, group, key); };
  const clear = () => { selection = emptySelection(); };
</script>

<section class="flex flex-col gap-6 min-[900px]:flex-row" aria-label="Books">
  {#if courses.length}
    <aside class="min-w-0 min-[900px]:w-72 min-[900px]:shrink-0" aria-label="Filter the books">
      <Button class="min-[900px]:hidden" outline compact icon={SlidersHorizontal} label={size ? `Filters (${size})` : 'Filters'} aria-expanded={open} aria-controls={panelId} onclick={() => (open = !open)}/>
      <div id={panelId} class="{open ? 'mt-4 block' : 'hidden'} min-[900px]:block">
        <CourseFilters {available} {size} ontoggle={change} onclear={clear}/>
      </div>
    </aside>
  {/if}
  <div class="min-w-0 flex-1">
    {@render intro?.()}
    <p role="status" aria-atomic="true" class="mb-4 text-sm text-muted-contrast">
      {results.length} of {courses.length} books
      {#if courses.length && !results.length} — No book matches these filters. <button type="button" class="text-accent hover:underline" onclick={clear}>Clear the filters</button>{/if}
      {#if !courses.length} — No books available yet.{/if}
    </p>
    <div class="grid grid-cols-1 gap-4 min-[761px]:grid-cols-2 min-[1500px]:grid-cols-3">
      {#each results as course (course.slug)}
        <Card elevate={1} class="flex h-full flex-col overflow-hidden">
          {#if course.image}<img class="aspect-video w-full object-cover" src={course.image} alt="" loading="lazy"/>{/if}
          <div class="flex flex-1 flex-col">
            <div class="mx-4 my-4 flex flex-1 flex-col min-[761px]:mx-5 min-[761px]:my-5">
              <h2 class={`${course.subtitle ? 'mb-1' : 'mb-3'} text-xl leading-tight font-semibold tracking-tight min-[761px]:text-2xl`}><a class="hover:text-accent" href={href(course.slug)}>{course.name}</a></h2>
              {#if course.subtitle}<p class="mb-3 text-sm text-muted-contrast min-[761px]:text-base">{course.subtitle}</p>{/if}
              {#if course.intro}<p class="mb-4 text-sm leading-relaxed text-muted-contrast">{course.intro}</p>{/if}
              <div class="mt-auto"><CourseMetadata {course}/></div>
            </div>
          </div>
          <div class="border-t border-frame">
            <a class="flex w-full items-center justify-center px-4 py-2 text-center text-xs font-medium text-accent hover:bg-surface hover:underline" href={href(course.slug)}>Open</a>
          </div>
        </Card>
      {/each}
    </div>
  </div>
</section>
