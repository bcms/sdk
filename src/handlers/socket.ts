import { v4 as uuidv4 } from 'uuid';
import SocketIO, { Socket } from 'socket.io-client';
import {
  BCMSSocketApiKeyEvent,
  BCMSSocketEntryEvent,
  BCMSSocketEvent,
  BCMSSocketEventName,
  BCMSSocketEventType,
  BCMSSocketGroupEvent,
  BCMSSocketHandler,
  BCMSSocketHandlerConfig,
  BCMSSocketLanguageEvent,
  BCMSSocketMediaEvent,
  BCMSSocketStatusEvent,
  BCMSSocketSubscriptionCallback,
  BCMSSocketTemplateEvent,
  BCMSSocketTemplateOrganizerEvent,
  BCMSSocketUserEvent,
  BCMSSocketWidgetEvent,
  BCMSStoreMutationTypes,
} from '../types';

export function createBcmsSocketHandler({
  store,
  storage,
  throwable,

  apiKeyHandler,
  entryHandler,
  groupHandler,
  langHandler,
  mediaHandler,
  statusHandler,
  tempOrgHandler,
  templateHandler,
  userHandler,
  widgetHandler,
}: BCMSSocketHandlerConfig): BCMSSocketHandler {
  const subs: {
    [eventName: string]: {
      [id: string]: BCMSSocketSubscriptionCallback;
    };
  } = {};
  const eventNames = Object.keys(BCMSSocketEventName);
  let isConnected = false;
  let socket: Socket | null = null;

  eventNames.forEach((eventName) => {
    subs[eventName] = {};
  });
  subs.ANY = {};

  function triggerSubs(
    eventName: BCMSSocketEventName | 'ANY',
    event: BCMSSocketEvent,
  ) {
    for (const id in subs[eventName]) {
      subs[eventName][id](event).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`Subs.${eventName}.${id} ->`, error);
      });
    }
    if (eventName !== 'ANY') {
      for (const id in subs.ANY) {
        subs.ANY[id](event).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(`Subs.${eventName}.${id} ->`, error);
        });
      }
    }
  }
  function initSocket(soc: Socket) {
    soc.on(BCMSSocketEventName.API_KEY, async (data: BCMSSocketApiKeyEvent) => {
      const eventName = BCMSSocketEventName.API_KEY;

      if (data.t === BCMSSocketEventType.UPDATE) {
        await throwable(async () => {
          await apiKeyHandler.get(data.a, true);
        });
      } else if (data.t === BCMSSocketEventType.REMOVE) {
        const item = store.getters.apiKey_findOne((e) => e._id === data.a);
        if (item) {
          store.commit(BCMSStoreMutationTypes.apiKey_remove, item);
        }
      }

      triggerSubs(eventName, data);
    });
    soc.on(BCMSSocketEventName.ENTRY, async (data: BCMSSocketEntryEvent) => {
      const eventName = BCMSSocketEventName.ENTRY;

      if (data.t === BCMSSocketEventType.UPDATE) {
        await throwable(async () => {
          await entryHandler.get({
            entryId: data.e,
            templateId: data.tm,
            skipCache: true,
          });
        });
      } else if (data.t === BCMSSocketEventType.REMOVE) {
        const entryLite = store.getters.entryLite_findOne(
          (e) => e._id === data.e,
        );
        if (entryLite) {
          store.commit(BCMSStoreMutationTypes.entryLite_remove, entryLite);
        }
        const entry = store.getters.entry_findOne((e) => e._id === data.e);
        if (entry) {
          store.commit(BCMSStoreMutationTypes.entry_remove, entry);
        }
      }

      triggerSubs(eventName, data);
    });
    soc.on(BCMSSocketEventName.GROUP, async (data: BCMSSocketGroupEvent) => {
      const eventName = BCMSSocketEventName.GROUP;

      if (data.t === BCMSSocketEventType.UPDATE) {
        await throwable(async () => {
          await groupHandler.get(data.g, true);
        });
      } else if (data.t === BCMSSocketEventType.REMOVE) {
        const item = store.getters.groupLite_findOne((e) => e._id === data.g);
        if (item) {
          store.commit(BCMSStoreMutationTypes.groupLite_remove, item);
        }
      }

      triggerSubs(eventName, data);
    });
    soc.on(
      BCMSSocketEventName.LANGUAGE,
      async (data: BCMSSocketLanguageEvent) => {
        const eventName = BCMSSocketEventName.LANGUAGE;

        if (data.t === BCMSSocketEventType.UPDATE) {
          await throwable(async () => {
            await langHandler.get(data.l, true);
          });
        } else if (data.t === BCMSSocketEventType.REMOVE) {
          const item = store.getters.language_findOne((e) => e._id === data.l);
          if (item) {
            store.commit(BCMSStoreMutationTypes.language_remove, item);
          }
        }

        triggerSubs(eventName, data);
      },
    );
    soc.on(BCMSSocketEventName.MEDIA, async (data: BCMSSocketMediaEvent) => {
      const eventName = BCMSSocketEventName.MEDIA;

      if (data.t === BCMSSocketEventType.UPDATE) {
        await throwable(async () => {
          await mediaHandler.getById(data.m, true);
        });
      } else if (data.t === BCMSSocketEventType.REMOVE) {
        const item = store.getters.media_findOne((e) => e._id === data.m);
        if (item) {
          store.commit(BCMSStoreMutationTypes.media_remove, item);
        }
      }

      triggerSubs(eventName, data);
    });
    soc.on(BCMSSocketEventName.STATUS, async (data: BCMSSocketStatusEvent) => {
      const eventName = BCMSSocketEventName.STATUS;

      if (data.t === BCMSSocketEventType.UPDATE) {
        await throwable(async () => {
          await statusHandler.get(data.s, true);
        });
      } else if (data.t === BCMSSocketEventType.REMOVE) {
        const item = store.getters.status_findOne((e) => e._id === data.s);
        if (item) {
          store.commit(BCMSStoreMutationTypes.status_remove, item);
        }
      }

      triggerSubs(eventName, data);
    });
    soc.on(
      BCMSSocketEventName.TEMPLATE,
      async (data: BCMSSocketTemplateEvent) => {
        const eventName = BCMSSocketEventName.TEMPLATE;

        if (data.t === BCMSSocketEventType.UPDATE) {
          await throwable(async () => {
            await templateHandler.get(data.tm, true);
          });
        } else if (data.t === BCMSSocketEventType.REMOVE) {
          const item = store.getters.template_findOne((e) => e._id === data.tm);
          if (item) {
            store.commit(BCMSStoreMutationTypes.template_set, item);
          }
        }

        triggerSubs(eventName, data);
      },
    );
    soc.on(
      BCMSSocketEventName.TEMPLATE_ORGANIZER,
      async (data: BCMSSocketTemplateOrganizerEvent) => {
        const eventName = BCMSSocketEventName.TEMPLATE_ORGANIZER;

        if (data.t === BCMSSocketEventType.UPDATE) {
          await throwable(async () => {
            await tempOrgHandler.get(data.to, true);
          });
        } else if (data.t === BCMSSocketEventType.REMOVE) {
          const item = store.getters.templateOrganizer_findOne(
            (e) => e._id === data.to,
          );
          if (item) {
            store.commit(BCMSStoreMutationTypes.templateOrganizer_remove, item);
          }
        }

        triggerSubs(eventName, data);
      },
    );
    soc.on(BCMSSocketEventName.USER, async (data: BCMSSocketUserEvent) => {
      const eventName = BCMSSocketEventName.USER;

      if (data.t === BCMSSocketEventType.UPDATE) {
        await throwable(async () => {
          await userHandler.get(data.u, true);
        });
      } else if (data.t === BCMSSocketEventType.REMOVE) {
        const item = store.getters.user_findOne((e) => e._id === data.u);
        if (item) {
          store.commit(BCMSStoreMutationTypes.user_remove, item);
        }
      }

      triggerSubs(eventName, data);
    });
    soc.on(BCMSSocketEventName.WIDGET, async (data: BCMSSocketWidgetEvent) => {
      const eventName = BCMSSocketEventName.WIDGET;

      if (data.t === BCMSSocketEventType.UPDATE) {
        await throwable(async () => {
          await widgetHandler.get(data.w, true);
        });
      } else if (data.t === BCMSSocketEventType.REMOVE) {
        const item = store.getters.widget_findOne((e) => e._id === data.w);
        if (item) {
          store.commit(BCMSStoreMutationTypes.widget_remove, item);
        }
      }

      triggerSubs(eventName, data);
    });
  }

  return {
    id() {
      if (socket) {
        return socket.id;
      }
      return null;
    },
    emit(event, data) {
      if (socket) {
        socket.emit(event, data);
      }
    },
    async connect() {
      if (!isConnected) {
        isConnected = true;
        return await new Promise((resolve, reject) => {
          try {
            const token = storage.get<string>('at');
            if (!token) {
              isConnected = false;
              reject('You need to login to access socket.');
              return;
            }
            socket = SocketIO('', {
              path: '/api/socket/server',
              transports: ['websocket'],
              query: {
                at: token,
              },
              autoConnect: false,
            });
            socket.connect();
            socket.on('connect_error', (...data: unknown[]) => {
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
              // eslint-disable-next-line no-console
              console.log('Successfully connected to Socket server.');
              isConnected = true;
              initSocket(socket as Socket);
              resolve();
            });
            socket.on('disconnect', () => {
              isConnected = false;
              // eslint-disable-next-line no-console
              console.log('Disconnected from Socket server.');
            });
          } catch (error) {
            reject(error);
          }
        });
      }
    },
    connected() {
      return isConnected;
    },
    disconnect() {
      if (socket && isConnected) {
        socket.disconnect();
        isConnected = false;
      }
    },
    subscribe(event, cb) {
      const id = uuidv4();
      subs[event][id] = cb;
      return () => {
        delete subs[event][id];
      };
    },
  };
}
