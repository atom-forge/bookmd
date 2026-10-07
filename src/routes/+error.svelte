<script lang="ts">
  import { page } from '$app/state';
  import ErrorCatalog from '$lib/ErrorCatalog.svelte';
</script>
<ErrorCatalog status={page.status}/>
