import {
  JWT,
  SocketEventName,
  HandlerManager,
  SocketSubscriptions,
  SocketEventDataClient,
} from '../../interfaces';
import { CacheControlPrototype } from '../../cache';
import { SocketEventHandlers } from './event-handlers';
import * as uuid from 'uuid';
import * as io from 'socket.io-client';
import { Queueable } from '../../util';

export interface SocketHandlerPrototype {
  id: () => string;
  connect: (accessToken: string, jwt: JWT) => Promise<void>;
  disconnect(): void;
  connected(): boolean;
  subscribe(
    event: SocketEventName,
    handler: (event: SocketEventDataClient) => Promise<void>,
  ): {
    unsubscribe(): void;
  };
}

export function SocketHandler(
  cacheControl: CacheControlPrototype,
  handlerManager: HandlerManager,
  server: {
    url: string;
    path: string;
  },
): SocketHandlerPrototype {
  let isConnected = false;
  let socket: SocketIOClient.Socket;
  const queueable = Queueable<void>('unsubscribe');
  const subscriptions: SocketSubscriptions = {};
  const handlers = SocketEventHandlers(
    cacheControl,
    handlerManager,
    () => {
      return socket.id;
    },
    () => {
      return subscriptions;
    },
  );
  Object.keys(SocketEventName).forEach((key) => {
    subscriptions[SocketEventName[key]] = [];
  });
  return {
    id: () => {
      if (isConnected) {
        return socket.id;
      }
    },
    async connect(accessToken, jwt) {
      if (isConnected === false) {
        isConnected = true;
        return new Promise((resolve, reject) => {
          try {
            socket = io(server.url, {
              path: server.path,
              query: {
                at: accessToken,
              },
              autoConnect: false,
            });
            socket.connect();
            socket.on('connect_error', (...data: any) => {
              socket.close();
              reject(data);
            });
            socket.on('error', (data) => {
              socket.close();
              reject(data);
            });
            socket.on('connect', () => {
              // tslint:disable-next-line: no-console
              console.log('Successfully connected to Socket server.');
              isConnected = true;
              resolve();
            });
            socket.on('disconnect', () => {
              isConnected = false;
              // tslint:disable-next-line: no-console
              console.log('Disconnected from Socket server.');
            });
            handlers.forEach((h) => {
              socket.on(h.name, async (data: any) => {
                await h.handler(data);
              });
            });
          } catch (error) {
            reject(error);
          }
        });
      }
    },
    disconnect() {
      if (isConnected === true) {
        socket.disconnect();
      }
    },
    connected() {
      return isConnected ? true : false;
    },
    subscribe(event, handler) {
      if (!subscriptions[event]) {
        subscriptions[event] = [];
      }
      const id = uuid.v4();
      subscriptions[event].push({
        id,
        handler,
      });
      return {
        unsubscribe: async () => {
          await queueable.exec('unsubscribe', 'free_one_by_one', async () => {
            subscriptions[event] = subscriptions[event].filter(
              (sub) => sub.id !== id,
            );
          });
        },
      };
    },
  };
}
