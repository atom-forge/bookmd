<script lang="ts">
  import { Button, Input } from '@atom-forge/ui';
  import { Search } from 'lucide-svelte';
  import type { EntryCandidate } from './entry-candidates';
  let { folder, candidates, value = $bindable(), truncated, onconfirm, oncancel }: {
    folder: string; candidates: EntryCandidate[]; value: string | null; truncated: boolean;
    onconfirm: () => void; oncancel?: () => void;
  } = $props();
  let query = $state('');
  const shown = $derived(candidates.filter(candidate => candidate.path.toLowerCase().includes(query.trim().toLowerCase())));
  const id = $props.id();
</script>

<section class="mx-auto mt-12 mb-16 flex w-full max-w-2xl flex-col" aria-labelledby="{id}-title">
  <h1 id="{id}-title" class="mx-5 text-2xl font-semibold tracking-tight">Choose the entry file</h1>
  <p class="mx-5 mt-2 text-muted-contrast">Folder <strong class="break-all">{folder}</strong>. Pick the course Markdown file to render.</p>
  {#if truncated}<p class="mx-5 mt-2 text-sm text-warning" role="status">The folder is very large; only the first files were listed.</p>{/if}
  {#if candidates.length}
    <Input class="mx-5 mt-5" bind:value={query} icon={Search} placeholder="Filter by path" aria-label="Filter Markdown files"/>
    <fieldset class="mx-5 mt-4 max-h-[50dvh] min-w-0 overflow-y-auto rounded-[var(--radius-control)] border border-frame">
      <legend class="sr-only">Markdown files</legend>
      {#each shown as candidate (candidate.path)}
        <label class="flex cursor-pointer items-start gap-3 border-b border-frame px-3 py-2 last:border-b-0 hover:bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
          <input class="mt-1.5 accent-[var(--color-accent)]" type="radio" name="{id}-entry" value={candidate.path} bind:group={value}/>
          <span class="min-w-0 break-all text-sm leading-relaxed">{candidate.path}
            {#if candidate.highlighted}<span class="ml-1 rounded bg-accent px-1.5 py-0.5 align-middle text-[10px] font-semibold text-accent-contrast">suggested</span>{/if}
          </span>
        </label>
      {:else}
        <p class="mx-3 my-3 text-sm text-muted-contrast">No file matches the filter.</p>
      {/each}
    </fieldset>
  {:else}
    <p class="mx-5 mt-5" role="alert">This folder has no Markdown files.</p>
  {/if}
  <div class="mx-5 mt-5 flex flex-wrap gap-3">
    <Button accent label="Render preview" disabled={value === null} onclick={onconfirm}/>
    {#if oncancel}<Button outline label="Cancel" onclick={oncancel}/>{/if}
  </div>
</section>
