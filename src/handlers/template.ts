import { Template, PropChange } from '../interfaces';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';

export interface TemplateHandlerPrototype {
  getAll(): Promise<Template[]>;
  get(id: string): Promise<Template>;
  count(): Promise<number>;
  add(data: { name: string; desc: string }): Promise<Template>;
  update(data: {
    _id: string;
    name?: string;
    desc?: string;
    propChanges?: PropChange[];
  }): Promise<Template>;
  deleteById(id: string): Promise<void>;
}

export function TemplateHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): TemplateHandlerPrototype {
  const queueable = Queueable<Template | Template[] | number>('getAll', 'get', 'count');
  let countLatch = false;

  return {
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const templates = cacheControl.template.getAll();
          if (countLatch === false) {
            countLatch = true;
            const count = await this.count();
            if (count === templates.length) {
              return templates;
            }
          } else if (templates.length > 0) {
            return templates;
          }
          const result: {
            templates: Template[];
          } = await send({
            url: '/template/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.templates.forEach((template) => {
            cacheControl.template.set(template);
          });
          return result.templates;
        },
      )) as Template[];
    },
    async get(id) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const template = cacheControl.template.get(id);
        if (template) {
          return template;
        }
        const result: {
          template: Template;
        } = await send({
          url: `/template/${id}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.template.set(result.template);
        return result.template;
      })) as Template;
    },
    async count() {
      return (await queueable.exec('count', 'first_done_free_all', async () => {
        const result: {
          count: number;
        } = await send({
          url: '/template/count',
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        return result.count;
      })) as number;
    },
    async add(data) {
      const result: {
        template: Template;
      } = await send({
        url: '/template',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.template.set(result.template);
      return result.template;
    },
    async update(data) {
      const result: {
        template: Template;
      } = await send({
        url: '/template',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.template.set(result.template);
      return result.template;
    },
    async deleteById(id) {
      await send({
        url: `/template/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.group.remove(id);
    },
  };
}