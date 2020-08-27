import { CacheEntity } from './interfaces';

export interface CacheHandlerPrototype<T> {
  get: (id: string) => T;
  getAll: () => T[];
  getMany: (ids: string[]) => T[];
  set: (entity: T) => void;
  remove: (id: string) => void;
  clear: () => void;
  clearExpired: () => void;
  find(query: (e: T) => boolean): T[];
  findOne(query: (e: T) => boolean): T;
}

export function EntityCacheHandler<T extends { _id: string }>(
  TTL: number,
): CacheHandlerPrototype<T> {
  const cache: Array<CacheEntity<T>> = [];

  return {
    get: (id) => {
      const c = cache.find((e) => e.entity._id === id);
      return c ? JSON.parse(JSON.stringify(c.entity)) : undefined;
    },
    getAll: () => {
      return JSON.parse(JSON.stringify(cache.map((e) => e.entity)));
    },
    getMany: (ids) => {
      const entries: T[] = [];
      return JSON.parse(
        JSON.stringify(
          cache.filter((e) => ids.includes(e.entity._id)).map((e) => e.entity),
        ),
      );
    },
    set: (entity) => {
      for (const i in cache) {
        if (cache[i].entity._id === entity._id) {
          cache[i] = {
            expAt: Date.now() + TTL,
            entity: JSON.parse(JSON.stringify(entity)),
          };
          return;
        }
      }
      cache.push({
        expAt: Date.now() + TTL,
        entity,
      });
    },
    remove: (id) => {
      for (let i = 0; i < cache.length; i = i + 1) {
        if (cache[i].entity._id === id) {
          cache.splice(i, 1);
        }
      }
    },
    clear: () => {
      while (cache.length > 0) {
        cache.pop();
      }
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
        if (query(cache[i].entity)) {
          output.push(JSON.parse(JSON.stringify(cache[i].entity)));
        }
      }
      return JSON.parse(JSON.stringify(output));
    },
    findOne(query) {
      for (const i in cache) {
        if (query(cache[i].entity)) {
          return JSON.parse(JSON.stringify(cache[i].entity));
        }
      }
    },
  };
}
