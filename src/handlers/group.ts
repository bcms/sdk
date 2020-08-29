import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';
import { Group, PropChange } from '../interfaces';

export interface GroupHandlerPrototype {
  getAll(): Promise<Group[]>;
  get(id: string): Promise<Group>;
  getMany(ids: string[]): Promise<Group[]>;
  count(): Promise<number>;
  add(data: { label: string; desc: string }): Promise<Group>;
  update(data: {
    _id: string;
    label?: string;
    desc?: string;
    propChanges?: PropChange[];
  }): Promise<Group>;
  deleteById(id: string): Promise<void>;
}

export function GroupHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): GroupHandlerPrototype {
  const queueable = Queueable<Group | Group[]>('getAll', 'get', 'getMany');
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
              console.log('getAll done 3');
              return groups;
            }
          } else if (groups.length > 0) {
            console.log('getAll done 2');
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
          console.log('getAll done 1');
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
    async getMany(ids) {
      console.log('HERE 3')
      return (await queueable.exec('getMany', 'free_one_by_one', async () => {
        if (countLatch === false) {
          await this.getAll();
        }
        console.log('h4');
        const groups = cacheControl.group.find((e) => ids.includes(e._id));
        if (groups.length !== ids.length) {
          console.log('h5');
          const missingIds: string[] = [];
          for (const i in ids) {
            const g = groups.find((e) => e._id === ids[i]);
            if (!g) {
              missingIds.push('' + ids[i]);
            }
          }
          console.log('h6');
          const result: {
            groups: Group[];
          } = await send({
            url: `/group/many/${missingIds.join('-')}`,
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          for (const i in result.groups) {
            cacheControl.group.set(result.groups[i]);
            groups.push(result.groups[i]);
          }
        }
        console.log('HERE 2');
        return groups;
      })) as Group[];
    },
    async count() {
      console.log('count start');
      const result: {
        count: number;
      } = await send({
        url: '/group/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      console.log('count done');
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
