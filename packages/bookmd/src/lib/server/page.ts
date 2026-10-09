import { error } from '@sveltejs/kit';
import { graph } from './content';
import { portalPage } from '$lib/portal-page';

export function loadPortalPage(slug = '') {
  const data = portalPage(graph, slug);
  if (!data) error(404, 'Page not found');
  return data;
}
