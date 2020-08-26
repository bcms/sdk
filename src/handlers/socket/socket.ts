import {
  JWT,
  SocketEventName,
  SocketEventData,
  HandlerManager,
  SocketSubscriptions,
} from '../../interfaces';
import { CacheControlPrototype } from '../../cache';
import { SocketEventHandlers } from './event-handlers';
import * as uuid from 'uuid';
import * as io from 'socket.io-client';

export interface SocketHandlerPrototype {
  connect: (accessToken: string, jwt: JWT) => Promise<void>;
  disconnect(): void;
  connected(): boolean;
  subscribe(
    event: SocketEventName,
    handler: (data: any) => Promise<void>,
  ): {
    unsubscribe(): void;
  };
}

export function SocketHandler(
  cacheControl: CacheControlPrototype,
  handlerManager: HandlerManager,
  getAccessToken: () => JWT,
  server: {
    url: string;
    path: string;
  },
): SocketHandlerPrototype {
  let isConnected = false;
  let socket: SocketIOClient.Socket;
  const subscriptions: SocketSubscriptions = {};
  const handlers = SocketEventHandlers(
    cacheControl,
    handlerManager,
    getAccessToken,
    () => {
      return subscriptions;
    },
  );
  Object.keys(SocketEventName).forEach((key) => {
    subscriptions[SocketEventName[key]] = [];
  });
  return {
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
              socket.on(h.name, (data: any) => {
                h.handler(data);
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
        unsubscribe: () => {
          subscriptions[event] = subscriptions[event].filter(
            (sub) => sub.id !== id,
          );
        },
      };
    },
  };
}
