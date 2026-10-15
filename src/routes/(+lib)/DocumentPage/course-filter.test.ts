import { expect, test } from 'bun:test';
import type { Course } from '../../../core/content';
import { emptySelection, filterCourses, options, selectionFromQuery, selectionToQuery, toggle } from './course-filter';

const base: Course = { slug: '', name: '', subtitle: '', authors: [], released: null, copyright: '', license: '', language: 'hu', tags: [], contentTags: [], intro: '', image: null };
const a: Course = { ...base, slug: 'a', language: 'hu', authors: ['Éva'], tags: ['web', 'Kezdő'], contentTags: ['HTML'] };
const b: Course = { ...base, slug: 'b', language: 'en', authors: ['Eva', 'John'], tags: ['web'], contentTags: ['CSS', 'HTML'] };
const c: Course = { ...base, slug: 'c', language: 'en', authors: ['John'], tags: ['kezdo'], contentTags: [] };
const courses = [a, b, c];
const select = (...steps: [Parameters<typeof toggle>[1], string][]) => steps.reduce((selection, [group, key]) => toggle(selection, group, key), emptySelection());
const slugs = (list: Course[]) => list.map(course => course.slug);

test('no selection shows every book', () => expect(filterCourses(courses, emptySelection())).toBe(courses));

test('language and author are OR inside the group, groups are AND', () => {
  expect(slugs(filterCourses(courses, select(['language', 'hu'], ['language', 'en'])))).toEqual(['a', 'b', 'c']);
  expect(slugs(filterCourses(courses, select(['author', 'eva'], ['author', 'john'])))).toEqual(['a', 'b', 'c']);
  expect(slugs(filterCourses(courses, select(['language', 'en'], ['author', 'eva'])))).toEqual(['b']);
});

test('tags and topics are AND inside the group, ignoring case and accents', () => {
  expect(slugs(filterCourses(courses, select(['tag', 'web'], ['tag', 'kezdo'])))).toEqual(['a']);
  expect(slugs(filterCourses(courses, select(['topic', 'html'], ['topic', 'css'])))).toEqual(['b']);
});

test('options carry the number of books they would show', () => {
  const all = options(courses, emptySelection());
  expect(all.language.map(o => [o.label, o.count])).toEqual([['en', 2], ['hu', 1]]);
  expect(all.author.map(o => [o.key, o.count])).toEqual([['eva', 2], ['john', 2]]);
  const english = options(courses, select(['language', 'en']));
  expect(english.tag.find(o => o.key === 'web')!.count).toBe(1);
  expect(english.tag.find(o => o.key === 'kezdo')!.count).toBe(1);
  // an OR group still counts the books of its other options
  expect(english.language.find(o => o.key === 'hu')!.count).toBe(1);
  expect(english.language.find(o => o.key === 'en')).toMatchObject({ selected: true, count: 2 });
  // an AND group counts only the books that stay
  const web = options(courses, select(['tag', 'web']));
  expect(web.tag.find(o => o.key === 'kezdo')!.count).toBe(1);
  expect(web.topic.find(o => o.key === 'css')!.count).toBe(1);
});

test('the selection survives a round trip through the query string and drops unknown options', () => {
  const selection = select(['language', 'en'], ['tag', 'web'], ['tag', 'kezdo']);
  const query = selectionToQuery(selection, new URLSearchParams('keep=1'));
  expect(query.get('keep')).toBe('1');
  expect(selectionFromQuery(query, courses)).toEqual(selection);
  expect(selectionFromQuery(new URLSearchParams('tag=nope&lang=en&lang=en'), courses)).toEqual(select(['language', 'en']));
});
