<script lang="ts">
  import { Download } from 'lucide-svelte';
  import type { ContentPage } from '../../../core/content';
  let { attachments, class: classes }: { attachments: ContentPage['attachments']; class?: string } = $props();
  function sizeLabel(bytes: number | null) {
    if (bytes === null) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
</script>

{#if attachments.length}
  <section class={`border-t border-frame ${classes ?? ''}`} aria-label="Downloads">
    <h2 class="mt-4 text-[10px] font-bold tracking-[1.5px] text-muted-contrast uppercase">Downloads ({attachments.length})</h2>
    <ul class="mt-2 mb-4">
      {#each attachments as file}
        <li class="py-0.5 text-[13px] leading-relaxed [overflow-wrap:anywhere]">
          <a class="inline-flex items-center gap-2 text-accent hover:underline" href={file.url} download={file.name}>
            <Download size={14} aria-hidden="true"/>{file.name}
          </a>
          {#if file.size !== null}<span class="ml-2 text-muted-contrast">{sizeLabel(file.size)}</span>{/if}
        </li>
      {/each}
    </ul>
  </section>
{/if}
