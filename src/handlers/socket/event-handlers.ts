import {
  SocketEventName,
  SocketEventData,
  HandlerManager,
  JWT,
  SocketSubscriptions,
} from '../../interfaces';
import { CacheControlPrototype } from '../../cache';

export interface SocketEventHandlerPrototype {
  name: SocketEventName;
  handler: (data: SocketEventData) => Promise<void>;
}

export function SocketEventHandlers(
  cacheControl: CacheControlPrototype,
  handlerManager: HandlerManager,
  getSocketId: () => string,
  getSubscriptions: () => SocketSubscriptions,
): SocketEventHandlerPrototype[] {
  const runUpdates = async (
    updates: Array<{
      name: string;
      ids: string[];
    }>,
  ) => {
    if (updates && updates instanceof Array) {
      updates.forEach(async (update, i) => {
        if (update.ids.length > 0) {
          switch (update.name) {
            case 'groups':
              {
                await cacheControl.group.removeMany(update.ids);
                await handlerManager.group.getMany(update.ids);
              }
              break;
            case 'templates':
              {
                await cacheControl.template.removeMany(update.ids);
                await handlerManager.template.getMany(update.ids);
              }
              break;
            case 'widgets':
              {
                await cacheControl.widget.removeMany(update.ids);
                await handlerManager.widget.getMany(update.ids);
              }
              break;
            case 'entries':
              {
                await cacheControl.entry.removeMany(update.ids);
                await handlerManager.entry.getManyLite(update.ids);
              }
              break;
            case 'media':
              {
                await cacheControl.media.removeMany(update.ids);
                await handlerManager.media.getMany(update.ids);
              }
              break;
          }
        }
      });
    }
  };
  return [
    {
      name: SocketEventName.LANGUAGE,
      handler: async (data) => {
        if (data.source === getSocketId()) {
          return;
        }
        await cacheControl.language.remove(data.entry._id);
        if (data.type !== 'remove') {
          await handlerManager.language.get(data.entry._id);
        }
        getSubscriptions()[SocketEventName.LANGUAGE].forEach((sub) => {
          sub.handler({ data });
        });
      },
    },
    {
      name: SocketEventName.GROUP,
      handler: async (data) => {
        if (data.source !== getSocketId()) {
          await cacheControl.group.remove(data.entry._id);
        }
        if (data.type === 'update') {
          if (data.source !== getSocketId()) {
            await handlerManager.group.get(data.entry._id);
          }
          await runUpdates(data.message.updated);
        } else if (data.type === 'add') {
          if (data.source !== getSocketId()) {
            await handlerManager.group.get(data.entry._id);
          }
        } else if (data.type === 'remove') {
          await runUpdates(data.message.updated);
        }
        getSubscriptions()[SocketEventName.GROUP].forEach((sub) => {
          /**
           * On the client side:
           *
           * - If `data.type`
           *    - update:
           *      - get this Group
           *      - get all Groups in `updates.groups`
           *      - get all Widgets in `updates.widgets`
           *      - get all Templates in `updates.templates`
           *      - get all Entries in `updates.entries`
           *    - remove:
           *      - remove this Group
           *      - get all Groups in `updates.groups`
           *      - get all Widgets in `updates.widgets`
           *      - get all Templates in `updates.templates`
           *      - get all Entries in `updates.entries`
           *    - add:
           *      - get this Group
           */
          sub.handler({
            data,
            updates: data.message.updated,
          });
        });
      },
    },
    {
      name: SocketEventName.TEMPLATE,
      handler: async (data) => {
        if (data.source !== getSocketId()) {
          await cacheControl.template.remove(data.entry._id);
        }
        const entriesToRemove = cacheControl.entry.find(
          (e) => e.data.templateId === data.entry._id,
        );
        for (const i in entriesToRemove) {
          const entry = entriesToRemove[i];
          await cacheControl.entry.remove(entry._id);
        }
        if (data.type === 'update') {
          if (data.source !== getSocketId()) {
            await handlerManager.template.get(data.entry._id);
          }
          await handlerManager.entry.getAllLite(data.entry._id);
        } else if (data.type === 'add') {
          if (data.source !== getSocketId()) {
            await handlerManager.template.get(data.entry._id);
          }
        }
        getSubscriptions()[SocketEventName.TEMPLATE].forEach((sub) => {
          /**
           * On the client side:
           *
           * - If `data.type`
           *    - update: get Template and get all Entries
           *    - remove: remove Template and all its Entries
           *    - add: get the Template
           */
          sub.handler({ data });
        });
      },
    },
    {
      name: SocketEventName.WIDGET,
      handler: async (data) => {
        if (data.source === getSocketId()) {
          return;
        }
        await cacheControl.widget.remove(data.entry._id);
        if (data.type !== 'remove') {
          await handlerManager.widget.get(data.entry._id);
        }
        getSubscriptions()[SocketEventName.WIDGET].forEach((sub) => {
          sub.handler({ data });
        });
      },
    },
    {
      name: SocketEventName.MEDIA,
      handler: async (data) => {
        if (data.source !== getSocketId()) {
          await cacheControl.media.remove(data.entry._id);
          if (data.type !== 'remove') {
            await handlerManager.media.get(data.entry._id);
          }
        }
        if (data.type === 'update') {
          if (data.source !== getSocketId()) {
            await cacheControl.media.remove(data.entry._id);
          }
          await runUpdates(data.message.updated);
        } else if (data.type === 'remove') {
          const updates: {
            name: string;
            ids: string[];
          } = data.message.updated.find((e) => e.name === 'media');
          if (updates && updates.ids.length > 0) {
            await cacheControl.media.removeMany(updates.ids);
          }
        }
        getSubscriptions()[SocketEventName.MEDIA].forEach((sub) => {
          sub.handler({ data });
        });
      },
    },
  ];
}
