import type { Course } from '../../../core/content';

function normalize(text: string): string {
  return text.toLocaleLowerCase('hu').normalize('NFD').replace(/\p{M}/gu, '');
}

export function filterCourses(courses: Course[], query: string): Course[] {
  const words = normalize(query).trim().split(/\s+/u).filter(Boolean);
  if (!words.length) return courses;
  return courses.filter(course => {
    const text = normalize([course.name, course.author ?? '', course.intro, ...course.tags, ...course.contentTags].join(' '));
    return words.every(word => text.includes(word));
  });
}
