import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { isSourceRef, parseSourceRef } from '../src/core/source-ref';
import { resolveRef, type GitTransport } from './git-source';

export const planSchemaVersion = 1;
const frontmatter = /^﻿?---\r?\n((?:[^\n]*\n)*?)---(?:\r?\n|$)/;

export type PlanInputs = {
  /** Instance commit: covers local content, config and build integration. */
  instanceCommit: string;
  engineCommit: string; engineVersion: string;
  /** SHA-256 of the instance lockfile; empty when the instance has none. */
  lockfile: string;
  /** SHA-256 of the normalized course registry. */
  registry: string;
};
export type PlanSource = { source: string; commit: string };
/** What one publication is built from. After a successful deploy it becomes the baseline. */
export type Plan = { schemaVersion: typeof planSchemaVersion; fingerprint: string; inputs: PlanInputs; sources: PlanSource[] };

const sha256 = (text: string | Uint8Array) => createHash('sha256').update(text).digest('hex');

export function fingerprintOf(inputs: PlanInputs, sources: PlanSource[]): string {
  const ordered = [...sources].sort((a, b) => a.source.localeCompare(b.source));
  return sha256(JSON.stringify({ schemaVersion: planSchemaVersion, inputs: [inputs.instanceCommit, inputs.engineCommit, inputs.engineVersion, inputs.lockfile, inputs.registry], sources: ordered.map(s => [s.source, s.commit]) }));
}

export function makePlan(inputs: PlanInputs, sources: PlanSource[]): Plan {
  return { schemaVersion: planSchemaVersion, fingerprint: fingerprintOf(inputs, sources), inputs, sources: [...sources].sort((a, b) => a.source.localeCompare(b.source)) };
}

/** Registry `courses` in order, with Git entries in their normalized form. */
export async function registryCourses(contentRoot: string, entrypoint: string): Promise<string[]> {
  const text = await readFile(resolve(contentRoot, entrypoint), 'utf8');
  const match = text.match(frontmatter);
  const courses = (match ? parseYaml(match[1]) : null)?.courses;
  if (courses === undefined || courses === null) return [];
  if (!Array.isArray(courses) || courses.some(item => typeof item !== 'string')) throw new Error(`Invalid courses in ${entrypoint}`);
  return courses.map(entry => isSourceRef(entry) ? parseSourceRef(entry).normalized : entry.trim());
}

export type PlanOptions = { instanceCommit: string; engineCommit: string; engineVersion: string; lockfile?: string };

/** Resolves every Git ref to a commit (no download) and fingerprints the publication inputs. */
export async function createPlan(config: { contentRoot: string; entrypoint: string }, options: PlanOptions, transport?: GitTransport): Promise<Plan> {
  const courses = await registryCourses(config.contentRoot, config.entrypoint);
  const git = courses.filter(isSourceRef);
  const sources = git.length === new Set(git.map(entry => entry.toLowerCase())).size ? await Promise.all(git.map(async entry => {
    const resolved = await resolveRef(parseSourceRef(entry), transport);
    return { source: resolved.normalized, commit: resolved.commit };
  })) : (() => { throw new Error('A Git course source is listed more than once'); })();
  const lockfile = options.lockfile ? sha256(await readFile(options.lockfile).catch(() => '')) : '';
  return makePlan({ instanceCommit: options.instanceCommit, engineCommit: options.engineCommit, engineVersion: options.engineVersion, lockfile, registry: sha256(JSON.stringify(courses)) }, sources);
}

const isSha = (value: unknown) => typeof value === 'string' && /^[0-9a-f]{40}$/.test(value);
/** Strict reader: anything unexpected is "no baseline", which always leads to a full build. */
export function parsePlan(text: string): Plan | null {
  try {
    const plan = JSON.parse(text) as Plan;
    const { inputs } = plan;
    if (plan.schemaVersion !== planSchemaVersion || typeof plan.fingerprint !== 'string' || !Array.isArray(plan.sources) || !inputs) return null;
    if (![inputs.instanceCommit, inputs.engineCommit].every(isSha) || typeof inputs.engineVersion !== 'string' || typeof inputs.lockfile !== 'string' || typeof inputs.registry !== 'string') return null;
    if (!plan.sources.every(s => typeof s?.source === 'string' && isSha(s.commit))) return null;
    return fingerprintOf(inputs, plan.sources) === plan.fingerprint ? plan : null;
  } catch { return null; }
}

export type Decision = { changed: boolean; reasons: string[] };
export function compare(baseline: Plan | null, plan: Plan, force = false): Decision {
  if (force) return { changed: true, reasons: ['forced rebuild'] };
  if (!baseline) return { changed: true, reasons: ['no usable baseline from a previous successful publication'] };
  if (baseline.fingerprint === plan.fingerprint) return { changed: false, reasons: [] };
  const reasons: string[] = [];
  const labels: Record<keyof PlanInputs, string> = { instanceCommit: 'instance commit', engineCommit: 'engine commit', engineVersion: 'engine version', lockfile: 'lockfile', registry: 'course registry' };
  for (const key of Object.keys(labels) as (keyof PlanInputs)[]) if (baseline.inputs[key] !== plan.inputs[key]) reasons.push(`${labels[key]} changed`);
  const before = new Map(baseline.sources.map(s => [s.source, s.commit]));
  const after = new Map(plan.sources.map(s => [s.source, s.commit]));
  for (const [source, commit] of after) {
    if (!before.has(source)) reasons.push(`new source ${source} @ ${commit.slice(0, 12)}`);
    else if (before.get(source) !== commit) reasons.push(`${source}: ${before.get(source)!.slice(0, 12)} → ${commit.slice(0, 12)}`);
  }
  for (const source of before.keys()) if (!after.has(source)) reasons.push(`removed source ${source}`);
  return { changed: true, reasons: reasons.length ? reasons : ['fingerprint changed'] };
}
