import type { NavItem } from '../../scripts/content';

export function breadcrumbPath(tree: NavItem[], slug: string): NavItem[] {
  const pages = new Map(tree.map(page => [page.slug, page]));
  const path: NavItem[] = [];
  const visited = new Set<string>();
  let current = pages.get(slug);
  while (current) {
    if (visited.has(current.slug)) throw new Error('Circular breadcrumb parent chain');
    visited.add(current.slug);
    path.unshift(current);
    if (current.parent === null) break;
    current = pages.get(current.parent);
    if (!current) throw new Error('Missing breadcrumb parent');
  }
  return path;
}
