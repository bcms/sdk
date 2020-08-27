import {
  SocketEventName,
  SocketEventData,
  HandlerManager,
  JWT,
  SocketSubscriptions,
} from '../../interfaces';
import { CacheControlPrototype } from 'src/cache';

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
  const preHandler = async (
    data: SocketEventData,
    execute: () => Promise<void>,
  ) => {
    if (data.source === getSocketId()) {
      return;
    }
    await execute();
  };
  return [
    {
      name: SocketEventName.LANGUAGE,
      handler: async (data) => {
        await preHandler(data, async () => {
          cacheControl.language.remove(data.entry._id);
          if (data.type !== 'remove') {
            await handlerManager.language.get(data.entry._id);
          }
          getSubscriptions()[SocketEventName.LANGUAGE].forEach((sub) => {
            sub.handler(data);
          });
        });
      },
    },
    {
      name: SocketEventName.GROUP,
      handler: async (data) => {
        await preHandler(data, async () => {
          cacheControl.group.remove(data.entry._id);
          if (data.type !== 'remove') {
            await handlerManager.group.get(data.entry._id);
            const updates: {
              [key: string]: string[];
            } = {};
            data.message.split('_').forEach((p1) => {
              const keyAndValue = p1.split(':');
              updates[keyAndValue[0]] = keyAndValue[1].split('-');
              if (updates[keyAndValue[0]][0] === '') {
                updates[keyAndValue[0]] = [];
              }
            });
            for (const key in updates) {
              if (updates[key].length > 0) {
                switch (key) {
                  case 'groups':
                    {
                      for (const j in updates[key]) {
                        cacheControl.group.remove(updates[key][j]);
                      }
                      const groups = await handlerManager.group.getMany(updates[key]);
                      for (const i in groups) {
                        cacheControl.group.set(groups[i]);
                      }
                      console.log('up', groups);
                    }
                    break;
                }
              }
            }
          }
          console.log(cacheControl.group.getAll());
          getSubscriptions()[SocketEventName.GROUP].forEach((sub) => {
            sub.handler(data);
          });
        });
      },
    },
    {
      name: SocketEventName.TEMPLATE,
      handler: async (data) => {
        await preHandler(data, async () => {
          cacheControl.template.remove(data.entry._id);
          if (data.type !== 'remove') {
            await handlerManager.template.get(data.entry._id);
          } else {
            const entriesToRemove = cacheControl.entry.find(
              (e) => e.data.templateId === data.entry._id,
            );
            for (const i in entriesToRemove) {
              const entry = entriesToRemove[i];
              cacheControl.entry.remove(entry._id);
            }
          }
          getSubscriptions()[SocketEventName.TEMPLATE].forEach((sub) => {
            sub.handler(data);
          });
          // cacheControl.template.remove(data.entry._id);
          // if (data.type !== 'remove') {
          //   await handlerManager.language.get(data.entry._id);
          // }
          // getSubscriptions()[SocketEventName.LANGUAGE].forEach((sub) => {
          //   sub.handler(data);
          // });
        });
      },
    },
  ];
}
