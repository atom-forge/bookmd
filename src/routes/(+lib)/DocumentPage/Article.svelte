<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { ProseMarkdown } from '@atom-forge/ui';
  let { html, dark = false }: { html: string; dark?: boolean } = $props();
  let container: HTMLDivElement;
  let mounted = $state(false);
  onMount(() => { mounted = true; });
  $effect(() => {
    const current = html;
    const theme = dark;
    if (!mounted) return;
    let cancelled = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    async function diagrams() {
      await tick();
      if (cancelled || !container) return;
      // Restore the source before rendering again after a theme or route change.
      container.innerHTML = current;
      for (const code of container.querySelectorAll<HTMLElement>('pre > code')) {
        const pre = code.parentElement!;
        const wrapper = document.createElement('div');
        wrapper.className = 'not-prose group relative my-6 min-w-0';
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code');
        button.setAttribute('aria-live', 'polite');
        button.className = 'absolute right-2 top-2 z-10 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto cursor-pointer rounded border border-frame bg-canvas px-2.5 py-1 text-xs text-canvas-contrast hover:bg-frame focus-visible:outline-2 focus-visible:outline-accent';
        button.addEventListener('click', async () => {
          button.disabled = true;
          try {
            await navigator.clipboard.writeText(code.textContent || '');
            if (cancelled) return;
            button.textContent = 'Copied!';
          } catch {
            if (cancelled) return;
            button.textContent = 'Copy failed';
          }
          const timer = setTimeout(() => {
            timers.delete(timer);
            if (cancelled) return;
            button.textContent = 'Copy';
            button.disabled = false;
          }, 2000);
          timers.add(timer);
        });
        pre.before(wrapper);
        wrapper.append(pre, button);
        pre.classList.add('!my-0');
        // Highlight.js paints the code element, leaving the pre padding transparent.
        pre.style.backgroundColor = getComputedStyle(code).backgroundColor;
      }
      const nodes = [...container.querySelectorAll<HTMLElement>('.mermaid-source')];
      if (!nodes.length) return;
      const { default: mermaid } = await import('mermaid');
      if (cancelled) return;
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: theme ? 'dark' : 'default', suppressErrorRendering: true });
      for (const [index, node] of nodes.entries()) {
        const source = node.textContent || '';
        try {
          const { svg } = await mermaid.render(`diagram-${Date.now()}-${index}`, source);
          if (cancelled) return;
          node.innerHTML = svg;
          node.classList.add('diagram');
        } catch {
          if (cancelled) return;
          node.textContent = source;
          node.classList.add('diagram-error');
          node.setAttribute('title', 'Invalid Mermaid diagram');
        }
      }
    }
    void diagrams();
    return () => {
      cancelled = true;
      for (const timer of timers) clearTimeout(timer);
    };
  });
