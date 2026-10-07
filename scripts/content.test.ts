import { test, expect } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { stringify } from 'yaml';
import { buildGraph, youtubeId } from './content';
import { courseMenu } from '../src/lib/course-menu';

async function fixture(files: Record<string, string>, run: (root: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), 'bookmd-'));
  try {
    for (const [path, body] of Object.entries(files)) {
      await mkdir(dirname(join(root, path)), { recursive: true });
      await writeFile(join(root, path), body);
    }
    await run(root);
  } finally { await rm(root, { recursive: true, force: true }); }
}
const md = (metadata: object, body: string) => `---\n${stringify(metadata)}---\n${body}`;
const build = (root: string) => buildGraph(root, 'courses.md', '', join(root, 'assets'));
const catalog = md({ courses: ['[[web/course.md]]'] }, '# Courses\nCatalog introduction');
test('renders math, highlighted code, Mermaid and YouTube without raw HTML', async () => {
  await fixture({ 'courses.md': '# Render\n\n$x^2$\n\n```js\nconst n = 1;\n```\n\n```mermaid\ngraph TD; A-->B\n```\n\n[Video](https://youtu.be/dQw4w9WgXcQ)\n\n<script>alert(1)</script>' }, async root => {
    const html = (await build(root)).pages[0].html;
    expect(html).toContain('katex'); expect(html).toContain('hljs-keyword');
    expect(html).toContain('mermaid-source'); expect(html).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(html).not.toContain('<script>');
  });
  expect(youtubeId('https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ')).toBeNull();
});

test('rejects missing files and escaping content paths', async () => {
  await fixture({ 'courses.md': '[Missing](missing.md)' }, async root => {
    await expect(build(root)).rejects.toThrow();
    await writeFile(join(root, 'courses.md'), '[Escape](../)');
    await expect(build(root)).rejects.toThrow('escapes root');
    await writeFile(join(root, 'courses.md'), md({ courses: ['[[../course.md]]'] }, '# Courses'));
    await expect(build(root)).rejects.toThrow();
  });
});

test('Obsidian callouts preserve Markdown, nested blocks, aliases and fold states', async () => {
  await fixture({
    'courses.md': '# Callouts\n\n> [!TIP] **Custom** title\n> Body with [a link](note.md), $x^2$.\n>\n> - List item\n>\n> > [!warning]- Hidden\n> > Nested body\n\n> [!success]+ Open\n> Visible body\n\n> [!faq]\n\n> [!custom-type] Unknown\n\n> Ordinary quote\n\n```md\n> [!danger] Literal code\n```',
    'note.md': '# Note'
  }, async root => {
    const page = (await build(root)).pages[0];
    expect(page.html).toContain('data-callout="tip"');
    expect(page.html).toContain('<strong>Custom</strong> title');
    expect(page.html).toContain('href="/note/"');
    expect(page.html).toContain('katex');
    expect(page.html).toMatch(/<li>\s*(?:<p>)?List item(?:<\/p>)?\s*<\/li>/);
    expect(page.html).toContain('<details class="callout" data-callout="warning" data-callout-type="warning">');
    expect(page.html).toContain('data-callout-type="success" open');
    expect(page.html).toContain('data-callout="question"');
    expect(page.html).toContain('Faq');
    expect(page.html).toContain('data-callout="note" data-callout-type="custom-type"');
    expect(page.html).toContain('<blockquote>\n<p>Ordinary quote</p>\n</blockquote>');
    expect(page.html).not.toContain('data-callout="danger"');
    expect(page.html).toContain('callout-icon lucide');
    expect(page.html).not.toContain('[!TIP]');
  });
});

