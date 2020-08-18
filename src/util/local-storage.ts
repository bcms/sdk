import { Storage } from '../interfaces';
import * as uuid from 'uuid';

export interface LocalStoragePrototype extends Storage {
  clear: () => void;
}

export function LocalStorage(config: { prfx: string }): LocalStoragePrototype {
  if (!localStorage) {
    throw new Error('"localStorage" does not exist.');
  }

  let subscription: Array<{
    id: string;
    key: string;
    handler: (value: any) => void | Promise<void>;
  }> = [];

  return {
    get: (key) => {
      const value = localStorage.getItem(`${config.prfx}_${key}`);
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
          localStorage.setItem(`${config.prfx}_${key}`, JSON.stringify(value));
        } else {
          localStorage.setItem(`${config.prfx}_${key}`, value);
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
        localStorage.removeItem(`${config.prfx}_${key}`);
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
      const l = JSON.parse(JSON.stringify(localStorage));
      for (const key in l) {
        if (key.startsWith(config.prfx)) {
          localStorage.removeItem(key);
        }
      }
    },
  };
}
