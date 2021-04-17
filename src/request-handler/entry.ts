import type {
  BCMSEntry,
  BCMSEntryLite,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkEntryRequestHandlerPrototype,
  BCMSSdkSendFunction,
} from '../types';
import { BCMSSdkEntryService } from '../services';

export function BCMSSdkEntryRequestHandler(
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  const getAllLatch: {
    [templateId: string]: boolean;
  } = {};
  const self: BCMSSdkEntryRequestHandlerPrototype = {
    async getAllLite(templateId) {
      if (getAllLatch[templateId]) {
        return cache.entryLite.find((e) => e.item.templateId === templateId);
      }
      const query: BCMSEntryLite[] = await send({
        url: `/entry/all/${templateId}/lite`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      getAllLatch[templateId] = true;
      query.forEach((e) => {
        cache.entryLite.set(e);
      });
      return query;
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
        const query: BCMSEntryLite[] = await send({
          url: `/entry/${templateId}/many/lite`,
          method: 'GET',
          headers: {
            Authorization: '',
            ids: missingIds.join('_'),
          },
        });
        query.forEach((e) => {
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
      const query: BCMSEntryLite = await send({
        url: `/entry/${templateId}/${id}/lite`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.entryLite.set(query);
      return query;
    },
    async get(templateId, id) {
      const entity = cache.entry.get(id);
      if (entity) {
        return entity;
      }
      const query: BCMSEntry = await send({
        url: `/entry/${templateId}/${id}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.entry.set(query);
      return query;
    },
    async create(data) {
      const query: BCMSEntry = await send({
        url: `/entry/${data.templateId}`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.entry.set(query);
      cache.entryLite.set(BCMSSdkEntryService.toLite(query));
      cache.entryLite.set(BCMSSdkEntryService.toLite(query));
      return query;
    },
    async update(data) {
      const query: BCMSEntry = await send({
        url: `/entry/${data.templateId}`,
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.entry.set(query);
      cache.entryLite.set(BCMSSdkEntryService.toLite(query));
      return query;
    },
    async deleteById(templateId, id) {
      const query: BCMSEntry = await send({
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
      const query: number = await send({
        url: `/entry/${templateId}/count`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return query;
    },
  };
  return self;
}
