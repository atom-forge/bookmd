import { getContext, setContext } from 'svelte';
import { base } from '$app/paths';

export type PageHref = (slug: string) => string;
const key = Symbol('page-href');

/** Published URL of a page; the default when no context overrides it. */
export const publishedHref: PageHref = slug => `${base}/${slug ? slug.split('/').map(encodeURIComponent).join('/') + '/' : ''}`;

export function providePageHref(href: PageHref) { setContext(key, href); }
export function usePageHref(): PageHref { return getContext<PageHref | undefined>(key) ?? publishedHref; }
