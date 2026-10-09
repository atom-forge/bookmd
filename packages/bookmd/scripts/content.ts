import { readFile, writeFile, mkdir, copyFile, realpath, rm } from 'node:fs/promises';
import { resolve, relative, extname, sep, isAbsolute, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { processContent, type ContentGraph } from '../src/core/content';
export * from '../src/core/content';

export async function buildGraph(contentRoot: string, entrypoint: string, base = '', assetDir = resolve('static/content-assets'), titleFallback = 'BookMD'): Promise<ContentGraph> {
  const root = await realpath(contentRoot);
  async function physical(path: string) {
    const file = await realpath(resolve(root, '.' + path));
    const rel = relative(root, file);
    if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) throw new Error(`Content escapes root: ${path}`);
    return file;
  }
  await mkdir(assetDir, { recursive: true });
  return processContent({
    async resolve(path) { return '/' + relative(root, await physical(path)).split(sep).join('/'); },
    async readText(path) { return readFile(await physical(path), 'utf8'); },
    async assetUrl(path, base) {
      const file = await physical(path);
      const name = `${createHash('sha256').update(relative(root, file)).digest('hex').slice(0, 16)}${extname(file)}`;
      await copyFile(file, resolve(assetDir, name));
      return `${base}/content-assets/${name}`;
    }
  }, entrypoint, { base, title: titleFallback, rootName: basename(root) });
}

export async function generate(config: { contentRoot: string; entrypoint: string; title?: string }, workRoot = process.cwd(), base = process.env.BASE_PATH || '') {
  const output = (path: string) => resolve(workRoot, path);
  await rm(output('static/content-assets'), { recursive: true, force: true });
  const graph = await buildGraph(resolve(config.contentRoot), config.entrypoint, base, output('static/content-assets'), config.title);
  await mkdir(output('src/lib/generated'), { recursive: true });
  await writeFile(output('src/lib/generated/content.json'), JSON.stringify(graph));
  await writeFile(output('src/lib/generated/catalog.json'), JSON.stringify({ branding: graph.branding || '', page: graph.pages.find(page => page.slug === '')!, courses: graph.courses }));
  await writeFile(output('static/.nojekyll'), '');
  console.log(`Generated ${graph.pages.length} pages in ${graph.courses.length} courses.`);
  return graph;
}
