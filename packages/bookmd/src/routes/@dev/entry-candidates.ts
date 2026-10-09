/** Highlighted names in order of preference. */
export const highlightedNames = ['book.md', 'course.md', 'index.md', 'readme.md'];

export type EntryCandidate = { path: string; highlighted: boolean };

const rank = (path: string) => { const index = highlightedNames.indexOf(path.split('/').at(-1)!.toLowerCase()); return index < 0 ? highlightedNames.length : index; };
const depth = (path: string) => path.split('/').length;

/** Markdown files only; preferred names first (case-insensitive), then shallower paths. */
export function entryCandidates(paths: Iterable<string>): EntryCandidate[] {
  const result: EntryCandidate[] = [];
  for (const path of paths) {
    if (!path.toLowerCase().endsWith('.md')) continue;
    result.push({ path, highlighted: highlightedNames.includes(path.split('/').at(-1)!.toLowerCase()) });
  }
  return result.sort((a, b) => rank(a.path) - rank(b.path) || depth(a.path) - depth(b.path) || a.path.localeCompare(b.path));
}

/** The uniquely best highlighted candidate may be preselected; rendering still needs confirmation. */
export function preselected(candidates: EntryCandidate[]): string | null {
  const [best, next] = candidates;
  if (!best?.highlighted) return null;
  return next && rank(next.path) === rank(best.path) && depth(next.path) === depth(best.path) ? null : best.path;
}
