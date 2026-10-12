import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assemble, isApproved, validateCourseId, type BookValidator } from './assemble';
import { buildGraph } from './content';
import { gitEntries } from './registry';
import type { GitTransport } from './git-source';

let work: string;
const transport: GitTransport = { url: ({ repo }) => `file://${join(work, 'remote', repo)}` };
const git = (cwd: string, ...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { cwd, stdio: 'pipe' }).toString().trim();

async function remote(name: string, files: Record<string, string>) {
  const dir = join(work, 'remote', name);
  for (const [path, text] of Object.entries(files)) { await mkdir(join(dir, path, '..'), { recursive: true }); await writeFile(join(dir, path), text); }
  git(dir, 'init', '-q', '-b', 'main'); git(dir, 'config', 'uploadpack.allowAnySHA1InWant', 'true'); git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'init');
}
async function local(name: string, registry: string, files: Record<string, string> = {}) {
  const dir = join(work, name);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'courses.md'), registry);
  for (const [path, text] of Object.entries(files)) { await mkdir(join(dir, path, '..'), { recursive: true }); await writeFile(join(dir, path), text); }
  return dir;
}
const registry = (...courses: string[]) => `---\ncourses:\n${courses.map(course => `  - "${course}"`).join('\n')}\n---\n# Catalog\n`;
const course = (id: string | null, extra = '') => `---\n${id ? `id: ${id}\n` : ''}name: Ext\nlanguage: en\nchildren: ["[[lesson.md]]"]\n---\n# Ext\n`.concat(extra);

beforeAll(async () => {
  work = await mkdtemp(join(tmpdir(), 'bookmd-assemble-'));
  await remote('ext', { 'site/course.md': course('web-programming-1'), 'site/lesson.md': '---\ntype: content\n---\n# Lesson\n\n![i](img/a.png) [x](#h)\n\n## H\n', 'site/img/a.png': 'png', 'secret.md': '# repo secret' });
  await remote('noid', { 'course.md': course(null), 'lesson.md': '# L' });
  await remote('bad', { 'course.md': course('Bad_ID'), 'lesson.md': '# L' });
  await remote('collide', { 'course.md': course('mine'), 'lesson.md': '# L' });
  await remote('escape', { 'course.md': course('esc'), 'lesson.md': '# L\n\n[out](../mine/course.md)' });
});
afterAll(() => rm(work, { recursive: true, force: true }));

describe('course id', () => {
  test.each([[undefined, 'must declare'], ['', 'must declare'], ['Web', 'invalid course id'], ['a_b', 'invalid'], ['-a', 'invalid'], ['a--b', 'invalid'], ['x'.repeat(65), 'invalid'], ['404', 'reserved']])('rejects %p', (id, message) => {
    expect(() => validateCourseId(id, 'src')).toThrow(message);
  });
  test('accepts URL-safe ids', () => expect(validateCourseId('web-programming-1', 'src')).toBe('web-programming-1'));
});

