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

test('`attachments` lists downloads, even Markdown files, which do not become pages', async () => {
  const source = { ...memory({ ...files,
    '/demo/lesson.md': '---\ntype: content\nattachments: ["[[docs/llm.md]]", "data.csv"]\n---\n# Lesson\n\nSee [help](help.md).',
    '/demo/docs/llm.md': '# For LLMs', '/demo/data.csv': 'a,b'
  }), async assetSize() { return 1536; } } satisfies ContentSource;
  const graph = await processContent(source, 'courses.md', { base: '/b' });
  const lesson = graph.pages.find(page => page.slug === 'demo/lesson')!;
  expect(graph.pages.map(page => page.slug)).not.toContain('demo/docs/llm');
  expect(lesson.html).toContain('/b/demo/help/');
  expect(lesson.attachments).toEqual([
    { name: 'llm.md', url: '/b/assets/demo/docs/llm.md', size: 1536 },
    { name: 'data.csv', url: '/b/assets/demo/data.csv', size: 1536 }
  ]);
  expect(graph.pages.find(page => page.slug === 'demo/help')!.attachments).toEqual([]);
});

test('a missing attachment fails the build, or becomes a diagnostic for tolerant callers', async () => {
  const broken = memory({ ...files, '/demo/help.md': '---\nattachments: ["[[gone.pdf]]"]\n---\n# Help' });
  await expect(processContent(broken, 'courses.md')).rejects.toThrow('Missing');
  const diagnostics: { target: string }[] = [];
  const graph = await processContent(broken, 'courses.md', { diagnostics });
  expect(diagnostics.map(item => item.target)).toEqual(['gone.pdf']);
  expect(graph.pages.find(page => page.slug === 'demo/help')!.attachments).toEqual([]);
});

test('the books list is `books`; the older `courses` still works, both together do not', async () => {
  const withKey = (key: string) => memory({ ...files, '/courses.md': `---\n${key}: ["[[demo/course.md]]"]\n---\n# Catalog` });
  for (const key of ['books', 'courses']) expect((await processContent(withKey(key), 'courses.md')).courses.map(course => course.slug)).toEqual(['demo']);
  await expect(processContent(memory({ ...files, '/courses.md': '---\nbooks: ["[[demo/course.md]]"]\ncourses: ["[[demo/course.md]]"]\n---\n# C' }), 'courses.md')).rejects.toThrow('not both');
});

test('![[note]] embeds a document where it is written; ![[note#Heading]] only that section', async () => {
  const embedFiles = { ...files,
    '/demo/lesson.md': '---\ntype: content\n---\n# Lesson\n\nBefore.\n\n![[shared/part.md]]\n\nBetween.\n\n![[shared/other#Second]]\n\n> ![[shared/tail]]\n\nAfter.',
    '/demo/shared/part.md': '---\ntitle: Ignored\n---\n## First\n\nOne [help](../help.md) ![i](pic.svg).',
    '/demo/shared/other.md': '## Intro\n\nNo\n\n## Second\n\nTwo\n\n### Deep\n\nDeeper\n\n## Third\n\nThree',
    '/demo/shared/tail.md': 'Tail text',
    '/demo/shared/pic.svg': '<svg/>'
  };
  const graph = await processContent(memory(embedFiles), 'courses.md', { base: '/b' });
  const lesson = graph.pages.find(page => page.slug === 'demo/lesson')!;
  expect(lesson.html.indexOf('Before.')).toBeLessThan(lesson.html.indexOf('One'));
  expect(lesson.html.indexOf('One')).toBeLessThan(lesson.html.indexOf('Between.'));
  expect(lesson.html.indexOf('Between.')).toBeLessThan(lesson.html.indexOf('Deeper'));
  expect(lesson.html.indexOf('Deeper')).toBeLessThan(lesson.html.indexOf('After.'));
  expect(lesson.html).not.toContain('Three');
  expect(lesson.html).not.toContain('No<');
  expect(lesson.html).toContain('href="/b/demo/help/"');
  expect(lesson.html).toContain('src="/b/assets/demo/shared/pic.svg"');
  expect(lesson.html).toContain('Tail text');
  expect(lesson.headings.map(item => item.title)).toEqual(['Lesson', 'First', 'Second', 'Deep']);
  expect(lesson.text).toContain('Tail text');
  expect(graph.pages.map(page => page.slug)).not.toContain('demo/shared/part');
});

test('![[picture]] is an image; width or alt text follow the bar', async () => {
  const graph = await processContent(memory({ ...files, '/demo/lesson.md': '# L\n\nA ![[image.svg]] B ![[image.svg|300]] C ![[image.svg|The logo]]' }), 'courses.md', { base: '/b' });
  const html = graph.pages.find(page => page.slug === 'demo/lesson')!.html;
  expect(html).toContain('<img src="/b/assets/demo/image.svg" alt="">');
  expect(html).toContain('width="300"');
  expect(html).toContain('alt="The logo"');
});

test('embeds report circles, missing documents and headings', async () => {
  const build = (extra: Record<string, string>) => processContent(memory({ ...files, ...extra }), 'courses.md');
  await expect(build({ '/demo/lesson.md': '# L\n\n![[a.md]]', '/demo/a.md': '![[lesson.md]]' })).rejects.toThrow('Circular embed');
  await expect(build({ '/demo/lesson.md': '# L\n\n![[nowhere]]' })).rejects.toThrow('Missing');
  await expect(build({ '/demo/lesson.md': '# L\n\n![[part#Nope]]' })).rejects.toThrow('Missing heading');
  const diagnostics: { target: string }[] = [];
  const graph = await processContent(memory({ ...files, '/demo/lesson.md': '# L\n\n![[nowhere]]' }), 'courses.md', { diagnostics });
  expect(diagnostics.map(item => item.target)).toEqual(['nowhere']);
  expect(graph.pages.find(page => page.slug === 'demo/lesson')!.html).toContain('![[nowhere]]');
});
