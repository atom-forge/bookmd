// Written by `generate`; gitignored, so tell the type checker the shapes it will have.
declare module '$lib/generated/content.json' {
  const content: unknown;
  export default content;
}
declare module '$lib/generated/catalog.json' {
  const catalog: {
    branding: string;
    page: import('./core/content').ContentPage;
    courses: import('./core/content').Course[];
  };
  export default catalog;
}
