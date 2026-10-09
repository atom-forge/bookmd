/** `<ref>@github.com/<owner>/<repo>/<path-to-entrypoint.md>` — an application syntax, never a download URL. */
export type SourceRef = {
  ref: string; host: 'github.com'; owner: string; repo: string;
  /** Entry Markdown file, relative to the repository root. */
  path: string;
  /** Canonical text, with owner and repo lower-cased (GitHub treats them case-insensitively). */
  normalized: string;
  /** Identifies the checkout (repository + ref); the entry path is deliberately excluded. */
  checkoutKey: string;
};

export class SourceRefError extends Error {
  constructor(public entry: string, message: string) {
    super(`Invalid course source "${entry}": ${message}`);
    this.name = 'SourceRefError';
  }
}

// Text before the first "@" followed by a host-like segment and a slash.
const gitShaped = /^[^\s@[\]]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+\//;
const ownerPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const repoPattern = /^[A-Za-z0-9._-]{1,100}$/;
// Conservative ASCII subset of Git ref names; never starts with "-" so it cannot act as an option.
const refPattern = /^[A-Za-z0-9._+/-]+$/;

export function isSourceRef(entry: string): boolean {
  return gitShaped.test(entry.trim());
}

export function parseSourceRef(entry: string): SourceRef {
  const text = entry.trim();
  if (/[\u0000-\u001f\u007f\\?#%]/.test(text) || /@github\.com\/.*[[\]]/i.test(text)) throw new SourceRefError(entry, 'contains an unsupported character');
  const at = text.indexOf('@');
  if (at === -1) throw new SourceRefError(entry, 'expected <ref>@github.com/<owner>/<repo>/<path>.md');
  const ref = text.slice(0, at);
  const source = text.slice(at + 1);
  if (!ref) throw new SourceRefError(entry, 'the ref is required (there is no default branch)');
  if (!refPattern.test(ref) || ref.startsWith('-') || ref.startsWith('/') || ref.endsWith('/') || ref.endsWith('.') || ref.endsWith('.lock')
    || ref.includes('..') || ref.includes('//') || ref.includes('/.')) {
    throw new SourceRefError(entry, `unsupported ref "${ref}"`);
  }
  const [host, owner, repo, ...segments] = source.split('/');
  if (host?.toLowerCase() !== 'github.com') throw new SourceRefError(entry, `unsupported host "${host}"; only github.com is supported`);
  if (!owner || !ownerPattern.test(owner)) throw new SourceRefError(entry, `invalid owner "${owner ?? ''}"`);
  if (!repo || !repoPattern.test(repo) || repo === '.' || repo === '..' || repo.endsWith('.git')) throw new SourceRefError(entry, `invalid repository "${repo ?? ''}"`);
  if (!segments.length) throw new SourceRefError(entry, 'the path to the entry Markdown file is missing');
  for (const segment of segments) {
    if (segment === '' || segment === '.' || segment === '..') throw new SourceRefError(entry, `invalid path segment "${segment}"; the path must stay inside the repository`);
  }
  const path = segments.join('/');
  if (!/\.md$/i.test(path)) throw new SourceRefError(entry, 'the entry must be a .md file');
  const slug = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
  return { ref, host: 'github.com', owner, repo, path, normalized: `${ref}@github.com/${slug}/${path}`, checkoutKey: `${ref}\n${slug}` };
}
