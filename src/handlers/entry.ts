import {
  EntryLite,
  Entry,
  EntryMeta,
  EntryContent,
  SocketEventName,
} from '../interfaces';
import { Queueable } from '../util';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { SocketHandlerPrototype } from './socket';

export interface EntryHandlerPrototype {
  pushChange<T>(data: { tree: string; data: T }): void;
  getAllLite(templateId: string): Promise<EntryLite[]>;
  get(data: { templateId: string; id: string }): Promise<Entry>;
  getLite(data: { templateId: string; id: string }): Promise<EntryLite>;
  getManyLite(ids: string[]): Promise<Entry[]>;
  count(templateId: string): Promise<number>;
  add(data: {
    templateId: string;
    meta: EntryMeta[];
    content: EntryContent[];
  }): Promise<Entry>;
  update(data: {
    _id: string;
    templateId: string;
    meta: EntryMeta[];
    content: EntryContent[];
  }): Promise<Entry>;
  deleteById(data: { templateId: string; id: string }): Promise<void>;
}

export function EntryHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
  socketHandler: SocketHandlerPrototype,
): EntryHandlerPrototype {
  const queueable = Queueable<Entry | EntryLite[]>(
    'getAllLite',
    'get',
    'getLite',
    'getMany',
  );
  const countLatchFor: {
    [key: string]: boolean;
  } = {};

  return {
    pushChange(data) {
      socketHandler.emit(SocketEventName.ENTRY_CHANGE, data);
    },
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
          if (countLatchFor[templateId]) {
            return entriesLite.map((e) => {
              return e.data;
            });
          }
          countLatchFor[templateId] = true;
          const count = await this.count(templateId);
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
    async get(data) {
      if (!data.id) {
        throw new Error('Parameter "id" was not provided.');
      }
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const entry = cacheControl.entry.get(data.id);
        if (!entry || entry.lite === true) {
          const result: {
            entry: Entry;
          } = await send({
            url: `/entry/${data.templateId}/${data.id}`,
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
    async getLite(data) {
      if (!data.id) {
        throw new Error('Parameter "id" was not provided.');
      }
      return (await queueable.exec('getLite', 'free_one_by_one', async () => {
        const entry = cacheControl.entry.get(data.id);
        if (!entry) {
          const result: {
            entry: EntryLite;
          } = await send({
            url: `/entry/${data.templateId}/${data.id}/lite`,
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          cacheControl.entry.set({
            _id: result.entry._id,
            lite: true,
            data: result.entry,
          });
          return result.entry;
        }
        return entry.data;
      })) as EntryLite;
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
        url: `/entry/${data.templateId}`,
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
        url: `/entry/${data.templateId}`,
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
    async deleteById(data) {
      if (!data.id) {
        throw new Error('Parameter "id" was not provided.');
      }
      await send({
        url: `/entry/${data.templateId}/${data.id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      await cacheControl.entry.remove(data.id);
    },
  };
}
