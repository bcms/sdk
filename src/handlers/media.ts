import {
  BCMSMedia,
  BCMSMediaHandler,
  BCMSMediaHandlerConfig,
  BCMSStoreMutationTypes,
} from '../types';
import { useBcmsStringUtility } from '../util';

export function createBcmsMediaHandler({
  send,
  store,
}: BCMSMediaHandlerConfig): BCMSMediaHandler {
  const baseUri = '/media';
  const latch: {
    getAll: boolean;
    getByParentId: {
      [parentId: string]: boolean;
    };
  } = {
    getAll: false,
    getByParentId: {},
  };
  const stringUtil = useBcmsStringUtility();

  const self: BCMSMediaHandler = {
    async getAll() {
      if (latch.getAll) {
        return store.getters.media_items;
      }
      const result: {
        items: BCMSMedia[];
      } = await send({
        url: `${baseUri}/all`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      latch.getAll = true;
      store.commit(BCMSStoreMutationTypes.media_set, result.items);
      return result.items;
    },
    async getAllByParentId(id, skipCache) {
      if (!skipCache) {
        if (latch.getByParentId[id]) {
          return store.getters.media_find((e) => e.parentId === id);
        }
      }
      const result: {
        items: BCMSMedia[];
      } = await send({
        url: `${baseUri}/all/parent/${id}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      latch.getByParentId[id] = true;
      store.commit(BCMSStoreMutationTypes.media_set, result.items);
      return result.items;
    },
    async getMany(ids, skipCache) {
      let cacheHits: BCMSMedia[] = [];
      let missingIds: string[] = [];
      if (!skipCache) {
        cacheHits = store.getters.media_find((e) => ids.includes(e._id));
        if (cacheHits.length !== ids.length) {
          for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (!cacheHits.find((e) => e._id === id)) {
              missingIds.push(id);
            }
          }
        } else {
          return cacheHits;
        }
      } else {
        missingIds = ids;
      }
      const result: { items: BCMSMedia[] } = await send({
        url: `${baseUri}/many`,
        method: 'GET',
        headers: {
          Authorization: '',
          'X-Bcms-Ids': missingIds.join('-'),
        },
      });
      store.commit(BCMSStoreMutationTypes.media_set, result.items);
      return [...cacheHits, ...result.items];
    },
    async getById(id, skipCache) {
      if (!skipCache) {
        const cacheHit = store.getters.media_findOne((e) => e._id === id);
        if (cacheHit) {
          return cacheHit;
        }
      }
      const result: { item: BCMSMedia } = await send({
        url: `${baseUri}/${id}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      store.commit(BCMSStoreMutationTypes.media_set, result.item);
      return result.item;
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
    async createFile(data) {
      const filenameParts = data.file.name.split('.');
      const filename =
        stringUtil.toSlug(
          filenameParts.splice(0, filenameParts.length - 1).join('.'),
        ) +
        '.' +
        filenameParts[filenameParts.length - 1];
      const fd: FormData & {
        getBoundary?(): number;
      } = new FormData();
      fd.append('media', data.file, filename);
      const result: {
        item: BCMSMedia;
      } = await send({
        onUploadProgress: data.onProgress,
        url: `${baseUri}/file${
          typeof data.parentId !== 'undefined'
            ? `?parentId=${data.parentId}`
            : ''
        }`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data${
            typeof fd.getBoundary !== 'undefined'
              ? `; boundary=${fd.getBoundary()}`
              : ''
          }`,
          Authorization: '',
        },
        data: fd,
      });
      store.commit(BCMSStoreMutationTypes.media_set, result.item);
      return result.item;
    },
    async createDir(data) {
      const result: { item: BCMSMedia } = await send({
        url: `${baseUri}/dir`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      store.commit(BCMSStoreMutationTypes.media_set, result.item);
      return result.item;
    },
    async count() {
      if (latch.getAll) {
        return store.getters.media_items.length;
      }
      const result: { count: number } = await send({
        url: `${baseUri}/count`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
    async deleteById(id) {
      await send({
        url: `${baseUri}/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      const cacheHit = store.getters.media_findOne((e) => e._id === id);
      if (cacheHit) {
        store.commit(BCMSStoreMutationTypes.media_remove, cacheHit);
      }
    },
  };

  return self;
}
