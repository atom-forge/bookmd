import { readFile, writeFile, mkdir, copyFile, realpath, rm } from 'node:fs/promises';
import { resolve, relative, dirname, extname, sep, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Root as MarkdownRoot, Link, Image } from 'mdast';
import type { Root as HtmlRoot, Element } from 'hast';
import config from '../portal.config';
import { parse as parseYaml } from 'yaml';
import { remarkCallouts, rehypeCalloutIcons } from './callouts';

export type NavItem = { slug: string; title: string; parent: string | null; chapter?: string | number };
export type ContentPage = NavItem & {
  type?: string; course: string | null; html: string; text: string; inTree: boolean;
  previous: string | null; next: string | null;
  author: string | null; tags: string[];
  headings: { id: string; title: string; depth: number }[];
};
export type Course = {
  slug: string; name: string; author: string | null;
  language: string; tags: string[]; contentTags: string[]; intro: string; image: string | null;
};
export function normalizeTag(tag: string): string {
  return tag.trim().toLocaleLowerCase('hu').normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/gu, ' ');
}

export type ContentGraph = { branding?: string; exportManifest?: { course: string; source: string; number: number[]; filename: string }[]; pages: ContentPage[]; navigation: NavItem[]; courses: Course[] };
const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
const external = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

export function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) return null;
    let id: string | null = null;
    if (parsed.hostname === 'youtu.be') id = parsed.pathname.slice(1);
    if (['youtube.com', 'www.youtube.com', 'www.youtube-nocookie.com'].includes(parsed.hostname)) {
      id = parsed.pathname === '/watch' ? parsed.searchParams.get('v') : parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1] || null;
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function interactiveEmbed(url: string): { src: string; title: string; className: string } | null {
  const video = youtubeId(url);
  if (video) return { src: `https://www.youtube-nocookie.com/embed/${video}`, title: 'YouTube video', className: 'youtube' };
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) return null;
    if (['desmos.com', 'www.desmos.com'].includes(parsed.hostname)) {
      const graph = parsed.pathname.match(/^\/(calculator|3d)\/([a-zA-Z0-9]+)\/?$/);
      if (graph) return { src: `https://www.desmos.com/${graph[1]}/${graph[2]}?embed`, title: graph[1] === '3d' ? 'Desmos 3D graph' : 'Desmos graph', className: 'math-embed' };
    }
    if (['geogebra.org', 'www.geogebra.org'].includes(parsed.hostname)) {
      const material = parsed.pathname.match(/^\/m\/([a-zA-Z0-9]+)\/?$/);
      if (material) return {
        src: `https://www.geogebra.org/material/iframe/id/${material[1]}/width/1000/height/600/border/888888/rc/true/ai/false/sdz/true/smb/false/stb/false/stbh/false/ld/false/sri/true/sfsb/true`,
        title: 'GeoGebra activity', className: 'math-embed'
      };
    }
  } catch { /* Unsupported URLs remain ordinary links. */ }
  return null;
}

