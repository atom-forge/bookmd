import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { generate } from './scripts/content';
import config from './portal.config';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), {
    name: 'markdown-content',
    configureServer(server) {
      const root = resolve(config.contentRoot);
      server.watcher.add(root);
      let pending: ReturnType<typeof setTimeout>;
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(root + '/')) return;
        clearTimeout(pending);
        pending = setTimeout(async () => {
          try { await generate(); server.ws.send({ type: 'full-reload' }); }
          catch (error) { console.error(error); }
        }, 150);
      });
    }
  }]
});
