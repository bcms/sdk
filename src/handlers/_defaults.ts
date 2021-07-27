import type { BCMSEntity } from '../types';
import type {
  BCMSDefaultHandler,
  BCMSDefaultHandlerConfig,
} from '../types/handlers/_defaults';

export function createBcmsDefaultHandler<
  Model extends BCMSEntity & { cid?: string },
  AddData,
  UpdateData,
>({
  baseUri,
  send,
  cache,
}: BCMSDefaultHandlerConfig<Model>): BCMSDefaultHandler<
  Model,
  AddData,
  UpdateData
> {
  let getAllLatch = false;

  return {
    async getAll() {
      if (getAllLatch) {
        return cache.findAll();
      }
      const result: {
        items: Model[];
      } = await send({
        url: baseUri + '/all',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.set(result.items);
      getAllLatch = true;
      return result.items;
    },
    async get(cid, skipCache) {
      if (!skipCache) {
        const cacheHit = cache.findOne((e) => e.cid === cid);
        if (cacheHit) {
          return cacheHit;
        }
      }
      const result: { item: Model } = await send({
        url: baseUri + `/${cid}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.set(result.item);
      return result.item;
    },
    async getMany(cids, skipCache) {
      let items: Model[] = [];
      let missingIds: string[] = [];
      if (!skipCache) {
        const cacheHits = cache.find((e) => cids.includes(e.cid as string));
        for (let i = 0; i < cids.length; i++) {
          const cid = cids[i];
          if (!cacheHits.find((e) => e.cid === cid)) {
            missingIds.push(cid);
          }
        }
        if (missingIds.length === 0) {
          return cacheHits;
        } else {
          items = cacheHits;
        }
      } else {
        missingIds = cids;
      }
      const result: { items: Model[] } = await send({
        url: baseUri + '/many',
        method: 'GET',
        headers: {
          Authorization: '',
          'X-Bcms-Ids': missingIds.join('_'),
        },
      });
      cache.set(result.items);
      return [...items, ...result.items];
    },
    async create(data) {
      const result: { item: Model } = await send({
        url: baseUri,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.set(result.item);
      return result.item;
    },
    async update(data) {
      const result: { item: Model } = await send({
        url: baseUri,
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.set(result.item);
      return result.item;
    },
    async deleteById(id) {
      await send({
        url: baseUri + `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      const cacheHit = cache.findOne((e) => e._id === id);
      if (cacheHit) {
        cache.remove(cacheHit);
      }
    },
    async count() {
      if (getAllLatch) {
        return cache.findAll().length;
      }
      const result: { count: number } = await send({
        url: baseUri + '/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
  };
}
