import type { ContentSource } from '../../core/content';
import type { DirectoryIndex } from './directory-index';
import { describeFileError } from './directory-index';

/** Virtual layout: the chosen folder is mounted under `/course`, beside a generated catalog. */
export const mount = '/course';
export const catalogPath = '/.preview-catalog.md';
export const maxMarkdownBytes = 5 * 1024 * 1024;

// Blob URLs inherit the portal origin. Documents that could run script when opened are never exposed.
const embeddable: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.avif': 'image/avif', '.bmp': 'image/bmp', '.ico': 'image/x-icon', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav'
};
const linkable: Record<string, string> = { ...embeddable, '.pdf': 'application/pdf', '.txt': 'text/plain' };
delete linkable['.svg'];

function enoent(path: string) {
  return Object.assign(new Error(`File not found: ${path.startsWith(mount + '/') ? path.slice(mount.length + 1) : path}`), { code: 'ENOENT' });
}

/** Hides the virtual mount from messages produced by the shared core. */
export function visibleMessage(message: string): string {
  return message.replaceAll(mount + '/', '').replaceAll(catalogPath, 'catalog');
}

export function catalogFor(entry: string): string {
  return `---\ncourses:\n  - ${JSON.stringify(`${mount}/${entry}`)}\n---\n`;
}

/** Maps a virtual path to its file path inside the chosen folder. */
export function folderPath(virtual: string): string | null {
  return virtual.startsWith(mount + '/') ? virtual.slice(mount.length + 1) : null;
}

export function createPreviewSource(index: DirectoryIndex, entry: string) {
  const urls = new Map<string, string>();
  let disposed = false;
  const source: ContentSource = {
    async resolve(path) {
      if (path === catalogPath) return path;
      const inner = folderPath(path);
      if (inner === null || !index.files.has(inner)) throw enoent(path);
      return path;
    },
    async readText(path) {
      if (path === catalogPath) return catalogFor(entry);
      const inner = folderPath(path);
      const handle = inner === null ? undefined : index.files.get(inner);
      if (!handle) throw enoent(path);
      try {
        const file = await handle.file();
        if (file.size > maxMarkdownBytes) throw new Error(`File too large for preview (${Math.ceil(file.size / 1048576)} MB): ${inner}`);
        return await file.text();
      } catch (error) {
        throw new Error(describeFileError(error, inner!), { cause: error });
      }
    },
    async assetUrl(path, _base, usage = 'link') {
      const inner = folderPath(path);
      const handle = inner === null ? undefined : index.files.get(inner);
      if (!handle) throw enoent(path);
      const extension = inner!.slice(inner!.lastIndexOf('.')).toLowerCase();
      const type = (usage === 'embed' ? embeddable : linkable)[extension];
      if (!type) throw new Error(`Asset type is not available in the preview${usage === 'link' ? ' as a link' : ''}: ${inner}`);
      const cached = urls.get(path);
      if (cached) return cached;
      try {
        const file = await handle.file();
        if (disposed) throw new Error('Preview session closed');
        const url = URL.createObjectURL(file.type === type ? file : file.slice(0, file.size, type));
        urls.set(path, url);
        return url;
      } catch (error) {
        throw new Error(describeFileError(error, inner!), { cause: error });
      }
    }
  };
  return {
    source,
    /** Releases all blob URLs; call only after the DOM stopped using them. */
    dispose() { disposed = true; for (const url of urls.values()) URL.revokeObjectURL(url); urls.clear(); }
  };
}
