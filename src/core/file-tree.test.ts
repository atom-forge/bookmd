import { expect, test } from 'bun:test';
import { parseTree, treeIcon } from './file-tree';
import { processContent, type ContentSource } from './content';

test('indentation, folders, comments, highlights and placeholders', () => {
  const [root] = parseTree('my-books/\n  package.json   # the project\n  content/\n    books.md\n    **01-intro.md**  # open this\n    ...\n\n  README.md');
  expect(root).toMatchObject({ name: 'my-books/', folder: true });
  expect(root.children.map(node => node.name)).toEqual(['package.json', 'content/', 'README.md']);
  expect(root.children[0].comment).toBe('the project');
  const content = root.children[1];
  expect(content.children.map(node => [node.name, node.highlight, node.placeholder, node.comment])).toEqual([
    ['books.md', false, false, ''], ['01-intro.md', true, false, 'open this'], ['...', false, true, '']
  ]);
});

test('the output of the tree command is understood', () => {
  const nodes = parseTree('.\n├── src\n│   ├── app.ts\n│   └── lib\n│       └── util.ts\n└── README.md');
  expect(nodes).toHaveLength(1);
  expect(nodes[0].children.map(node => node.name)).toEqual(['src', 'README.md']);
  expect(nodes[0].children[0].children.map(node => node.name)).toEqual(['app.ts', 'lib']);
  expect(nodes[0].children[0].children[1].children[0].name).toBe('util.ts');
});

test('a hash inside a name is not a comment; a comment-only line is skipped', () => {
  const nodes = parseTree('# just a note\nC#/\n  a#b.txt  #  with # inside');
  expect(nodes.map(node => node.name)).toEqual(['C#/']);
  expect(nodes[0].children[0]).toMatchObject({ name: 'a#b.txt', comment: 'with # inside' });
});

test.each([
  ['src/', 'folder'], ['app.ts', 'file-code'], ['notes.MD', 'file-text'], ['logo.png', 'file-image'], ['data.csv', 'file-spreadsheet'],
  ['bundle.zip', 'file-archive'], ['tsconfig.json', 'file-braces'], ['package.json', 'file-cog'], ['.env.local', 'file-cog'], ['Makefile', 'file-terminal'], ['LICENSE', 'file']
])('%s gets the %s icon', (name, icon) => {
  expect(treeIcon({ name, folder: name.endsWith('/'), children: [] })).toBe(icon);
});

test('a tree block becomes a nested list without script', async () => {
  const source: ContentSource = {
    async resolve(path) { return path; },
    async readText() { return '---\ncourses: []\n---\n# Catalog\n\n```tree\nbook/\n  **a.ts**  # key file\n  img/\n    logo.png\n```\n\n```text\nstays\n```'; },
    async assetUrl(path) { return path; }
  };
  const html = (await processContent(source, 'courses.md')).pages[0].html;
  expect(html).toContain('class="filetree"');
  expect(html).toContain('<li class="filetree-folder">');
  expect(html).toContain('<strong>a.ts</strong>');
  expect(html).toContain('filetree-comment">key file<');
  expect(html).toContain('aria-hidden="true"');
  expect(html).not.toContain('language-tree');
  expect(html).toContain('stays');
  expect(html).not.toContain('<script');
});
