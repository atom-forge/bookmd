import { expect, test } from 'bun:test';
import { compareCells } from './sortable-table';

test('numbers are compared by value, text naturally', () => {
  expect(['10', '9', '2,5'].sort(compareCells)).toEqual(['2,5', '9', '10']);
  expect(['file10', 'file2', 'File1'].sort(compareCells)).toEqual(['File1', 'file2', 'file10']);
});
