import * as uuid from 'uuid';
import SocketIO from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type {
  BCMSJwt,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkRequestHandlerManagerPrototype,
  BCMSSdkSocketPrototype,
  BCMSSdkSocketSubscriptionCallback,
  BCMSSdkSocketSubscriptions,
} from '../types';
import { BCMSSdkSocketEventName } from '../types';

export function BCMSSdkSocket(
  config: {
    server: {
      url: string;
      path: string;
    };
  },
  cache: BCMSSdkCacheControllerPrototype,
  rhManager: BCMSSdkRequestHandlerManagerPrototype,
  getAccessToken: () => BCMSJwt | null,
) {
  const subs: BCMSSdkSocketSubscriptions = {};
  let isConnected = false;
  let socket: Socket | null = null;

  Object.keys(BCMSSdkSocketEventName).forEach((eventName) => {
    subs[eventName] = {};
  });

  const self: BCMSSdkSocketPrototype = {
    id() {
      return socket ? '' + socket.id : null;
    },
    emit(event, data) {
      if (socket) {
        socket.emit(event, data);
      }
    },
    async connect(accessToken) {
      if (isConnected === false) {
        isConnected = true;
        return new Promise((resolve, reject) => {
          try {
            socket = SocketIO(config.server.url, {
              path: config.server.path,
              transports: ['websocket'],
              query: {
                at: accessToken,
              },
              autoConnect: false,
            });
            socket.connect();
            socket.on('connect_error', (...data: any) => {
              if (socket) {
                socket.close();
              }
              isConnected = false;
              reject(data);
            });
            socket.on('error', (data) => {
              if (socket) {
                socket.close();
              }
              isConnected = false;
              reject(data);
            });
            socket.on('connect', () => {
              console.log('Successfully connected to Socket server.');
              isConnected = true;
              resolve();
            });
            socket.on('disconnect', () => {
              isConnected = false;
              console.log('Disconnected from Socket server.');
            });
            // handlers.forEach(async (h) => {
            //   socket.on(h.name, async (data: any) => {
            //     await h.handler(data);
            //   });
            // });
          } catch (error) {
            reject(error);
          }
        });
      }
    },
    disconnect() {
      if (isConnected && socket) {
        socket.disconnect();
      }
    },
    connected() {
      return isConnected;
    },
    subscribe(event, callback) {
      if (!subs[event]) {
        subs[event] = {};
      }
      const id = uuid.v4();
      subs[event][id] = callback as BCMSSdkSocketSubscriptionCallback<unknown>;
      return () => {
        delete subs[event][id];
      };
    },
  };
  return self;
}
