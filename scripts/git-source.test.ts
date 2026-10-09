import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtemp, mkdir, rm, writeFile, readFile, readdir, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { isSourceRef, parseSourceRef, SourceRefError } from '../src/core/source-ref';
import { checkout, GitSourceError, resolveRef, syncSources, type GitTransport } from './git-source';

describe('source reference parser', () => {
  test('parses refs with slashes and normalizes owner and repo', () => {
    const source = parseSourceRef('release/2026@github.com/Another-Colleague/Algorithms/unit 1/course.md'.replace(' ', '-'));
    expect(source).toMatchObject({ ref: 'release/2026', owner: 'Another-Colleague', repo: 'Algorithms', path: 'unit-1/course.md' });
    expect(source.normalized).toBe('release/2026@github.com/another-colleague/algorithms/unit-1/course.md');
    expect(parseSourceRef('main@github.com/a/b/x.md').checkoutKey).toBe(parseSourceRef('main@github.com/A/B/y/z.md').checkoutKey);
    expect(parseSourceRef('main@github.com/a/b/x.md').checkoutKey).not.toBe(parseSourceRef('dev@github.com/a/b/x.md').checkoutKey);
  });
  test('tells Git sources from local references', () => {
    expect(isSourceRef('main@github.com/a/b/c.md')).toBe(true);
    expect(isSourceRef('[[web/course.md]]')).toBe(false);
    expect(isSourceRef('web/course.md')).toBe(false);
  });
  test.each([
    ['@github.com/a/b/c.md', 'ref is required'],
    ['main@gitlab.com/a/b/c.md', 'only github.com'],
    ['main@github.com/-a/b/c.md', 'invalid owner'],
    ['main@github.com/a/b.git/c.md', 'invalid repository'],
    ['main@github.com/a/b', 'path to the entry'],
    ['main@github.com/a/b/c.txt', '.md file'],
    ['main@github.com/a/b/../c.md', 'inside the repository'],
    ['main@github.com/a/b//c.md', 'inside the repository'],
    ['main@github.com/a/b/c.md?x=1', 'unsupported character'],
    ['--upload-pack=evil@github.com/a/b/c.md', 'unsupported ref'],
    ['a..b@github.com/a/b/c.md', 'unsupported ref'],
    ['feature@x@github.com/a/b/c.md', 'unsupported host'],
    ['main@github.com/a/b/c\\d.md', 'unsupported character']
  ])('rejects %s', (entry, message) => {
    expect(() => parseSourceRef(entry)).toThrow(SourceRefError);
    expect(() => parseSourceRef(entry)).toThrow(message);
  });
});

