<script lang="ts">
  import { Chip } from '@atom-forge/ui';
  import CourseMetadata from '../CourseMetadata.svelte';
  import type { PortalPageData } from '$lib/portal-page';
  let { page, course }: Pick<PortalPageData, 'page' | 'course'> = $props();
  // The authors of a page are shown only when they differ from the authors of the book.
  const ownAuthors = $derived(page.authors.join('\n') !== (course?.authors ?? []).join('\n') ? page.authors : []);
  const bookInfo = $derived(course ? [course.released ? `Released ${course.released}` : '', course.copyright, course.license].filter(Boolean) : []);
</script>

{#if course && page.slug === course.slug}
  {#if course.image}<img class="mb-6 aspect-video w-full rounded-[var(--radius-control)] object-cover" src={course.image} alt=""/>{/if}
  {#if course.tags.length || course.contentTags.length}<div class="mb-6"><CourseMetadata {course} showIdentity={false}/></div>{/if}
  {#if bookInfo.length}<p class="mb-6 text-xs text-muted-contrast" aria-label="Book information">{bookInfo.join(' · ')}</p>{/if}
{:else if ownAuthors.length || page.tags.length}
  <div class="mb-6 flex flex-wrap items-center gap-1.5" aria-label="Document metadata">

    {#each ownAuthors as author}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere] bg-primary text-primary-contrast"><span class="sr-only">Author: </span>{author}</Chip>{/each}
    {#each page.tags as tag}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere]">{tag}</Chip>{/each}
  </div>
{/if}
