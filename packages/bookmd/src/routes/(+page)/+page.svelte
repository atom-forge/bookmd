<script lang="ts">
  import DocumentPage from '../(+lib)/DocumentPage.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>
<DocumentPage {data}/>
