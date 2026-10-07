import { expect, test } from 'bun:test';
import { readingOrder } from './reading-order';

const pages: { slug: string; parent: string | null; previous: string | null; next: string | null }[] = [
  { slug: 'before', parent: null, previous: null, next: 'module' },
  { slug: 'module', parent: null, previous: 'before', next: 'after' },
  { slug: 'after', parent: null, previous: 'module', next: null },
  { slug: 'first', parent: 'module', previous: null, next: 'middle' },
  { slug: 'middle', parent: 'module', previous: 'first', next: 'last' },
  { slug: 'last', parent: 'module', previous: 'middle', next: null }
];

test('sibling links take precedence over parent links', () => {
  expect(readingOrder(pages, pages[4])).toEqual({ previous: pages[3], next: pages[5], previousFromParent: false, nextFromParent: false });
});

test('first and last children use the parent neighbours', () => {
  expect(readingOrder(pages, pages[3])).toMatchObject({ previous: pages[0], previousFromParent: true, nextFromParent: false });
  expect(readingOrder(pages, pages[5])).toMatchObject({ next: pages[2], nextFromParent: true, previousFromParent: false });
});

test('missing neighbours stay absent', () => {
  expect(readingOrder(pages, pages[0])).toMatchObject({ previous: null, previousFromParent: false });
  expect(readingOrder(pages, { slug: 'outside', parent: null, previous: null, next: null })).toEqual({ previous: null, next: null, previousFromParent: false, nextFromParent: false });
});

test('an empty root slug is a valid neighbour', () => {
  const root = { slug: '', parent: null, previous: null, next: null };
  const parent = { slug: 'parent', parent: '', previous: '', next: null };
  const child = { slug: 'child', parent: 'parent', previous: null, next: null };
  expect(readingOrder([root, parent, child], child)).toMatchObject({ previous: root, previousFromParent: true });
});
