import { CacheEntry } from './interfaces';
import { totalmem } from 'os';

export interface CacheHandlerPrototype<T> {
  get: (id: string) => T;
  getAll: () => T[];
  getMany: (ids: string[]) => T[];
  set: (entry: T) => void;
  remove: (id: string) => void;
  clear: () => void;
  clearExpired: () => void;
}

export function EntryCacheHandler<T extends { _id: string }>(
  TTL: number,
): CacheHandlerPrototype<T> {
  const cache: Array<CacheEntry<T>> = [];

  return {
    get: (id) => {
      const c = cache.find((e) => e.entry._id === id);
      return c ? c.entry : undefined;
    },
    getAll: () => {
      return JSON.parse(JSON.stringify(cache.map((e) => e.entry)));
    },
    getMany: (ids) => {
      const entries: T[] = [];
      return cache.filter((e) => ids.includes(e.entry._id)).map((e) => e.entry);
    },
    set: (entry) => {
      for (const i in cache) {
        if (cache[i].entry._id === entry._id) {
          cache[i] = {
            expAt: Date.now() + TTL,
            entry,
          };
          return;
        }
      }
      cache.push({
        expAt: Date.now() + TTL,
        entry,
      });
    },
    remove: (id) => {
      for (let i = 0; i < cache.length; i = i + 1) {
        if (cache[i].entry._id === id) {
          cache.splice(i, 1);
        }
      }
    },
    clear: () => {
      cache.splice(0, cache.length);
    },
    clearExpired: () => {
      const clearIds: number[] = [];
      for (let i = 0; i < cache.length; i = i + 1) {
        if (cache[i].expAt > Date.now()) {
          clearIds.push(i);
        }
      }
      for (const i in clearIds) {
        const id = clearIds[i];
        cache.splice(id, 1);
      }
    },
  };
}
