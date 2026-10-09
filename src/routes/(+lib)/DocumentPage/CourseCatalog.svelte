<script lang="ts">
  import { usePageHref } from '../page-href';
  import { Button, Card, Input } from '@atom-forge/ui';
    import { Search } from 'lucide-svelte';
    import { filterCourses } from './course-search';
  import CourseMetadata from '../CourseMetadata.svelte';
  import type { Course } from '../../../core/content';
  let { courses }: { courses: Course[] } = $props();
  const href = usePageHref();
    let query = $state('');
    let searchInput: Input | undefined = $state();
    const results = $derived(filterCourses(courses, query));
    const searchId = $props.id();

    function clearSearch() {
      query = '';
      searchInput?.focus();
    }
</script>
<section class="mt-6 flex flex-col" aria-label="Courses">
  <div class="mb-4 flex flex-col gap-2">
    <label for={searchId} class="text-sm font-medium">Search courses</label>
    <div class="flex flex-wrap items-center gap-2">
      <Input id={searchId} bind:this={searchInput} bind:value={query} icon={Search} placeholder="Name, author, description or tags" aria-describedby={`${searchId}-count`} class="min-w-0 flex-1"/>
      <Button label="Clear search" ghost disabled={!query.length} onclick={clearSearch}/>
    </div>
    <p id={`${searchId}-count`} role="status" aria-atomic="true" class="text-sm text-muted-contrast">
      {results.length} of {courses.length} courses
      {#if courses.length && !results.length} — No courses match your search. Try different words or clear the search.{/if}
      {#if !courses.length} — No courses available yet.{/if}
    </p>
  </div>
  <div class="grid grid-cols-1 gap-4 min-[761px]:grid-cols-2 min-[1201px]:grid-cols-4">
    {#each results as course (course.slug)}
      <Card elevate={1} class="flex h-full flex-col overflow-hidden">
        {#if course.image}<img class="aspect-video w-full object-cover" src={course.image} alt="" loading="lazy"/>{/if}
        <div class="flex flex-1 flex-col">
          <div class="mx-4 my-4 flex flex-1 flex-col min-[761px]:mx-5 min-[761px]:my-5">

            <h2 class="mb-3 text-xl leading-tight font-semibold tracking-tight min-[761px]:text-2xl"><a class="hover:text-accent" href={href(course.slug)}>{course.name}</a></h2>
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

</section>
