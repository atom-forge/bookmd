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
  expect(readingOrder(pages, pages[4])).toEqual({ previous: pages[3], next: pages[5], previousFromParent: false, nextFromParent: false, nextToChild: false });
});

test('first and last children use the parent neighbours', () => {
  expect(readingOrder(pages, pages[3])).toMatchObject({ previous: pages[0], previousFromParent: true, nextFromParent: false });
  expect(readingOrder(pages, pages[5])).toMatchObject({ next: pages[2], nextFromParent: true, previousFromParent: false });
});

test('missing neighbours stay absent', () => {
  expect(readingOrder(pages, pages[0])).toMatchObject({ previous: null, previousFromParent: false });
  expect(readingOrder(pages, { slug: 'outside', parent: null, previous: null, next: null })).toEqual({ previous: null, next: null, previousFromParent: false, nextFromParent: false, nextToChild: false });
});

test('parents descend to their first direct child before their next sibling', () => {
  expect(readingOrder(pages, pages[1])).toEqual({
    previous: pages[0], next: pages[3], previousFromParent: false, nextFromParent: false, nextToChild: true
  });
});

test('child selection follows navigation order, not discovery order or slug order', () => {
  const nested = { slug: 'nested', parent: 'first', previous: null, next: null };
  const discovered = [pages[1], nested, pages[5], pages[4], pages[3], pages[0], pages[2]];
  const tree = [pages[0], pages[1], pages[3], nested, pages[4], pages[5], pages[2]];
  expect(readingOrder(discovered, pages[1], tree)).toMatchObject({ next: pages[3], nextToChild: true, nextFromParent: false });
  expect(readingOrder(discovered, pages[3], tree)).toMatchObject({ previous: pages[0], previousFromParent: true, next: nested, nextToChild: true, nextFromParent: false });
});

test('a last sibling with children descends rather than using its parent next', () => {
  const child = { slug: 'last-child', parent: 'last', previous: null, next: null };
  expect(readingOrder([...pages, child], pages[5])).toMatchObject({
    previous: pages[4], previousFromParent: false, next: child, nextToChild: true, nextFromParent: false
  });
});

test('leaves keep sibling and parent-next fallbacks', () => {
  expect(readingOrder(pages, pages[4])).toMatchObject({ next: pages[5], nextToChild: false, nextFromParent: false });
  expect(readingOrder(pages, pages[5])).toMatchObject({ next: pages[2], nextToChild: false, nextFromParent: true });
  expect(readingOrder(pages, pages[2])).toMatchObject({ next: null, nextToChild: false, nextFromParent: false });
});

test('children of the empty root slug are valid next targets', () => {
  const root = { slug: '', parent: null, previous: null, next: null };
  const child = { slug: 'child', parent: '', previous: null, next: null };
  expect(readingOrder([root, child], root)).toMatchObject({ next: child, nextToChild: true, nextFromParent: false });
});

test('an empty root slug is a valid neighbour', () => {
  const root = { slug: '', parent: null, previous: null, next: null };
  const parent = { slug: 'parent', parent: '', previous: '', next: null };
  const child = { slug: 'child', parent: 'parent', previous: null, next: null };
  expect(readingOrder([root, parent, child], child)).toMatchObject({ previous: root, previousFromParent: true });
});
