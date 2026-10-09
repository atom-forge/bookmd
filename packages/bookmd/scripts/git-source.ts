import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep, isAbsolute } from 'node:path';
import { parseSourceRef, type SourceRef } from '../src/core/source-ref';

/** Maps a validated owner/repo to the address Git talks to. Public GitHub repositories use anonymous HTTPS. */
export type GitTransport = { url(source: Pick<SourceRef, 'owner' | 'repo'>): string };
export const githubHttps: GitTransport = { url: ({ owner, repo }) => `https://github.com/${owner}/${repo}.git` };

export class GitSourceError extends Error {
  constructor(public source: string, message: string) {
    super(`${source}: ${message}`);
    this.name = 'GitSourceError';
  }
}

const timeoutMs = 120_000;
const fullSha = /^[0-9a-f]{40}$/i;

// Git runs without the user's or system configuration (no credential helpers, URL rewrites or hooks)
// and never prompts. Arguments are an array: registry text is never interpreted by a shell.
async function git(args: string[], options: { cwd?: string } = {}): Promise<string> {
  return new Promise((done, fail) => {
    execFile('git', args, {
      cwd: options.cwd, timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024, encoding: 'utf8',
      env: {
        PATH: process.env.PATH ?? '', HOME: '/nonexistent', LC_ALL: 'C',
        GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_CONFIG_NOSYSTEM: '1',
        GIT_TERMINAL_PROMPT: '0', GIT_ASKPASS: '/bin/false', GIT_LFS_SKIP_SMUDGE: '1'
      }
    }, (error, stdout, stderr) => {
      if (!error) return done(stdout);
      fail(new Error(stderr.trim().split('\n').slice(-2).join(' ') || error.message));
    });
  });
}

export type ResolvedSource = SourceRef & { commit: string; refKind: 'commit' | 'branch' | 'tag' };

/** Resolves the requested ref to one full commit SHA. There is no fallback to a default branch. */
export async function resolveRef(source: SourceRef, transport: GitTransport = githubHttps): Promise<ResolvedSource> {
  const url = transport.url(source);
  if (fullSha.test(source.ref)) return { ...source, commit: source.ref.toLowerCase(), refKind: 'commit' };
  let output: string;
  try {
    output = await git(['ls-remote', '--', url, `refs/heads/${source.ref}`, `refs/tags/${source.ref}`, `refs/tags/${source.ref}^{}`]);
  } catch (error) {
    throw new GitSourceError(source.normalized, `cannot read repository ${source.owner}/${source.repo}: ${(error as Error).message}`);
  }
  const found = new Map<string, string>();
  for (const line of output.split('\n')) {
    const [sha, name] = line.split('\t');
    if (sha && name) found.set(name, sha);
  }
  const branch = found.get(`refs/heads/${source.ref}`);
  // An annotated tag points at a tag object; the peeled entry is the commit.
  const tag = found.get(`refs/tags/${source.ref}^{}`) ?? found.get(`refs/tags/${source.ref}`);
  if (branch && tag) throw new GitSourceError(source.normalized, `"${source.ref}" is both a branch and a tag; use a commit SHA`);
  const commit = branch ?? tag;
  if (!commit) throw new GitSourceError(source.normalized, `ref "${source.ref}" was not found in ${source.owner}/${source.repo}`);
  return { ...source, commit, refKind: branch ? 'branch' : 'tag' };
}

export type CheckedOut = ResolvedSource & {
  /** Checkout directory (shared by every course from the same repository and ref). */
  directory: string;
  /** Course content root: the entry file's directory. */
  contentRoot: string;
  /** Entry file name inside the content root. */
  entrypoint: string;
};

/** Content of one commit in `<root>/<hash of repository+ref>/`, without Git metadata, hooks, symlinks or LFS. */
export async function checkout(source: ResolvedSource, root: string, transport: GitTransport = githubHttps): Promise<CheckedOut> {
  const hash = createHash('sha256').update(source.checkoutKey).digest('hex');
  const directory = resolve(root, 'repos', hash);
  const marker = `${directory}.commit`;
  const reusable = await readFile(marker, 'utf8').then(text => text.trim() === source.commit, () => false);
  if (!reusable) {
    await rm(directory, { recursive: true, force: true });
    await rm(marker, { force: true });
    await mkdir(directory, { recursive: true });
    try {
      await git(['init', '-q'], { cwd: directory });
      await git(['fetch', '-q', '--depth', '1', '--no-tags', '--no-recurse-submodules', '--', transport.url(source), source.commit], { cwd: directory });
      await git(['-c', 'core.symlinks=false', '-c', 'core.hooksPath=/dev/null', '-c', 'core.autocrlf=false', 'checkout', '-q', '--detach', 'FETCH_HEAD'], { cwd: directory });
      const head = (await git(['rev-parse', 'HEAD'], { cwd: directory })).trim();
      if (head !== source.commit) throw new Error(`fetched ${head} instead of ${source.commit}`);
      await rm(join(directory, '.git'), { recursive: true, force: true });
      await writeFile(marker, source.commit + '\n');
    } catch (error) {
      await rm(directory, { recursive: true, force: true });
      throw new GitSourceError(source.normalized, `cannot download commit ${source.commit.slice(0, 12)}: ${(error as Error).message}`);
    }
  }
  const entry = resolve(directory, source.path);
  const real = await realpath(entry).catch(() => null);
  const inside = real !== null && !relative(await realpath(directory), real).startsWith('..') && !isAbsolute(relative(await realpath(directory), real));
  if (!inside || !(await stat(real!)).isFile()) throw new GitSourceError(source.normalized, `entry file "${source.path}" does not exist in commit ${source.commit.slice(0, 12)}`);
  return { ...source, directory, contentRoot: dirname(entry), entrypoint: entry.slice(dirname(entry).length + sep.length) };
}

/** Validates, resolves and downloads every Git source of a registry. The first failure aborts: no partial result. */
export async function syncSources(entries: string[], root: string, transport: GitTransport = githubHttps): Promise<CheckedOut[]> {
  const parsed = entries.map(parseSourceRef);
  const duplicates = parsed.filter((source, index) => parsed.findIndex(other => other.normalized.toLowerCase() === source.normalized.toLowerCase()) !== index);
  if (duplicates.length) throw new GitSourceError(duplicates[0].normalized, 'listed more than once');
  const resolved = await Promise.all(parsed.map(source => resolveRef(source, transport)));
  const result: CheckedOut[] = [];
  for (const source of resolved) result.push(await checkout(source, root, transport));
  return result;
}