async function renderSource(tree: MarkdownRoot, usedIds: Set<string>) {
  const headings: ContentPage['headings'] = [];
  const remap = new Map<string, string>();
      const processor = unified().use(remarkCallouts).use(remarkRehype).use(rehypeCalloutIcons).use(rehypeSlug).use(() => (htmlTree: HtmlRoot) => {
    visit(htmlTree, 'element', node => {
      if (!node.properties.id) return;
      const original = String(node.properties.id);
      let id = original;
      for (let suffix = 1; usedIds.has(id); suffix++) id = `${original}-${suffix}`;
      usedIds.add(id); remap.set(original, id); node.properties.id = id;
    });
    visit(htmlTree, 'element', node => {
      const href = node.properties.href;
      if (typeof href === 'string' && href.startsWith('#')) {
        const id = decodeURIComponent(href.slice(1));
        if (remap.has(id)) node.properties.href = `#${remap.get(id)}`;
      }
      for (const property of ['ariaDescribedBy', 'ariaLabelledBy']) {
        const ids = node.properties[property];
        if (Array.isArray(ids)) node.properties[property] = ids.map(id => remap.get(String(id)) || id);
      }
    });
  }).use(rehypeKatex).use(rehypeHighlight, { detect: false, ignoreMissing: true }).use(() => (htmlTree: HtmlRoot) => {
        visit(htmlTree, 'element', (node, index, parentNode) => {
          if (/^h[1-6]$/.test(node.tagName)) {
            const content = (element: Element): string => element.children.map(child => child.type === 'text' ? child.value : child.type === 'element' ? content(child) : '').join('');
            headings.push({ id: String(node.properties.id), title: content(node), depth: Number(node.tagName[1]) });
          }
          if (node.tagName === 'pre') {
            const code = node.children[0];
            if (code?.type === 'element' && (code.properties.className as string[] | undefined)?.includes('language-mermaid')) {
              node.properties = { className: ['mermaid-source'] };
              node.children = code.children;
            }
          }
          if (node.tagName === 'p' && node.children.length === 1 && parentNode && index !== undefined) {
            const link = node.children[0];
            if (link.type !== 'element' || link.tagName !== 'a' || link.properties['data-embed'] !== 'true') return;
            const embed = interactiveEmbed(String(link.properties.href));
            if (!embed) return;
            parentNode.children[index] = {
              type: 'element', tagName: 'iframe', properties: {
                src: embed.src, title: embed.title,
                loading: 'lazy', allowFullScreen: true, className: [embed.className],
                referrerPolicy: 'strict-origin-when-cross-origin'
              }, children: []
            };
          }
        });
      }).use(rehypeStringify);
      const html = String(processor.stringify(await processor.run(tree)));

  return { html, headings };
}

