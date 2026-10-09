import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assemble, requireApproval, validateCourseId } from './assemble';
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
  test.each([['noid', 'must declare a stable course'], ['bad', 'invalid course id'], ['collide', 'collides with local content']])('%s blocks the assembly', async (repo, message) => {
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
    const source = { normalized: 'main@github.com/o/r/course.md' };
    expect(() => requireApproval({ ...source, access: 'public' }, {})).not.toThrow();
    expect(() => requireApproval({ ...source, access: 'private' }, {})).toThrow('publish: true');
    expect(() => requireApproval({ ...source, access: 'private' }, { publish: 'yes' })).toThrow('publish: true');
    expect(() => requireApproval({ ...source, access: 'private' }, { publish: false })).toThrow('publish: true');
    expect(() => requireApproval({ ...source, access: 'private' }, { publish: true })).not.toThrow();
  });
  test('the assembly blocks an unapproved private source and accepts an approved one', async () => {
    await remote('priv-no', { 'course.md': course('priv-no') });
    await remote('priv-yes', { 'course.md': course('priv-yes').replace('name: Ext', 'publish: true\nname: Ext'), 'lesson.md': '# L' });
    const gated: GitTransport = { url: ({ repo }) => `file://${join(work, 'nowhere', repo)}`, authenticate: async ({ repo }) => ({ url: `file://${join(work, 'remote', repo)}` }) };
    const no = await local('priv-no-site', registry('main@github.com/o/priv-no/course.md'), { 'mine/course.md': '# m' });
    await expect(assemble({ contentRoot: no, entrypoint: 'courses.md' }, join(work, 'wpn'), await gitEntries(no, 'courses.md'), { transport: gated })).rejects.toThrow('publish: true');
    const yes = await local('priv-yes-site', registry('main@github.com/o/priv-yes/course.md'), { 'mine/course.md': '# m' });
    const assembly = await assemble({ contentRoot: yes, entrypoint: 'courses.md' }, join(work, 'wpy'), await gitEntries(yes, 'courses.md'), { transport: gated });
    expect(assembly.sources.map(s => s.id)).toEqual(['priv-yes']);
  });
});
