import type { LanguageFn } from 'highlight.js';

/**
 * Svelte for highlight.js: HTML with `{expressions}` and the block tags `{#if}`, `{:else}`, `{/if}`, `{@render}`.
 * The `<script>` and `<style>` elements are matched first, so braces in them stay JavaScript and CSS.
 */
export const svelte: LanguageFn = hljs => ({
  name: 'Svelte',
  aliases: ['sveltehtml'],
  subLanguage: 'xml',
  contains: [
    hljs.COMMENT('<!--', '-->', { relevance: 10 }),
    { begin: /<script[^>]*>/, end: /<\/script>/, beginScope: 'tag', endScope: 'tag', subLanguage: 'javascript', excludeBegin: false, returnBegin: false },
    { begin: /<style[^>]*>/, end: /<\/style>/, beginScope: 'tag', endScope: 'tag', subLanguage: 'css' },
    {
      begin: /\{/, end: /\}/, subLanguage: 'javascript',
      contains: [{ begin: /[#:/@]\w+/, className: 'keyword' }]
    }
  ]
});
