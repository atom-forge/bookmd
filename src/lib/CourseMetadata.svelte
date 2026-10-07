<script lang="ts">
  import type { Course } from '../../scripts/content';
  let { course, showTags = true }: { course: Course; showTags?: boolean } = $props();
</script>
<dl class="mb-3 flex items-baseline gap-1.5 text-[11px] leading-normal text-muted-contrast [&_dd]:m-0">
  <div class="shrink-0"><dt class="sr-only">Year</dt><dd>{course.year ?? 'Not specified'}</dd></div>
  <span aria-hidden="true">|</span>
  <div class="shrink-0"><dt class="sr-only">Language</dt><dd>{course.language.toUpperCase()}</dd></div>
  <span aria-hidden="true">|</span>
  <div class="min-w-0"><dt class="sr-only">Instructor</dt><dd>{course.instructor || 'Not specified'}</dd></div>
</dl>
{#if showTags && course.tags.length}
  <div class="mb-6 flex flex-wrap gap-1.5 [&_span]:rounded-[var(--radius-control)] [&_span]:border [&_span]:border-frame [&_span]:px-2 [&_span]:py-[3px] [&_span]:text-[11px] [&_span]:text-muted-contrast" aria-label="Tags">
    {#each course.tags as tag}<span>{tag}</span>{/each}
  </div>
{/if}