describe('git adapter', () => {
  let work: string; let repo: string; let first: string; let second: string;
  const transport: GitTransport = { url: ({ repo: name }) => `file://${join(work, name)}` };
  const sh = async (cwd: string, ...args: string[]) => {
    const child = Bun.spawn(['git', '-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { cwd, stdout: 'pipe', stderr: 'pipe' });
    const out = await new Response(child.stdout).text();
    if (await child.exited) throw new Error(await new Response(child.stderr).text());
    return out.trim();
  };
  beforeAll(async () => {
    work = await mkdtemp(join(tmpdir(), 'bookmd-git-'));
    repo = join(work, 'course-repo');
    await mkdir(join(repo, 'materials'), { recursive: true });
    await sh(repo, 'init', '-q', '-b', 'main');
    // GitHub serves any reachable commit by SHA; plain local servers only do so when asked.
    await sh(repo, 'config', 'uploadpack.allowAnySHA1InWant', 'true');
    await writeFile(join(repo, 'materials/course.md'), '---\nlanguage: en\n---\n# One');
    await symlink('/etc/passwd', join(repo, 'materials/link.md'));
    await sh(repo, 'add', '-A'); await sh(repo, 'commit', '-q', '-m', 'one');
    first = await sh(repo, 'rev-parse', 'HEAD');
    await sh(repo, 'tag', '-a', 'v1', '-m', 'release');
    await writeFile(join(repo, 'materials/course.md'), '---\nlanguage: en\n---\n# Two');
    await sh(repo, 'commit', '-q', '-am', 'two');
    second = await sh(repo, 'rev-parse', 'HEAD');
    await sh(repo, 'branch', 'release/2026', first);
  });
  afterAll(() => rm(work, { recursive: true, force: true }));

  test('resolves branches, annotated tags and commit SHAs to one commit', async () => {
    expect((await resolveRef(parseSourceRef('main@github.com/o/course-repo/materials/course.md'), transport))).toMatchObject({ commit: second, refKind: 'branch' });
    expect((await resolveRef(parseSourceRef('v1@github.com/o/course-repo/materials/course.md'), transport))).toMatchObject({ commit: first, refKind: 'tag' });
    expect((await resolveRef(parseSourceRef(`${first}@github.com/o/course-repo/materials/course.md`), transport))).toMatchObject({ commit: first, refKind: 'commit' });
  });
  test('ignores the configuration of the repository it runs in', async () => {
    const host = join(work, 'host');
    await mkdir(host, { recursive: true });
    await sh(host, 'init', '-q', '-b', 'main');
    // Like the credentials actions/checkout stores: local configuration that would break every other source.
    await sh(host, 'config', `url.file:///nowhere/.insteadOf`, `file://${join(work, 'course-repo')}`);
    const before = process.cwd();
    process.chdir(host);
    try {
      expect(await resolveRef(parseSourceRef('main@github.com/o/course-repo/materials/course.md'), transport)).toMatchObject({ commit: second });
    } finally { process.chdir(before); }
  });
  test('resolves a ref that contains a slash', async () => {
    expect(await resolveRef(parseSourceRef('release/2026@github.com/o/course-repo/materials/course.md'), transport)).toMatchObject({ commit: first, refKind: 'branch' });
  });
  test('falls back to credentialed access only when anonymous access fails', async () => {
    let authenticated = 0;
    const gated: GitTransport = {
      url: ({ repo: name }) => `file://${join(work, name === 'private-course' ? 'nowhere' : name)}`,
      authenticate: async ({ repo: name }) => { authenticated++; return { url: `file://${join(work, 'course-repo')}`, env: { BOOKMD_TEST: name } }; }
    };
    const open = await resolveRef(parseSourceRef('main@github.com/o/course-repo/materials/course.md'), gated);
    expect(open).toMatchObject({ commit: second, access: 'public' });
    expect(authenticated).toBe(0); // public sources never touch credentials
    const closed = await resolveRef(parseSourceRef('main@github.com/o/private-course/materials/course.md'), gated);
    expect(closed).toMatchObject({ commit: second, access: 'private' });
    const root = join(work, 'out-private');
    const checked = await checkout(closed, root, gated);
    expect(checked.access).toBe('private');
    expect(authenticated).toBe(2);
    expect((await checkout(closed, root, { url: gated.url })).access).toBe('private'); // a reused checkout remembers it
  });
  test('without credentials a closed repository points at the app setup', async () => {
    const closed: GitTransport = { url: () => `file://${join(work, 'nowhere')}` };
    await expect(resolveRef(parseSourceRef('main@github.com/o/secret/materials/course.md'), closed)).rejects.toThrow('configure the BookMD GitHub App');
  });
  test('an app failure is reported as such', async () => {
    const broken: GitTransport = { url: () => `file://${join(work, 'nowhere')}`, authenticate: async () => { throw new Error('the BookMD GitHub App is not installed on o/secret'); } };
    await expect(resolveRef(parseSourceRef('main@github.com/o/secret/materials/course.md'), broken)).rejects.toThrow('not installed on o/secret');
  });
  test('an unknown ref or repository fails without a fallback', async () => {
    await expect(resolveRef(parseSourceRef('nope@github.com/o/course-repo/materials/course.md'), transport)).rejects.toThrow('was not found');
    await expect(resolveRef(parseSourceRef('main@github.com/o/missing/materials/course.md'), transport)).rejects.toThrow('cannot read repository');
  });
  test('downloads exactly the resolved commit, without Git metadata or live symlinks', async () => {
    const root = join(work, 'out');
    const [one] = await syncSources(['v1@github.com/o/course-repo/materials/course.md'], root, transport);
    expect(await readFile(join(one.contentRoot, one.entrypoint), 'utf8')).toContain('# One');
    expect(one.commit).toBe(first);
    expect(await readdir(one.directory)).not.toContain('.git');
    expect(await readFile(join(one.contentRoot, 'link.md'), 'utf8')).toBe('/etc/passwd'); // a plain file, not a link
    // Another branch/ref of the same repository gets its own checkout; one ref serves several courses.
    const [head, again] = await syncSources(['main@github.com/o/course-repo/materials/course.md', 'main@github.com/O/Course-Repo/materials/link.md'], root, transport);
    expect(head.directory).toBe(again.directory);
    expect(head.directory).not.toBe(one.directory);
    expect(await readFile(join(head.contentRoot, 'course.md'), 'utf8')).toContain('# Two');
  });
  test('a missing entry file or duplicate listing blocks the whole sync', async () => {
    const root = join(work, 'out2');
    await expect(syncSources(['main@github.com/o/course-repo/materials/gone.md'], root, transport)).rejects.toThrow(GitSourceError);
    await expect(syncSources(['main@github.com/o/course-repo/materials/course.md', 'main@github.com/o/course-repo/materials/course.md'], root, transport)).rejects.toThrow('more than once');
    await expect(syncSources(['main@github.com/o/course-repo/materials/course.md', 'zzz@github.com/o/course-repo/materials/course.md'], root, transport)).rejects.toThrow('was not found');
  });
  test('reuses an unchanged checkout and refreshes it when the commit moves', async () => {
    const root = join(work, 'out3');
    const source = await resolveRef(parseSourceRef('main@github.com/o/course-repo/materials/course.md'), transport);
    const a = await checkout(source, root, transport);
    await writeFile(join(a.contentRoot, 'marker.txt'), 'x');
    expect(await readdir(a.contentRoot)).toContain('marker.txt');
    const b = await checkout(source, root, transport);
    expect(await readdir(b.contentRoot)).toContain('marker.txt'); // reused
    const older = await checkout({ ...source, commit: first }, root, transport);
    expect(await readdir(older.contentRoot)).not.toContain('marker.txt'); // replaced by another commit
  });
});
