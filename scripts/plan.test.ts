import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assemble } from './assemble';
import type { GitTransport } from './git-source';
import { compare, createPlan, makePlan, parsePlan, type PlanInputs } from './plan';
import { gitEntries } from './registry';

const sha = (c: string) => c.repeat(40);
const inputs: PlanInputs = { instanceCommit: sha('a'), engineCommit: sha('b'), engineVersion: '0.1.0', lockfile: 'l', registry: 'r' };
const sources = [{ source: 'main@github.com/o/a/course.md', commit: sha('1') }, { source: 'main@github.com/o/b/course.md', commit: sha('2') }];

describe('fingerprint and comparison', () => {
  test('is deterministic and independent of source order', () => {
    expect(makePlan(inputs, sources).fingerprint).toBe(makePlan(inputs, [...sources].reverse()).fingerprint);
  });
  test('an identical plan is unchanged; force always rebuilds', () => {
    const plan = makePlan(inputs, sources);
    expect(compare(plan, makePlan(inputs, sources))).toEqual({ changed: false, reasons: [] });
    expect(compare(plan, makePlan(inputs, sources), true)).toEqual({ changed: true, reasons: ['forced rebuild'] });
  });
  test.each<[string, Partial<PlanInputs>, string]>([
    ['instance commit', { instanceCommit: sha('c') }, 'instance commit changed'],
    ['engine commit', { engineCommit: sha('c') }, 'engine commit changed'],
    ['engine version', { engineVersion: '0.2.0' }, 'engine version changed'],
    ['lockfile', { lockfile: 'x' }, 'lockfile changed'],
    ['registry', { registry: 'x' }, 'course registry changed']
  ])('detects a changed %s', (_name, change, reason) => {
    expect(compare(makePlan(inputs, sources), makePlan({ ...inputs, ...change }, sources))).toEqual({ changed: true, reasons: [reason] });
  });
  test('detects moved, new and removed sources', () => {
    const base = makePlan(inputs, sources);
    expect(compare(base, makePlan(inputs, [{ ...sources[0], commit: sha('9') }, sources[1]])).reasons[0]).toContain('111111111111 → 999999999999');
    expect(compare(base, makePlan(inputs, [...sources, { source: 'main@github.com/o/c/course.md', commit: sha('3') }])).reasons[0]).toContain('new source');
    expect(compare(base, makePlan(inputs, [sources[0]])).reasons[0]).toContain('removed source');
  });
  test('an engine installed from a registry has no commit; its version and the lockfile identify it', () => {
    const registry = makePlan({ ...inputs, engineCommit: '' }, sources);
    expect(parsePlan(JSON.stringify(registry))).toEqual(registry);
    expect(compare(registry, makePlan({ ...inputs, engineCommit: '', engineVersion: '0.1.1' }, sources)).reasons).toEqual(['engine version changed']);
    expect(compare(registry, makePlan({ ...inputs, engineCommit: '', lockfile: 'other' }, sources)).reasons).toEqual(['lockfile changed']);
    expect(parsePlan(JSON.stringify({ ...registry, inputs: { ...registry.inputs, engineCommit: 'not-a-sha' } }))).toBeNull();
  });
  test('a missing, corrupt, unknown-schema or tampered baseline means a full build', () => {
    const plan = makePlan(inputs, sources);
    const text = JSON.stringify(plan);
    expect(parsePlan(text)).toEqual(plan);
    for (const bad of ['', 'nope', '{}', JSON.stringify({ ...plan, schemaVersion: 2 }), JSON.stringify({ ...plan, fingerprint: 'x' }), JSON.stringify({ ...plan, sources: [{ source: 's', commit: 'short' }] }), JSON.stringify({ ...plan, inputs: { ...inputs, registry: 'tampered' } })]) {
      expect(parsePlan(bad)).toBeNull();
    }
    expect(compare(null, plan).changed).toBe(true);
  });
});

describe('plan against Git repositories', () => {
  let work: string;
  const transport: GitTransport = { url: ({ repo }) => `file://${join(work, 'remote', repo.toLowerCase())}` };
  const git = (cwd: string, ...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { cwd, stdio: 'pipe' }).toString().trim();
  const course = (title: string) => `---\nid: ext\nname: Ext\nlanguage: en\n---\n# ${title}\n`;
  beforeAll(async () => {
    work = await mkdtemp(join(tmpdir(), 'bookmd-plan-'));
    const repo = join(work, 'remote', 'ext');
    await mkdir(repo, { recursive: true });
    await writeFile(join(repo, 'course.md'), course('One'));
    git(repo, 'init', '-q', '-b', 'main'); git(repo, 'config', 'uploadpack.allowAnySHA1InWant', 'true'); git(repo, 'add', '-A'); git(repo, 'commit', '-q', '-m', '1');
    await mkdir(join(work, 'site'), { recursive: true });
    await writeFile(join(work, 'site', 'courses.md'), '---\ncourses:\n  - "main@github.com/O/Ext/course.md"\n---\n# C\n');
  });
  afterAll(() => rm(work, { recursive: true, force: true }));
  const config = () => ({ contentRoot: join(work, 'site'), entrypoint: 'courses.md' });
  const options = { instanceCommit: sha('a'), engineCommit: sha('b'), engineVersion: '0.1.0' };

  test('the plan records the resolved commit, and a moved branch changes it', async () => {
    const first = await createPlan(config(), options, transport);
    expect(first.sources).toEqual([{ source: 'main@github.com/o/ext/course.md', commit: git(join(work, 'remote', 'ext'), 'rev-parse', 'HEAD') }]);
    expect(compare(first, await createPlan(config(), options, transport)).changed).toBe(false);
  });
  test('a build with pins downloads the planned commit even after the branch moved', async () => {
    const planned = await createPlan(config(), options, transport);
    const repo = join(work, 'remote', 'ext');
    await writeFile(join(repo, 'course.md'), course('Two'));
    git(repo, 'commit', '-q', '-am', '2');
    const moved = await createPlan(config(), options, transport);
    expect(compare(planned, moved).changed).toBe(true);
    const pins = new Map(planned.sources.map(s => [s.source.toLowerCase(), s.commit]));
    const entries = await gitEntries(config().contentRoot, 'courses.md');
    const assembly = await assemble(config(), join(work, 'w'), entries, { transport, pins });
    expect(assembly.sources[0].commit).toBe(planned.sources[0].commit);
    expect(await readFile(join(assembly.contentRoot, 'ext', 'course.md'), 'utf8')).toContain('# One');
    await expect(assemble(config(), join(work, 'w2'), entries, { transport, pins: new Map() })).rejects.toThrow('plan does not contain');
    await expect(assemble(config(), join(work, 'w3'), entries, { transport, pins: new Map([...pins, ['main@github.com/x/y/z.md', sha('4')]]) })).rejects.toThrow('not in the registry');
  });
  test('an unknown ref fails the plan without a result', async () => {
    await writeFile(join(work, 'site', 'courses.md'), '---\ncourses:\n  - "nope@github.com/o/ext/course.md"\n---\n');
    await expect(createPlan(config(), options, transport)).rejects.toThrow('was not found');
  });
});
