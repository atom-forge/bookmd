import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
// Registers \ce{...} and \pu{...} (chemical formulas and units) in KaTeX.
import 'katex/contrib/mhchem';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Root as MarkdownRoot, Link, Image, Heading, Paragraph, Parent, Code } from 'mdast';
import type { Root as HtmlRoot, Element } from 'hast';

import { parse as parseYaml } from 'yaml';
import { bookListKey } from './book-list';
import { remarkCallouts, rehypeCalloutIcons } from './callouts';
import { rehypeFileTree } from './file-tree';

import { resolve, relative, dirname, extname, basename, sep } from './paths';

/** Paths are absolute, slash-separated identifiers within a virtual content root. */
export interface ContentSource {
  resolve(path: string): Promise<string>;
  readText(path: string): Promise<string>;
  /** File names directly inside a directory; empty when it does not exist. Without it, folders never supply children. */
  list?(directory: string): Promise<string[]>;
  /** `embed` assets are used by images; `link` assets are opened as documents by the reader; `attachment` files are downloaded as they are. */
  assetUrl(path: string, base: string, usage?: 'embed' | 'link' | 'attachment'): Promise<string>;
}

export type ContentDiagnostic = { file: string; target: string; message: string };

export type NavItem = { slug: string; title: string; parent: string | null; chapter?: string | number };
export type ContentPage = NavItem & {
  type?: string; course: string | null; html: string; text: string; inTree: boolean;
  previous: string | null; next: string | null;
  author: string | null; tags: string[];
  requires: string[]; teaches: string[];
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
const safeSchemes = new Set(['http', 'https', 'mailto', 'tel']);
const external = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

/** First heading of the shallowest depth present, so a document starting at H2 still has a title. */
function headingTitle(tree: MarkdownRoot): string {
  let best: { depth: number; text: string } | undefined;
  visit(tree, 'heading', node => { if (!best || node.depth < best.depth) best = { depth: node.depth, text: toString(node) }; });
  return best?.text.trim() ?? '';
}

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
      const processor = unified().use(remarkCallouts).use(remarkRehype).use(rehypeCalloutIcons).use(rehypeFileTree).use(rehypeSlug).use(() => (htmlTree: HtmlRoot) => {
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

export async function processContent(source: ContentSource, entrypoint: string, options: { base?: string; title?: string; rootName?: string; sealed?: string[]; diagnostics?: ContentDiagnostic[]; link?: (slug: string, query: string, fragment: string) => string } = {}): Promise<ContentGraph> {
  const root = '/';
  const base = options.base ?? '';
  const titleFallback = options.title ?? 'BookMD';
  const graph: ContentGraph = { pages: [], navigation: [], courses: [] };
  async function contained(file: string) {
    const target = await source.resolve(file);
    const rel = relative(root, target);
    if (rel.split(sep)[0] === '..' || rel.startsWith(sep)) throw new Error(`Content escapes root: ${file}`);
    return target;
  }
  const wikiLinks = new WeakSet<Link>();
  const embeds = new WeakMap<Paragraph, string>();
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
  const maxImportedCode = 200_000;
  /**
   * A fenced block shows the text of a source file instead of its own. Three spellings reach the same import:
   * `file=path lines=10-20` (BookMD), and the syntax of the Obsidian plugins "Embed Code File"
   * (an `embed-ts` block with PATH:, LINES: and TITLE: lines) and "Code File Embed" (`codefile path:10-25`).
   */
  async function importCode(tree: MarkdownRoot, file: string) {
    type Import = { block: Code; path: string; lines?: string; lang: string | null; meta: string | null; vault?: boolean };
    const imports: Import[] = [];
    visit(tree, 'code', node => {
      // Without a language, the first word of the info string is the `file=` option itself.
      if (node.lang?.startsWith('file=')) { node.meta = [node.lang, node.meta].filter(Boolean).join(' '); node.lang = null; }
      if (node.meta && /(?:^|\s)file=/.test(node.meta)) {
        const given: Record<string, string> = {};
        const rest = node.meta.replace(/(\w+)=("[^"]*"|\S+)/g, (all, key: string, value: string) => {
          if (key !== 'file' && key !== 'lines') return all;
          given[key] = value.replace(/^"|"$/g, '');
          return '';
        }).trim();
        imports.push({ block: node, path: given.file, lines: given.lines, lang: node.lang ?? null, meta: rest || null });
      } else if (node.lang?.toLowerCase().startsWith('embed-') && node.lang.length > 6) {
        const given: Record<string, string> = {};
        for (const line of node.value.split('\n')) {
          const field = line.match(/^\s*(PATH|LINES|TITLE)\s*:\s*(.*?)\s*$/i);
          if (field) given[field[1].toLowerCase()] = field[2].replace(/^["']|["']$/g, '');
        }
        if (given.path) {
          const vault = /^vault:\/\//i.test(given.path);
          imports.push({ block: node, path: vault ? given.path.slice(8) : given.path, lines: given.lines, lang: node.lang.slice(6), meta: null, vault });
        }
      } else if (node.lang?.toLowerCase() === 'codefile' && node.meta) {
        const spec = node.meta.trim().match(/^(.*?)(?::(\d+(?:-\d*)?))?$/)!;
        imports.push({ block: node, path: spec[1].replace(/^["']|["']$/g, ''), lines: spec[2], lang: null, meta: null });
      }
    });
    for (const { block, path, lines, lang, meta, vault } of imports) {
      try {
        // vault:// paths start at the root of the book (the Obsidian vault) the page belongs to.
        const book = vault ? courseRoots.filter(course => inside(course.directory, file)).sort((x, y) => y.directory.length - x.directory.length)[0] : undefined;
        const found = await target(file, vault ? '/' + relative(root, resolve(book?.directory ?? root, path)).split(sep).join('/') : path);
        let text = (await source.readText(found)).replace(/\r\n?/g, '\n');
        if (text.length > maxImportedCode) throw new Error(`File is too large to show as code (more than ${maxImportedCode / 1000} KB): ${path}`);
        if (lines !== undefined) {
          const range = lines.match(/^(\d+)(?:(-)(\d*))?$/);
          const all = text.replace(/\n$/, '').split('\n');
          const from = range ? Number(range[1]) : 0;
          const to = range ? (range[2] ? (range[3] ? Number(range[3]) : all.length) : from) : 0;
          if (!range || from < 1 || to < from || from > all.length) throw new Error(`Invalid lines="${lines}" for ${path} (${all.length} lines)`);
          text = all.slice(from - 1, to).join('\n');
        }
        block.value = text.replace(/\n$/, '');
        block.lang = lang || extname(found).slice(1).toLowerCase() || null;
        block.meta = meta;
      } catch (error) {
        // Tolerant callers collect broken references; builds keep failing.
        if (!options.diagnostics) throw error;
        options.diagnostics.push({ file, target: path ?? '', message: error instanceof Error ? error.message : String(error) });
      }
    }
  }
  async function document(file: string) {
    let body = await source.readText(file);
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
    if (metadata.title !== undefined && typeof metadata.title !== 'string') throw new Error(`Invalid title in ${file}`);
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
    await importCode(tree, file);
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
    // A paragraph made of one ![[note]] or ![[note#Heading]] embeds that document at this place.
    visit(tree, 'paragraph', paragraph => {
      const only = paragraph.children.length === 1 && paragraph.children[0].type === 'text' ? paragraph.children[0].value.trim().match(/^!\[\[([^\[\]\n|]+)\]\]$/) : null;
      const path = only?.[1].trim();
      if (path && !external.test(path) && ['', '.md'].includes(extname(path.split('#')[0]).toLowerCase())) embeds.set(paragraph, path);
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
    // ![[picture.png]] and ![[picture.png|alt text]] / ![[picture.png|300]] (width) are images. Documents embed only as a paragraph of their own.
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined || parent.type === 'link' || parent.type === 'linkReference') return;
      const parts: (typeof node | Image)[] = [];
      let cursor = 0;
      for (const match of node.value.matchAll(/!\[\[([^\[\]\n|]+)(?:\|([^\[\]\n]+))?\]\]/g)) {
        const url = match[1].trim();
        if (!url || external.test(url) || ['', '.md'].includes(extname(url.split('#')[0]).toLowerCase())) continue;
        if (match.index! > cursor) parts.push({ type: 'text', value: node.value.slice(cursor, match.index) });
        const size = match[2]?.trim().match(/^(\d+)(?:x(\d+))?$/);
        const image: Image = { type: 'image', url, alt: size ? '' : match[2]?.trim() ?? '' };
        if (size) image.data = { hProperties: { width: size[1], ...(size[2] ? { height: size[2] } : {}) } };
        parts.push(image);
        cursor = match.index! + match[0].length;
      }
      if (!cursor) return;
      if (cursor < node.value.length) parts.push({ type: 'text', value: node.value.slice(cursor) });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
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
    return { tree, sources, children: childLinks, declaredChildren: metadata.children !== undefined, metadata };
  }
  // A sealed directory is one course's own territory: its files may only reference files inside it.
  const sealed = (options.sealed ?? []).map(directory => resolve(root, directory));
  const inside = (directory: string, file: string) => { const rel = relative(directory, file); return rel !== '..' && !rel.startsWith('..' + sep) && !rel.startsWith(sep); };
  async function confined(file: string, found: string) {
    const home = sealed.find(directory => inside(directory, file));
    if (home && !inside(home, found)) throw new Error(`Reference leaves the course root in ${file}: ${found}`);
    return found;
  }
  async function target(file: string, url: string) {
    if (external.test(url) || !url.split(/[?#]/)[0]) throw new Error(`Expected local path in ${file}: ${url}`);
    const path = decodeURIComponent(url.split(/[?#]/)[0]);
    const wanted = path.startsWith('/') ? resolve(root, '.' + path) : resolve(dirname(file), path);
    const home = sealed.find(directory => inside(directory, file));
    // Check the lexical target first so a sealed course never probes files outside itself.
    if (home && !inside(home, wanted)) throw new Error(`Reference leaves the course root in ${file}: ${url}`);
    try {
      return await confined(file, await contained(wanted));
    } catch (error) {
      const marker = `/${options.rootName ?? ""}/`;
      const index = path.indexOf(marker);
      if ((error as { code?: string }).code !== 'ENOENT' || index === -1) throw error;
      // Obsidian may rewrite links as paths from the vault root.
      return confined(file, await contained(resolve(root, path.slice(index + marker.length))));
    }
  }
  async function markdownTarget(file: string, path: string) {
    const pathPart = path.split(/[?#]/)[0];
    const result = await target(file, extname(pathPart) ? path : pathPart + '.md' + path.slice(pathPart.length));
    if (extname(result).toLowerCase() !== '.md') throw new Error(`Expected Markdown file: ${result}`);
    return result;
  }
  const asset = (file: string, usage: 'embed' | 'link' | 'attachment' = 'link') => source.assetUrl(file, base, usage);
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
  const bookKey = bookListKey(catalog.metadata, start);
  const coursePaths = referencePaths(catalog.metadata[bookKey], bookKey, start);
  for (const path of coursePaths) {
    const file = await markdownTarget(start, path);
    if (aliases.has(file)) throw new Error(`Repeated course: ${path}`);
    const route = relative(root, file).split(sep).join('/').replace(/(?:^|\/)(?:course|book)\.md$/i, '').replace(/\.md$/i, '');
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
    name ||= (typeof metadata.title === 'string' ? metadata.title.trim() : '') || headingTitle(tree);
    name ||= slug.split('/').at(-1)!;
    const tags = metadata.tags ?? [];
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error(`Invalid tags in ${file}`);
    if ('instructor' in metadata || 'year' in metadata) throw new Error(`Obsolete course metadata in ${file}: use author instead of instructor and remove year`);
    const image = text('image');
    const imageUrl = image ? await asset(await target(file, image), 'embed') : null;
    graph.courses.push({ slug, name, author: text('author') || null, language: text('language', true), tags: [...new Set(tags.map(tag => tag.trim()))], contentTags: [], intro: text('intro'), image: imageUrl });
    titles.set(slug, name);
  }
  /** Pages in the folder named like the document (without `.md`) are its children, in natural file-name order. */
  async function folderChildren(file: string) {
    if (!source.list || extname(file).toLowerCase() !== '.md') return [];
    const directory = file.slice(0, -extname(file).length);
    const names = (await source.list(directory)).filter(name => extname(name).toLowerCase() === '.md' && !name.startsWith('.'));
    names.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    const prefix = directory.split('/').map(encodeURIComponent).join('/');
    return names.map(name => ({ path: `${prefix}/${encodeURIComponent(name)}`, title: '' }));
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
  const href = (slug: string, query: string, fragment: string) => options.link
    ? options.link(slug, query, fragment)
    : `${base}/${slug ? slug.split('/').map(encodeURIComponent).join('/') + '/' : ''}${query}${fragment}`;
  // Links and images that already point at their final address (those of an embedded document, written relative to it).
  const rewritten = new WeakSet<object>();
  /** Resolves the links and images of a parsed document, which are written relative to `file`. */
  async function rewriteLinks(tree: MarkdownRoot, file: string) {
    // Content is untrusted: only inert link schemes may reach generated markup.
    visit(tree, 'link', (node, index, parent) => {
      const scheme = node.url.match(/^([a-z][a-z\d+.-]*):/i)?.[1].toLowerCase();
      if (!scheme || safeSchemes.has(scheme) || !parent || index === undefined) return;
      options.diagnostics?.push({ file, target: node.url, message: `Unsupported link scheme "${scheme}:"; rendered as text` });
      parent.children.splice(index, 1, ...node.children);
      return index;
    });
    const links: (Link | Image)[] = [];
    visit(tree, node => { if ((node.type === 'link' || node.type === 'image') && !rewritten.has(node)) links.push(node); });
    for (const node of links) {
      rewritten.add(node);
      if (external.test(node.url)) continue;
      const match = node.url.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/)!;
      if (!match[1]) continue;
      let fileTarget: string;
      let assetUrl: string | undefined;
      // A link ending in #!download offers the file as it is (even a Markdown file) instead of linking to a page.
      const download = node.type === 'link' && match[3]?.toLowerCase() === '#!download';
      try {
        fileTarget = node.type === 'link' && wikiLinks.has(node)
          ? await markdownTarget(file, node.url) : await target(file, node.url);
        if (download || !(node.type === 'link' && extname(fileTarget).toLowerCase() === '.md')) assetUrl = await asset(fileTarget, download ? 'attachment' : node.type === 'image' ? 'embed' : 'link');
      } catch (error) {
        // Tolerant callers collect broken references; builds keep failing.
        if (!options.diagnostics) throw error;
        options.diagnostics.push({ file, target: node.url, message: error instanceof Error ? error.message : String(error) });
        if (node.type === 'link') node.url = '#';
        continue;
      }
      if (download) {
        const name = basename(fileTarget);
        if (!toString(node).trim()) node.children = [{ type: 'text', value: name }];
        node.data = { ...node.data, hProperties: { ...(node.data as { hProperties?: object } | undefined)?.hProperties, download: name } };
        node.url = `${assetUrl}${match[2] || ''}`;
      }
      else if (node.type === 'link' && extname(fileTarget).toLowerCase() === '.md') {
        const targetSlug = register(fileTarget);
        if (!toString(node).trim()) {
          let label = titles.get(targetSlug) || '';
          async function findTitle(sourceFile: string, seen: Set<string>): Promise<void> {
            if (label || seen.has(sourceFile)) return;
            seen.add(sourceFile);
            const source = await document(sourceFile);
            if (seen.size === 1 && typeof source.metadata.title === 'string') label = source.metadata.title.trim();
            label ||= headingTitle(source.tree);
            for (const path of source.sources) await findTitle(await markdownTarget(sourceFile, path), seen);
          }
          await findTitle(fileTarget, new Set());
          node.children = [{ type: 'text', value: label || targetSlug.split('/').at(-1) || titleFallback }];
        }
        node.url = href(targetSlug, match[2] || '', match[3] || '');
      }
      else {
        node.url = `${assetUrl}${match[2] || ''}${match[3] || ''}`;
      }
    }
  }
  /** The part of a parsed document an embed `![[document#Heading]]` asks for: everything, or one section. */
  function section(tree: MarkdownRoot, heading: string | undefined, from: string): MarkdownRoot['children'] {
    if (!heading) return tree.children;
    if (heading.startsWith('^')) throw new Error(`Block embeds are not supported in ${from}: #${heading}`);
    const wanted = heading.trim().toLowerCase();
    const first = tree.children.findIndex(node => node.type === 'heading' && toString(node).trim().toLowerCase() === wanted);
    if (first === -1) throw new Error(`Missing heading "${heading}" in the embedded document of ${from}`);
    const depth = (tree.children[first] as Heading).depth;
    let last = first + 1;
    while (last < tree.children.length && !(tree.children[last].type === 'heading' && (tree.children[last] as Heading).depth <= depth)) last++;
    return tree.children.slice(first, last);
  }
  /** The content of an embedded document: its body, with its own embeds and sources, links resolved relative to it. */
  async function embeddedContent(file: string, chain: string[], heading?: string): Promise<MarkdownRoot['children']> {
    if (chain.includes(file)) throw new Error(`Circular embed: ${[...chain, file].join(' -> ')}`);
    const { tree, sources } = await document(file);
    const inner = [...chain, file];
    await expandEmbeds(tree, file, inner);
    await rewriteLinks(tree, file);
    const nodes = [...section(tree, heading, file)];
    if (!heading) for (const path of sources) nodes.push(...await embeddedContent(await markdownTarget(file, path), inner));
    return nodes;
  }
  /** Replaces every paragraph made of one `![[document]]` with the embedded document's content. */
  async function expandEmbeds(tree: MarkdownRoot, file: string, chain: string[]) {
    const found: { parent: Parent; index: number; path: string }[] = [];
    visit(tree, 'paragraph', (node, index, parent) => {
      const embed = embeds.get(node);
      if (embed && parent && index !== undefined) found.push({ parent, index, path: embed });
    });
    for (const { parent, index, path } of found.reverse()) {
      const [documentPath, heading] = path.split('#', 2).length === 2 ? [path.slice(0, path.indexOf('#')), path.slice(path.indexOf('#') + 1)] : [path, undefined];
      try {
        parent.children.splice(index, 1, ...await embeddedContent(await markdownTarget(file, documentPath), chain, heading?.trim() || undefined));
      } catch (error) {
        if (!options.diagnostics) throw error;
        options.diagnostics.push({ file, target: path, message: error instanceof Error ? error.message : String(error) });
        parent.children.splice(index, 1, { type: 'paragraph', children: [{ type: 'text', value: `![[${path}]]` }] });
      }
    }
  }
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
      let requires: string[] = [];
      let teaches: string[] = [];
      async function append(file: string, ancestors: string[]) {
        if (ancestors.includes(file)) throw new Error(`Circular sources: ${[...ancestors, file].join(' -> ')}`);
        const { tree, sources, children, declaredChildren, metadata } = await document(file);
        if (!ancestors.length) {
          if (!title && typeof metadata.title === 'string') title = metadata.title.trim();
          if (metadata.type !== undefined && typeof metadata.type !== 'string') throw new Error(`Invalid type in ${file}`);
          type = typeof metadata.type === 'string' ? metadata.type : undefined;
          if (relative(root, file).split(sep).includes('resources') && 'tags' in metadata) throw new Error(`Resources cannot have tags: ${file}`);
          if (metadata.author !== undefined && typeof metadata.author !== 'string') throw new Error(`Invalid author in ${file}`);
          author = typeof metadata.author === 'string' ? metadata.author.trim() || null : null;
          const pageTags = metadata.tags ?? [];
          if (!Array.isArray(pageTags) || pageTags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error(`Invalid tags in ${file}`);
          tags = [...new Set(pageTags.map(tag => tag.trim()))];
          for (const key of ['requires', 'teaches'] as const) {
            if (relative(root, file).split(sep).includes('resources') && key in metadata) throw new Error(`Resources cannot have ${key}: ${file}`);
            const concepts = metadata[key] ?? [];
            if (!Array.isArray(concepts) || concepts.some(concept => typeof concept !== 'string' || !concept.trim())) throw new Error(`Invalid ${key} in ${file}`);
            const unique = [...new Set<string>(concepts.map(concept => concept.trim()))];
            if (key === 'requires') requires = unique; else teaches = unique;
          }
        }
        await registerChildren(file, declaredChildren || file === start ? children : await folderChildren(file));
        title ||= headingTitle(tree);
        await expandEmbeds(tree, file, [...ancestors, file]);
        texts.push(toString(tree));
        await rewriteLinks(tree, file);
        const rendered = await renderSource(tree, usedIds);
        html += rendered.html + '\n'; headings.push(...rendered.headings);
        for (const source of sources) await append(await markdownTarget(file, source), [...ancestors, file]);
      }
      await append(files.get(slug)!, []);
      title ||= slug.split('/').at(-1) || titleFallback;
      const parent = parents.get(slug) ?? null;
      const inTree = parents.has(slug);
      graph.pages.push({ course: owner(files.get(slug)!), slug, title, parent, ...(type !== undefined ? { type } : {}), inTree, author, tags, requires, teaches, html, text: texts.join('\n'), headings, previous: siblings.get(slug)?.previous ?? null, next: siblings.get(slug)?.next ?? null });
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

