import { buildGraph } from './content';
import { resolve } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
const [root, entrypoint, course] = process.argv.slice(2);
if (!root || !entrypoint || !course) throw new Error('Usage: export-manifest.ts CONTENT_ROOT ENTRYPOINT COURSE_SLUG');
const assets = await mkdtemp(resolve(tmpdir(), 'course-export-'));
try {
  const graph = await buildGraph(resolve(root), entrypoint, '', assets);
  if (!graph.courses.some(item => item.slug === course)) throw new Error(`Unknown course: ${course}`);
  console.log(JSON.stringify({ entries: graph.exportManifest?.filter(item => item.course === course),
    titles: Object.fromEntries(graph.pages.map(page => [page.slug, page.title])) }));
} finally { await rm(assets, { recursive: true, force: true }); }
