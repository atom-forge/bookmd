<script lang="ts">
  import { Button, EmptyState } from '@atom-forge/ui';
  import { FolderOpen, FolderX, History } from 'lucide-svelte';
  let { supported, busy, restore, oncontinue, onpick }: {
    supported: boolean; busy: boolean; restore: { folder: string; entry: string } | null;
    oncontinue: () => void; onpick: () => void;
  } = $props();
</script>

<section class="mx-auto mt-16 mb-16 flex max-w-xl flex-col" aria-labelledby="preview-title">
  <h1 id="preview-title" class="mx-5 text-2xl font-semibold tracking-tight">Local book preview</h1>
  <p class="mx-5 mt-3 text-muted-contrast">Check a book folder on this computer with the same renderer as the published portal.</p>
  {#if supported && restore}
    <p class="mx-5 mt-6 break-all">Last time: <strong>{restore.folder}</strong> / {restore.entry}</p>
    <div class="mx-5 mt-3 flex flex-wrap gap-3">
      <Button accent icon={History} label="Continue with this folder" loading={busy} onclick={oncontinue}/>
      <Button outline icon={FolderOpen} label="Choose another folder" onclick={onpick}/>
    </div>
  {:else if supported}
    <div class="mx-5 mt-6"><Button accent icon={FolderOpen} label="Open book folder" loading={busy} onclick={onpick}/></div>
  {:else}
    <EmptyState class="mt-6" icon={FolderX} title="Folder access is not available" description="Open this page in desktop Chrome or Edge over HTTPS or localhost."/>
  {/if}
  <ul class="mx-5 mt-8 list-disc pl-5 text-sm text-muted-contrast">
    <li>Files are only read in your browser. Nothing is uploaded or modified.</li>
    <li>Embedded external content, such as videos, can still make network requests.</li>
    <li>The folder choice is remembered in this browser; after a page reload Chrome may ask for read access again.</li>
  </ul>
</section>
