type ReadingPage = {
  slug: string;
  parent: string | null;
  previous: string | null;
  next: string | null;
};

export function readingOrder<T extends ReadingPage>(pages: readonly T[], page: T, tree: readonly Pick<ReadingPage, 'slug' | 'parent'>[] = pages) {
  const parent = pages.find(candidate => candidate.slug === page.parent);
  const previous = pages.find(candidate => candidate.slug === (page.previous ?? parent?.previous)) ?? null;
  const firstChild = tree.find(candidate => candidate.parent === page.slug);
  const child = firstChild ? pages.find(candidate => candidate.slug === firstChild.slug) : null;
  const next = child ?? pages.find(candidate => candidate.slug === (page.next ?? parent?.next)) ?? null;
  return {
    previous,
    next,
    previousFromParent: page.previous === null && previous !== null,
    nextFromParent: !child && page.next === null && next !== null,
    nextToChild: child != null
  };
}
