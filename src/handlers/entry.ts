import { EntryLite, Entry, EntryMeta } from '../interfaces';
import { Queueable } from '../util';
import { CacheControlPrototype, EntryCacheItem } from '../cache';
import { AxiosRequestConfig } from 'axios';

export interface EntryHandlerPrototype {
  getAllLite(templateId: string): Promise<EntryLite[]>;
  get(id: string): Promise<Entry>;
  getManyLite(ids: string[]): Promise<Entry[]>;
  count(templateId): Promise<number>;
  add(data: {
    templateId: string;
    meta: EntryMeta[];
  }): Promise<Entry>;
  update(data: {
    _id: string;
    templateId: string;
    meta: EntryMeta[];
  }): Promise<Entry>;
  deleteById(id: string): Promise<void>;
}

export function EntryHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): EntryHandlerPrototype {
  const queueable = Queueable<Entry | EntryLite[]>(
    'getAllLite',
    'get',
    'getMany',
  );
  const countLatchFor: {
    [key: string]: boolean;
  } = {};

  return {
    async getAllLite(templateId) {
      if (!templateId) {
        throw new Error('Parameter "templateId" was not provided.');
      }
      return (await queueable.exec(
        'getAllLite',
        'free_one_by_one',
        async () => {
          const entriesLite = cacheControl.entry.find(
            (e) => e.data.templateId === templateId,
          );
          countLatchFor[templateId] = true;
          const count = this.count(templateId);
          if (count.count !== entriesLite.length) {
            const eResult: {
              entries: EntryLite[];
            } = await send({
              url: `/entry/all/${templateId}/lite`,
              method: 'GET',
              headers: {
                Authorization: '',
              },
            });
            for (const i in eResult.entries) {
              const entry = eResult.entries[i];
              cacheControl.entry.set({
                _id: entry._id,
                lite: true,
                data: entry,
              });
            }
            return eResult.entries;
          }
          return entriesLite.map((e) => e.data);
        },
      )) as EntryLite[];
    },
    async get(id) {
      if (!id) {
        throw new Error('Parameter "id" was not provided.');
      }
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const entry = cacheControl.entry.get(id);
        if (!entry || entry.lite === true) {
          const result: {
            entry: Entry;
          } = await send({
            url: `/entry/${id}`,
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          cacheControl.entry.set({
            _id: result.entry._id,
            lite: false,
            data: result.entry,
          });
          return result.entry;
        }
        return entry.data;
      })) as Entry;
    },
    async getManyLite(ids) {
      return (await queueable.exec('getMany', 'free_one_by_one', async () => {
        const entries = cacheControl.entry.find((e) => ids.includes(e._id));
        if (entries.length !== ids.length) {
          const missingIds: string[] = [];
          for (const i in ids) {
            const e = entries.find((t) => t._id === ids[i]);
            if (!e) {
              missingIds.push(ids[i]);
            }
          }
          const result: {
            entries: Entry[];
          } = await send({
            url: `/entry/many/lite/${missingIds.join('-')}`,
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          for (const i in result.entries) {
            cacheControl.entry.set({
              _id: result.entries[i]._id,
              data: result.entries[i],
              lite: true,
            });
            entries.push({
              _id: result.entries[i]._id,
              data: result.entries[i],
              lite: true,
            });
          }
        }
        return entries.map((e) => e.data);
      })) as Entry[];
    },
    async count(templateId) {
      if (templateId) {
        const result: {
          count: number;
        } = await send({
          url: `/entry/count/${templateId}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        return result.count;
      } else {
        const result: {
          count: number;
        } = await send({
          url: '/entry/count',
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        return result.count;
      }
    },
    async add(data) {
      const result: {
        entry: Entry;
      } = await send({
        url: '/entry',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.entry.set({
        _id: result.entry._id,
        lite: false,
        data: result.entry,
      });
      return result.entry;
    },
    async update(data) {
      const result: {
        entry: Entry;
      } = await send({
        url: '/entry',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.entry.set({
        _id: result.entry._id,
        lite: false,
        data: result.entry,
      });
      return result.entry;
    },
    async deleteById(id) {
      if (!id) {
        throw new Error('Parameter "id" was not provided.');
      }
      await send({
        url: `/entry/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.entry.remove(id);
    },
  };
}
