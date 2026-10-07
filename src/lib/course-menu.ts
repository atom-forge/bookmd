import type { NavItem } from '../../scripts/content';

export type CourseNode = NavItem & { children: CourseNode[] };

export function courseMenu(items: NavItem[], courseSlug: string): CourseNode | null {
  const nodes = new Map(items.map(item => [item.slug, { ...item, children: [] as CourseNode[] }]));
  for (const node of nodes.values()) {
    if (node.slug !== courseSlug && node.parent !== null) nodes.get(node.parent)?.children.push(node);
  }
  return nodes.get(courseSlug) || null;
}

// Only expandable ancestors (including the selected node) belong to the open path.
export function courseOpenPath(items: NavItem[], slug: string, courseSlug: string): string[] {
  const path: string[] = [];
  const seen = new Set<string>();
  let node = items.find(item => item.slug === slug);
  while (node && node.slug !== courseSlug && !seen.has(node.slug)) {
    seen.add(node.slug);
    if (items.some(item => item.parent === node?.slug)) path.unshift(node.slug);
    node = items.find(item => item.slug === node?.parent);
  }
  return node?.slug === courseSlug ? path : [];
}

