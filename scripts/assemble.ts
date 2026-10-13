import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, relative, resolve, sep } from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { bookListKey } from '../src/core/book-list';
import { isSourceRef } from '../src/core/source-ref';
import { checkout, defaultTransport, fallbackVariant, syncSources, type CheckedOut, type GitTransport, type Pins } from './git-source';

const frontmatter = /^﻿?---\r?\n((?:[^\n]*\n)*?)---(?:\r?\n|$)/;
/** URL-safe course identifier: lower-case words joined by single hyphens. */
export const courseIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const reserved = new Set(['_app', '404', '@dev', 'content-assets', 'assets', 'static', 'favicon.ico']);

export type AssembledSource = { id: string; source: string; commit: string };
export type Assembly = {
  /** Content root to process: the original one, or a generated one that contains the external courses. */
  contentRoot: string;
  entrypoint: string;
  /** Virtual directories that are sealed per external course. */
  sealed: string[];
  /** Route prefixes: the book's folder inside its repository is served at the book's id. */
  mounts: { directory: string; route: string }[];
  sources: AssembledSource[];
  /** Books left out of the site: not approved for publication (yet), or broken with no earlier good version. */
  skipped: { source: string; reason: string }[];
  /** Books whose planned commit is broken and that were built from their last good commit instead. */
  fallbacks: { source: string; planned: string; used: string; reason: string }[];
};
/** Checks that one book builds on its own; throws a description of the first problem. */
export type BookValidator = (checked: CheckedOut, id: string) => Promise<void>;

export function validateCourseId(id: unknown, source: string): string {
  if (typeof id !== 'string' || !id) throw new Error(`${source}: the entry file must declare a stable course "id" in its frontmatter`);
  if (id.length > 64 || !courseIdPattern.test(id)) throw new Error(`${source}: invalid course id "${id}"; use lower-case letters, digits and single hyphens (at most 64 characters)`);
  if (reserved.has(id)) throw new Error(`${source}: course id "${id}" is reserved`);
  return id;
}

async function entryMetadata(checked: CheckedOut): Promise<Record<string, unknown>> {
  const text = await readFile(resolve(checked.contentRoot, checked.entrypoint), 'utf8');
  const match = text.match(frontmatter);
  try { return (match ? parseYaml(match[1]) : null) ?? {}; } catch { throw new Error(`${checked.normalized}: the entry file has invalid frontmatter`); }
}

/**
 * A private repository does not make the generated site private. Its author must therefore approve
 * publication explicitly, in the course itself: `publish: true` in the entry file's frontmatter.
 * A private source without the approval is not ready to be published, so it is left out of the build.
 */
export function isApproved(checked: Pick<CheckedOut, 'access'>, metadata: Record<string, unknown>): boolean {
  return checked.access !== 'private' || metadata.publish === true;
}

/** The folders from the repository root to the book's own folder. */
export const bookPath = (checked: Pick<CheckedOut, 'directory' | 'contentRoot'>): string[] => relative(checked.directory, checked.contentRoot).split(sep).filter(Boolean);

// Synced sources are reused while a dev server regenerates after local edits; a new process syncs again.
const synced = new Map<string, CheckedOut[]>();

/**
 * Combines local content and external Git courses into one generated content root
 * `<work>/content`, with each external course under its own id. Registries without Git
 * entries are processed in place. The versioned local content is never written.
 */
