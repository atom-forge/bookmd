import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gitEntries, registryEntries } from './registry';
import { isSourceRef, parseSourceRef } from '../src/core/source-ref';
import { resolveRef, type GitTransport } from './git-source';

export const planSchemaVersion = 1;

export type PlanInputs = {
  /** Instance commit: covers local content, config and build integration. */
  instanceCommit: string;
  /** Commit of an engine checkout; empty when the engine comes from a registry (version and lockfile identify it). */
  engineCommit: string; engineVersion: string;
  /** SHA-256 of the instance lockfile; empty when the instance has none. */
  lockfile: string;
  /** SHA-256 of the normalized course registry. */
  registry: string;
};
/**
 * `used` is only set when the build did not use the planned commit: the commit that was used instead (the last
 * good version of a book that failed to build), or null when the book was left out.
 */
export type PlanSource = { source: string; commit: string; used?: string | null };
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

/** Registry `books` (or older `courses`) in order, with Git entries in their normalized form and `as <slug>` when a slug is given. */
export async function registryCourses(contentRoot: string, entrypoint: string): Promise<string[]> {
  return (await registryEntries(contentRoot, entrypoint)).map(entry => isSourceRef(entry.value)
    ? parseSourceRef(entry.value).normalized + (entry.slug ? ` as ${entry.slug}` : '') : entry.value.trim());
}

export type PlanOptions = { instanceCommit: string; engineCommit: string; engineVersion: string; lockfile?: string };

/** Resolves every Git ref to a commit (no download) and fingerprints the publication inputs. */
export async function createPlan(config: { contentRoot: string; entrypoint: string }, options: PlanOptions, transport?: GitTransport): Promise<Plan> {
  const courses = await registryCourses(config.contentRoot, config.entrypoint);
  const git = (await gitEntries(config.contentRoot, config.entrypoint)).map(entry => parseSourceRef(entry).normalized);
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
    if (!isSha(inputs.instanceCommit) || (inputs.engineCommit !== '' && !isSha(inputs.engineCommit)) || typeof inputs.engineVersion !== 'string' || typeof inputs.lockfile !== 'string' || typeof inputs.registry !== 'string') return null;
    if (!plan.sources.every(s => typeof s?.source === 'string' && isSha(s.commit) && (s.used === undefined || s.used === null || isSha(s.used)))) return null;
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

/** Commits that were really published by a plan, per lower-cased source; books that were left out have none. */
export function goodCommits(plan: Plan | null): Map<string, string> {
  const good = new Map<string, string>();
  for (const source of plan?.sources ?? []) {
    const commit = source.used === undefined ? source.commit : source.used;
    if (commit) good.set(source.source.toLowerCase(), commit);
  }
  return good;
}

export type BookOutcome = { source: string; used: string | null };
/** Records what a build used instead of the planned commits. The fingerprint (the planned inputs) does not change. */
export function withOutcomes(plan: Plan, outcomes: BookOutcome[]): Plan {
  const byName = new Map(outcomes.map(outcome => [outcome.source.toLowerCase(), outcome.used]));
  return { ...plan, sources: plan.sources.map(({ used: _previous, ...source }) => byName.has(source.source.toLowerCase()) ? { ...source, used: byName.get(source.source.toLowerCase())! } : source) };
}
