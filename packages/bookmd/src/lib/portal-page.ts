import type { ContentGraph } from '../core/content';
import { breadcrumbPath } from './breadcrumb';
import { readingOrder } from './reading-order';

/** Page view model derived from a content graph; shared by the build and the browser preview. */
export function portalPage(graph: ContentGraph, slug = '') {
  const page = graph.pages.find(page => page.slug === slug.replace(/\/$/, ''));
  if (!page) return null;
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
export type PortalPageData = NonNullable<ReturnType<typeof portalPage>>;
