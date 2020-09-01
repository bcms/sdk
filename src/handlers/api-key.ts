import { ApiKey, ApiKeyAccess } from '../interfaces';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';

export interface ApiKeyHandlerPrototype {
  getAll(): Promise<ApiKey[]>;
  get(id: string): Promise<ApiKey>;
  count(): Promise<number>;
  add(data: {
    name: string;
    desc: string;
    blocked: boolean;
    access: ApiKeyAccess;
  }): Promise<ApiKey>;
  update(data: {
    _id: string;
    name?: string;
    desc?: string;
    blocked?: boolean;
    access?: ApiKeyAccess;
  }): Promise<ApiKey>;
  deleteById(id: string): Promise<void>;
}

export function ApiKeyHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): ApiKeyHandlerPrototype {
  const queueable = Queueable<ApiKey | ApiKey[] | number>(
    'getAll',
    'get',
    'count',
  );
  let countLath = false;
  return {
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const keys = cacheControl.apiKey.getAll();
          if (countLath === false) {
            countLath = true;
            const count = await this.count();
            if (count !== keys.length) {
              const result: {
                keys: ApiKey[];
              } = await send({
                url: '/key/all',
                method: 'GET',
                headers: {
                  Authorization: '',
                },
              });
              result.keys.forEach((key) => {
                cacheControl.apiKey.set(key);
              });
              return JSON.parse(JSON.stringify(result.keys));
            }
          }
          return keys;
        },
      )) as ApiKey[];
    },
    async get(id) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const key = cacheControl.apiKey.get(id);
        if (key) {
          return key;
        }
        const result: {
          key: ApiKey;
        } = await send({
          url: `/key/${id}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.apiKey.set(result.key);
        return JSON.parse(JSON.stringify(result.key));
      })) as ApiKey;
    },
    async count() {
      return (await queueable.exec('count', 'first_done_free_all', async () => {
        const result: {
          count: number;
        } = await send({
          url: '/key/count',
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        return result.count;
      })) as number;
    },
    async add(data) {
      const result: {
        key: ApiKey;
      } = await send({
        url: '/key',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.apiKey.set(result.key);
      return JSON.parse(JSON.stringify(result.key));
    },
    async update(data) {
      const result: {
        key: ApiKey;
      } = await send({
        url: '/key',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.apiKey.set(result.key);
      return JSON.parse(JSON.stringify(result.key));
    },
    async deleteById(id) {
      await send({
        url: `/key/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.apiKey.remove(id);
    },
  };
}
