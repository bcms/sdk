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
  find(query: (e: T) => boolean): T[];
  findOne(query: (e: T) => boolean): T;
}

export function EntryCacheHandler<T extends { _id: string }>(
  TTL: number,
): CacheHandlerPrototype<T> {
  const cache: Array<CacheEntry<T>> = [];

  return {
    get: (id) => {
      const c = cache.find((e) => e.entry._id === id);
      return c ? JSON.parse(JSON.stringify(c.entry)) : undefined;
    },
    getAll: () => {
      return cache.map((e) => e.entry);
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
    find(query) {
      const output: T[] = [];
      for (const i in cache) {
        if (query(cache[i].entry)) {
          output.push(JSON.parse(JSON.stringify(cache[i].entry)));
        }
      }
      return output;
    },
    findOne(query) {
      for (const i in cache) {
        if (query(cache[i].entry)) {
          return JSON.parse(JSON.stringify(cache[i].entry));
        }
      }
    },
  };
}
