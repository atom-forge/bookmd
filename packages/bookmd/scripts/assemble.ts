import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { isSourceRef } from '../src/core/source-ref';
import { syncSources, type CheckedOut, type GitTransport, type Pins } from './git-source';

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
  sources: AssembledSource[];
};

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
 */
export function requireApproval(checked: Pick<CheckedOut, 'normalized' | 'access'>, metadata: Record<string, unknown>): void {
  if (checked.access === 'private' && metadata.publish !== true) {
    throw new Error(`${checked.normalized}: this source is a private repository, and a private source does not make the published site private. The author must approve publication by adding "publish: true" to the entry file's frontmatter`);
  }
}

// Synced sources are reused while a dev server regenerates after local edits; a new process syncs again.
const synced = new Map<string, CheckedOut[]>();

/**
 * Combines local content and external Git courses into one generated content root
 * `<work>/content`, with each external course under its own id. Registries without Git
 * entries are processed in place. The versioned local content is never written.
 */
export async function assemble(config: { contentRoot: string; entrypoint: string }, work: string, entries: string[], options: { transport?: GitTransport; refresh?: boolean; pins?: Pins } = {}): Promise<Assembly> {
  if (!entries.length) return { contentRoot: config.contentRoot, entrypoint: config.entrypoint, sealed: [], sources: [] };
  let checkouts = options.refresh === false ? synced.get(work) : undefined;
  if (!checkouts) { checkouts = await syncSources(entries, work, options.transport, options.pins); synced.set(work, checkouts); }
  const ids = new Map<string, string>();
  const sources: AssembledSource[] = [];
  const local = new Set((await readdir(config.contentRoot)).map(name => name.toLowerCase().replace(/\.md$/, '')));
  for (const checked of checkouts) {
    const metadata = await entryMetadata(checked);
    requireApproval(checked, metadata);
    const id = validateCourseId(metadata.id, checked.normalized);
    if (ids.has(id)) throw new Error(`${checked.normalized}: course id "${id}" is already used by ${ids.get(id)}`);
    if (local.has(id)) throw new Error(`${checked.normalized}: course id "${id}" collides with local content "${id}"`);
    ids.set(id, checked.normalized);
    sources.push({ id, source: checked.normalized, commit: checked.commit });
  }
  const output = resolve(work, 'content');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const visible = (path: string) => !basename(path).startsWith('.');
  await cp(config.contentRoot, output, { recursive: true, filter: visible });
  for (const [index, checked] of checkouts.entries()) await cp(checked.contentRoot, resolve(output, sources[index].id), { recursive: true, filter: visible });

  const registry = resolve(output, config.entrypoint);
  const text = await readFile(registry, 'utf8');
  const match = text.match(frontmatter)!;
  const metadata = parseYaml(match[1]) as { courses: string[] };
  let next = 0;
  metadata.courses = metadata.courses.map(entry => {
    if (!isSourceRef(entry)) return entry;
    const source = sources[next], checked = checkouts![next++];
    return `${source.id}/${checked.entrypoint}`;
  });
  await writeFile(registry, `---\n${stringifyYaml(metadata)}---\n${text.slice(match[0].length)}`);
  await writeFile(resolve(work, 'course-sources.json'), JSON.stringify({ schemaVersion: 1, sources }, null, 2) + '\n');
  return { contentRoot: output, entrypoint: config.entrypoint, sealed: sources.map(source => '/' + source.id), sources };
}
