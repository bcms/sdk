import { JWT, HandlerManager, SocketEventName } from './interfaces';
import { GeneralUtil, LocalStorage, Queueable } from './util';
import Axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { CacheControl } from './cache';
import {
  UserHandler,
  GroupHandler,
  WidgetHandler,
  TemplateHandler,
  LanguageHandler,
  MediaHandler,
  SocketHandler,
  EntryHandler,
  ApiKeyHandler,
  FunctionHandler,
  StatusHandler,
} from './handlers';

export interface BCMSConfig {
  cms: {
    origin: string;
    mock?: boolean;
  };
  storage?: {
    prfx: string;
  };
  loginPath?: string;
}

/**
 * This is the main entry point. From this object, all public
 * API is exposed to the client.
 */

export interface BCMSPrototype extends HandlerManager {
  isLoggedIn: () => Promise<boolean>;
  send<T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean): Promise<T>;
  socket: {
    id: () => string;
    subscribe(
      event: SocketEventName,
      handler: (data: any) => Promise<void>,
    ): {
      unsubscribe(): void;
    };
  };
}

export function BCMS(config: BCMSConfig): BCMSPrototype {
  if (!config.storage) {
    config.storage = {
      prfx: 'bcms',
    };
  }

  const queueable = Queueable<boolean>('refreshAccessToken');
  const cacheControl = CacheControl();
  const storage = LocalStorage({
    prfx: config.storage.prfx,
  });
  let accessToken: JWT;
  let accessTokenRaw = storage.get('at');
  const handlerManager: HandlerManager = {
    user: undefined,
    group: undefined,
    widget: undefined,
    template: undefined,
    language: undefined,
    media: undefined,
    entry: undefined,
    apiKey: undefined,
    apiFunction: undefined,
    status: undefined,
  };
  const userHandler = UserHandler(
    cacheControl,
    send,
    storage,
    () => {
      clear();
    },
    () => {
      return accessToken;
    },
    isLoggedIn,
  );
  const socket = SocketHandler(
    cacheControl,
    handlerManager,
    {
      url: config.cms.origin,
      path: '/api/socket/server/',
    },
    () => {
      return accessToken;
    },
  );
  const entryHandler = EntryHandler(cacheControl, send, socket);
  const widgetHandler = WidgetHandler(cacheControl, send, entryHandler);
  const templateHandler = TemplateHandler(cacheControl, send);
  const groupHandler = GroupHandler(
    cacheControl,
    send,
    templateHandler,
    widgetHandler,
  );
  const languageHandler = LanguageHandler(cacheControl, send);
  const mediaHandler = MediaHandler(
    cacheControl,
    send,
    async () => {
      await refreshAccessToken();
      return accessTokenRaw;
    },
    config.cms.origin,
  );
  const apiKeyHandler = ApiKeyHandler(cacheControl, send);
  const apiFunctionHandler = FunctionHandler(cacheControl, send);
  const statusHandler = StatusHandler(cacheControl, send);

  handlerManager.user = userHandler;
  handlerManager.apiFunction = apiFunctionHandler;
  handlerManager.apiKey = apiKeyHandler;
  handlerManager.entry = entryHandler;
  handlerManager.group = groupHandler;
  handlerManager.language = languageHandler;
  handlerManager.media = mediaHandler;
  handlerManager.template = templateHandler;
  handlerManager.widget = widgetHandler;
  handlerManager.status = statusHandler;
  /**
   * Will decode encoded Access Token aka Raw Access Token.
   */
  function unpackAccessToken(at: string) {
    const atParts = at.split('.');
    if (atParts.length === 3) {
      accessToken = {
        header: JSON.parse(GeneralUtil.b64.decode(atParts[0])),
        payload: JSON.parse(GeneralUtil.b64.decode(atParts[1])),
        signature: atParts[2],
      };
    }
  }
  /**
   * Method that will handle Access Token before sending
   * REST API request. It is recommended to use this method
   * for sending requests to the REST API.
   */
  async function send<T>(
    conf: AxiosRequestConfig,
    doNotInjectAuth?: boolean,
  ): Promise<T> {
    if (
      !doNotInjectAuth &&
      conf.headers &&
      typeof conf.headers.Authorization === 'string'
    ) {
      const loggedIn = await isLoggedIn();
      conf.headers.Authorization = `Bearer ${accessTokenRaw}`;
      if (loggedIn === false || !accessTokenRaw) {
        if (typeof config.loginPath === 'string') {
          // tslint:disable-next-line: no-console
          console.error('Go to login page.');
          // window.location.href = config.loginPath;
        } else {
          throw {
            status: 401,
            message: 'Not logged in.',
          };
        }
      }
    }
    if (!conf.headers && socket.id) {
      conf.headers = {
        sid: socket.id(),
      };
    } else if (socket.id()) {
      conf.headers.sid = socket.id();
    }
    conf.url = `${config.cms.origin}/api${conf.url}`;
    try {
      const response = await Axios(conf);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          throw {
            status: err.response.status,
            code: err.response.data.code,
            message: err.response.data.message,
          };
        } else {
          throw {
            status: err.response.status,
            code: '-1',
            message: err.message,
          };
        }
      } else {
        // tslint:disable-next-line: no-console
        throw {
          status: -1,
          code: '-1',
          message: err.message,
        };
      }
    }
  }
  /**
   * Check if User is logged in. If this method returns `false`,
   * called to protected resources will fail and User will be
   * redirected to defined login path.
   */
  async function isLoggedIn(): Promise<boolean> {
    const result = await refreshAccessToken();
    if (socket && result === true && !socket.connected()) {
      await socket.connect(accessTokenRaw, accessToken);
    }
    return result;
  }
  /**
   * Will try to refresh the Access Token. If Access Token
   * is still valid, it will not be refreshed.
   */
  async function refreshAccessToken(): Promise<boolean> {
    return await queueable.exec(
      'refreshAccessToken',
      'free_one_by_one',
      async () => {
        let refresh = true;
        if (typeof accessToken !== 'undefined') {
          if (accessToken.payload.iat + accessToken.payload.exp > Date.now()) {
            refresh = false;
          }
        } else {
          const at: string = storage.get('at');
          if (at) {
            unpackAccessToken(at);
            if (
              (accessToken as JWT).payload.iat +
                (accessToken as JWT).payload.exp >
              Date.now()
            ) {
              refresh = false;
            }
          }
        }
        if (refresh === false) {
          return true;
        }
        const refreshToken = storage.get('rt');
        if (!refreshToken) {
          return false;
        }
        try {
          const result: {
            accessToken: string;
          } = await send(
            {
              url: '/auth/token/refresh',
              method: 'POST',
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
            true,
          );
          await storage.set('at', result.accessToken);
          return true;
        } catch (error) {
          // TODO: Handle refresh token error.
          await storage.clear();
          return false;
        }
      },
    );
  }
  /**
   * Clear all data
   */
  async function clear() {
    storage.clear();
    cacheControl.clear();
    accessToken = undefined;
    accessTokenRaw = undefined;
    socket.disconnect();
  }

  if (accessTokenRaw) {
    unpackAccessToken(accessTokenRaw);
  }
  storage.subscribe('at', (value, type) => {
    if (type === 'set') {
      accessTokenRaw = value;
      unpackAccessToken(value);
      if (!socket.connected()) {
        socket.connect(value, accessToken);
      }
    } else if (type === 'remove') {
      socket.disconnect();
    }
  });
  isLoggedIn().catch(error => {
    console.error(error);
  });
  return {
    isLoggedIn,
    send,
    socket: {
      id: socket.id,
      subscribe(event, handler) {
        return socket.subscribe(event, handler);
      },
    },
    ...handlerManager,
  };
}
