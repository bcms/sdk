import { EntryLite, PropChange, Widget } from '../interfaces';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';
import { EntryHandlerPrototype } from './entry';

export interface WidgetHandlerPrototype {
  whereIsItUsed(id: string): Promise<EntryLite[]>;

  getAll(): Promise<Widget[]>;

  get(id: string): Promise<Widget>;

  getMany(ids: string[]): Promise<Widget[]>;

  count(): Promise<number>;

  add(data: {
    label: string;
    desc: string;
    singleEntry: boolean;
    previewImage: string;
    previewScript: string;
    previewStyle: string;
  }): Promise<Widget>;

  update(data: {
    _id: string;
    label?: string;
    desc?: string;
    previewImage?: string;
    previewScript?: string;
    previewStyle?: string;
    propChanges?: PropChange[];
  }): Promise<Widget>;

  deleteById(id: string): Promise<void>;
}

export function WidgetHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
  entryHandler: EntryHandlerPrototype,
): WidgetHandlerPrototype {
  const queueable = Queueable<Widget | Widget[]>('getAll', 'get', 'getMany');
  let countLatch = false;

  return {
    async whereIsItUsed(id) {
      const result: {
        entries: Array<{
          id: string;
          templateId: string;
          lngCodes: string[];
        }>;
      } = await send({
        url: `/widget/${id}/where-is-it-used`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      const output: EntryLite[] = [];
      for (const i in result.entries) {
        const e = result.entries[i];
        output.push(
          await entryHandler.getLite({
            id: e.id,
            templateId: e.templateId,
          }),
        );
      }
      return output;
    },
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const widgets = cacheControl.widget.getAll();
          if (countLatch === false) {
            countLatch = true;
            const count = await this.count();
            if (count === widgets.length) {
              return widgets;
            }
          } else if (widgets.length > 0) {
            return widgets;
          }
          const result: {
            widgets: Widget[];
          } = await send({
            url: '/widget/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.widgets.forEach((widget) => {
            cacheControl.widget.set(widget);
          });
          return result.widgets;
        },
      )) as Widget[];
    },
    async get(id) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const widget = cacheControl.widget.get(id);
        if (widget) {
          return widget;
        }
        const result: {
          widget: Widget;
        } = await send({
          url: `/widget/${id}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.widget.set(result.widget);
        return result.widget;
      })) as Widget;
    },
    async getMany(ids) {
      return (await queueable.exec('getMany', 'free_one_by_one', async () => {
        if (countLatch === false) {
          this.getAll();
        }
        const widgets = cacheControl.widget.find((e) => ids.includes(e._id));
        if (widgets.length !== ids.length) {
          const missingIds: string[] = [];
          for (const i in ids) {
            const w = widgets.find((e) => e._id === ids[i]);
            if (!w) {
              missingIds.push(ids[i]);
            }
          }
          const result: {
            widgets: Widget[];
          } = await send({
            url: `/widget/many/${missingIds.join('-')}`,
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          for (const i in result.widgets) {
            cacheControl.group.set(result.widgets[i]);
            widgets.push(JSON.parse(JSON.stringify(result.widgets[i])));
          }
        }
        return widgets;
      })) as Widget[];
    },
    async count() {
      const result: {
        count: number;
      } = await send({
        url: '/widget/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
    async add(data) {
      const result: {
        widget: Widget;
      } = await send({
        url: '/widget',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.widget.set(result.widget);
      return result.widget;
    },
    async update(data) {
      const result: {
        widget: Widget;
      } = await send({
        url: '/widget',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.widget.set(result.widget);
      return result.widget;
    },
    async deleteById(id) {
      await send({
        url: `/widget/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      await cacheControl.widget.remove(id);
    },
  };
}
