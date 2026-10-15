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

test('a link ending in #!download offers the file as it is; a Markdown file does not become a page', async () => {
  const graph = await processContent(memory({ ...files,
    '/demo/lesson.md': '# Lesson\n\n[Notes](docs/llm.md#!download), [[docs/llm#!download|the LLM notes]], [[docs/llm#!download]], [Data](data.csv#!DOWNLOAD), and [help](help.md).',
    '/demo/docs/llm.md': '# For LLMs', '/demo/data.csv': 'a,b'
  }), 'courses.md', { base: '/b' });
  const html = graph.pages.find(page => page.slug === 'demo/lesson')!.html;
  expect(graph.pages.map(page => page.slug)).not.toContain('demo/docs/llm');
  expect(html).toContain('<a href="/b/assets/demo/docs/llm.md" download="llm.md">Notes</a>');
  expect(html).toContain('>the LLM notes</a>');
  expect(html).toContain('>llm.md</a>');
  expect(html).toContain('href="/b/assets/demo/data.csv" download="data.csv"');
  expect(html).toContain('/b/demo/help/');
});

test('a missing file behind #!download fails the build, or becomes a diagnostic for tolerant callers', async () => {
  const broken = memory({ ...files, '/demo/lesson.md': '# Lesson\n\n[x](gone.md#!download)' });
  await expect(processContent(broken, 'courses.md')).rejects.toThrow('Missing');
  const diagnostics: { target: string }[] = [];
  await processContent(broken, 'courses.md', { diagnostics });
  expect(diagnostics.map(item => item.target)).toEqual(['gone.md#!download']);
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

test('a fenced block with file= shows that file, optionally only some lines', async () => {
  const code = 'const a = 1;\nconst b = 2;\nconst c = <b>3</b>;\n';
  const build = (fence: string, extra: Record<string, string> = {}, options = {}) => processContent(memory({ ...files,
    '/demo/lesson.md': `# Lesson\n\n${fence}`, '/demo/src/app.ts': code, ...extra }), 'courses.md', options);
  const html = async (fence: string) => (await build(fence)).pages.find(page => page.slug === 'demo/lesson')!.html;
  const whole = await html('```ts file=src/app.ts\nignored\n```');
  expect(whole).toContain('const');
  expect(whole).toContain('&#x3C;');
  expect(whole).not.toContain('<b>3');
  expect(whole).not.toContain('ignored');
  expect(whole).toContain('language-ts');
  const some = await html('```ts file="src/app.ts" lines=2-3\n```');
  expect(some).not.toContain('a = 1');
  expect(some).toContain('b');
  expect(await html('```file=src/app.ts lines=1\n```')).toContain('language-ts');
  expect(await html('```ts file=src/app.ts lines=3-\n```')).not.toContain('b = 2');
  expect((await build('```ts file=src/app.ts\n```')).pages.find(page => page.slug === 'demo/lesson')!.text).toContain('const a = 1;');
  for (const bad of ['lines=0', 'lines=5', 'lines=3-2', 'lines=x']) await expect(html(`\`\`\`ts file=src/app.ts ${bad}\n\`\`\``)).rejects.toThrow('Invalid lines');
  await expect(html('```ts file=src/none.ts\n```')).rejects.toThrow('Missing');
  await expect(build('```ts file=src/big.ts\n```', { '/demo/src/big.ts': 'x'.repeat(200_001) })).rejects.toThrow('too large');
  const diagnostics: { target: string }[] = [];
  await build('```ts file=src/none.ts\n```', {}, { diagnostics });
  expect(diagnostics.map(item => item.target)).toEqual(['src/none.ts']);
});

test('an imported file cannot leave the sealed book', async () => {
  await expect(processContent(memory({ ...files, '/other/secret.ts': 'x', '/demo/lesson.md': '# L\n\n```ts file=../other/secret.ts\n```' }), 'courses.md', { sealed: ['/demo'] })).rejects.toThrow('leaves the course root');
});

test('the Obsidian plugin spellings import files too', async () => {
  const code = 'const a = 1;\nconst b = 2;\nconst c = 3;\n';
  const page = async (body: string) => (await processContent(memory({ ...files, '/demo/lesson.md': `# L\n\n${body}`, '/demo/src/app.ts': code, '/demo/sub/note.md': '# N\n\n```embed-ts\nPATH: "vault://src/app.ts"\nLINES: "3"\n```' }), 'courses.md')).pages.find(item => item.slug === 'demo/lesson')!;
  const embed = (await page('```embed-ts\nPATH: "src/app.ts"\nLINES: "2-3"\nTITLE: "App"\n```')).html;
  expect(embed).toContain('language-ts');
  expect(embed).not.toContain('a = 1');
  expect(embed).toContain('b');
  expect(embed).not.toContain('PATH');
  const codefile = (await page('```codefile src/app.ts:1-1\n```')).html;
  expect(codefile).toContain('language-ts');
  expect(codefile).toContain('a');
  expect(codefile).not.toContain('b = 2');
  expect((await page('```codefile src/app.ts\n```')).html).toContain('c');
  // vault:// starts at the root of the book, whatever folder the page is in.
  expect((await processContent(memory({ ...files, '/demo/src/app.ts': code, '/demo/lesson.md': '# L\n\n```embed-ts\nPATH: vault://src/app.ts\nLINES: 1\n```' }), 'courses.md')).pages.find(item => item.slug === 'demo/lesson')!.html).toContain('a');
  // A block that merely looks similar stays as it is.
  expect((await page('```embed-ts\nno path here\n```')).html).toContain('no path here');
});

test('chemical formulas with \\ce render through KaTeX', async () => {
  const graph = await processContent(memory({ ...files, '/demo/lesson.md': '# L\n\n$\\ce{2H2 + O2 -> 2H2O}$ and $\\ce{Fe^{3+}}$ and $$\\ce{CO2 + H2O <=> H2CO3}$$ and $\\pu{12.5 kJ mol-1}$' }), 'courses.md');
  const html = graph.pages.find(page => page.slug === 'demo/lesson')!.html;
  expect(html).not.toContain('katex-error');
  expect(html).toContain('x-arrow');
  expect(html.match(/class="katex"/g)).toHaveLength(4);
});

test('a book has several authors, a release date, a copyright and a license', async () => {
  const build = (front: string) => processContent(memory({
    '/courses.md': '---\nbooks: ["[[b/book.md]]"]\n---\n# Catalog',
    '/b/book.md': `---\nlanguage: en\n${front}\n---\n# B`,
  }), 'courses.md', {});
  const graph = await build('author: [Jane Doe, " John Roe ", Jane Doe]\nreleased: 2026-10\ncopyright: © 2026 AtomForge\nlicense: CC BY-SA 4.0');
  expect(graph.courses[0]).toMatchObject({ authors: ['Jane Doe', 'John Roe'], released: '2026-10', copyright: '© 2026 AtomForge', license: 'CC BY-SA 4.0' });
  expect((await build('author: Solo\nreleased: 2026')).courses[0]).toMatchObject({ authors: ['Solo'], released: '2026', copyright: '', license: '' });
  expect((await build('released: 2026-10-15')).courses[0].released).toBe('2026-10-15');
  for (const bad of ['released: 2026-13', 'released: 2026-02-30', 'released: yesterday', 'author: [a, 1]']) await expect(build(bad)).rejects.toThrow('Invalid');
});

test('the title of a book wins over the older name key', async () => {
  const graph = await processContent(memory({
    '/courses.md': '---\nbooks: ["[[a/book.md]]", "[[b/book.md]]"]\n---\n# Catalog',
    '/a/book.md': '---\nlanguage: en\ntitle: New title\nname: Old name\n---\n# A',
    '/b/book.md': '---\nlanguage: en\nname: Old name\n---\n# B'
  }), 'courses.md', {});
  expect(graph.courses.map(course => course.name)).toEqual(['New title', 'Old name']);
});

test('a book can have a subtitle', async () => {
  const graph = await processContent(memory({
    '/courses.md': '---\nbooks: ["[[b/book.md]]"]\n---\n# Catalog',
    '/b/book.md': '---\nlanguage: en\nname: Main title\nsubtitle: The second line\n---\n# B'
  }), 'courses.md', {});
  expect(graph.courses[0]).toMatchObject({ name: 'Main title', subtitle: 'The second line' });
});

test('a book intro can be a wikilink to a Markdown file whose text is used', async () => {
  const graph = await processContent(memory({
    '/courses.md': '---\nbooks: ["[[b/book.md]]", "[[c/book.md]]"]\n---\n# Catalog',
    '/b/book.md': '---\nlanguage: en\nintro: "[[about.md]]"\n---\n# B',
    '/b/about.md': '---\ntitle: x\n---\n# Heading\n\nSome **bold** text.\n\nSecond [link](x.md).',
    '/c/book.md': '---\nlanguage: en\nintro: Plain text\n---\n# C'
  }), 'courses.md', {});
  expect(graph.courses.find(course => course.slug === 'b')!.intro).toBe('Some bold text. Second link.');
  expect(graph.courses.find(course => course.slug === 'c')!.intro).toBe('Plain text');
});