export async function assemble(config: { contentRoot: string; entrypoint: string }, work: string, entries: string[], options: { transport?: GitTransport; refresh?: boolean; pins?: Pins; fallbacks?: Pins; validate?: BookValidator } = {}): Promise<Assembly> {
  if (!entries.length) return { contentRoot: config.contentRoot, entrypoint: config.entrypoint, sealed: [], mounts: [], sources: [], skipped: [], fallbacks: [] };
  let checkouts = options.refresh === false ? synced.get(work) : undefined;
  if (!checkouts) { checkouts = await syncSources(entries, work, options.transport, options.pins); synced.set(work, checkouts); }
  const ids = new Map<string, string>();
  const sources: AssembledSource[] = [];
  const skipped: Assembly['skipped'] = [];
  const fallbacks: Assembly['fallbacks'] = [];
  const included: (CheckedOut | null)[] = [];
  const local = new Set((await readdir(config.contentRoot)).map(name => name.toLowerCase().replace(/\.md$/, '')));

  /** The id of a book that builds on its own; null when its author has not approved publication. */
  async function prepare(checked: CheckedOut): Promise<string | null> {
    const metadata = await entryMetadata(checked);
    if (!isApproved(checked, metadata)) return null;
    const id = validateCourseId(metadata.id, checked.normalized);
    await options.validate?.(checked, id);
    return id;
  }
  const message = (error: unknown) => error instanceof Error ? error.message : String(error);

  for (const planned of checkouts) {
    let chosen: CheckedOut | null = planned, id: string | null = null, failure: string | null = null;
    try { id = await prepare(planned); }
    catch (error) {
      failure = message(error);
      chosen = null;
      const commit = options.fallbacks?.get(planned.normalized.toLowerCase());
      if (commit && commit !== planned.commit) {
        try {
          const earlier = await checkout({ ...planned, commit, refKind: 'commit' }, work, options.transport ?? defaultTransport(), fallbackVariant);
          id = await prepare(earlier);
          if (id) { chosen = earlier; fallbacks.push({ source: planned.normalized, planned: planned.commit, used: commit, reason: failure }); }
        } catch { /* no usable earlier version */ }
      }
    }
    if (!chosen || !id) {
      const reason = failure ?? 'private source without "publish: true" in the entry file\'s frontmatter';
      skipped.push({ source: planned.normalized, reason });
      included.push(null);
      continue;
    }
    if (ids.has(id)) throw new Error(`${planned.normalized}: course id "${id}" is already used by ${ids.get(id)}`);
    if (local.has(id)) throw new Error(`${planned.normalized}: course id "${id}" collides with local content "${id}"`);
    ids.set(id, planned.normalized);
    included.push(chosen);
    sources.push({ id, source: planned.normalized, commit: chosen.commit });
  }
  const output = resolve(work, 'content');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const visible = (path: string) => !basename(path).startsWith('.');
  await cp(config.contentRoot, output, { recursive: true, dereference: true, filter: visible });
  const ready = included.filter((checked): checked is CheckedOut => checked !== null);
  // The whole repository of a book is its territory, so a book can use shared files next to its own folder.
  for (const [index, checked] of ready.entries()) await cp(checked.directory, resolve(output, sources[index].id), { recursive: true, filter: visible });
  const entryPath = (checked: CheckedOut) => bookPath(checked).concat(checked.entrypoint).join('/');

  const registry = resolve(output, config.entrypoint);
  const text = await readFile(registry, 'utf8');
  const match = text.match(frontmatter)!;
  const metadata = parseYaml(match[1]) as Record<string, string[]>;
  const key = bookListKey(metadata, config.entrypoint);
  let next = 0, nextReady = 0;
  metadata[key] = metadata[key].flatMap(entry => {
    if (!isSourceRef(entry)) return [entry];
    const checked = included[next++];
    return checked ? [`${sources[nextReady++].id}/${entryPath(checked)}`] : [];
  });
  await writeFile(registry, `---\n${stringifyYaml(metadata)}---\n${text.slice(match[0].length)}`);
  await writeFile(resolve(work, 'course-sources.json'), JSON.stringify({ schemaVersion: 1, sources }, null, 2) + '\n');
  return { contentRoot: output, entrypoint: config.entrypoint, sealed: sources.map(source => '/' + source.id), mounts: ready.map((checked, index) => ({ directory: ['/' + sources[index].id, ...bookPath(checked)].join('/'), route: sources[index].id })), sources, skipped, fallbacks };
}
