import { test, expect } from 'bun:test';
import { processContent, type ContentSource } from './content';
import { breadcrumbPath } from '../lib/breadcrumb';
import { courseMenu } from '../lib/course-menu';

function memory(files: Record<string, string>): ContentSource {
  return {
    async resolve(path) {
      if (!(path in files)) throw Object.assign(new Error(`Missing ${path}`), { code: 'ENOENT' });
      return path;
    },
    async readText(path) { return files[path]; },
    async assetUrl(path, base) { return `${base}/assets${path}`; }
  };
}
const files = {
  '/courses.md': '---\ncourses: ["[[demo/course.md]]"]\n---\n# Catalog',
  '/demo/course.md': '---\nlanguage: en\nchildren: ["[[z.md]]", "[[a.md]]"]\n---\n# Demo',
  '/demo/z.md': '---\ntype: chapter\nchapter: 99\nchildren: ["[[help.md]]", "[[lesson.md]]"]\n---\n# Chapter',
  '/demo/a.md': '---\ntype: chapter\n---\n# Second',
  '/demo/help.md': '---\ntype: resource\nchapter: 7\n---\n# Help',
  '/demo/lesson.md': '---\ntype: content\nchapter: 8\nsources: ["part.md"]\n---\n# Lesson\n\n[help](help.md)\n\n![Image](image.svg)',
  '/demo/part.md': '## Included\n\nText',
  '/demo/image.svg': '<svg></svg>'
};

test('memory source renders, resolves links/assets and shares computed numbers with navigation', async () => {
  const graph = await processContent(memory(files), 'courses.md', { base: '/preview' });
  const lesson = graph.pages.find(page => page.slug === 'demo/lesson')!;
  expect(lesson.chapter).toBe('1.1');
  expect(lesson.html).toContain('/preview/demo/help/');
  expect(lesson.html).toContain('/preview/assets/demo/image.svg');
  expect(lesson.headings.map(item => item.title)).toEqual(['Lesson', 'Included']);
  expect(graph.pages.find(page => page.slug === 'demo/help')).not.toHaveProperty('chapter');
  expect(courseMenu(graph.navigation, 'demo')!.children.map(item => item.chapter)).toEqual(['1', '2']);
  expect(breadcrumbPath(graph.navigation, lesson.slug).map(item => item.chapter)).toEqual([undefined, undefined, '1', '1.1']);
  expect(graph.exportManifest?.map(item => item.number)).toEqual([[1, 1]]);
});

test('virtual paths reject traversal and missing references', async () => {
  await expect(processContent(memory({ '/courses.md': '[escape](../outside.md)' }), 'courses.md')).rejects.toThrow('Content escapes root');
  await expect(processContent(memory({ '/courses.md': '[missing](missing.md)' }), 'courses.md')).rejects.toThrow('Missing');
});

test('non-tree content and unknown roles do not receive numbers', async () => {
  const graph = await processContent(memory({ ...files,
    '/demo/help.md': '---\ntype: custom\n---\n# Help\n\n[extra](extra.md)',
    '/demo/extra.md': '---\ntype: content\nchapter: 100\n---\n# Extra'
  }), 'courses.md');
  expect(graph.pages.find(page => page.slug === 'demo/extra')).not.toHaveProperty('chapter');
  expect(graph.exportManifest).toHaveLength(1);
});

test('[[!file]] attaches a file as it is, even Markdown, and `attachments` lists downloads', async () => {
  const source = { ...memory({ ...files,
    '/demo/lesson.md': '---\ntype: content\nattachments: ["[[docs/llm.md]]", "data.csv"]\n---\n# Lesson\n\nGet [[!docs/llm.md]], [[!docs/llm.md|the LLM notes]] or [help](help.md).',
    '/demo/docs/llm.md': '# For LLMs', '/demo/data.csv': 'a,b'
  }), async assetSize() { return 1536; } } satisfies ContentSource;
  const graph = await processContent(source, 'courses.md', { base: '/b' });
  const lesson = graph.pages.find(page => page.slug === 'demo/lesson')!;
  expect(graph.pages.map(page => page.slug)).not.toContain('demo/docs/llm');
  expect(lesson.html).toContain('href="/b/assets/demo/docs/llm.md"');
  expect(lesson.html).toContain('download="llm.md"');
  expect(lesson.html).toContain('>llm.md</a>');
  expect(lesson.html).toContain('>the LLM notes</a>');
  expect(lesson.html).toContain('/b/demo/help/');
  expect(lesson.attachments).toEqual([
    { name: 'llm.md', url: '/b/assets/demo/docs/llm.md', size: 1536 },
    { name: 'data.csv', url: '/b/assets/demo/data.csv', size: 1536 }
  ]);
  expect(graph.pages.find(page => page.slug === 'demo/help')!.attachments).toEqual([]);
});

test('a missing attachment fails the build, or becomes a diagnostic for tolerant callers', async () => {
  const broken = memory({ ...files, '/demo/help.md': '---\nattachments: ["[[gone.pdf]]"]\n---\n# Help', '/demo/lesson.md': '# Lesson\n\n[[!gone.md]]' });
  await expect(processContent(broken, 'courses.md')).rejects.toThrow('Missing');
  const diagnostics: { target: string }[] = [];
  const graph = await processContent(broken, 'courses.md', { diagnostics });
  expect(diagnostics.map(item => item.target).sort()).toEqual(['gone.md', 'gone.pdf']);
  expect(graph.pages.find(page => page.slug === 'demo/help')!.attachments).toEqual([]);
});
