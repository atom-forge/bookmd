import type { DirectoryHandle } from './directory-index';

/** Only the folder handle and the entry path are kept, never file contents. */
export type StoredPreview = { handle: DirectoryHandle; entry: string };

const database = 'bookmd-preview';
const store = 'session';
const key = 'last';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(database, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (objects: IDBObjectStore) => IDBRequest<T>): Promise<T | undefined> {
  try {
    const db = await open();
    try {
      return await new Promise<T>((resolve, reject) => {
        const request = action(db.transaction(store, mode).objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally { db.close(); }
  } catch { return undefined; } // Storage can be blocked; the preview then simply does not persist.
}

export async function loadStored(): Promise<StoredPreview | null> {
  const value = await run('readonly', objects => objects.get(key));
  return value && typeof value === 'object' && 'handle' in value && typeof (value as StoredPreview).entry === 'string' ? value as StoredPreview : null;
}
export async function saveStored(value: StoredPreview): Promise<void> { await run('readwrite', objects => objects.put(value, key)); }