test('body wikilinks are rendered and crawled with aliases, anchors, sources and cycles', async () => {
  await fixture({
    'courses.md': catalog,
    'web/course.md': md({ language: 'en', children: ['[[overview.md]]'] }, '# Web'),
    'web/overview.md': md({ sources: ['[[parts.md]]'] }, '# Overview\nBefore [[chapter]] and [[chapter.md#details|Custom title]] after.\n\n`[[missing]]`\n\n```md\n[[missing]]\n```'),
    'web/chapter.md': '# Chapter\n## Details\n[[overview.md]]',
    'web/parts.md': '[[note.md|Note alias]]',
    'web/note.md': '# Note'
  }, async root => {
    const graph = await build(root);
    const overview = graph.pages.find(page => page.slug === 'web/overview')!;
    expect(overview.html).toContain('Before <a href="/web/chapter/">Chapter</a> and');
    expect(overview.html).toContain('<a href="/web/chapter/#details">Custom title</a> after.');
    expect(overview.html).toContain('<a href="/web/note/">Note alias</a>');
    expect(overview.html).toContain('<code>[[missing]]</code>');
    expect(graph.pages.filter(page => page.slug === 'web/chapter')).toHaveLength(1);
    expect(graph.pages.find(page => page.slug === 'web/chapter')?.inTree).toBe(false);
    expect(graph.pages.find(page => page.slug === 'web/chapter')?.html).toContain('href="/web/overview/"');
  });
});


test('local children build nested navigation and sibling order with optional titles', async () => {
  await fixture({
    'courses.md': catalog,
    'web/course.md': md({ language: 'en', tags: ['web'], children: ['[[week/overview.md]]', '[Custom syllabus](syllabus.md)'] }, '# Web\nIntroduction\n[Early B](week/b.md)'),
    'web/week/overview.md': md({ children: ['[[a]]', '[Custom B](b.md)'] }, '# Week'),
    'web/week/a.md': md({ children: ['[[exercises/one.md]]', '[[exercises/two.md]]'] }, '# A'),
    'web/week/b.md': '# B\n[[overview]]',
    'web/week/exercises/one.md': '# One', 'web/week/exercises/two.md': '# Two',
    'web/syllabus.md': '# Syllabus'
  }, async root => {
    const graph = await build(root);
    const pages = new Map(graph.pages.map(page => [page.slug, page]));
    expect(graph.navigation.map(page => page.slug)).toEqual(['', 'web', 'web/week/overview', 'web/week/a', 'web/week/exercises/one', 'web/week/exercises/two', 'web/week/b', 'web/syllabus']);
    expect(pages.get('web/week/b')).toMatchObject({ parent: 'web/week/overview', title: 'Custom B', previous: 'web/week/a', next: null, inTree: true });
    expect(pages.get('web/week/a')).toMatchObject({ previous: null, next: 'web/week/b' });
    expect(pages.get('web/week/overview')).toMatchObject({ previous: null, next: 'web/syllabus' });
    expect(pages.get('web/week/exercises/one')).toMatchObject({ parent: 'web/week/a', next: 'web/week/exercises/two' });
    const menu = courseMenu(graph.navigation, 'web');
    expect(menu?.children.map(page => page.title)).toEqual(['Week', 'Custom syllabus']);
    expect(menu?.children[0].children.map(page => page.title)).toEqual(['A', 'Custom B']);
    expect(menu?.children[0].children[0].children.map(page => page.title)).toEqual(['One', 'Two']);
    expect(pages.get('web')?.html).toContain('Introduction');
    expect(pages.get('web')?.html).not.toContain('Custom syllabus');
  });
});

test('sources compose content without adding hierarchy and resolve local child paths', async () => {
  await fixture({
    'courses.md': catalog,
    'web/course.md': md({ language: 'hu', children: ['[[main.md]]'] }, '# Course'),
    'web/main.md': md({ sources: ['[[parts/first]]', '[[parts/second.md]]'] }, '# Main\nOwn body'),
    'web/parts/first.md': md({ sources: ['[[nested.md]]'] }, '# Shared\n[[../note.md]]'),
    'web/parts/second.md': '# Shared\n[Local](#shared)',
    'web/parts/nested.md': 'Nested body', 'web/note.md': '# Note'
  }, async root => {
    const graph = await build(root);
    const page = graph.pages.find(page => page.slug === 'web/main')!;
    expect(page.html.indexOf('Own body')).toBeLessThan(page.html.indexOf('Nested body'));
    expect(page.html).toContain('id="shared-1"');
    expect(page.html).toContain('href="#shared-1"');
    expect(graph.navigation.map(page => page.slug)).toEqual(['', 'web', 'web/main']);
    expect(graph.pages.find(page => page.slug === 'web/note')?.inTree).toBe(false);
    await writeFile(join(root, 'web/parts/nested.md'), md({ sources: ['[[../main.md]]'] }, 'Cycle'));
    await expect(build(root)).rejects.toThrow('Circular sources');
  });
});

