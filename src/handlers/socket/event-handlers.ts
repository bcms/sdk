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
  ];
}
