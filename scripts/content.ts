import { readFile, readdir, writeFile, mkdir, copyFile, realpath, rm } from 'node:fs/promises';
import { resolve, relative, extname, sep, isAbsolute, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { processContent, type ContentGraph } from '../src/core/content';
import { assemble } from './assemble';
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
    async assetUrl(path, base) {
      const { file, rel } = await physical(path);
      const name = `${createHash('sha256').update(rel).digest('hex').slice(0, 16)}${extname(file)}`;
      await copyFile(file, resolve(assetDir, name));
      return `${base}/content-assets/${name}`;
    }
  }, entrypoint, { base, title: titleFallback, rootName: basename(root), sealed });
}

export async function generate(config: { contentRoot: string; entrypoint: string; title?: string }, workRoot = process.cwd(), base = process.env.BASE_PATH || '', options: { refresh?: boolean; pins?: Pins } = {}) {
  const output = (path: string) => resolve(workRoot, path);
  await rm(output('static/content-assets'), { recursive: true, force: true });
  // Git course sources are downloaded and combined with the local content first.
  const assembly = await assemble(config, workRoot, await gitEntries(config.contentRoot, config.entrypoint), options);
  const graph = await buildGraph(resolve(assembly.contentRoot), assembly.entrypoint, base, output('static/content-assets'), config.title, assembly.sealed);
  await mkdir(output('src/lib/generated'), { recursive: true });
  await writeFile(output('src/lib/generated/content.json'), JSON.stringify(graph));
  await writeFile(output('src/lib/generated/catalog.json'), JSON.stringify({ branding: graph.branding || '', page: graph.pages.find(page => page.slug === '')!, courses: graph.courses }));
  await writeFile(output('static/.nojekyll'), '');
  console.log(`Generated ${graph.pages.length} pages in ${graph.courses.length} courses${assembly.sources.length ? ` (${assembly.sources.length} from Git)` : ''}.`);
  return graph;
}
