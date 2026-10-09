export type PreviewFile = { path: string; file(): Promise<File> };
export type DirectoryIndex = {
  name: string;
  files: Map<string, PreviewFile>;
  /** Skipped directory paths and a reason the scan stopped early, if any. */
  skipped: string[];
  truncated: boolean;
};

// Minimal read-only view of the File System Access API (not in the TypeScript DOM lib).
export type DirectoryHandle = {
  kind: 'directory'; name: string;
  values(): AsyncIterable<DirectoryHandle | FileHandle>;
  queryPermission?(descriptor: { mode: 'read' }): Promise<PermissionState>;
  requestPermission?(descriptor: { mode: 'read' }): Promise<PermissionState>;
};
export type FileHandle = { kind: 'file'; name: string; getFile(): Promise<File> };

export const maxFiles = 20000;
/** Hidden directories and dependency folders are never course content. */
export const ignoredDirectory = (name: string) => name.startsWith('.') || name === 'node_modules';

export async function scanDirectory(root: DirectoryHandle, signal?: { aborted: boolean }): Promise<DirectoryIndex> {
  const index: DirectoryIndex = { name: root.name, files: new Map(), skipped: [], truncated: false };
  async function walk(directory: DirectoryHandle, prefix: string): Promise<void> {
    for await (const entry of directory.values()) {
      if (signal?.aborted) return;
      if (index.files.size >= maxFiles) { index.truncated = true; return; }
      const path = prefix + entry.name;
      if (entry.kind === 'directory') {
        if (ignoredDirectory(entry.name)) index.skipped.push(path);
        else await walk(entry, path + '/');
        if (index.truncated) return;
      } else if (!entry.name.startsWith('.')) {
        index.files.set(path, { path, file: () => entry.getFile() });
      }
    }
  }
  await walk(root, '');
  return index;
}

export function describeFileError(error: unknown, path?: string): string {
  const name = error instanceof DOMException ? error.name : '';
  const where = path ? ` (${path})` : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return `Read permission was lost${where}. Choose the folder again.`;
  if (name === 'NotFoundError') return `A file was removed or renamed${where}. Reload the preview.`;
  return error instanceof Error ? error.message : String(error);
}
