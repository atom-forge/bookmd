import { expect, test } from 'bun:test';
import type { Course } from '../../../../scripts/content';
import { filterCourses } from './course-search';

const course: Course = {
  slug: 'web', name: 'Árvíztűrő WEB', author: 'Őri Éva',
  intro: 'Bevezetés a hálózatok világába', tags: ['kezdő', 'Saját címke'],
  contentTags: ['Összesített téma'], language: 'hu', image: '/image.png'
};
const other: Course = { ...course, slug: 'other', name: 'Other', author: null, intro: '', tags: [], contentTags: [] };
const courses = [course, other];

test('empty and whitespace queries preserve all courses and their order', () => {
  expect(filterCourses(courses, '')).toBe(courses);
  expect(filterCourses(courses, ' \t\n ')).toBe(courses);
  expect(filterCourses([], 'web')).toEqual([]);
});

test('searches each actual course text field ignoring case and Hungarian accents', () => {
  for (const query of ['osszesitett tema', 'ARVIZTURO', 'ori eva', 'HALOZATOK', 'kezdo', 'sajat cimke', 'ÁRVÍZTŰRŐ', 'O\u030Bri']) {
    expect(filterCourses(courses, query)).toEqual([course]);
  }
});

test('all words must match but can occur across fields and in any order', () => {
  expect(filterCourses(courses, ' kezdo\tEVA\nweb halo ')).toEqual([course]);
  expect(filterCourses(courses, 'web missing')).toEqual([]);
});

test('handles missing optional metadata without indexing non-search fields or materials', () => {
  expect(filterCourses([other], 'other')).toEqual([other]);
  for (const query of ['2026', 'hu', 'image.png', 'full material text', 'null']) {
    expect(filterCourses(courses, query)).toEqual([]);
  }
  expect(courses).toEqual([course, other]);
});
