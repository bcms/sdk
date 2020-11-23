import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';
import { Group, PropChange, Template, Widget } from '../interfaces';
import { TemplateHandlerPrototype } from './template';
import { WidgetHandlerPrototype } from './widget';

export interface GroupHandlerPrototype {
  whereIsItUsed(
    id: string,
  ): Promise<{
    templates: Template[];
    groups: Group[];
    widgets: Widget[];
  }>;
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
  templateHandler: TemplateHandlerPrototype,
  widgetHandler: WidgetHandlerPrototype,
): GroupHandlerPrototype {
  const queueable = Queueable<Group | Group[]>('getAll', 'get', 'getMany');
  let countLatch = false;

  const self: GroupHandlerPrototype = {
    async whereIsItUsed(id) {
      const result: {
        templateIds: string[];
        groupIds: string[];
        widgetIds: string[];
      } = await send({
        url: `/group/${id}/where-is-it-used`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      const output: {
        templates: Template[];
        groups: Group[];
        widgets: Widget[];
      } = {
        groups: [],
        templates: [],
        widgets: [],
      };
      for (const i in result.templateIds) {
        output.templates.push(await templateHandler.get(result.templateIds[i]));
      }
      for (const i in result.groupIds) {
        output.groups.push(await self.get(result.groupIds[i]));
      }
      for (const i in result.widgetIds) {
        output.widgets.push(await widgetHandler.get(result.widgetIds[i]));
      }
      return output;
    },
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
    async getMany(ids) {
      return (await queueable.exec('getMany', 'free_one_by_one', async () => {
        if (countLatch === false) {
          await this.getAll();
        }
        const groups = cacheControl.group.find((e) => ids.includes(e._id));
        if (groups.length !== ids.length) {
          const missingIds: string[] = [];
          for (const i in ids) {
            const g = groups.find((e) => e._id === ids[i]);
            if (!g) {
              missingIds.push('' + ids[i]);
            }
          }
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
            groups.push(JSON.parse(JSON.stringify(result.groups[i])));
          }
        }
        return groups;
      })) as Group[];
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
      await cacheControl.group.remove(id);
    },
  };
  return self;
}
