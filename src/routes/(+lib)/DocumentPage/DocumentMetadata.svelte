<script lang="ts">
  import { Chip } from '@atom-forge/ui';
  import CourseMetadata from '../CourseMetadata.svelte';
  import type { PortalPageData } from '$lib/server/page';
  let { page, course }: Pick<PortalPageData, 'page' | 'course'> = $props();
</script>

{#if course && page.slug === course.slug}
  {#if course.image}<img class="mb-6 aspect-video w-full rounded-[var(--radius-control)] object-cover" src={course.image} alt=""/>{/if}
  {#if course.tags.length || course.contentTags.length}<div class="mb-6"><CourseMetadata {course} showIdentity={false}/></div>{/if}
{:else if (page.author && page.author !== course?.author) || page.tags.length}
  <div class="mb-6 flex flex-wrap items-center gap-1.5" aria-label="Document metadata">

    {#if page.author && page.author !== course?.author}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere] bg-primary text-primary-contrast"><span class="sr-only">Author: </span>{page.author}</Chip>{/if}
    {#each page.tags as tag}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere]">{tag}</Chip>{/each}
  </div>
{/if}
