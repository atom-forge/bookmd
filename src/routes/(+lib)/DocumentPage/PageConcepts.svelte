<script lang="ts">
  let { requires, teaches, class: classes }: { requires: string[]; teaches: string[]; class?: string } = $props();
  const groups = $derived([
    { label: 'Prerequisites', concepts: requires },
    { label: 'Teaches', concepts: teaches }
  ].filter(group => group.concepts.length));
</script>

{#if groups.length}
  <div class={classes}>
    {#each groups as group, index}
      <section class={`border-t border-frame ${index === groups.length - 1 ? 'border-b' : ''}`} aria-label={group.label}>
        <h2 class="mt-4 text-[10px] font-bold tracking-[1.5px] text-muted-contrast uppercase">{group.label} ({group.concepts.length})</h2>
        <ul class="mt-2 mb-4">
          {#each group.concepts as concept}
            <li class="py-0.5 text-[13px] leading-relaxed [overflow-wrap:anywhere]">{concept}</li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
{/if}
