// Virtual POSIX paths; adapters map these identifiers to their storage.
export const sep = '/';
export function resolve(...parts: string[]): string {
  let path = '';
  for (const part of parts) path = part.startsWith('/') ? part : path + '/' + part;
  const segments: string[] = [];
  for (const part of path.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (!segments.length) throw new Error(`Content escapes root: ${path}`);
      segments.pop();
    } else segments.push(part);
  }
  return '/' + segments.join('/');
}
export function relative(from: string, to: string): string {
  const a = resolve(from).split('/').filter(Boolean);
  const b = resolve(to).split('/').filter(Boolean);
  let common = 0;
  while (common < a.length && common < b.length && a[common] === b[common]) common++;
  return [...a.slice(common).map(() => '..'), ...b.slice(common)].join('/');
}
export function dirname(path: string): string { return path.slice(0, path.lastIndexOf('/')) || '/'; }
export function basename(path: string, suffix = ''): string {
  const name = path.split('/').at(-1)!;
  return suffix && name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
}
export function extname(path: string): string {
  const name = basename(path);
  const index = name.lastIndexOf('.');
  return index > 0 ? name.slice(index) : '';
}
