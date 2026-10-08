import { error } from '@sveltejs/kit';
import { graph } from './content';
import { breadcrumbPath } from '$lib/breadcrumb';
import { readingOrder } from '$lib/reading-order';

export function loadPortalPage(slug = '') {
  const page = graph.pages.find(page => page.slug === slug.replace(/\/$/, ''));
  if (!page) error(404, 'Page not found');
  const tree = graph.navigation;
  const firstHeading = page.headings.find(heading => heading.depth === 1);
  const titleHeading = page.slug !== '' && firstHeading?.title === page.title ? firstHeading : null;
  const course = graph.courses.find(course => course.slug === page.course) || null;
  return {
    page, course, branding: graph.branding || '',
    courseTree: course ? tree.filter(item => {
      const path = breadcrumbPath(tree, item.slug);
      return path.some(parent => parent.slug === course.slug);
    }) : [],
    courses: page.slug === '' ? graph.courses : [],
    titleHeading,
    articleHtml: page.html,
    breadcrumb: breadcrumbPath(tree, page.inTree ? page.slug : course?.slug || ''),
    treePaths: Object.fromEntries(tree.map(item => [item.slug, breadcrumbPath(tree, item.slug)])),
    ...readingOrder(graph.pages, page, tree)
  };
}
export type PortalPageData = ReturnType<typeof loadPortalPage>;