describe('assembly of local and Git courses', () => {
  test('registries without Git entries are processed in place', async () => {
    const dir = await local('plain', registry('[[mine/course.md]]'), { 'mine/course.md': course('mine') });
    const result = await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, 'w0'), await gitEntries(dir, 'courses.md'));
    expect(result).toMatchObject({ contentRoot: dir, sealed: [], sources: [] });
  });
  test('places the external course under its id and builds one catalog', async () => {
    const dir = await local('site', registry('[[mine/course.md]]', 'main@github.com/o/ext/site/course.md'), { 'mine/course.md': '---\nlanguage: en\n---\n# Mine' });
    const before = await readFile(join(dir, 'courses.md'), 'utf8');
    const assembly = await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, 'w1'), await gitEntries(dir, 'courses.md'), { transport });
    expect(assembly.sources).toEqual([{ id: 'web-programming-1', source: 'main@github.com/o/ext/site/course.md', commit: expect.stringMatching(/^[0-9a-f]{40}$/) }]);
    expect(assembly.sealed).toEqual(['/web-programming-1']);
    expect(await readFile(join(dir, 'courses.md'), 'utf8')).toBe(before); // versioned content is untouched
    const graph = await buildGraph(assembly.contentRoot, assembly.entrypoint, '', join(work, 'assets1'), 'T', assembly.sealed);
    expect(graph.courses.map(c => c.slug)).toEqual(['mine', 'web-programming-1']);
    expect(graph.pages.map(p => p.slug)).toContain('web-programming-1/lesson');
    expect(graph.pages.find(p => p.slug === 'web-programming-1/lesson')!.html).toMatch(/src="\/content-assets\//);
    expect(JSON.parse(await readFile(join(work, 'w1', 'course-sources.json'), 'utf8')).sources[0].id).toBe('web-programming-1');
  });
  test.each([['noid', 'must declare a stable course'], ['bad', 'invalid course id']])('%s is left out with the reason', async (repo, message) => {
    const dir = await local(`reg-${repo}`, registry(`main@github.com/o/${repo}/course.md`), { 'mine/course.md': '# x' });
    const assembly = await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, `w-${repo}`), await gitEntries(dir, 'courses.md'), { transport });
    expect(assembly.sources).toEqual([]);
    expect(assembly.skipped).toEqual([{ source: `main@github.com/o/${repo}/course.md`, reason: expect.stringContaining(message) }]);
  });
  test.each([['collide', 'collides with local content']])('%s blocks the assembly', async (repo, message) => {
    const dir = await local(`reg-${repo}`, registry(`main@github.com/o/${repo}/course.md`), { 'mine/course.md': '# x' });
    await expect(assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, `w-${repo}`), await gitEntries(dir, 'courses.md'), { transport })).rejects.toThrow(message);
  });
  test('the same id twice is rejected', async () => {
    const dir = await local('dup', registry('main@github.com/o/ext/site/course.md', 'main@github.com/p/ext/site/course.md'));
    await expect(assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, 'wdup'), await gitEntries(dir, 'courses.md'), { transport })).rejects.toThrow('already used');
  });
  test('an external course cannot read outside its own root', async () => {
    const dir = await local('esc', registry('main@github.com/o/escape/course.md'), { 'mine/course.md': '---\nlanguage: en\n---\n# m' });
    const assembly = await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, 'wesc'), await gitEntries(dir, 'courses.md'), { transport });
    await expect(buildGraph(assembly.contentRoot, assembly.entrypoint, '', join(work, 'assets2'), 'T', assembly.sealed)).rejects.toThrow('leaves the course root');
  });
});

describe('publication approval for private sources', () => {
  test('a private source needs publish: true; public sources do not', () => {
    expect(isApproved({ access: 'public' }, {})).toBe(true);
    expect(isApproved({ access: 'private' }, {})).toBe(false);
    expect(isApproved({ access: 'private' }, { publish: 'yes' })).toBe(false);
    expect(isApproved({ access: 'private' }, { publish: false })).toBe(false);
    expect(isApproved({ access: 'private' }, { publish: true })).toBe(true);
  });
  test('the assembly skips an unapproved private source and keeps an approved one', async () => {
    await remote('priv-no', { 'course.md': course('priv-no') });
    await remote('priv-yes', { 'course.md': course('priv-yes').replace('name: Ext', 'publish: true\nname: Ext'), 'lesson.md': '# L' });
    const gated: GitTransport = { url: ({ repo }) => `file://${join(work, 'nowhere', repo)}`, authenticate: async ({ repo }) => ({ url: `file://${join(work, 'remote', repo)}` }) };
    const dir = await local('priv-site', registry('main@github.com/o/priv-no/course.md', 'main@github.com/o/priv-yes/course.md'), { 'mine/course.md': '# m' });
    const assembly = await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, 'wp'), await gitEntries(dir, 'courses.md'), { transport: gated });
    expect(assembly.sources.map(s => s.id)).toEqual(['priv-yes']);
    expect(assembly.skipped.map(item => item.source)).toEqual(['main@github.com/o/priv-no/course.md']);
    const text = await readFile(join(assembly.contentRoot, 'courses.md'), 'utf8');
    expect(text).toContain('priv-yes/course.md');
    expect(text).not.toContain('priv-no');
  });
});

