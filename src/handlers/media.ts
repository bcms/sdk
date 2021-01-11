import { Media, MediaAggregate } from '../interfaces';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable, MediaUtil } from '../util';

export interface MediaHandlerPrototype {
  getUrlWithAccessToken(media: Media, size?: 'small'): Promise<string>;
  getAll(): Promise<Media[]>;
  getAllAggregated(): Promise<MediaAggregate[]>;
  getAllByParentId(parentId: string): Promise<Media[]>;
  getMany(ids: string[]): Promise<Media[]>;
  get(id: string): Promise<Media>;
  getAggregated(id: string): Promise<MediaAggregate>;
  getBinary(id: string, size?: 'small'): Promise<Buffer>;
  count(): Promise<number>;
  /**
   * Add new file to the server and the database. If parent ID
   * is not provided, file will be added to the root.
   */
  addFile(
    formData: FormData,
    parentId?: string,
    uploadProgressCallback?: (data: any) => void,
  ): Promise<Media>;
  /**
   * Create a new DIR Media on the server and in database.
   */
  addDir(data: { name: string; parentId?: string }): Promise<Media>;
  update(data: { _id: string; rename: string }): Promise<Media>;
  /**
   * Will remove specified Media and its dependencies from
   * the database. Have in mind that deleting a DIR, all
   * of its children will be deleted to.
   */
  deleteById(id: string);
}

export function MediaHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
  getAccessToken: () => Promise<string>,
  cmsOrigin: string,
): MediaHandlerPrototype {
  const mUtil = MediaUtil();
  const queueable = Queueable<
    Media | Media[] | MediaAggregate | MediaAggregate[]
  >(
    'getAll',
    'getAllAggregated',
    'getAllByParentId',
    'get',
    'getAggregated',
    'getMany',
  );
  let countLatch = false;

  return {
    async getUrlWithAccessToken(media, size) {
      return `${cmsOrigin}/api/media/${media._id}/bin${
        size ? '/' + size : ''
      }/act?act=${await getAccessToken()}`;
    },
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const media = cacheControl.media.getAll();
          if (countLatch === false) {
            countLatch = true;
            const count = await this.count();
            if (count === media.length) {
              return media;
            }
          } else if (media.length > 0) {
            return media;
          }
          const result: {
            media: Media[];
          } = await send({
            url: '/media/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.media.forEach((m) => {
            cacheControl.media.set(m);
          });
          return result.media;
        },
      )) as Media[];
    },
    async getAllAggregated() {
      return (await queueable.exec(
        'getAllAggregated',
        'first_done_free_all',
        async () => {
          const media = cacheControl.media.getAll();
          if (countLatch === false) {
            countLatch = true;
            const count = await this.count();
            if (count === media.length) {
              return mUtil.aggregateFromRoot(media);
            }
          } else if (media.length > 0) {
            return mUtil.aggregateFromRoot(media);
          }
          const result: {
            media: Media[];
          } = await send({
            url: '/media/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.media.forEach((m) => {
            cacheControl.media.set(m);
          });
          return mUtil.aggregateFromRoot(result.media);
        },
      )) as MediaAggregate[];
    },
    async getAllByParentId(parentId) {
      return (await queueable.exec(
        'getAllByParentId',
        'free_one_by_one',
        async () => {
          if (countLatch === false) {
            await this.getAll();
          }
          return mUtil.aggregateFromRoot(
            cacheControl.media.find((e) => e.parentId === parentId),
          );
        },
      )) as Media[];
    },
    async getMany(ids) {
      return (await queueable.exec('getMany', 'free_one_by_one', async () => {
        if (countLatch === false) {
          await this.getAll();
        }
        const missingIds: string[] = [];
        const media: Media[] = [];
        ids.forEach((id) => {
          const m = cacheControl.media.get(id);
          if (!m) {
            missingIds.push(id);
          } else {
            media.push(m);
          }
        });
        // const media = cacheControl.media.find((e) => {
        //   if (ids.includes(e._id)) {
        //     return true;
        //   }
        //   missingIds.push(e._id);
        //   return false;
        // });
        if (missingIds.length > 0) {
          const result: {
            media: Media[];
          } = await send({
            url: `/media/many/${missingIds.join('-')}`,
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          for (const i in result.media) {
            cacheControl.media.set(result.media[i]);
            media.push(JSON.parse(JSON.stringify(result.media[i])));
          }
        }
        return media;
      })) as Media[];
    },
    async get(id) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const media = cacheControl.media.get(id);
        if (media) {
          return JSON.parse(JSON.stringify(media));
        }
        const result: {
          media: Media;
        } = await send({
          url: `/media/${id}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.media.set(result.media);
        return JSON.parse(JSON.stringify(result.media));
      })) as Media;
    },
    async getAggregated(id) {
      return (await queueable.exec(
        'getAggregated',
        'free_one_by_one',
        async () => {
          if (countLatch === false) {
            await this.getAll();
          }
          const media = cacheControl.media.get(id);
          if (media) {
            return mUtil.aggregate(media, cacheControl.media.getAll());
          }
          const result: {
            media: Media;
          } = await send({
            url: `/media/${id}`,
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          cacheControl.media.set(result.media);
          return mUtil.aggregate(result.media, cacheControl.media.getAll());
        },
      )) as MediaAggregate;
    },
    async getBinary(id, size) {
      const result: Buffer = await send({
        url: `/media/${id}/bin${size ? '/' + size : ''}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
        responseType: 'arraybuffer',
      });
      return result;
    },
    async addDir(data) {
      const result: {
        media: Media;
      } = await send({
        url: '/media/dir',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.media.set(result.media);
      return JSON.parse(JSON.stringify(result.media));
    },
    async addFile(formData, parentId?, uploadProgressCallback?) {
      // const fd = new FormData();
      // fd.append('media', file.blob, file.name);
      const result: {
        media: Media;
      } = await send({
        onUploadProgress: (eventData) => {
          uploadProgressCallback(eventData);
        },
        url: `/media/file${
          typeof parentId !== 'undefined' ? `?parentId=${parentId}` : ''
        }`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data${
            typeof (formData as any).getBoundary !== 'undefined'
              ? `; boundary=${(formData as any).getBoundary()}`
              : ''
          }`,
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: '',
        },
        data: formData,
      });
      cacheControl.media.set(result.media);
      return JSON.parse(JSON.stringify(result.media));
    },
    async update(data) {
      const result: {
        media: Media;
      } = await send({
        url: `/media/${data._id}`,
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.media.set(result.media);
      return JSON.parse(JSON.stringify(result.media));
    },
    async count() {
      const result: {
        count: number;
      } = await send({
        url: '/media/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
    async deleteById(id) {
      await send({
        url: `/media/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.media.remove(id);
    },
  };
}
