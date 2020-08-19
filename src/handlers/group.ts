import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';
import { Group, PropChange } from '../interfaces';

export interface GroupHandlerPrototype {
  getAll(): Promise<Group[]>;
  get(id: string): Promise<Group>;
  count(): Promise<number>;
  add(data: { name: string; desc: string }): Promise<Group>;
  update(data: {
    _id: string;
    name?: string;
    desc?: string;
    propChanges?: PropChange[];
  }): Promise<Group>;
  deleteById(id: string): Promise<void>;
}

export function GroupHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): GroupHandlerPrototype {
  const queueable = Queueable<Group | Group[]>('getAll', 'get');
  let countLatch = false;

  return {
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const groups = cacheControl.group.getAll();
          if (countLatch === false) {
            countLatch = true;
            const count = await this.count();
            if (count === groups.length) {
              return groups;
            }
          } else if (groups.length > 0) {
            return groups;
          }
          const result: {
            groups: Group[];
          } = await send({
            url: '/group/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.groups.forEach((group) => {
            cacheControl.group.set(group);
          });
          return result.groups;
        },
      )) as Group[];
    },
    async get(id) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const group = cacheControl.group.get(id);
        if (group) {
          return group;
        }
        const result: {
          group: Group;
        } = await send({
          url: `/group/${id}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.group.set(result.group);
        return result.group;
      })) as Group;
    },
    async count() {
      const result: {
        count: number;
      } = await send({
        url: '/group/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
    async add(data) {
      const result: {
        group: Group;
      } = await send({
        url: '/group',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.group.set(result.group);
      return result.group;
    },
    async update(data) {
      const result: {
        group: Group;
      } = await send({
        url: '/group',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.group.set(result.group);
      return result.group;
    },
    async deleteById(id) {
      await send({
        url: `/group/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.group.remove(id);
    },
  };
}
