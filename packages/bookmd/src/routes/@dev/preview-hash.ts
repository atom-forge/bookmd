export type PreviewLocation = { slug: string | null; heading: string | null };

const encode = (slug: string) => slug.split('/').map(encodeURIComponent).join('/');

/** `#page=<slug>[&heading=<id>]`; the page and heading never compete for one fragment. */
export function previewHash(slug: string, heading?: string | null): string {
  return `#page=${encode(slug)}${heading ? `&heading=${encodeURIComponent(heading)}` : ''}`;
}

function decode(value: string): string | null {
  try { return decodeURIComponent(value); } catch { return null; }
}

export function parsePreviewHash(hash: string): PreviewLocation {
  const params = new URLSearchParams(hash.replace(/^#/, '').replaceAll('+', '%2B'));
  const page = params.get('page');
  const slug = page === null ? null : decode(page.replaceAll('%2B', '+'));
  return { slug: slug || null, heading: params.get('heading') || null };
}
