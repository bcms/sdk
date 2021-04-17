import type {
  BCMSSdkCacheEntityItem,
  BCMSSdkCacheHandlerPrototype,
} from '../types';

export function BCMSSdkCacheHandler<T extends BCMSSdkCacheEntityItem>() {
  const self: BCMSSdkCacheHandlerPrototype<T> = {
    cache: [],
    get(id) {
      self.cache;
      const c = self.cache.find((e) => e.item._id === id);
      return c ? JSON.parse(JSON.stringify(c.item)) : null;
    },
    getAll() {
      return JSON.parse(JSON.stringify(self.cache.map((e) => e.item)));
    },
    getMany(ids) {
      return JSON.parse(
        JSON.stringify(
          self.cache.filter((e) => ids.includes(e.item._id)).map((e) => e.item),
        ),
      );
    },
    find(query) {
      const output: T[] = [];
      for (let i = 0; i < self.cache.length; i++) {
        if (query(self.cache[i])) {
          output.push(JSON.parse(JSON.stringify(self.cache[i].item)));
        }
      }
      return output;
    },
    findOne(query) {
      for (let i = 0; i < self.cache.length; i++) {
        if (query(self.cache[i])) {
          return JSON.parse(JSON.stringify(self.cache[i].item));
        }
      }
      return null;
    },
    set(item) {
      for (let i = 0; i < self.cache.length; i++) {
        if (self.cache[i].item._id === item._id) {
          self.cache[i] = {
            item: JSON.parse(JSON.stringify(item)),
          };
          return;
        }
      }
      self.cache.push({
        item,
      });
    },
    remove(id) {
      for (let i = 0; i < self.cache.length; i = i + 1) {
        if (self.cache[i].item._id === id) {
          self.cache.splice(i, 1);
          break;
        }
      }
    },
    clear: () => {
      while (self.cache.length > 0) {
        self.cache.pop();
      }
    },
  };
  return self;
}
