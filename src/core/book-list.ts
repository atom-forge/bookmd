/**
 * The list of books in the collection's entry file is `books`; `courses` is the older name and is still read.
 * Both in one file is ambiguous, so it is an error.
 */
export function bookListKey(metadata: Record<string, unknown> | null | undefined, file: string): 'books' | 'courses' {
  const has = (key: string) => metadata?.[key] !== undefined && metadata[key] !== null;
  if (has('books') && has('courses')) throw new Error(`${file}: use either "books" or "courses" (the older name), not both`);
  return has('courses') ? 'courses' : 'books';
}
