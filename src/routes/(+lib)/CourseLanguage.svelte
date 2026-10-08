<script lang="ts">
  let { language }: { language?: string | null } = $props();
  const code = $derived(language?.trim().toUpperCase());
  const label = $derived(code === 'HU' ? 'Hungarian' : code === 'EN' ? 'English' : code);
</script>

{#if code}
  <span class="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-frame bg-canvas text-[10px] leading-none font-semibold tracking-normal text-muted-contrast" role="img" aria-label={`Language: ${label}`} title={label}>{code}</span>
{/if}
