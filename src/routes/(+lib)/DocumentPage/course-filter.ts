import { normalizeTag, type Course } from '../../../core/content';

export const groups = ['language', 'author', 'tag', 'topic'] as const;
export type Group = (typeof groups)[number];
/** The selected options of every group, as normalized keys. */
export type Selection = Record<Group, string[]>;
export type Option = { key: string; label: string; count: number; selected: boolean };

export const titles: Record<Group, string> = { language: 'Language', author: 'Author', tag: 'Tags', topic: 'Topics' };
/** `any`: a book matches when it has at least one selected option. `all`: it must have every selected option. */
export const modes: Record<Group, 'any' | 'all'> = { language: 'any', author: 'any', tag: 'all', topic: 'all' };

export const emptySelection = (): Selection => ({ language: [], author: [], tag: [], topic: [] });
export const isEmpty = (selection: Selection) => groups.every(group => !selection[group].length);
export const selectionSize = (selection: Selection) => groups.reduce((sum, group) => sum + selection[group].length, 0);

function labels(course: Course, group: Group): string[] {
  switch (group) {
    case 'language': return course.language ? [course.language] : [];
    case 'author': return course.authors;
    case 'tag': return course.tags;
    case 'topic': return course.contentTags;
  }
}
const keys = (course: Course, group: Group) => new Set(labels(course, group).map(normalizeTag));

/** Whether the book satisfies the selection; the groups are combined with AND, `skip` leaves one group out. */
function matches(course: Course, selection: Selection, skip?: Group): boolean {
  return groups.every(group => {
    const wanted = selection[group];
    if (group === skip || !wanted.length) return true;
    const own = keys(course, group);
    return modes[group] === 'any' ? wanted.some(key => own.has(key)) : wanted.every(key => own.has(key));
  });
}

export function filterCourses(courses: Course[], selection: Selection): Course[] {
  return isEmpty(selection) ? courses : courses.filter(course => matches(course, selection));
}

/**
 * Every option of a group with the number of books it would show: the count of the books that match the
 * selection of the other groups (and, in an `all` group, of the group itself) and have the option.
 */
export function options(courses: Course[], selection: Selection): Record<Group, Option[]> {
  const result = {} as Record<Group, Option[]>;
  for (const group of groups) {
    const known = new Map<string, string>();
    for (const course of courses) for (const label of labels(course, group)) if (!known.has(normalizeTag(label))) known.set(normalizeTag(label), label);
    const pool = courses.filter(course => matches(course, selection, modes[group] === 'any' ? group : undefined));
    result[group] = [...known].map(([key, label]) => ({
      key, label, selected: selection[group].includes(key),
      count: pool.filter(course => keys(course, group).has(key)).length
    })).sort((a, b) => a.label.localeCompare(b.label, 'hu'));
  }
  return result;
}

export function toggle(selection: Selection, group: Group, key: string): Selection {
  const current = selection[group];
  return { ...selection, [group]: current.includes(key) ? current.filter(item => item !== key) : [...current, key] };
}

const parameters: Record<Group, string> = { language: 'lang', author: 'author', tag: 'tag', topic: 'topic' };
export function selectionToQuery(selection: Selection, search: URLSearchParams = new URLSearchParams()): URLSearchParams {
  for (const group of groups) search.delete(parameters[group]);
  for (const group of groups) for (const key of selection[group]) search.append(parameters[group], key);
  return search;
}
/** The selection of a query string; options that no book has are dropped. */
export function selectionFromQuery(search: URLSearchParams, courses: Course[]): Selection {
  const available = options(courses, emptySelection());
  const selection = emptySelection();
  for (const group of groups) {
    const known = new Set(available[group].map(option => option.key));
    selection[group] = [...new Set(search.getAll(parameters[group]))].filter(key => known.has(key));
  }
  return selection;
}
