<script lang="ts">
  import '../app.css';
  import 'katex/dist/katex.min.css';
  import 'highlight.js/styles/github-dark.css';
  import { Root } from '@atom-forge/ui';
  let { children } = $props();
</script>
<Root><div class="[&_a]:no-underline [&_*:focus-visible]:outline-2 [&_*:focus-visible]:outline-accent [&_*:focus-visible]:outline-offset-4">{@render children()}</div></Root>
