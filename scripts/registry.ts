import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { bookListKey } from '../src/core/book-list';
import { isSourceRef, parseSourceRef } from '../src/core/source-ref';

/** One item of the `books` (or older `courses`) list: the text as written, and the slug given to a Git book. */
export type RegistryEntry = { value: string; slug?: string };

/**
 * The list of books in the collection's entry file. An item is a string (a local reference or a Git source) or,
 * for a Git book, an object `{ source, slug }` that chooses the address of the book in the collection.
 */
export async function registryEntries(contentRoot: string, entrypoint: string): Promise<RegistryEntry[]> {
  const text = await readFile(resolve(contentRoot, entrypoint), 'utf8');
  const match = text.match(/^﻿?---\r?\n((?:[^\n]*\n)*?)---(?:\r?\n|$)/);
  const metadata = match ? parseYaml(match[1]) : null;
  const key = bookListKey(metadata, entrypoint);
  const list = metadata?.[key];
  if (list === undefined || list === null) return [];
  if (!Array.isArray(list)) throw new Error(`Invalid ${key} in ${entrypoint}`);
  return list.map((item): RegistryEntry => {
    if (typeof item === 'string') return { value: item };
    const object = item !== null && typeof item === 'object' && !Array.isArray(item) ? item as Record<string, unknown> : null;
    if (!object || typeof object.source !== 'string' || Object.keys(object).some(name => name !== 'source' && name !== 'slug') || (object.slug !== undefined && typeof object.slug !== 'string')) {
      throw new Error(`Invalid ${key} in ${entrypoint}: an item is a quoted string, or an object with "source" and optionally "slug"`);
    }
    if (!isSourceRef(object.source)) throw new Error(`Invalid ${key} in ${entrypoint}: "slug" can only be given to a book from Git (${object.source})`);
    const slug = typeof object.slug === 'string' ? object.slug.trim() : '';
    return slug ? { value: object.source, slug } : { value: object.source };
  });
}

/** Git source entries of the registry; local references are left to the content pipeline. */
export async function gitEntries(contentRoot: string, entrypoint: string): Promise<string[]> {
  return (await registryEntries(contentRoot, entrypoint)).map(entry => entry.value).filter(isSourceRef);
}

/** Slugs given in the registry, by lower-cased normalized source. */
export async function gitSlugs(contentRoot: string, entrypoint: string): Promise<Map<string, string>> {
  const slugs = new Map<string, string>();
  for (const entry of await registryEntries(contentRoot, entrypoint)) if (entry.slug) slugs.set(parseSourceRef(entry.value).normalized.toLowerCase(), entry.slug);
  return slugs;
}
