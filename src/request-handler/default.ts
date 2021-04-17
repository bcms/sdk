import type {
  BCMSSdkCacheHandlerPrototype,
  BCMSSdkDefaultRequestHandlerConfig,
  BCMSSdkDefaultRequestHandlerEntity,
  BCMSSdkDefaultRequestHandlerPrototype,
  BCMSSdkSendFunction,
} from '../types';

export function BCMSSdkDefaultRequestHandler<
  Entity extends BCMSSdkDefaultRequestHandlerEntity,
  AddData,
  UpdateData
>(
  config: BCMSSdkDefaultRequestHandlerConfig,
  cache: BCMSSdkCacheHandlerPrototype<Entity>,
  send: BCMSSdkSendFunction,
) {
  let getAllLatch = false;
  const self: BCMSSdkDefaultRequestHandlerPrototype<
    Entity,
    AddData,
    UpdateData
  > = {
    async getAll() {
      if (getAllLatch) {
        return cache.getAll();
      }
      const query: Entity[] = await send({
        url: config.baseUri + '/all',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      query.forEach((e) => {
        cache.set(e);
      });
      getAllLatch = true;
      return query;
    },
    async get(id) {
      const entity = cache.get(id);
      if (entity) {
        return entity;
      }
      const query: Entity = await send({
        url: config.baseUri + `/${id}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.set(query);
      return query;
    },
    async getMany(ids) {
      const missingIds: string[] = [];
      const entities: Entity[] = cache.find((e) => ids.includes(e.item._id));
      for (let i = 0; i < ids.length; i++) {
        if (!entities.find((e) => e._id === ids[i])) {
          missingIds.push(ids[i]);
        }
      }
      if (missingIds.length > 0) {
        const query: Entity[] = await send({
          url: config.baseUri + '/many',
          method: 'GET',
          headers: {
            Authorization: '',
            ids: missingIds.join('_'),
          },
        });
        query.forEach((e) => {
          cache.set(e);
          entities.push(e);
        });
      }
      return entities;
    },
    async create(data) {
      const query: Entity = await send({
        url: config.baseUri,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.set(query);
      return query;
    },
    async update(data) {
      const query: Entity = await send({
        url: config.baseUri,
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.set(query);
      return query;
    },
    async deleteById(id) {
      await send({
        url: config.baseUri + `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cache.remove(id);
    },
    async count() {
      return await send({
        url: config.baseUri + '/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
    },
  };
  return self;
}
