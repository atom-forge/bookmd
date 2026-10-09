import { graph } from '$lib/server/content';
import { loadPortalPage } from '$lib/server/page';
import type { EntryGenerator, PageServerLoad } from './$types';
export const entries: EntryGenerator = () => graph.pages.filter(page => page.slug).map(({ slug }) => ({ slug }));
export const load: PageServerLoad = ({ params }) => loadPortalPage(params.slug);
