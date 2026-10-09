import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { mkdir, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep, isAbsolute } from 'node:path';
import { parseSourceRef, type SourceRef } from '../src/core/source-ref';
import { credentialsFromEnv, withApp } from './github-app';

export type GitAccess = { url: string; env?: Record<string, string> };
type RepoSource = Pick<SourceRef, 'owner' | 'repo'>;
/**
 * Maps a validated owner/repo to the address Git talks to. Access is anonymous first, so public sources never
 * need credentials; `authenticate`, when present, supplies credentialed access for sources that refused it.
 */
export type GitTransport = { url(source: RepoSource): string; authenticate?(source: RepoSource): Promise<GitAccess> };
export const githubHttps: GitTransport = { url: ({ owner, repo }) => `https://github.com/${owner}/${repo}.git` };

/** Anonymous HTTPS, plus the BookMD GitHub App when its credentials are in the environment. */
export function defaultTransport(env: Record<string, string | undefined> = process.env): GitTransport {
  const credentials = credentialsFromEnv(env);
  return credentials ? withApp(githubHttps, credentials) : githubHttps;
}

/**
 * Runs `action` with anonymous access and falls back to credentialed access when that fails.
 * `access` tells which one worked: a source that needed credentials is private.
 */
async function withAccess<T>(source: SourceRef, transport: GitTransport, action: (access: GitAccess) => Promise<T>): Promise<{ value: T; access: 'public' | 'private' }> {
  try {
    return { value: await action({ url: transport.url(source) }), access: 'public' };
  } catch (anonymous) {
    if (!transport.authenticate) {
      throw new Error(`${(anonymous as Error).message}. If ${source.owner}/${source.repo} is private, configure the BookMD GitHub App (BOOKMD_APP_ID, BOOKMD_APP_PRIVATE_KEY).`);
    }
    let access: GitAccess;
    try { access = await transport.authenticate(source); }
    catch (error) { throw new Error(error instanceof Error ? error.message : String(error)); }
    return { value: await action(access), access: 'private' };
  }
}

export class GitSourceError extends Error {
  constructor(public source: string, message: string) {
    super(`${source}: ${message}`);
    this.name = 'GitSourceError';
  }
}

const timeoutMs = 120_000;
// Commands that need no repository run outside any: the working directory may be a repository whose
// local configuration (for example the credentials actions/checkout stores) must not apply to other sources.
const neutral = tmpdir();
const fullSha = /^[0-9a-f]{40}$/i;

// Git runs without the user's or system configuration (no credential helpers, URL rewrites or hooks)
// and never prompts. Arguments are an array: registry text is never interpreted by a shell.
async function git(args: string[], options: { cwd?: string; env?: Record<string, string> } = {}): Promise<string> {
  return new Promise((done, fail) => {
    execFile('git', args, {
      cwd: options.cwd, timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024, encoding: 'utf8',
      env: {
        PATH: process.env.PATH ?? '', HOME: '/nonexistent', LC_ALL: 'C',
        GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_CONFIG_NOSYSTEM: '1',
        GIT_TERMINAL_PROMPT: '0', GIT_ASKPASS: '/bin/false', GIT_LFS_SKIP_SMUDGE: '1', ...options.env
      }
    }, (error, stdout, stderr) => {
      if (!error) return done(stdout);
      fail(new Error(stderr.trim().split('\n').slice(-2).join(' ') || error.message));
    });
  });
}

export type ResolvedSource = SourceRef & { commit: string; refKind: 'commit' | 'branch' | 'tag'; access?: 'public' | 'private' };

/** Resolves the requested ref to one full commit SHA. There is no fallback to a default branch. */
export async function resolveRef(source: SourceRef, transport: GitTransport = defaultTransport()): Promise<ResolvedSource> {
  if (fullSha.test(source.ref)) return { ...source, commit: source.ref.toLowerCase(), refKind: 'commit' };
  let result;
  try {
    result = await withAccess(source, transport, ({ url, env }) => git(['ls-remote', '--', url, `refs/heads/${source.ref}`, `refs/tags/${source.ref}`, `refs/tags/${source.ref}^{}`], { env, cwd: neutral }));
  } catch (error) {
    throw new GitSourceError(source.normalized, `cannot read repository ${source.owner}/${source.repo}: ${(error as Error).message}`);
  }
  const found = new Map<string, string>();
  for (const line of result.value.split('\n')) {
    const [sha, name] = line.split('\t');
    if (sha && name) found.set(name, sha);
  }
  const branch = found.get(`refs/heads/${source.ref}`);
  // An annotated tag points at a tag object; the peeled entry is the commit.
  const tag = found.get(`refs/tags/${source.ref}^{}`) ?? found.get(`refs/tags/${source.ref}`);
  if (branch && tag) throw new GitSourceError(source.normalized, `"${source.ref}" is both a branch and a tag; use a commit SHA`);
  const commit = branch ?? tag;
  if (!commit) throw new GitSourceError(source.normalized, `ref "${source.ref}" was not found in ${source.owner}/${source.repo}`);
  return { ...source, commit, refKind: branch ? 'branch' : 'tag', access: result.access };
}