test('rejects invalid children, duplicate parents, self references, and hierarchy cycles', async () => {
  await fixture({
    'courses.md': catalog,
    'web/course.md': md({ language: 'en', children: ['[[a.md]]', '[[b.md]]'] }, '# Web'),
    'web/a.md': '# A', 'web/b.md': '# B'
  }, async root => {
    for (const value of ['a.md', '[[]]', '[[a.md|Title]]', 42, ['a.md']]) {
      await writeFile(join(root, 'web/a.md'), md({ children: [value] }, '# A'));
      await expect(build(root)).rejects.toThrow('Invalid children');
    }
    await writeFile(join(root, 'web/a.md'), md({ children: ['[[a.md]]'] }, '# A'));
    await expect(build(root)).rejects.toThrow('cannot contain their parent');
    await writeFile(join(root, 'web/a.md'), md({ children: ['[[b.md]]'] }, '# A'));
    await expect(build(root)).rejects.toThrow('Repeated child');
    await writeFile(join(root, 'web/course.md'), md({ language: 'en', children: ['[[a.md]]'] }, '# Web'));
    await writeFile(join(root, 'web/a.md'), md({ children: ['[[b.md]]'] }, '# A'));
    await writeFile(join(root, 'web/b.md'), md({ children: ['[[course.md]]'] }, '# B'));
    await expect(build(root)).rejects.toThrow('Circular children');
    await writeFile(join(root, 'web/a.md'), md({ series: ['[[b.md]]'] }, '# A'));
    await expect(build(root)).rejects.toThrow('Use children');
  });
});

test('course catalog metadata stays independent and ordinary dividers are rendered', async () => {
  await fixture({
    'courses.md': md({ courses: ['[[hu/course.md]]', '[[en/course.md]]'] }, '# Courses'),
    'hu/course.md': md({ language: 'hu' }, '# Hungarian\n\n***\n\n[[../en/course.md]]'),
    'en/course.md': md({ language: 'en' }, '# English')
  }, async root => {
    const graph = await build(root);
    expect(graph.courses.map(course => course.name)).toEqual(['Hungarian', 'English']);
    expect(graph.courses.map(course => course.language)).toEqual(['hu', 'en']);
    expect(graph.pages.find(page => page.slug === 'hu')?.html).toContain('<hr>');
    expect(graph.pages.find(page => page.slug === 'hu')?.html).toContain('href="/en/"');
  });
});

test('page author and free-form tags belong to the document without inheritance', async () => {
  await fixture({
    'courses.md': catalog,
    'web/course.md': md({ language: 'en', author: 'Course author', tags: ['course'], children: ['[[chapter.md]]', '[[plain.md]]'] }, '# Web'),
    'web/chapter.md': md({ author: '  Chapter author  ', tags: ['custom label', ' saját címke ', 'custom label'], sources: ['[[source.md]]'] }, '# Chapter'),
    'web/source.md': md({ author: 'Source author', tags: ['source'] }, 'Source text'),
    'web/plain.md': '# Plain'
  }, async root => {
    const graph = await build(root);
    const chapter = graph.pages.find(page => page.slug === 'web/chapter')!;
    expect(chapter.author).toBe('Chapter author');
    expect(chapter.tags).toEqual(['custom label', 'saját címke']);
    const plain = graph.pages.find(page => page.slug === 'web/plain')!;
    expect(plain.author).toBeNull();
    expect(plain.tags).toEqual([]);
    for (const metadata of [{ author: 123 }, { tags: 'tag' }, { tags: [''] }]) {
      await writeFile(join(root, 'web/plain.md'), md(metadata, '# Plain'));
      await expect(build(root)).rejects.toThrow('Invalid');
    }
  });
});
