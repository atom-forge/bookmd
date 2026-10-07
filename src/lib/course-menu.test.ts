import { describe, expect, test } from 'bun:test';
import type { NavItem } from '../../scripts/content';
import { courseMenu, courseOpenPath } from './course-menu';

const items: NavItem[] = [
  { slug: 'course', title: 'Course', parent: '' },
  { slug: 'a', title: 'A', parent: 'course' },
  { slug: 'a1', title: 'A1', parent: 'a' },
  { slug: 'leaf', title: 'Leaf', parent: 'a1' },
  { slug: 'a2', title: 'A2', parent: 'a' },
  { slug: 'leaf2', title: 'Leaf 2', parent: 'a2' },
  { slug: 'b', title: 'B', parent: 'course' },
  { slug: 'b1', title: 'B1', parent: 'b' },
  { slug: 'other', title: 'Other course', parent: '' }
];

describe('single course navigation path', () => {
  test('all main branches and nested descendants retain source order', () => {
    const root = courseMenu(items, 'course');
    expect(root?.children.map(node => node.slug)).toEqual(['a', 'b']);
    expect(root?.children[0].children[0].children[0].slug).toBe('leaf');
    expect(courseMenu(items, 'missing')).toBeNull();
  });
  test('direct deep load and navigation synchronize expandable ancestors', () => {
    expect(courseOpenPath(items, 'leaf', 'course')).toEqual(['a', 'a1']);
    expect(courseOpenPath(items, 'a1', 'course')).toEqual(['a', 'a1']);
    expect(courseOpenPath(items, 'b1', 'course')).toEqual(['b']);
    expect(courseOpenPath(items, 'course', 'course')).toEqual([]);
  });
  test('selecting a parallel root replaces the old path and descendants', () => {
    let openPath = courseOpenPath(items, 'leaf', 'course');
    expect(openPath).toEqual(['a', 'a1']);
    openPath = courseOpenPath(items, 'b', 'course');
    expect(openPath).toEqual(['b']);
  });
  test('selecting a sibling keeps common ancestors', () => {
    expect(courseOpenPath(items, 'a1', 'course')).toEqual(['a', 'a1']);
    expect(courseOpenPath(items, 'a2', 'course')).toEqual(['a', 'a2']);
  });
  test('selecting an ancestor removes deeper branches but keeps the selected branch open', () => {
    expect(courseOpenPath(items, 'a', 'course')).toEqual(['a']);
    expect(courseOpenPath(items, 'course', 'course')).toEqual([]);
  });
  test('repeated active branch selection opens rather than toggles closed', () => {
    let openPath: string[] = [];
    const activeSlug = 'a1';
    for (let click = 0; click < 3; click++) {
      openPath = courseOpenPath(items, activeSlug, 'course');
      expect(openPath).toEqual(['a', 'a1']);
    }
  });
  test('selecting the active leaf restores its ancestors from another path', () => {
    let openPath = courseOpenPath(items, 'b', 'course');
    expect(openPath).toEqual(['b']);
    openPath = courseOpenPath(items, 'leaf', 'course');
    expect(openPath).toEqual(['a', 'a1']);
  });
  test('external context may use last tree page; unrelated and cyclic paths are safe', () => {
    expect(courseOpenPath(items, 'leaf', 'course')).toEqual(['a', 'a1']);
    expect(courseOpenPath(items, 'other', 'course')).toEqual([]);
    expect(courseOpenPath(items, 'missing', 'course')).toEqual([]);
    expect(courseOpenPath([{ slug: 'loop', title: 'Loop', parent: 'loop' }], 'loop', 'course')).toEqual([]);
  });
});
