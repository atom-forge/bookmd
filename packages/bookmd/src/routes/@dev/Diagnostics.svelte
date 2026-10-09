<script lang="ts">
  import type { ContentDiagnostic } from '../../core/content';
  import { folderPath } from './preview-source';
  let { items, error }: { items: ContentDiagnostic[]; error?: string | null } = $props();
</script>

{#if error}
  <p class="mx-5 my-3 rounded-[var(--radius-control)] border border-error px-3 py-2 text-sm" role="alert">{error}</p>
{/if}
{#if items.length}
  <details class="border-b border-frame bg-canvas" open={items.length <= 5}>
    <summary class="mx-5 my-2 cursor-pointer text-sm font-medium text-warning">{items.length} {items.length === 1 ? 'problem' : 'problems'} in the course</summary>
    <ul class="mx-5 mt-1 mb-3 flex flex-col gap-2 text-sm">
      {#each items as item}
        <li class="min-w-0"><code class="break-all">{folderPath(item.file) ?? item.file}</code>: <code class="break-all">{item.target}</code> — <span class="break-words">{item.message}</span></li>
      {/each}
    </ul>
  </details>
{/if}
