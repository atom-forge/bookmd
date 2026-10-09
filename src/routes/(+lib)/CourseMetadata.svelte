<script lang="ts">
  import { Chip } from '@atom-forge/ui';
  import type { Course } from '../../core/content';
  let { course, showIdentity = true }: { course: Course; showIdentity?: boolean } = $props();
  let expanded = $state(false);
  const limit = 4;
  const id = $props.id();
  const hiddenCount = $derived(Math.max(0, course.contentTags.length - limit));
</script>

{#if (showIdentity && (course.language || course.author)) || course.tags.length || course.contentTags.length}
  <div class="flex flex-wrap items-center gap-1.5" aria-label="Course metadata">
    {#if showIdentity && course.language}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere] bg-accent text-accent-contrast"><span class="sr-only">Language: </span>{course.language}</Chip>{/if}
    {#if showIdentity && course.author}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere] bg-primary text-primary-contrast"><span class="sr-only">Author: </span>{course.author}</Chip>{/if}
    {#each course.tags as tag}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere]">{tag}</Chip>{/each}
    {#each course.contentTags.slice(0, limit) as tag}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere] bg-muted text-muted-contrast">{tag}</Chip>{/each}
    {#if hiddenCount}
      <span id={id} class="contents" hidden={!expanded}>
        {#if expanded}
          {#each course.contentTags.slice(limit) as tag}<Chip class="text-[10px] uppercase max-w-full whitespace-normal [overflow-wrap:anywhere] bg-muted text-muted-contrast">{tag}</Chip>{/each}
        {/if}
      </span>
      <button type="button" class="rounded px-2 py-1 text-[10px] uppercase text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" aria-expanded={expanded} aria-controls={id} aria-label={expanded ? `${course.name}: kevesebb címke` : `${course.name}: ${hiddenCount} további címke`} onclick={() => expanded = !expanded}>
        {expanded ? 'Kevesebb' : `+${hiddenCount} további`}
      </button>
    {/if}
  </div>
{/if}
