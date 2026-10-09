import { visit } from 'unist-util-visit';
import type { Root, PhrasingContent, Paragraph } from 'mdast';
import type { Root as HtmlRoot, Element } from 'hast';
import icons from './callout-icons.json';

const types: Record<string, { type: string; icon: keyof typeof icons }> = {
  note: { type: 'note', icon: 'pencil' },
  abstract: { type: 'abstract', icon: 'list' },
  info: { type: 'info', icon: 'info' },
  todo: { type: 'todo', icon: 'circle-check' },
  tip: { type: 'tip', icon: 'lightbulb' },
  success: { type: 'success', icon: 'check' },
  question: { type: 'question', icon: 'circle-question-mark' },
  warning: { type: 'warning', icon: 'triangle-alert' },
  failure: { type: 'failure', icon: 'x' },
  danger: { type: 'danger', icon: 'octagon-alert' },
  bug: { type: 'bug', icon: 'bug' },
  example: { type: 'example', icon: 'list-ordered' },
  quote: { type: 'quote', icon: 'quote' }
};
const aliases: Record<string, string> = {
  summary: 'abstract', tldr: 'abstract', hint: 'tip', important: 'tip',
  check: 'success', done: 'success', help: 'question', faq: 'question',
  caution: 'warning', attention: 'warning', fail: 'failure', missing: 'failure',
  error: 'danger', cite: 'quote'
};

export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', node => {
      if (node.data?.hName) return;
      const first = node.children[0];
      if (first?.type !== 'paragraph' || first.children[0]?.type !== 'text') return;
      const marker = first.children[0].value.match(/^\[!([\w-]+)\]([+-])?[ \t]*/i);
      if (!marker) return;
      const identifier = marker[1].toLowerCase();
      const definition = types[aliases[identifier] || identifier] || types.note;
      first.children[0].value = first.children[0].value.slice(marker[0].length);
      const title: PhrasingContent[] = [];
      const body: PhrasingContent[] = [];
      let inBody = false;
      for (const child of first.children) {
        if (!inBody && child.type === 'break') { inBody = true; continue; }
        if (!inBody && child.type === 'text' && child.value.includes('\n')) {
          const index = child.value.indexOf('\n');
          if (index) title.push({ type: 'text', value: child.value.slice(0, index) });
          if (child.value.slice(index + 1)) body.push({ type: 'text', value: child.value.slice(index + 1) });
          inBody = true;
        } else if (child.type !== 'text' || child.value) (inBody ? body : title).push(child);
      }
      if (!title.length || title.every(child => child.type === 'text' && !child.value.trim())) {
        title.splice(0, title.length, { type: 'text', value: identifier.replace(/(^|[-_ ])\w/g, value => value.replace(/[-_]/, ' ').toUpperCase()) });
      }
      const header: Paragraph = { type: 'paragraph', children: title, data: {
        hName: marker[2] ? 'summary' : 'div', hProperties: { className: ['callout-title'], dataCalloutIcon: definition.icon }
      } };
      const content = [...(body.length ? [{ type: 'paragraph' as const, children: body }] : []), ...node.children.slice(1)];
      node.data = { ...node.data, hName: marker[2] ? 'details' : 'aside', hProperties: {
        className: ['callout'], dataCallout: definition.type, dataCalloutType: identifier,
        ...(marker[2] === '+' ? { open: true } : {})
      } };
      node.children = [header, { type: 'blockquote', children: content, data: { hName: 'div', hProperties: { className: ['callout-body'] } } }];
    });
  };
}

export function rehypeCalloutIcons() {
  return (tree: HtmlRoot) => {
    visit(tree, 'element', node => {
      const name = node.properties.dataCalloutIcon as keyof typeof icons;
      if (!name || !Object.hasOwn(icons, name)) return;
      const svg: Element = { type: 'element', tagName: 'svg', properties: {
        className: ['callout-icon', 'lucide'], width: 20, height: 20, viewBox: '0 0 24 24',
        fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', ariaHidden: 'true'
      }, children: icons[name].map(([tagName, properties]) => ({ type: 'element', tagName, properties, children: [] }) as Element) };
      node.children.unshift(svg);
      delete node.properties.dataCalloutIcon;
    });
  };
}