export async function buildGraph(contentRoot: string, entrypoint: string, base = '', assetDir = resolve('static/content-assets')): Promise<ContentGraph> {
  const root = await realpath(contentRoot);
  const graph: ContentGraph = { pages: [], navigation: [], courses: [] };
  async function contained(file: string) {
    const target = await realpath(file);
    const rel = relative(root, target);
    if (rel.split(sep)[0] === '..' || rel.startsWith(sep)) throw new Error(`Content escapes root: ${file}`);
    return target;
  }
  const wikiLinks = new WeakSet<Link>();
  function referencePaths(value: unknown, key: string, file: string): string[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) throw new Error(`Invalid ${key} in ${file}`);
    return value.map(item => {
      if (typeof item !== 'string' || !item.trim()) throw new Error(`Invalid ${key} in ${file}`);
      const path = item.trim();
      const wiki = path.match(/^\[\[([^\[\]\n|]+)\]\]$/);
      if (wiki && wiki[1].trim()) return wiki[1].trim();
      if (path.includes('[') || path.includes(']')) throw new Error(`Invalid ${key} in ${file}`);
      return path;
    });
  }
  async function document(file: string) {
    let body = await readFile(file, 'utf8');
    let metadata: Record<string, unknown> = {};
    const frontmatter = body.match(/^\uFEFF?---\r?\n((?:[^\n]*\n)*?)---(?:\r?\n|$)/);
    if (frontmatter) {
      const parsed = parseYaml(frontmatter[1]);
      if (parsed !== null && (typeof parsed !== 'object' || Array.isArray(parsed))) throw new Error(`Invalid frontmatter in ${file}`);
      metadata = parsed || {};
      body = body.slice(frontmatter[0].length);
    }
    const sources = referencePaths(metadata.sources, 'sources', file);
    if (metadata.series !== undefined || metadata.tree !== undefined) throw new Error(`Use children instead of series or tree in ${file}`);
    const children = metadata.children ?? [];
    if (!Array.isArray(children)) throw new Error(`Invalid children in ${file}`);
    const childLinks = children.map(value => {
      if (typeof value !== 'string' || !value.trim()) throw new Error(`Invalid children in ${file}`);
      const wiki = value.trim().match(/^\[\[([^\[\]\n|]+)\]\]$/);
      if (wiki && wiki[1].trim()) return { path: wiki[1].trim(), title: '' };
      const parsed = parser.parse(value.trim()) as MarkdownRoot;
      const paragraph = parsed.children[0];
      if (parsed.children.length !== 1 || paragraph.type !== 'paragraph' || paragraph.children.length !== 1 || paragraph.children[0].type !== 'link') throw new Error(`Invalid children in ${file}: expected a wiki or Markdown link`);
      const link = paragraph.children[0];
      return { path: link.url, title: toString(link).trim() };
    });
    const tree = parser.parse(body) as MarkdownRoot;
    // GFM autolinks split [[https://...]] into text + link + text.
    // Rejoin those nodes before processing regular wiki links.
    visit(tree, 'paragraph', paragraph => {
      for (let i = 1; i < paragraph.children.length - 1; i++) {
        const before = paragraph.children[i - 1];
        const link = paragraph.children[i];
        const after = paragraph.children[i + 1];
        if (before.type !== 'text' || link.type !== 'link' || after.type !== 'text'
          || !before.value.endsWith('[[') || !after.value.startsWith(']]')) continue;
        before.value = before.value.slice(0, -2);
        after.value = after.value.slice(2);
        link.data = { ...link.data, hProperties: { 'data-embed': 'true' } };
        if (!before.value) { paragraph.children.splice(i - 1, 1); i--; }
        if (!after.value) paragraph.children.splice(i + 1, 1);
      }
    });
    const references = new Map<string, string>();
    visit(tree, 'definition', node => { references.set(node.identifier, node.url); });
    visit(tree, (node, index, parent) => {
      if ((node.type === 'linkReference' || node.type === 'imageReference') && parent && index !== undefined) {
        const url = references.get(node.identifier);
        if (!url) throw new Error(`Missing reference ${node.identifier} in ${file}`);
        parent.children[index] = node.type === 'linkReference' ? { type: 'link', url, children: node.children } : { type: 'image', url, alt: node.alt };
      }
    });
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined || parent.type === 'link' || parent.type === 'linkReference') return;
      const parts: (typeof node | Link)[] = [];
      const pattern = /(?<!!)\[\[([^\[\]\n|]+)(?:\|([^\[\]\n]+))?\]\]/g;
      let cursor = 0;
      for (const match of node.value.matchAll(pattern)) {
        const url = match[1].trim();
        if (!url) continue;
        if (match.index! > cursor) parts.push({ type: 'text', value: node.value.slice(cursor, match.index) });
        const link: Link = { type: 'link', url, children: match[2] ? [{ type: 'text', value: match[2].trim() }] : [] };
        if (external.test(url)) {
          if (!link.children.length) link.children = [{ type: 'text', value: url }];
          link.data = { hProperties: { 'data-embed': 'true' } };
        }
        wikiLinks.add(link);
        parts.push(link);
        cursor = match.index! + match[0].length;
      }
      if (!cursor) return;
      if (cursor < node.value.length) parts.push({ type: 'text', value: node.value.slice(cursor) });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
    return { tree, sources, children: childLinks, metadata };
  }
  async function target(file: string, url: string) {
    if (external.test(url) || !url.split(/[?#]/)[0]) throw new Error(`Expected local path in ${file}: ${url}`);
    const path = decodeURIComponent(url.split(/[?#]/)[0]);
    try {
      return await contained(path.startsWith('/') ? resolve(root, '.' + path) : resolve(dirname(file), path));
    } catch (error) {
      const marker = `/${basename(root)}/`;
      const index = path.indexOf(marker);
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || index === -1) throw error;
      // Obsidian may rewrite links as paths from the vault root.
      return contained(resolve(root, path.slice(index + marker.length)));
    }
  }
  async function markdownTarget(file: string, path: string) {
    const pathPart = path.split(/[?#]/)[0];
    const result = await target(file, extname(pathPart) ? path : pathPart + '.md' + path.slice(pathPart.length));
    if (extname(result).toLowerCase() !== '.md') throw new Error(`Expected Markdown file: ${result}`);
    return result;
  }
  await mkdir(assetDir, { recursive: true });
  async function asset(file: string) {
    const name = `${createHash('sha256').update(relative(root, file)).digest('hex').slice(0, 16)}${extname(file)}`;
    await copyFile(file, resolve(assetDir, name));
    return `${base}/content-assets/${name}`;
  }
  const start = await contained(resolve(root, entrypoint));
  const files = new Map<string, string>([['', start]]);
  const parents = new Map<string, string | null>([['', null]]);
  const titles = new Map<string, string>();
  const aliases = new Map<string, string>([[start, '']]);
  const declaredOwners = new Map<string, string>();
  const courseRoots: { directory: string; slug: string; file: string }[] = [];
  const siblings = new Map<string, { previous: string | null; next: string | null }>();
  const queue = [''];
  const discovered = new Set(queue);
  function slugFor(file: string) {
    return aliases.get(file) ?? relative(root, file).split(sep).join('/').replace(/\.md$/i, '');
  }
  function register(file: string) {
    const slug = slugFor(file);
    if (files.has(slug) && files.get(slug) !== file) throw new Error(`Duplicate route ${slug}`);
    files.set(slug, file);
    if (!discovered.has(slug)) { discovered.add(slug); queue.push(slug); }
    return slug;
  }
  function owner(file: string) {
    if (file === start) return null;
    if (declaredOwners.has(file)) return declaredOwners.get(file)!;
    return courseRoots.filter(course => file === course.file || (relative(course.directory, file).split(sep)[0] !== '..' && !relative(course.directory, file).startsWith(sep)))
      .sort((a, b) => b.directory.length - a.directory.length)[0]?.slug ?? null;
  }
  const catalog = await document(start);
  if (catalog.metadata.branding !== undefined && typeof catalog.metadata.branding !== 'string') throw new Error(`Invalid branding in ${start}: expected text`);
  graph.branding = typeof catalog.metadata.branding === 'string' ? catalog.metadata.branding.trim() : '';
  const coursePaths = referencePaths(catalog.metadata.courses, 'courses', start);
  for (const path of coursePaths) {
    const file = await markdownTarget(start, path);
    if (aliases.has(file)) throw new Error(`Repeated course: ${path}`);
    const route = relative(root, file).split(sep).join('/').replace(/(?:^|\/)course\.md$/i, '').replace(/\.md$/i, '');
    if (!route) throw new Error('Course entry must have its own route');
    aliases.set(file, route);
    const slug = register(file);
    parents.set(slug, '');
    courseRoots.push({ directory: dirname(file), file, slug });
    const { metadata, tree } = await document(file);
    function text(key: string, required = false) {
      const value = metadata[key];
      if (value === undefined || value === null || value === '') {
        if (required) throw new Error(`Missing ${key} in ${file}`);
        return '';
      }
      if (typeof value !== 'string') throw new Error(`Invalid ${key} in ${file}`);
      const trimmed = value.trim();
      if (required && !trimmed) throw new Error(`Missing ${key} in ${file}`);
      return trimmed;
    }
    let name = text('name');
    visit(tree, 'heading', node => { if (!name && node.depth === 1) name = toString(node); });
    name ||= slug.split('/').at(-1)!;
    const tags = metadata.tags ?? [];
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error(`Invalid tags in ${file}`);
    if ('instructor' in metadata || 'year' in metadata) throw new Error(`Obsolete course metadata in ${file}: use author instead of instructor and remove year`);
    const image = text('image');
    const imageUrl = image ? await asset(await target(file, image)) : null;
    graph.courses.push({ slug, name, author: text('author') || null, language: text('language', true), tags: [...new Set(tags.map(tag => tag.trim()))], contentTags: [], intro: text('intro'), image: imageUrl });
    titles.set(slug, name);
  }
  const processedChildren = new Set<string>();
  const membership = new Map<string, string>();
  async function registerChildren(file: string, children: { path: string; title: string }[]) {
    if (processedChildren.has(file)) return;
    processedChildren.add(file);
    if (!children.length) return;
    const rootSlug = register(file);
    const members: string[] = [];
    for (const child of children) {
      const member = register(await markdownTarget(file, child.path));
      if (member === rootSlug) throw new Error(`Children cannot contain their parent: ${file}`);
      if (membership.has(member)) throw new Error(`Repeated child: ${member}`);
      if (child.title) titles.set(member, child.title);
      membership.set(member, rootSlug);
      members.push(member);
    }
    members.forEach((slug, index) => siblings.set(slug, { previous: members[index - 1] ?? null, next: members[index + 1] ?? null }));
  }
  const href = (slug: string) => `${base}/${slug ? slug.split('/').map(encodeURIComponent).join('/') + '/' : ''}`;
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const slug = queue[cursor];
      let title = titles.get(slug) || '';
      const texts: string[] = [];
      const headings: ContentPage['headings'] = [];
      const usedIds = new Set<string>();
      let html = '';
      let author: string | null = null;
      let type: string | undefined;
      let tags: string[] = [];
      async function append(file: string, ancestors: string[]) {
        if (ancestors.includes(file)) throw new Error(`Circular sources: ${[...ancestors, file].join(' -> ')}`);
        const { tree, sources, children, metadata } = await document(file);
        if (!ancestors.length) {
          if (metadata.type !== undefined && typeof metadata.type !== 'string') throw new Error(`Invalid type in ${file}`);
          type = typeof metadata.type === 'string' ? metadata.type : undefined;
          if (relative(root, file).split(sep).includes('resources') && 'tags' in metadata) throw new Error(`Resources cannot have tags: ${file}`);
          if (metadata.author !== undefined && typeof metadata.author !== 'string') throw new Error(`Invalid author in ${file}`);
          author = typeof metadata.author === 'string' ? metadata.author.trim() || null : null;
          const pageTags = metadata.tags ?? [];
          if (!Array.isArray(pageTags) || pageTags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error(`Invalid tags in ${file}`);
          tags = [...new Set(pageTags.map(tag => tag.trim()))];
        }
        await registerChildren(file, children);
        visit(tree, 'heading', node => { if (!title && node.depth === 1) title = toString(node); });
        texts.push(toString(tree));
        const links: (Link | Image)[] = [];
        visit(tree, node => { if (node.type === 'link' || node.type === 'image') links.push(node); });
        for (const node of links) {
          if (external.test(node.url)) continue;
          const match = node.url.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/)!;
          if (!match[1]) continue;
          const fileTarget = node.type === 'link' && wikiLinks.has(node)
            ? await markdownTarget(file, node.url) : await target(file, node.url);
          if (node.type === 'link' && extname(fileTarget).toLowerCase() === '.md') {
            const targetSlug = register(fileTarget);
            if (!toString(node).trim()) {
              let label = titles.get(targetSlug) || '';
              async function findTitle(sourceFile: string, seen: Set<string>): Promise<void> {
                if (label || seen.has(sourceFile)) return;
                seen.add(sourceFile);
                const source = await document(sourceFile);
                visit(source.tree, 'heading', heading => { if (!label && heading.depth === 1) label = toString(heading); });
                for (const path of source.sources) await findTitle(await markdownTarget(sourceFile, path), seen);
              }
              await findTitle(fileTarget, new Set());
              node.children = [{ type: 'text', value: label || targetSlug.split('/').at(-1) || config.title }];
            }
            node.url = `${href(targetSlug)}${match[2] || ''}${match[3] || ''}`;
          }
          else {
            node.url = `${await asset(fileTarget)}${match[2] || ''}${match[3] || ''}`;
          }
        }
        const rendered = await renderSource(tree, usedIds);
        html += rendered.html + '\n'; headings.push(...rendered.headings);
        for (const source of sources) await append(await markdownTarget(file, source), [...ancestors, file]);
      }
      await append(files.get(slug)!, []);
      title ||= slug.split('/').at(-1) || config.title;
      const parent = parents.get(slug) ?? null;
      const inTree = parents.has(slug);
      graph.pages.push({ course: owner(files.get(slug)!), slug, title, parent, ...(type !== undefined ? { type } : {}), inTree, author, tags, html, text: texts.join('\n'), headings, previous: siblings.get(slug)?.previous ?? null, next: siblings.get(slug)?.next ?? null });
      if (inTree) graph.navigation.push({ slug, title, parent });
    }

  // Reject hierarchy cycles even when a branch is reached through an ordinary link.
  for (const member of membership.keys()) {
    const seen = new Set<string>();
    for (let current: string | undefined = member; current !== undefined; current = membership.get(current)) {
      if (seen.has(current)) throw new Error(`Circular children: ${member}`);
      seen.add(current);
    }
  }
  // Attach children after discovery, including children of late-discovered parents.
  let expanded = true;
  while (expanded) {
    expanded = false;
    for (const [member, rootSlug] of membership) {
      if (!parents.has(rootSlug)) continue;
      if (parents.has(member)) {
        if (parents.get(member) !== rootSlug) throw new Error(`Conflicting child parent: ${member}`);
        continue;
      }
      for (let ancestor: string | null = rootSlug; ancestor !== null; ancestor = parents.get(ancestor) ?? null) {
        if (ancestor === member) throw new Error(`Circular children: ${member}`);
      }
      parents.set(member, rootSlug);
      const course = owner(files.get(rootSlug)!);
      if (course !== null) declaredOwners.set(files.get(member)!, course);
      expanded = true;
    }
  }
  for (const page of graph.pages) {
    page.title = titles.get(page.slug) || page.title;
    page.previous = siblings.get(page.slug)?.previous ?? null;
    page.next = siblings.get(page.slug)?.next ?? null;
    page.parent = parents.get(page.slug) ?? null;
    page.inTree = parents.has(page.slug);
    page.course = owner(files.get(page.slug)!);
  }
  for (const course of graph.courses) {
    const seen = new Set(course.tags.map(normalizeTag));
    for (const page of graph.pages) {
      if (page.course !== course.slug) continue;
      for (const tag of page.tags) {
        const key = normalizeTag(tag);
        if (seen.has(key)) continue;
        seen.add(key);
        course.contentTags.push(tag);
      }
    }
  }
  // Number only explicit chapter/content pages, in declared children order.
  // Unnumbered wrappers keep the nearest chapter context and consume no number.
  graph.exportManifest = [];
  const pagesBySlug = new Map(graph.pages.map(page => [page.slug, page]));
  for (const course of graph.courses) {
    const counters = new Map<string, number>();
    function numberBranch(slug: string, prefix: number[]) {
      const page = pagesBySlug.get(slug)!;
      let nextPrefix = prefix;
      if (slug !== course.slug && (page.type === 'chapter' || page.type === 'content')) {
        const key = prefix.join('.');
        const index = (counters.get(key) || 0) + 1;
        counters.set(key, index);
        const number = [...prefix, index];
        page.chapter = number.join('.');
        if (page.type === 'chapter') nextPrefix = number;
        else {
          const source = relative(root, files.get(slug)!).split(sep).join('/');
          const name = basename(source, '.md').replace(/^(?:\d+-)+/, '');
          graph.exportManifest!.push({ course: course.slug, source, number,
            filename: `${number.map(part => String(part).padStart(2, '0')).join('-')}-${name}.md` });
        }
      }
      for (const [child, parent] of membership) if (parent === slug) numberBranch(child, nextPrefix);
    }
    numberBranch(course.slug, []);
  }

  graph.navigation = [];
  function navigationBranch(slug: string) {
    const page = pagesBySlug.get(slug)!;
    graph.navigation.push({ slug, title: page.title, parent: page.parent, ...(page.chapter !== undefined ? { chapter: page.chapter } : {}) });
    const declaredChildren = [...membership].filter(([, rootSlug]) => rootSlug === slug).map(([member]) => member);
    const children = [...parents].filter(([child, parent]) => parent === slug && !declaredChildren.includes(child)).map(([child]) => child);
    for (const child of [...children, ...declaredChildren]) navigationBranch(child);
  }
  navigationBranch('');
  return graph;
}

export async function generate() {
  await rm('static/content-assets', { recursive: true, force: true });
  const graph = await buildGraph(resolve(config.contentRoot), config.entrypoint, process.env.BASE_PATH || '', resolve('static/content-assets'));
  await mkdir('src/lib/generated', { recursive: true });
  await writeFile('src/lib/generated/content.json', JSON.stringify(graph));
  await writeFile('src/lib/generated/catalog.json', JSON.stringify({ branding: graph.branding || '', page: graph.pages.find(page => page.slug === '')!, courses: graph.courses }));
  await writeFile('static/.nojekyll', '');
  console.log(`Generated ${graph.pages.length} pages in ${graph.courses.length} courses.`);
  return graph;
}
