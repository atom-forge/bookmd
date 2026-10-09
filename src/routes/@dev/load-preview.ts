import { processContent, type ContentDiagnostic, type ContentGraph } from '../../core/content';
import type { DirectoryIndex } from './directory-index';
import { catalogPath, createPreviewSource, visibleMessage } from './preview-source';

export type LoadedPreview = {
  graph: ContentGraph; diagnostics: ContentDiagnostic[]; index: DirectoryIndex; entry: string;
  /** Slug of the course page; the generated catalog page is never shown. */
  courseSlug: string; dispose(): void;
};

/** Processes one entry file with the shared core. Fatal errors reject and release their assets. */
export async function loadPreview(index: DirectoryIndex, entry: string, link: (slug: string, query: string, fragment: string) => string): Promise<LoadedPreview> {
  const session = createPreviewSource(index, entry);
  const diagnostics: ContentDiagnostic[] = [];
  try {
    const graph = await processContent(session.source, catalogPath, { link, diagnostics, title: index.name });
    for (const item of diagnostics) item.message = visibleMessage(item.message);
    return { graph, diagnostics, index, entry, courseSlug: graph.courses[0].slug, dispose: session.dispose };
  } catch (error) {
    session.dispose();
    throw new Error(visibleMessage(error instanceof Error ? error.message : String(error)), { cause: error });
  }
}
