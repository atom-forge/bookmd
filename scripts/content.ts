import { readFile, readdir, writeFile, mkdir, copyFile, realpath, rm, cp, mkdtemp, appendFile, stat } from 'node:fs/promises';
import { resolve, relative, extname, sep, isAbsolute, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { processContent, type ContentGraph } from '../src/core/content';
import { assemble, type Assembly, type BookValidator } from './assemble';
import type { Pins } from './git-source';
import { gitEntries } from './registry';
export * from '../src/core/content';

export async function buildGraph(contentRoot: string, entrypoint: string, base = '', assetDir = resolve('static/content-assets'), titleFallback = 'BookMD', sealed: string[] = []): Promise<ContentGraph> {
  const root = await realpath(contentRoot);
  async function physical(path: string) {
    const lexical = resolve(root, '.' + path);
    const rel = relative(root, lexical);
    if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) throw new Error(`Content escapes root: ${path}`);
    return { file: await realpath(lexical), rel };
  }
  await mkdir(assetDir, { recursive: true });
  return processContent({
    async resolve(path) { return '/' + (await physical(path)).rel.split(sep).join('/'); },
    async readText(path) { return readFile((await physical(path)).file, 'utf8'); },
    async list(path) {
      try {
        return (await readdir((await physical(path)).file, { withFileTypes: true })).filter(entry => !entry.isDirectory()).map(entry => entry.name);
      } catch (error) {
        if ((error as { code?: string }).code === 'ENOENT' || (error as { code?: string }).code === 'ENOTDIR') return [];
        throw error;
      }
    },
    // Each file keeps its own name, in a folder named by the hash of its place, so equal names cannot collide.
    async assetUrl(path, base) {
      const { file, rel } = await physical(path);
      const folder = createHash('sha256').update(rel).digest('hex').slice(0, 16);
      const name = basename(file);
      await mkdir(resolve(assetDir, folder), { recursive: true });
      await copyFile(file, resolve(assetDir, folder, name));
      return `${base}/content-assets/${folder}/${encodeURIComponent(name)}`;
    },
    async assetSize(path) { return (await stat((await physical(path)).file)).size; }
  }, entrypoint, { base, title: titleFallback, rootName: basename(root), sealed });
}

/** Builds one book on its own, in a throw-away catalog; a problem inside the book is thrown. */
function bookValidator(config: { title?: string }, workRoot: string, base: string): BookValidator {
  return async (checked, id) => {
    const directory = await mkdtemp(resolve(workRoot, 'validate-'));
    try {
      await cp(checked.contentRoot, resolve(directory, 'book', id), { recursive: true, filter: path => !basename(path).startsWith('.') });
      await writeFile(resolve(directory, 'book', 'courses.md'), `---\nbooks:\n  - "[[${id}/${checked.entrypoint}]]"\n---\n# Catalog\n`);
      await buildGraph(resolve(directory, 'book'), 'courses.md', base, resolve(directory, 'assets'), config.title, ['/' + id]);
    } finally { await rm(directory, { recursive: true, force: true }); }
  };
}

const largeFile = 25 * 1024 * 1024, largeSite = 500 * 1024 * 1024;
/** Warns about assets that are heavy for a static host (GitHub Pages: 1 GB per site, 100 MB per file). */
export async function largeAssetWarnings(assetDir: string): Promise<string[]> {
  const files: { path: string; size: number }[] = [];
  for (const folder of await readdir(assetDir).catch(() => [])) {
    for (const name of await readdir(resolve(assetDir, folder)).catch(() => [])) files.push({ path: `${folder}/${name}`, size: (await stat(resolve(assetDir, folder, name))).size });
  }
  const mb = (bytes: number) => `${Math.round(bytes / 1048576)} MB`;
  const total = files.reduce((sum, file) => sum + file.size, 0);
  return [
    ...files.filter(file => file.size >= largeFile).map(file => `Large file ${mb(file.size)}: content-assets/${file.path}`),
    ...(total >= largeSite ? [`The files of the books add up to ${mb(total)}; GitHub Pages allows 1 GB per site`] : [])
  ];
}

/** Tells the author, in the log and (on GitHub Actions) as annotations and in the job summary, what was left out. */
export async function reportAssembly(assembly: Pick<Assembly, 'skipped' | 'fallbacks'>, extra: string[] = []): Promise<void> {
  const lines = [
    ...extra,
    ...assembly.fallbacks.map(item => `${item.source}: the new version does not build, the last good version ${item.used.slice(0, 12)} is published instead. ${item.reason}`),
    ...assembly.skipped.map(item => `${item.source}: left out of the site. ${item.reason}`)
  ];
  for (const line of lines) console.warn(process.env.GITHUB_ACTIONS ? `::warning::${line.replace(/\r?\n/g, ' ')}` : `Warning: ${line}`);
  if (lines.length && process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `**Books that need attention:**\n\n${lines.map(line => `- ${line.replace(/\r?\n/g, ' ')}`).join('\n')}\n\n`).catch(() => {});
}

export async function generate(config: { contentRoot: string; entrypoint: string; title?: string }, workRoot = process.cwd(), base = process.env.BASE_PATH || '', options: { refresh?: boolean; pins?: Pins; fallbacks?: Pins } = {}) {
  const output = (path: string) => resolve(workRoot, path);
  await rm(output('static/content-assets'), { recursive: true, force: true });
  // Git course sources are downloaded and combined with the local content first. A book that does not build is
  // replaced by its last good version, or left out, so it cannot hold back the others.
  const assembly = await assemble(config, workRoot, await gitEntries(config.contentRoot, config.entrypoint), { ...options, validate: bookValidator(config, workRoot, base) });
  const graph = await buildGraph(resolve(assembly.contentRoot), assembly.entrypoint, base, output('static/content-assets'), config.title, assembly.sealed);
  await reportAssembly(assembly, await largeAssetWarnings(output('static/content-assets')));
  await mkdir(output('src/lib/generated'), { recursive: true });
  await writeFile(output('src/lib/generated/content.json'), JSON.stringify(graph));
  await writeFile(output('src/lib/generated/catalog.json'), JSON.stringify({ branding: graph.branding || '', page: graph.pages.find(page => page.slug === '')!, courses: graph.courses }));
  await writeFile(output('static/.nojekyll'), '');
  console.log(`Generated ${graph.pages.length} pages in ${graph.courses.length} courses${assembly.sources.length ? ` (${assembly.sources.length} from Git)` : ''}.`);
  return { graph, assembly };
}
