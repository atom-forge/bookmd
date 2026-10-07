<script lang="ts">
  import { base } from '$app/paths';
  import { Card } from '@atom-forge/ui';
  import CourseMetadata from './CourseMetadata.svelte';
  import type { Course } from '../../scripts/content';
  let { courses }: { courses: Course[] } = $props();
</script>
<section class="mt-6" aria-label="Courses">
  <div class="grid grid-cols-1 gap-4 min-[761px]:grid-cols-2 min-[1201px]:grid-cols-4">
    {#each courses as course}
      <Card elevate={1} class="flex h-full flex-col overflow-hidden">
        {#if course.image}<img class="aspect-video w-full object-cover" src={course.image} alt="" loading="lazy"/>{/if}
        <div class="flex flex-1 flex-col p-4 min-[761px]:p-5">
          <CourseMetadata {course} showTags={false}/>
          <h2 class="mb-3 text-xl leading-tight font-semibold tracking-tight min-[761px]:text-2xl"><a class="hover:text-accent" href={`${base}/${course.slug.split('/').map(encodeURIComponent).join('/')}/`}>{course.name}</a></h2>
          {#if course.intro}<p class="mb-4 text-sm leading-relaxed text-muted-contrast">{course.intro}</p>{/if}
          {#if course.tags.length}
            <div class="mt-auto flex flex-wrap gap-1.5" aria-label="Tags">
              {#each course.tags as tag}<span class="rounded-[var(--radius-control)] border border-frame px-2 py-0.5 text-[10px] text-muted-contrast">{tag}</span>{/each}
            </div>
          {/if}
        </div>
        <div class="border-t border-frame">
          <a class="flex w-full items-center justify-center px-4 py-2 text-center text-xs font-medium text-accent hover:bg-surface hover:underline" href={`${base}/${course.slug.split('/').map(encodeURIComponent).join('/')}/`}>Open course</a>
        </div>
      </Card>
    {/each}
  </div>
  {#if !courses.length}<p class="py-8 text-muted-contrast">No courses available yet.</p>{/if}
</section>