describe('a book that does not build', () => {
  const entry = 'main@github.com/o/evolving/course.md';
  const noBrokenMarker: BookValidator = async checked => {
    if ((await readFile(join(checked.contentRoot, 'lesson.md'), 'utf8')).includes('BROKEN')) throw new Error('lesson.md: broken link');
  };
  let good: string, bad: string;
  beforeAll(async () => {
    await remote('evolving', { 'course.md': course('evolving'), 'lesson.md': '# Good' });
    const dir = join(work, 'remote', 'evolving');
    good = git(dir, 'rev-parse', 'HEAD');
    await writeFile(join(dir, 'lesson.md'), '# BROKEN');
    git(dir, 'commit', '-qam', 'break');
    bad = git(dir, 'rev-parse', 'HEAD');
  });
  const run = async (name: string, fallbacks?: Map<string, string>) => {
    const dir = await local(name, registry('[[mine/course.md]]', entry), { 'mine/course.md': '---\nlanguage: en\n---\n# Mine' });
    return { dir, assembly: await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, `w-${name}`), await gitEntries(dir, 'courses.md'), { transport, pins: new Map([[entry, bad]]), fallbacks, validate: noBrokenMarker }) };
  };
  test('is replaced by its last good commit', async () => {
    const { assembly } = await run('fb-good', new Map([[entry, good]]));
    expect(assembly.sources).toEqual([{ id: 'evolving', source: entry, commit: good }]);
    expect(assembly.fallbacks).toEqual([{ source: entry, planned: bad, used: good, reason: expect.stringContaining('broken link') }]);
    expect(assembly.skipped).toEqual([]);
    expect(await readFile(join(assembly.contentRoot, 'evolving', 'lesson.md'), 'utf8')).toBe('# Good');
  });
  test('is left out when there is no good version, and the catalog drops it', async () => {
    const { assembly } = await run('fb-none');
    expect(assembly.sources).toEqual([]);
    expect(assembly.skipped).toEqual([{ source: entry, reason: expect.stringContaining('broken link') }]);
    expect(await readFile(join(assembly.contentRoot, 'courses.md'), 'utf8')).not.toContain('evolving');
  });
  test('is left out when the last good commit is broken as well', async () => {
    const { assembly } = await run('fb-bad', new Map([[entry, bad]]));
    expect(assembly.skipped).toHaveLength(1);
  });
  test('does not fall back from a withdrawn publication approval', async () => {
    await remote('withdrawn', { 'course.md': course('withdrawn') });
    const gated: GitTransport = { url: ({ repo }) => `file://${join(work, 'nowhere', repo)}`, authenticate: async ({ repo }) => ({ url: `file://${join(work, 'remote', repo)}` }) };
    const key = 'main@github.com/o/withdrawn/course.md';
    const sha = git(join(work, 'remote', 'withdrawn'), 'rev-parse', 'HEAD');
    const dir = await local('fb-withdrawn', registry('[[mine/course.md]]', key), { 'mine/course.md': '# m' });
    const assembly = await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, 'w-withdrawn'), await gitEntries(dir, 'courses.md'), { transport: gated, fallbacks: new Map([[key, sha]]) });
    expect(assembly.fallbacks).toEqual([]);
    expect(assembly.skipped.map(item => item.source)).toEqual([key]);
  });
});

describe('the books key of the registry', () => {
  test('an external book is assembled under `books` as well, and the key is kept', async () => {
    const dir = await local('books-key', '', { 'mine/course.md': '---\nlanguage: en\n---\n# Mine' });
    await writeFile(join(dir, 'courses.md'), '---\nbooks:\n  - "[[mine/course.md]]"\n  - "main@github.com/o/ext/site/course.md"\n---\n# Catalog\n');
    const assembly = await assemble({ contentRoot: dir, entrypoint: 'courses.md' }, join(work, 'wbooks'), await gitEntries(dir, 'courses.md'), { transport });
    expect(assembly.sources.map(s => s.id)).toEqual(['web-programming-1']);
    const text = await readFile(join(assembly.contentRoot, 'courses.md'), 'utf8');
    expect(text).toContain('books:');
    expect(text).toContain('web-programming-1/course.md');
  });
});
