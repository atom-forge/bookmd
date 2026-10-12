import { visit } from 'unist-util-visit';
import type { Root as HtmlRoot, Element, ElementContent } from 'hast';
import icons from './tree-icons.json';

/** One line of a ```tree block. */
export type TreeNode = { name: string; folder: boolean; comment: string; highlight: boolean; placeholder: boolean; children: TreeNode[] };

// Box-drawing characters (the output of the `tree` command) count as indentation.
const prefix = /^[\s│├└─]*/;

/**
 * Parses the text of a ```tree block: the nesting follows the indentation (or the lines of `tree` output),
 * a trailing `/` marks a folder, `# text` is a comment, `**name**` highlights and `...` stands for more files.
 */
export function parseTree(text: string): TreeNode[] {
  const roots: TreeNode[] = [];
  const stack: { indent: number; node: TreeNode }[] = [];
  for (const line of text.replace(/\t/g, '    ').split(/\r?\n/)) {
    if (!line.trim()) continue;
    const indent = line.match(prefix)![0].length;
    const split = line.slice(indent).match(/^(.*?)(?:(?:^|\s+)#\s?(.*))?$/)!;
    let name = split[1].trim();
    if (!name) continue;
    const highlight = /^\*\*.+\*\*$/.test(name);
    if (highlight) name = name.slice(2, -2).trim();
    const node: TreeNode = { name, folder: name.endsWith('/'), comment: (split[2] ?? '').trim(), highlight, placeholder: name === '...' || name === '…', children: [] };
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    (stack.length ? stack[stack.length - 1].node.children : roots).push(node);
    stack.push({ indent, node });
  }
  return roots;
}

const extensions: Record<string, keyof typeof icons> = {
  ts: 'file-code', tsx: 'file-code', js: 'file-code', jsx: 'file-code', mjs: 'file-code', cjs: 'file-code', svelte: 'file-code', vue: 'file-code',
  py: 'file-code', rb: 'file-code', go: 'file-code', rs: 'file-code', java: 'file-code', kt: 'file-code', c: 'file-code', h: 'file-code',
  cpp: 'file-code', cs: 'file-code', php: 'file-code', swift: 'file-code', html: 'file-code', css: 'file-code', scss: 'file-code', sql: 'file-code',
  md: 'file-text', markdown: 'file-text', txt: 'file-text', pdf: 'file-text', doc: 'file-text', docx: 'file-text', rtf: 'file-text',
  png: 'file-image', jpg: 'file-image', jpeg: 'file-image', gif: 'file-image', webp: 'file-image', avif: 'file-image', svg: 'file-image', ico: 'file-image', bmp: 'file-image',
  zip: 'file-archive', tar: 'file-archive', gz: 'file-archive', tgz: 'file-archive', rar: 'file-archive', '7z': 'file-archive',
  json: 'file-braces', jsonc: 'file-braces', json5: 'file-braces',
  yml: 'file-cog', yaml: 'file-cog', toml: 'file-cog', ini: 'file-cog', env: 'file-cog', lock: 'file-cog',
  csv: 'file-spreadsheet', tsv: 'file-spreadsheet', xls: 'file-spreadsheet', xlsx: 'file-spreadsheet',
  sh: 'file-terminal', bash: 'file-terminal', zsh: 'file-terminal', bat: 'file-terminal'
};
/** Files known by their whole name rather than their extension. */
const names: Record<string, keyof typeof icons> = { 'package.json': 'file-cog', dockerfile: 'file-terminal', makefile: 'file-terminal' };

export function treeIcon(node: Pick<TreeNode, 'name' | 'folder' | 'children'>): keyof typeof icons {
  if (node.folder || node.children.length) return node.children.length ? 'folder-open' : 'folder';
  const name = node.name.toLowerCase();
  return names[name] ?? extensions[name.slice(name.lastIndexOf('.') + 1)] ?? (/^\.env/.test(name) ? 'file-cog' : 'file');
}

const element = (tagName: string, properties: Element['properties'], children: ElementContent[] = []): Element => ({ type: 'element', tagName, properties, children });
const text = (value: string): ElementContent => ({ type: 'text', value });

function list(nodes: TreeNode[]): Element {
  return element('ul', {}, nodes.map(node => {
    const icon = treeIcon(node);
    const svg = element('svg', {
      className: ['filetree-icon', 'lucide'], width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', ariaHidden: 'true'
    }, icons[icon].map(([tagName, properties]) => element(tagName as string, properties as Element['properties'])));
    const label = element('span', { className: ['filetree-name'] }, [node.highlight ? element('strong', {}, [text(node.name)]) : text(node.name)]);
    const line = element('span', { className: ['filetree-item', ...(node.highlight ? ['filetree-highlight'] : []), ...(node.placeholder ? ['filetree-more'] : [])] },
      [...(node.placeholder ? [] : [svg]), label, ...(node.comment ? [element('span', { className: ['filetree-comment'] }, [text(node.comment)])] : [])]);
    return element('li', { className: [node.folder || node.children.length ? 'filetree-folder' : 'filetree-file'] }, [line, ...(node.children.length ? [list(node.children)] : [])]);
  }));
}

/** Turns ```tree code blocks into a nested list with folder and file icons; it is plain HTML, no script. */
export function rehypeFileTree() {
  return (tree: HtmlRoot) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      const code = node.children[0];
      if (code?.type !== 'element' || code.tagName !== 'code' || !(code.properties.className as string[] | undefined)?.includes('language-tree')) return;
      const source = code.children.map(child => child.type === 'text' ? child.value : '').join('');
      const nodes = parseTree(source);
      if (!nodes.length) return;
      parent.children[index] = element('div', { className: ['filetree'], role: 'group', ariaLabel: 'File structure' }, [list(nodes)]);
    });
  };
}
