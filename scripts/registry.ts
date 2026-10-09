import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { isSourceRef } from '../src/core/source-ref';

/** Git source entries of the registry's `courses` list; local references are left to the content pipeline. */
export async function gitEntries(contentRoot: string, entrypoint: string): Promise<string[]> {
  const text = await readFile(resolve(contentRoot, entrypoint), 'utf8');
  const match = text.match(/^﻿?---\r?\n((?:[^\n]*\n)*?)---(?:\r?\n|$)/);
  const metadata = match ? parseYaml(match[1]) : null;
  const courses = metadata?.courses;
  if (courses === undefined || courses === null) return [];
  if (!Array.isArray(courses) || courses.some(item => typeof item !== 'string')) throw new Error(`Invalid courses in ${entrypoint}`);
  return courses.filter(isSourceRef);
}
