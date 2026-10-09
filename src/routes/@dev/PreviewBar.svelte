<script lang="ts">
  import { Button } from '@atom-forge/ui';
  import { FileText, FolderOpen, RefreshCw } from 'lucide-svelte';
  let { folder, entry, stale, busy, onreload, onentry, onfolder }: {
    folder: string; entry: string; stale: boolean; busy: boolean;
    onreload: () => void; onentry: () => void; onfolder: () => void;
  } = $props();
</script>

<div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-frame bg-surface" role="region" aria-label="Local course preview">
  <span class="mx-5 mt-2 mb-2 text-[10px] font-bold tracking-[1.5px] text-muted-contrast min-[900px]:mr-0">LOCAL PREVIEW</span>
  <span class="mx-5 my-1 min-w-0 flex-1 break-all text-xs min-[900px]:mx-0" title="{folder}/{entry}"><strong>{folder}</strong> / {entry}</span>
  {#if stale}<span class="mx-5 text-xs text-warning min-[900px]:mx-0" role="status">Showing the last successful load</span>{/if}
  <div class="mx-5 mt-1 mb-1 flex flex-wrap gap-2 min-[900px]:mt-1">
    <Button compact outline icon={RefreshCw} label="Reload" loading={busy} onclick={onreload}/>
    <Button compact outline icon={FileText} label="Entry file" onclick={onentry}/>
    <Button compact outline icon={FolderOpen} label="Folder" onclick={onfolder}/>
  </div>
</div>