</script>
<ProseMarkdown>
  <div class="w-full min-w-0 text-[15px] leading-[1.85] [&_h1]:text-[28px] [&_h1]:tracking-[-0.8px] min-[761px]:[&_h1]:text-[32px] [&_a]:text-accent [&_pre]:overflow-x-auto [&_pre]:rounded-[9px] [&_pre_code]:text-xs [&_img]:max-w-full [&_iframe.math-embed]:my-7 [&_iframe.math-embed]:h-[600px] [&_iframe.math-embed]:w-full [&_iframe.math-embed]:rounded-[10px] [&_iframe.math-embed]:border-0 [&_iframe.youtube]:my-7 [&_iframe.youtube]:aspect-video [&_iframe.youtube]:w-full [&_iframe.youtube]:rounded-[10px] [&_iframe.youtube]:border-0 [&_.mermaid-source]:whitespace-pre-wrap [&_.diagram]:w-full [&_.diagram]:max-w-full [&_.diagram]:overflow-x-auto [&_.diagram]:bg-transparent [&_.diagram_svg]:mx-auto [&_.diagram_svg]:block [&_.diagram_svg]:h-auto [&_.diagram_svg]:max-w-full [&_.diagram-error]:border [&_.diagram-error]:border-error [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:p-2 [&_.callout]:flow-root [&_.callout]:my-6 [&_.callout]:rounded-[var(--radius-control)] [&_.callout]:border [&_.callout]:border-frame [&_.callout]:border-l-[3px] [&_.callout]:border-l-blue-500/60 [&_.callout]:bg-blue-500/10 dark:[&_.callout]:bg-blue-400/10
      [&_.callout:is([data-callout=abstract])]:border-l-cyan-500/60 [&_.callout:is([data-callout=abstract])]:bg-cyan-500/10 dark:[&_.callout:is([data-callout=abstract])]:bg-cyan-400/10
      [&_.callout:is([data-callout=question],[data-callout=example])]:border-l-violet-500/60 [&_.callout:is([data-callout=question],[data-callout=example])]:bg-violet-500/10 dark:[&_.callout:is([data-callout=question],[data-callout=example])]:bg-violet-400/10
      [&_.callout:is([data-callout=success],[data-callout=tip])]:border-l-emerald-500/60 [&_.callout:is([data-callout=success],[data-callout=tip])]:bg-emerald-500/10 dark:[&_.callout:is([data-callout=success],[data-callout=tip])]:bg-emerald-400/10
      [&_.callout:is([data-callout=warning])]:border-l-amber-500/60 [&_.callout:is([data-callout=warning])]:bg-amber-500/10 dark:[&_.callout:is([data-callout=warning])]:bg-amber-400/10
      [&_.callout:is([data-callout=danger],[data-callout=failure],[data-callout=bug])]:border-l-rose-500/60 [&_.callout:is([data-callout=danger],[data-callout=failure],[data-callout=bug])]:bg-rose-500/10 dark:[&_.callout:is([data-callout=danger],[data-callout=failure],[data-callout=bug])]:bg-rose-400/10
      [&_.callout:is([data-callout=quote])]:border-l-slate-500/60 [&_.callout:is([data-callout=quote])]:bg-slate-500/10 dark:[&_.callout:is([data-callout=quote])]:bg-slate-400/10
      [&_.callout-title]:text-blue-700 dark:[&_.callout-title]:text-blue-300
      [&_.callout:is([data-callout=abstract])>.callout-title]:text-cyan-700 dark:[&_.callout:is([data-callout=abstract])>.callout-title]:text-cyan-300
      [&_.callout:is([data-callout=question],[data-callout=example])>.callout-title]:text-violet-700 dark:[&_.callout:is([data-callout=question],[data-callout=example])>.callout-title]:text-violet-300
      [&_.callout:is([data-callout=success],[data-callout=tip])>.callout-title]:text-emerald-700 dark:[&_.callout:is([data-callout=success],[data-callout=tip])>.callout-title]:text-emerald-300
      [&_.callout:is([data-callout=warning])>.callout-title]:text-amber-700 dark:[&_.callout:is([data-callout=warning])>.callout-title]:text-amber-300
      [&_.callout:is([data-callout=danger],[data-callout=failure],[data-callout=bug])>.callout-title]:text-rose-700 dark:[&_.callout:is([data-callout=danger],[data-callout=failure],[data-callout=bug])>.callout-title]:text-rose-300
      [&_.callout:is([data-callout=quote])>.callout-title]:text-slate-700 dark:[&_.callout:is([data-callout=quote])>.callout-title]:text-slate-300 [&_.callout]:text-canvas-contrast [&_.callout]:not-italic [&_.callout-title]:flex [&_.callout-title]:items-center [&_.callout-title]:gap-2.5 [&_.callout>div.callout-title]:mx-4 [&_.callout>div.callout-title]:my-3 [&_details.callout>summary]:px-4 [&_details.callout>summary]:py-3 [&_.callout-title]:text-sm [&_.callout-title]:leading-normal [&_.callout-title]:font-semibold [&_.callout-icon]:m-0 [&_.callout-icon]:shrink-0 [&_.callout-icon]:text-inherit [&_.callout-body]:flow-root [&_.callout-body>*]:mx-4 [&_.callout-body>:first-child]:mt-0 [&_.callout-body>:last-child]:mb-3.5 [&_.callout-body:empty]:min-h-3.5 [&_details.callout>summary]:cursor-pointer [&_details.callout>summary]:list-none [&_details.callout>summary::-webkit-details-marker]:hidden [&_details.callout>summary]:after:ml-auto [&_details.callout>summary]:after:size-[7px] [&_details.callout>summary]:after:shrink-0 [&_details.callout>summary]:after:rotate-[-45deg] [&_details.callout>summary]:after:border-r-2 [&_details.callout>summary]:after:border-b-2 [&_details.callout>summary]:after:content-[''] [&_details.callout[open]>summary]:after:rotate-45 [&_.callout-title]:before:[quotes:none] [&_.callout-title]:after:[quotes:none] [&_.callout-body_p]:before:[quotes:none] [&_.callout-body_p]:after:[quotes:none]" bind:this={container}>{@html html}</div>
</ProseMarkdown>
