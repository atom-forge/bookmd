#!/usr/bin/env bun
import { cp, mkdir, rm, writeFile, copyFile, access, readFile, symlink } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generate } from './scripts/content';
import { syncSources } from './scripts/git-source';
import { gitEntries } from './scripts/registry';

const engine = dirname(fileURLToPath(import.meta.url));
const [command, ...args] = process.argv.slice(2);
const commands = ['dev', 'build', 'check', 'content', 'preview', 'sources'];
if (!commands.includes(command)) {
  console.error('Usage: bookmd dev|build|check|content|preview|sources [--config FILE] [-- VITE_ARGS]');
  process.exit(1);
}
let configFile = resolve('portal.config.ts');
let forwarded: string[] = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--') { forwarded = args.slice(i + 1); break; }
  if (args[i] !== '--config' || !args[i + 1]) throw new Error(`Unknown or incomplete argument: ${args[i]}`);
  configFile = resolve(args[++i]);
}
const instance = dirname(configFile);
const work = resolve(instance, '.bookmd');
const output = resolve(instance, 'build');
const config = (await import(pathToFileURL(configFile).href)).default;
if (!config || typeof config.contentRoot !== 'string' || typeof config.entrypoint !== 'string') {
  throw new Error('BookMD config requires contentRoot and entrypoint strings.');
}
const contentRoot = resolve(instance, config.contentRoot);
const base = process.env.BASE_PATH ?? config.basePath ?? '';
if (typeof base !== 'string' || (base !== '' && (!base.startsWith('/') || base.endsWith('/') || /[?#\\]/.test(base)))) {
  throw new Error('basePath/BASE_PATH must be empty or a leading-slash path without a trailing slash.');
}
for (const writable of [work, output]) {
  const rel = relative(writable, contentRoot);
  const reverse = relative(contentRoot, writable);
    const contains = (path: string) => path === '' || (!path.startsWith('..') && !isAbsolute(path));
    if (contains(rel) || contains(reverse)) throw new Error('Content root must not overlap the work or output directory.');
}
await access(resolve(contentRoot, config.entrypoint));
await mkdir(work, { recursive: true });
if (command === 'sources') {
  // Resolves and downloads the Git course sources of the registry; any failure aborts without a partial result.
  const entries = await gitEntries(contentRoot, config.entrypoint);
  if (!entries.length) { console.log('No Git course sources in the registry.'); process.exit(0); }
  let sources;
  try { sources = await syncSources(entries, work); }
  catch (error) { console.error(`Error: ${error instanceof Error ? error.message : error}`); process.exit(1); }
  for (const source of sources) console.log(`${source.commit}  ${source.normalized}  (${source.refKind})`);
  await writeFile(resolve(work, 'course-sources.json'), JSON.stringify({ schemaVersion: 1, sources: sources.map(source => ({ source: source.normalized, commit: source.commit })) }, null, 2) + '\n');
  process.exit(0);
}
const manifest = JSON.parse(await readFile(resolve(engine, 'package.json'), 'utf8'));
for (const name of Object.keys(manifest.dependencies)) {
  let root = dirname(fileURLToPath(import.meta.resolve(`${name}/package.json`)));
  const link = resolve(work, 'node_modules', name);
  await mkdir(dirname(link), { recursive: true });
  await rm(link, { recursive: true, force: true });
  await symlink(root, link, 'dir');
}
// SvelteKit discovers a normal app in disposable instance-owned storage, never in the installed package.
for (const directory of ['src', 'scripts']) {
  await rm(resolve(work, directory), { recursive: true, force: true });
  await cp(resolve(engine, directory), resolve(work, directory), {
    recursive: true, filter: path => !path.includes('/generated/') && !path.endsWith('.test.ts')
  });
}
await cp(resolve(engine, 'tsconfig.json'), resolve(work, 'tsconfig.json'));
await writeFile(resolve(work, 'package.json'), JSON.stringify({ type: 'module', private: true }));
await writeFile(resolve(work, 'svelte.config.js'), `import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default { preprocess: vitePreprocess(), kit: { paths: { base: ${JSON.stringify(base)} }, adapter: adapter({ pages: ${JSON.stringify(output)}, assets: ${JSON.stringify(output)} }), prerender: { entries: ['*'] } } };
`);
const settings = { contentRoot, entrypoint: config.entrypoint, title: config.title };
await writeFile(resolve(work, 'vite.config.ts'), `import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { generate } from './scripts/content';
import { syncSources } from './scripts/git-source';
import { gitEntries } from './scripts/registry';
export default defineConfig({ ssr: { noExternal: ['@atom-forge/ui', 'lucide-svelte'] }, plugins: [tailwindcss(), sveltekit(), {
  name: 'bookmd-content', configureServer(server) {
    const root = ${JSON.stringify(contentRoot)};
    server.watcher.add(root);
    let pending: ReturnType<typeof setTimeout>;
    server.watcher.on('all', (_event, file) => {
      if (!file.startsWith(root + '/')) return;
      clearTimeout(pending);
      pending = setTimeout(async () => {
        try { await generate(${JSON.stringify(settings)}, ${JSON.stringify(work)}, ${JSON.stringify(base)}); server.ws.send({ type: 'full-reload' }); }
        catch (error) { console.error(error); }
      }, 150);
    });
  }
}] });
`);
await generate(settings, work, base);
async function run(bin: string, arguments_: string[]) {
  const packageName = bin.startsWith('@') ? bin.split('/').slice(0, 2).join('/') : bin.split('/')[0];
    let root = dirname(fileURLToPath(import.meta.resolve(packageName)));
    while (true) {
      try { if (JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).name === packageName) break; } catch {}
      const parent = dirname(root);
      if (parent === root) throw new Error(`Cannot locate executable package ${packageName}`);
      root = parent;
    }
    const executable = resolve(root, bin.slice(packageName.length + 1));
  const child = Bun.spawn(['node', executable, ...arguments_], { cwd: work, stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' });
  const stop = () => child.kill();
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
  const code = await child.exited;
  process.off('SIGINT', stop); process.off('SIGTERM', stop);
  if (code) process.exit(code);
}
if (command === 'check') {
  await run('@sveltejs/kit/svelte-kit.js', ['sync']);
  await run('svelte-check/bin/svelte-check', ['--tsconfig', './tsconfig.json']);
} else if (command !== 'content') {
  await run('vite/bin/vite.js', [command === 'dev' ? 'dev' : command === 'preview' ? 'preview' : 'build', ...forwarded]);
  if (command === 'build') await copyFile(resolve(output, '404/index.html'), resolve(output, '404.html'));
}
