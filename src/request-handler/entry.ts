import type {
  BCMSEntry,
  BCMSEntryLite,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkEntryRequestHandlerPrototype,
  BCMSSdkEntryServicePrototype,
  BCMSSdkSendFunction,
} from '../types';

export function BCMSSdkEntryRequestHandler(
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
  entryService: BCMSSdkEntryServicePrototype,
) {
  const getAllLatch: {
    [templateId: string]: boolean;
  } = {};
  const self: BCMSSdkEntryRequestHandlerPrototype = {
    async getAllLite(templateId) {
      if (getAllLatch[templateId]) {
        return cache.entryLite.find((e) => e.item.templateId === templateId);
      }
      const query: { items: BCMSEntryLite[] } = await send({
        url: `/entry/all/${templateId}/lite`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      getAllLatch[templateId] = true;
      query.items.forEach((e) => {
        cache.entryLite.set(e);
      });
      return query.items;
    },
    async getManyLite(templateId, ids) {
      const cacheEntities = cache.entryLite.find(
        (e) => e.item.templateId === templateId && ids.includes(e.item._id),
      );
      if (cacheEntities.length !== ids.length) {
        const missingIds: string[] = [];
        for (let i = 0; i < ids.length; i++) {
          if (!cacheEntities.find((e) => e._id === ids[i])) {
            missingIds.push(ids[i]);
          }
        }
        const query: { items: BCMSEntryLite[] } = await send({
          url: `/entry/${templateId}/many/lite`,
          method: 'GET',
          headers: {
            Authorization: '',
            ids: missingIds.join('_'),
          },
        });
        query.items.forEach((e) => {
          cache.entryLite.set(e);
          cacheEntities.push(e);
        });
      }
      return cacheEntities;
    },
    async getLite(templateId, id) {
      const entity = cache.entryLite.get(id);
      if (entity) {
        return entity;
      }
      const query: { item: BCMSEntryLite } = await send({
        url: `/entry/${templateId}/${id}/lite`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.entryLite.set(query.item);
      return query.item;
    },
    async get(templateId, id) {
      const entity = cache.entry.get(id);
      if (entity) {
        return entity;
      }
      const query: { item: BCMSEntry } = await send({
        url: `/entry/${templateId}/${id}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.entry.set(query.item);
      return query.item;
    },
    async create(data) {
      const query: { item: BCMSEntry } = await send({
        url: `/entry/${data.templateId}`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.entry.set(query.item);
      cache.entryLite.set(entryService.toLite(query.item));
      return query.item;
    },
    async update(data) {
      const query: { item: BCMSEntry } = await send({
        url: `/entry/${data.templateId}`,
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.entry.set(query.item);
      cache.entryLite.set(entryService.toLite(query.item));
      return query.item;
    },
    async deleteById(templateId, id) {
      await send({
        url: `/entry/${templateId}/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cache.entryLite.remove(id);
      cache.entry.remove(id);
    },
    async count(templateId) {
      if (getAllLatch[templateId]) {
        return cache.entryLite.find((e) => e.item.templateId === templateId)
          .length;
      }
      const query: { count: number } = await send({
        url: `/entry/${templateId}/count`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return query.count;
    },
  };
  return self;
}
