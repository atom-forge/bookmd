type ReadingPage = {
  slug: string;
  parent: string | null;
  previous: string | null;
  next: string | null;
};

export function readingOrder<T extends ReadingPage>(pages: readonly T[], page: T) {
  const parent = pages.find(candidate => candidate.slug === page.parent);
  const previous = pages.find(candidate => candidate.slug === (page.previous ?? parent?.previous)) ?? null;
  const next = pages.find(candidate => candidate.slug === (page.next ?? parent?.next)) ?? null;
  return {
    previous,
    next,
    previousFromParent: page.previous === null && previous !== null,
    nextFromParent: page.next === null && next !== null
  };
}
