const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
const arrows = { none: '↕', ascending: '▲', descending: '▼' } as const;

/** Compares two cell texts: numbers by value (a decimal comma is accepted), everything else as natural text. */
export function compareCells(a: string, b: string): number {
  const number = (text: string) => /^[-+]?\d+([.,]\d+)?$/.test(text.trim()) ? Number(text.trim().replace(',', '.')) : NaN;
  const x = number(a), y = number(b);
  if (!Number.isNaN(x) && !Number.isNaN(y)) return x - y;
  return collator.compare(a, b);
}

/** Makes the header cells of a table clickable: ascending, descending, then back to the document order. */
export function makeSortable(table: HTMLTableElement): void {
  const body = table.tBodies[0];
  const headers = table.tHead?.rows[0]?.cells;
  if (!body || !headers || body.rows.length < 2) return;
  const original = [...body.rows];
  for (const [column, header] of [...headers].entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'inline-flex cursor-pointer items-center gap-1.5 font-[inherit] text-inherit';
    button.append(...header.childNodes);
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.className = 'text-xs opacity-50';
    arrow.textContent = arrows.none;
    button.append(arrow);
    header.append(button);
    header.setAttribute('aria-sort', 'none');
    button.addEventListener('click', () => {
      const state = header.getAttribute('aria-sort') as keyof typeof arrows;
      const next = state === 'ascending' ? 'descending' : state === 'descending' ? 'none' : 'ascending';
      for (const other of headers) {
        other.setAttribute('aria-sort', other === header ? next : 'none');
        const mark = other.querySelector('button > span');
        if (mark) mark.textContent = arrows[other === header ? next : 'none'];
      }
      const text = (row: HTMLTableRowElement) => row.cells[column]?.textContent?.trim() ?? '';
      const rows = next === 'none' ? original : [...original].sort((a, b) => (next === 'ascending' ? 1 : -1) * compareCells(text(a), text(b)));
      body.append(...rows);
    });
  }
}
