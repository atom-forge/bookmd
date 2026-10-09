import { expect, test } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { buildGraph } from './content';
import { scanDirectory, type DirectoryHandle } from '../src/routes/@dev/directory-index';
import { loadPreview } from '../src/routes/@dev/load-preview';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const course: Record<string, string | Buffer> = {
  'course.md': '---\nname: Parity\nlanguage: en\nauthor: A\ntags: [x]\nimage: img/p.png\nchildren:\n  - "[[ch1.md]]"\n  - "[Second](part/ch2.md)"\n---\n# Parity\n\nIntro [[ch1.md#sub-heading]].',
  'ch1.md': '---\ntype: chapter\ntags: [y]\nchildren: ["[[lesson.md]]"]\n---\n# One\n\n![p](img/p.png)\n\n> [!warning]- Careful\n> nested\n> > [!tip] Inner\n> > text\n\n```ts\nconst a = 1;\n```\n\n```mermaid\ngraph TD; A-->B\n```\n\n$$E=mc^2$$ and $x$\n\n## Sub heading\n\n[ref](part/ch2.md) [file](doc.pdf)',
  'lesson.md': '---\ntype: content\n---\n# Lesson\n\nSee [[ch1.md]].',
  'part/ch2.md': '---\ntype: chapter\nsources: ["[[extra.md]]"]\n---\n# Two\n\nBack to [one](../ch1.md#sub-heading).',
  'part/extra.md': '## Extra\n\nbody',
  'img/p.png': png, 'doc.pdf': Buffer.from('%PDF')
};

// Wraps a real directory in the read-only handle shape used by the browser adapter.
function handleFor(root: string, name: string, entries: Map<string, string | Buffer>): DirectoryHandle {
  const prefix = (path: string) => entries.keys().filter(key => key.startsWith(path));
  const level = (base: string): DirectoryHandle['values'] => async function* () {
    const names = new Set([...prefix(base)].map(key => key.slice(base.length).split('/')[0]));
    for (const entry of names) {
      const full = base + entry;
      if (entries.has(full)) yield { kind: 'file' as const, name: entry, getFile: async () => new File([entries.get(full)!], entry) };
      else yield { kind: 'directory' as const, name: entry, values: level(full + '/') } as DirectoryHandle;
    }
  };
  return { kind: 'directory', name, values: level('') };
}

const normalize = (html: string) => html.replace(/(href|src)="[^"]*"/g, '$1="*"').replace(/id="diagram-\d+-\d+"/g, '');
const shape = (graph: Awaited<ReturnType<typeof buildGraph>>) => ({
  pages: graph.pages.filter(page => page.slug !== '').map(({ html, ...page }) => ({ ...page, html: normalize(html) })),
  navigation: graph.navigation.filter(item => item.slug !== ''),
  courses: graph.courses.map(({ image, ...rest }) => ({ ...rest, hasImage: image !== null })),
  manifest: graph.exportManifest!.map(({ filename, ...rest }) => rest)
});

test('build adapter and browser adapter produce an equivalent course model', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'bookmd-parity-'));
  try {
    // The build side sees the same course below a registry; the preview mounts it as `/course`.
    for (const [path, content] of Object.entries(course)) {
      const file = join(dir, 'course', path);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, content);
    }
    await writeFile(join(dir, 'courses.md'), '---\ncourses: ["[[course/course.md]]"]\n---\n# Catalog');
    const built = await buildGraph(dir, 'courses.md', '', join(dir, 'assets'));
    const index = await scanDirectory(handleFor(dir, 'fx', new Map(Object.entries(course))));
    const preview = await loadPreview(index, 'course.md', (slug, _query, fragment) => `#page=${slug}${fragment}`);
    expect(preview.diagnostics).toEqual([]);
    const compared = shape(built);
    expect(compared.pages.map(page => page.slug).sort()).toEqual(['course', 'course/ch1', 'course/lesson', 'course/part/ch2']);
    expect(compared.pages.find(page => page.slug === 'course/ch1')!.html).toContain('callout');
    expect(compared.pages.find(page => page.slug === 'course/ch1')!.html).toContain('mermaid-source');
    expect(shape(preview.graph)).toEqual(compared);
    preview.dispose();
  } finally { await rm(dir, { recursive: true, force: true }); }
});
