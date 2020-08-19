import { PropChange, Widget } from '../interfaces';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';

export interface WidgetHandlerPrototype {
  getAll(): Promise<Widget[]>;
  get(id: string): Promise<Widget>;
  count(): Promise<number>;
  add(data: { name: string; desc: string }): Promise<Widget>;
  update(data: {
    _id: string;
    name?: string;
    desc?: string;
    propChanges?: PropChange[];
  }): Promise<Widget>;
  deleteById(id: string): Promise<void>;
}

export function WidgetHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): WidgetHandlerPrototype {
  const queueable = Queueable<Widget | Widget[]>('getAll', 'get');
  let countLatch = false;

  return {
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
      cacheControl.widget.remove(id);
    },
  };
}