export type CheckedOut = ResolvedSource & {
  /** Whether the repository needed credentials. Private sources need the author's publication approval. */
  access: 'public' | 'private';
  /** Checkout directory (shared by every course from the same repository and ref). */
  directory: string;
  /** Course content root: the entry file's directory. */
  contentRoot: string;
  /** Entry file name inside the content root. */
  entrypoint: string;
};

/** Content of one commit in `<root>/<hash of repository+ref>/`, without Git metadata, hooks, symlinks or LFS. */
export async function checkout(source: ResolvedSource, root: string, transport: GitTransport = defaultTransport()): Promise<CheckedOut> {
  const hash = createHash('sha256').update(source.checkoutKey).digest('hex');
  const directory = resolve(root, 'repos', hash);
  const marker = `${directory}.commit`;
  // The marker holds the commit and how it was reached, so a reused checkout still knows whether it is private.
  const previous = await readFile(marker, 'utf8').then(text => text.trim().split('\n'), () => []);
  let access: 'public' | 'private' = previous[1] === 'private' ? 'private' : 'public';
  if (previous[0] !== source.commit) {
    await rm(directory, { recursive: true, force: true });
    await rm(marker, { force: true });
    await mkdir(directory, { recursive: true });
    try {
      await git(['init', '-q'], { cwd: directory });
      access = (await withAccess(source, transport, ({ url, env }) => git(['fetch', '-q', '--depth', '1', '--no-tags', '--no-recurse-submodules', '--', url, source.commit], { cwd: directory, env }))).access;
      await git(['-c', 'core.symlinks=false', '-c', 'core.hooksPath=/dev/null', '-c', 'core.autocrlf=false', 'checkout', '-q', '--detach', 'FETCH_HEAD'], { cwd: directory });
      const head = (await git(['rev-parse', 'HEAD'], { cwd: directory })).trim();
      if (head !== source.commit) throw new Error(`fetched ${head} instead of ${source.commit}`);
      await rm(join(directory, '.git'), { recursive: true, force: true });
      await writeFile(marker, `${source.commit}\n${access}\n`);
    } catch (error) {
      await rm(directory, { recursive: true, force: true });
      throw new GitSourceError(source.normalized, `cannot download commit ${source.commit.slice(0, 12)}: ${(error as Error).message}`);
    }
  }
  const entry = resolve(directory, source.path);
  const real = await realpath(entry).catch(() => null);
  const inside = real !== null && !relative(await realpath(directory), real).startsWith('..') && !isAbsolute(relative(await realpath(directory), real));
  if (!inside || !(await stat(real!)).isFile()) throw new GitSourceError(source.normalized, `entry file "${source.path}" does not exist in commit ${source.commit.slice(0, 12)}`);
  return { ...source, access, directory, contentRoot: dirname(entry), entrypoint: entry.slice(dirname(entry).length + sep.length) };
}

/** Pinned commits by lower-cased normalized source, as recorded by a plan. */
export type Pins = Map<string, string>;

/**
 * Validates, resolves and downloads every Git source of a registry. The first failure aborts: no partial result.
 * With `pins`, exactly the planned commits are downloaded and no ref is resolved again.
 */
export async function syncSources(entries: string[], root: string, transport: GitTransport = defaultTransport(), pins?: Pins): Promise<CheckedOut[]> {
  const parsed = entries.map(parseSourceRef);
  const duplicates = parsed.filter((source, index) => parsed.findIndex(other => other.normalized.toLowerCase() === source.normalized.toLowerCase()) !== index);
  if (duplicates.length) throw new GitSourceError(duplicates[0].normalized, 'listed more than once');
  if (pins) {
    const known = new Set(parsed.map(source => source.normalized.toLowerCase()));
    for (const key of pins.keys()) if (!known.has(key)) throw new GitSourceError(key, 'the plan contains a source that is not in the registry; create the plan again');
  }
  const resolved = await Promise.all(parsed.map(async (source): Promise<ResolvedSource> => {
    if (!pins) return resolveRef(source, transport);
    const commit = pins.get(source.normalized.toLowerCase());
    if (!commit) throw new GitSourceError(source.normalized, 'the plan does not contain this source; create the plan again');
    return { ...source, commit, refKind: 'commit' };
  }));
  const result: CheckedOut[] = [];
  for (const source of resolved) result.push(await checkout(source, root, transport));
  return result;
}
