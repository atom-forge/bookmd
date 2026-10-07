import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default {
  preprocess: vitePreprocess(),
  kit: {
    paths: { base: process.env.BASE_PATH || '' },
    adapter: adapter(),
    prerender: { entries: ['*'] }
  }
};
