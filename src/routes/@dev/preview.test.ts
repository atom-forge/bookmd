import { describe, expect, test } from 'bun:test';
import { processContent, type ContentDiagnostic } from '../../core/content';
import type { DirectoryIndex } from './directory-index';
import { entryCandidates, preselected } from './entry-candidates';
import { parsePreviewHash, previewHash } from './preview-hash';
import { createPreviewSource } from './preview-source';

function indexOf(files: Record<string, string>): DirectoryIndex {
  return {
    name: 'folder', skipped: [], truncated: false,
    files: new Map(Object.entries(files).map(([path, text]) => [path, { path, file: async () => new File([text], path.split('/').at(-1)!) }]))
  };
}
const link = (slug: string, _query: string, fragment: string) => `/@dev/${previewHash(slug, fragment ? decodeURIComponent(fragment.slice(1)) : null)}`;
async function preview(files: Record<string, string>, entry = 'course.md') {
  const session = createPreviewSource(indexOf(files), entry);
  const diagnostics: ContentDiagnostic[] = [];
  const graph = await processContent(session.source, '.preview-catalog.md', { link, diagnostics });
  return { graph, diagnostics, session };
}

describe('entry candidates', () => {
  test('highlights known names case-insensitively and lists only Markdown', () => {
    const result = entryCandidates(['a/Notes.md', 'z.txt', 'README.MD', 'b/course.md', 'img.png', 'x/y/Book.md']);
    expect(result.map(c => c.path)).toEqual(['x/y/Book.md', 'b/course.md', 'README.MD', 'a/Notes.md']);
    expect(result.filter(c => c.highlighted)).toHaveLength(3);
  });
  test('preselects the uniquely preferred candidate', () => {
    expect(preselected(entryCandidates(['course.md', 'a.md']))).toBe('course.md');
    expect(preselected(entryCandidates(['course.md', 'x/index.md', 'book.md']))).toBe('book.md');
    expect(preselected(entryCandidates(['course.md', 'x/index.md']))).toBe('course.md');
    expect(preselected(entryCandidates(['a/book.md', 'b/book.md']))).toBeNull();
    expect(preselected(entryCandidates(['a.md']))).toBeNull();
  });
});

describe('preview hash', () => {
  test('round-trips slugs and headings', () => {
    const hash = previewHash('course/á b/c+d', 'my heading');
    expect(parsePreviewHash(hash)).toEqual({ slug: 'course/á b/c+d', heading: 'my heading' });
  });
  test('tolerates malformed input', () => {
    expect(parsePreviewHash('')).toEqual({ slug: null, heading: null });
    expect(parsePreviewHash('#page=%E0%A4%A')).toEqual({ slug: null, heading: null });
    expect(parsePreviewHash('#heading-only')).toEqual({ slug: null, heading: null });
  });
});

describe('preview source through the shared core', () => {
  const files = {
    'course.md': '---\nlanguage: en\nchildren: ["[[a.md]]"]\n---\n# Course',
    'a.md': '# A\n\n[B](b.md#sec) [[b.md]] ![pic](img/p.png) [pdf](f.pdf)\n\n[self](#top)',
    'b.md': '# B\n\n## Sec',
    'img/p.png': 'x', 'f.pdf': 'x'
  };
  test('mounts the folder, links by hash and creates blob assets', async () => {
    const { graph, diagnostics, session } = await preview(files);
    expect(diagnostics).toEqual([]);
    expect(graph.courses.map(c => c.slug)).toEqual(['course']);
    const a = graph.pages.find(p => p.slug === 'course/a')!;
    expect(a.html).toContain('href="/@dev/#page=course/b&#x26;heading=sec"');
    expect(a.html).toMatch(/src="blob:/);
    expect(a.html).toMatch(/href="blob:[^"]+"/);
    session.dispose();
  });
  test('missing targets and unsupported schemes become diagnostics, not scripts', async () => {
    const { graph, diagnostics } = await preview({
      ...files,
      'a.md': '# A\n\n[x](gone.md) ![y](missing.png) [bad](javascript:alert(1)) [[javascript:alert(2)]] [v](data:text/html;base64,AA)'
    });
    const html = graph.pages.find(p => p.slug === 'course/a')!.html;
    expect(html).not.toMatch(/(?:href|src)="(?:javascript|data):/);
    expect(html).toContain('<a href="#">x</a>');
    expect(diagnostics.map(d => d.file)).toEqual(Array(5).fill('/course/a.md'));
    expect(diagnostics.some(d => d.target === 'gone.md')).toBe(true);
  });
  test('links cannot leave the chosen folder, and SVG is image-only', async () => {
    const { diagnostics, graph } = await preview({
      ...files, 'logo.svg': '<svg onload="alert(1)"/>',
      'a.md': '# A\n\n[up](../secret.md) ![logo](logo.svg) [svg](logo.svg) [html](page.html)', 'page.html': '<script>1</script>'
    });
    expect(diagnostics.map(d => d.target).sort()).toEqual(['../secret.md', 'logo.svg', 'page.html']);
    expect(graph.pages.find(p => p.slug === 'course/a')!.html).toMatch(/<img src="blob:[^"]+" alt="logo">/);
  });
  test('fatal errors still reject, and dispose revokes blob URLs', async () => {
    await expect(preview({ 'course.md': '# no language' })).rejects.toThrow('Missing language');
    const { session } = await preview(files);
    session.dispose();
    await expect(session.source.assetUrl('/course/img/p.png', '', 'embed')).rejects.toThrow();
  });
});

test('preview folders supply children like the build', async () => {
  const { graph } = await preview({
    'course.md': '---\nlanguage: en\nchildren: ["[[part.md]]"]\n---\n# Book',
    'part.md': '# Part',
    'part/2-b.md': '# B',
    'part/10-c.md': '# C',
    'part/deeper/x.md': '# X'
  });
  expect(graph.navigation.filter(item => item.parent === 'course/part' || item.parent === 'part').map(item => item.title)).toEqual(['B', 'C']);
});
