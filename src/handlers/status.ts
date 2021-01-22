import { AxiosRequestConfig } from 'axios';
import { CacheControlPrototype } from '../cache';
import { Queueable } from '../util';
import { Status } from '../interfaces';

export interface StatusHandlerPrototype {
  getAll(): Promise<Status[]>;
  get(id: string): Promise<Status>;
  count(): Promise<number>;
  add(data: { label: string; color?: string }): Promise<Status>;
  update(data: {
    _id: string;
    label?: string;
    color?: string;
  }): Promise<Status>;
  deleteById(id: string): Promise<void>;
}

export function StatusHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): StatusHandlerPrototype {
  const queueable = Queueable<Status | Status[]>('getAll', 'get', 'getMany');
  let countLatch = false;

  const self: StatusHandlerPrototype = {
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const statuses = cacheControl.status.getAll();
          if (countLatch === false) {
            countLatch = true;
            const count = await self.count();
            if (count === statuses.length) {
              return statuses;
            }
          } else if (statuses.length > 0) {
            return statuses;
          }
          const result: {
            statuses: Status[];
          } = await send({
            url: '/status/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.statuses.forEach((status) => {
            cacheControl.status.set(status);
          });
          return result.statuses;
        },
      )) as Status[];
    },
    async get(id) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const status = cacheControl.status.get(id);
        if (status) {
          return status;
        }
        const result: {
          status: Status;
        } = await send({
          url: `/status/${id}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.status.set(result.status);
        return result.status;
      })) as Status;
    },
    async count() {
      const result: {
        count: number;
      } = await send({
        url: '/status/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
    async add(data) {
      const result: {
        status: Status;
      } = await send({
        url: '/status',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.status.set(result.status);
      return result.status;
    },
    async update(data) {
      const result: {
        status: Status;
      } = await send({
        url: '/status',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.status.set(result.status);
      return result.status;
    },
    async deleteById(id) {
      await send({
        url: `/status/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.status.remove(id);
    },
  };
  return self;
}
