import { Storage } from '../interfaces';
import * as uuid from 'uuid';

interface LSPrototype {
  all: () => any;
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
function LS(): LSPrototype {
  if (typeof localStorage !== 'undefined') {
    return {
      all: () => {
        return localStorage;
      },
      getItem: (key) => {
        return localStorage.getItem(key);
      },
      setItem: (key, value) => {
        return localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        return localStorage.removeItem(key);
      },
    };
  }
  // tslint:disable-next-line: variable-name
  const _storage: {
    [key: string]: string;
  } = {};

  return {
    all: () => {
      return JSON.parse(JSON.stringify(_storage));
    },
    getItem: (key) => {
      if (_storage[key]) {
        return '' + _storage[key];
      } else {
        return undefined;
      }
    },
    setItem: (key, value) => {
      _storage[key] = '' + value;
    },
    removeItem: (key) => {
      delete _storage[key];
    },
  };
}
export interface LocalStoragePrototype extends Storage {
  clear: () => void;
}
export function LocalStorage(config: { prfx: string }): LocalStoragePrototype {
  const ls = LS();

  let subscription: Array<{
    id: string;
    key: string;
    handler: (value: any) => void | Promise<void>;
  }> = [];

  return {
    get: (key) => {
      const value = ls.getItem(`${config.prfx}_${key}`);
      if (value) {
        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      }
      return undefined;
    },
    set: async (key, value) => {
      try {
        if (typeof value === 'object') {
          ls.setItem(`${config.prfx}_${key}`, JSON.stringify(value));
        } else {
          ls.setItem(`${config.prfx}_${key}`, value);
        }
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.error(error);
        return false;
      }
      for (const i in subscription) {
        const e = subscription[i];
        if (e.key === key) {
          await e.handler(value);
        }
      }
      return true;
    },
    remove: (key) => {
      try {
        ls.removeItem(`${config.prfx}_${key}`);
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.error(error);
        return false;
      }
      return true;
    },
    subscribe: (key, handler) => {
      const id = uuid.v4();
      subscription.push({
        id,
        key,
        handler,
      });
      return () => {
        subscription = subscription.filter((e) => e.id !== id);
      };
    },
    clear: () => {
      const l = JSON.parse(JSON.stringify(ls.all()));
      for (const key in l) {
        if (key.startsWith(config.prfx)) {
          ls.removeItem(key);
        }
      }
    },
  };
}
