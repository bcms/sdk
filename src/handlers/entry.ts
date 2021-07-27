import {
  BCMSEntry,
  BCMSEntryHandler,
  BCMSEntryHandlerConfig,
  BCMSEntryLite,
  BCMSStoreMutationTypes,
} from '../types';

export function createBcmsEntryHandler({
  send,
  store,
}: BCMSEntryHandlerConfig): BCMSEntryHandler {
  const baseUri = '/entry';
  const getAllLatch: {
    [templateId: string]: boolean;
  } = {};

  return {
    async getAllLite(data) {
      if (getAllLatch[data.templateId]) {
        return store.getters.entryLite_find(
          (e) => e.templateId === data.templateId,
        );
      }
      const result: { items: BCMSEntryLite[] } = await send({
        url: `${baseUri}/all/${data.templateId}/lite`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      getAllLatch[data.templateId] = true;
      store.commit(BCMSStoreMutationTypes.entryLite_set, result.items);
      return result.items;
    },
    async getManyLite(data) {
      let cacheHits: BCMSEntryLite[] = [];
      let missingIds: string[] = [];
      if (!data.skipCache) {
        cacheHits = store.getters.entry_find(
          (e) =>
            e.templateId === data.templateId && data.entryIds.includes(e._id),
        );
        if (cacheHits.length === data.entryIds.length) {
          return cacheHits;
        }
        for (let i = 0; i < data.entryIds.length; i++) {
          const entryId = data.entryIds[i];
          if (!cacheHits.find((e) => e._id === entryId)) {
            missingIds.push(entryId);
          }
        }
      } else {
        missingIds = data.entryIds;
      }
      const result: { items: BCMSEntryLite[] } = await send({
        url: `${baseUri}/many/${data.templateId}`,
        method: 'GET',
        headers: {
          Authorization: '',
          'X-Bcms-Ids': data.entryIds,
        },
      });
      store.commit(BCMSStoreMutationTypes.entryLite_set, result.items);
      return [...cacheHits, ...result.items];
    },
    async getLite(data) {
      if (!data.skipCache) {
        const cacheHit = store.getters.entryLite_findOne(
          (e) => e._id === data.entryId,
        );
        if (cacheHit) {
          return cacheHit;
        }
      }
      const result: { item: BCMSEntryLite } = await send({
        url: `${baseUri}/${data.templateId}/${data.entryId}/lite`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      store.commit(BCMSStoreMutationTypes.entryLite_set, result.item);
      return result.item;
    },
    async get(data) {
      if (!data.skipCache) {
        const cacheHit = store.getters.entry_findOne(
          (e) => e._id === data.entryId,
        );
        if (cacheHit) {
          return cacheHit;
        }
      }
      const result: { item: BCMSEntry } = await send({
        url: `${baseUri}/${data.templateId}/${data.entryId}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      store.commit(BCMSStoreMutationTypes.entry_set, result.item);
      return result.item;
    },
    async count(data) {
      if (getAllLatch[data.templateId]) {
        return store.getters.entryLite_find(
          (e) => e.templateId === data.templateId,
        ).length;
      }
      const result: { count: number } = await send({
        url: `${baseUri}/count/${data.templateId}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
    async create(data) {
      const result: {
        item: BCMSEntry;
      } = await send({
        url: `${baseUri}/${data.templateId}`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      store.commit(BCMSStoreMutationTypes.entry_set, result.item);
      store.commit(BCMSStoreMutationTypes.entryLite_set, {
        _id: result.item._id,
        createdAt: result.item.createdAt,
        updatedAt: result.item.updatedAt,
        cid: result.item.cid,
        templateId: result.item.templateId,
        userId: result.item.userId,
        meta: result.item.meta.map((meta) => {
          return {
            lng: meta.lng,
            props: meta.props.slice(0, 2),
          };
        }),
      });
      return result.item;
    },
    async update(data) {
      const result: {
        item: BCMSEntry;
      } = await send({
        url: `${baseUri}/${data.templateId}`,
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      store.commit(BCMSStoreMutationTypes.entry_set, result.item);
      store.commit(BCMSStoreMutationTypes.entryLite_set, {
        _id: result.item._id,
        createdAt: result.item.createdAt,
        updatedAt: result.item.updatedAt,
        cid: result.item.cid,
        templateId: result.item.templateId,
        userId: result.item.userId,
        meta: result.item.meta.map((meta) => {
          return {
            lng: meta.lng,
            props: meta.props.slice(0, 2),
          };
        }),
      });
      return result.item;
    },
    async deleteById(data) {
      await send({
        url: `${baseUri}/${data.templateId}/${data.entryId}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
        data,
      });
      const entryLiteCacheHit = store.getters.entryLite_findOne(
        (e) => e._id === data.entryId,
      );
      if (entryLiteCacheHit) {
        store.commit(
          BCMSStoreMutationTypes.entryLite_remove,
          entryLiteCacheHit,
        );
      }
      const entryCacheHit = store.getters.entry_findOne(
        (e) => e._id === data.entryId,
      );
      if (entryCacheHit) {
        store.commit(BCMSStoreMutationTypes.entry_remove, entryCacheHit);
      }
    },
  };
}
