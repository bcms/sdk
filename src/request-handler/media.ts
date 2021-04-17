import type {
  BCMSJwt,
  BCMSMedia,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkMediaRequestHandlerPrototype,
  BCMSSdkMediaServicePrototype,
  BCMSSdkSendFunction,
} from '../types';
import { BCMSMediaType } from '../types';

export function BCMSSdkMediaRequestHandler(
  cache: BCMSSdkCacheControllerPrototype,
  mediaService: BCMSSdkMediaServicePrototype,
  send: BCMSSdkSendFunction,
  getAccessToken: () => BCMSJwt | null,
  getAccessTokenRaw: () => string | null,
  cmsOrigin: string,
) {
  const baseUri = '/media';
  let getAllLatch = false;
  const self: BCMSSdkMediaRequestHandlerPrototype = {
    async getAll() {
      if (getAllLatch) {
        return cache.media.getAll();
      }
      const query: { items: BCMSMedia[] } = await send({
        url: `${baseUri}/all`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      getAllLatch = true;
      query.items.forEach((e) => {
        cache.media.set(e);
      });
      return query.items;
    },
    async getAllByParentId(parentId, propagate) {
      if (!getAllLatch) {
        await self.getAll();
      }
      if (propagate) {
        return mediaService.getChildren(parentId, cache.media.getAll());
      } else {
        return cache.media.find((e) => e.item.parentId === parentId);
      }
    },
    async getAllAggregated() {
      if (!getAllLatch) {
        await self.getAll();
      }
      return mediaService.aggregateFromRoot(cache.media.getAll());
    },
    async getAllByParentIdAggregated(parentId) {
      if (!getAllLatch) {
        await self.getAll();
      }
      const parent = cache.media.get(parentId);
      if (!parent) {
        throw {
          status: 404,
          message: `Media with ID "${parentId}" does not exist.`,
        };
      }
      const aggregate = mediaService.aggregate(parent, cache.media.getAll());
      return aggregate.children ? aggregate.children : null;
    },
    async getMany(ids) {
      const cacheEntities = cache.media.find((e) => ids.includes(e.item._id));
      if (cacheEntities.length !== ids.length) {
        const missingIds: string[] = [];
        for (let i = 0; i < ids.length; i++) {
          if (!cacheEntities.find((e) => e._id === ids[i])) {
            missingIds.push(ids[i]);
          }
        }
        const query: { items: BCMSMedia[] } = await send({
          url: `${baseUri}/many`,
          method: 'GET',
          headers: {
            Authorization: '',
            ids: missingIds.join('_'),
          },
        });
        query.items.forEach((e) => {
          cache.media.set(e);
          cacheEntities.push(e);
        });
      }
      return cacheEntities;
    },
    async get(id) {
      const entity = cache.media.get(id);
      if (entity) {
        return entity;
      }
      const query: { item: BCMSMedia } = await send({
        url: `${baseUri}/${id}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.media.set(query.item);
      return query.item;
    },
    async getAggregated(id) {
      if (!getAllLatch) {
        await self.getAll();
      }
      const parent = cache.media.get(id);
      if (!parent) {
        throw {
          status: 404,
          message: `Media with ID "${id}" does not exist.`,
        };
      }
      return mediaService.aggregate(parent, cache.media.getAll());
    },
    async getUrlWithAccessToken(media, size) {
      const accessToken = getAccessToken();
      if (
        !accessToken ||
        accessToken.payload.exp + accessToken.payload.iat < Date.now() - 1000
      ) {
        await send({
          url: '/test',
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
      }
      return `${cmsOrigin}/api/media/${media._id}/bin${
        size ? '/' + size : ''
      }/act?act=${getAccessTokenRaw()}`;
    },
    async getBinary(id, size) {
      return await send({
        url: `${baseUri}/${id}/bin${size ? '/' + size : ''}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
        responseType: 'arraybuffer',
      });
    },
    async count() {
      if (getAllLatch) {
        return cache.media.getAll().length;
      }
      const query: { count: number } = await send({
        url: `${baseUri}/count`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return query.count;
    },
    async addFile(formData, parentId, uploadProgressCallback) {
      const query: {
        item: BCMSMedia;
      } = await send({
        onUploadProgress: uploadProgressCallback,
        url: `${baseUri}/file${
          typeof parentId !== 'undefined' ? `?parentId=${parentId}` : ''
        }`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data${
            typeof formData.getBoundary !== 'undefined'
              ? `; boundary=${formData.getBoundary()}`
              : ''
          }`,
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: '',
        },
        data: formData,
      });
      cache.media.set(query.item);
      return query.item;
    },
    async addDir(data) {
      const query: { item: BCMSMedia } = await send({
        url: `${baseUri}/dir`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.media.set(query.item);
      return query.item;
    },
    async update(data) {
      const query: { item: BCMSMedia } = await send({
        url: `${baseUri}`,
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cache.media.set(query.item);
      return query.item;
    },
    async deleteById(id) {
      const media = cache.media.get(id);
      await send({
        url: `${baseUri}/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      if (media) {
        if (media.type === BCMSMediaType.DIR) {
          const mediaToDelete = mediaService.getChildren(
            media._id,
            cache.media.getAll(),
          );
          for (let i = 0; i < mediaToDelete.length; i++) {
            cache.media.remove(mediaToDelete[i]._id);
          }
        }
      }
      cache.media.remove(id);
    },
  };
  return self;
}
