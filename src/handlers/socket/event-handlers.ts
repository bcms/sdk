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
  getAccessToken: () => JWT,
  getSubscriptions: () => SocketSubscriptions,
): SocketEventHandlerPrototype[] {
  const preHandler = (data: SocketEventData): JWT => {
    const jwt = getAccessToken();
    if (!jwt) {
      return;
    }
    if (data.source === jwt.payload.userId) {
      return;
    }
    return jwt;
  };
  return [
    {
      name: SocketEventName.LANGUAGE,
      handler: async (data) => {
        const jwt = preHandler(data);
        if (!jwt) {
          return;
        }
        cacheControl.language.remove(data.entry._id);
        if (data.type !== 'remove') {
          await handlerManager.language.get(data.entry._id);
        }
        getSubscriptions()[SocketEventName.LANGUAGE].forEach((sub) => {
          sub.handler(data);
        });
      },
    },
  ];
}
