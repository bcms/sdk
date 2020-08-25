import { JWT, HandlerManager } from './interfaces';
import { LocalStorage, Queueable } from './util';
import Axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { CacheControl } from './cache';
import {
  UserHandler,
  GroupHandler,
  WidgetHandler,
  TemplateHandler,
  LanguageHandler,
  MediaHandler,
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

export interface BCMSPrototype extends HandlerManager {
  isLoggedIn: () => Promise<boolean>;
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
  let handlerManager: HandlerManager;

  /**
   * Will decode encoded Access Token aka Raw Access Token.
   */
  function unpackAccessToken(at: string) {
    const atParts = at.split('.');
    if (atParts.length === 3) {
      accessToken = {
        header: JSON.parse(Buffer.from(atParts[0], 'base64').toString()),
        payload: JSON.parse(Buffer.from(atParts[1], 'base64').toString()),
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
        console.error(err);
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
    // if (socket && result === true) {
    //   await socket.connect(accessTokenRaw, accessToken);
    // }
    return result;
  }
  /**
   * Will try to refresh the Access Token. If Access Token
   * is still valid, it will not be refreshed.
   */
  async function refreshAccessToken(): Promise<boolean> {
    return await queueable.exec(
      'refreshAccessToken',
      'first_done_free_all',
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
          storage.clear();
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
  }

  if (accessTokenRaw) {
    unpackAccessToken(accessTokenRaw);
  }
  storage.subscribe('at', (value) => {
    accessTokenRaw = value;
    unpackAccessToken(value);
    // TODO: socket.connect(value, accessToken);
  });
  handlerManager = {
    // socket: SocketHandler({
    //   cacheControl,
    // }),
    user: UserHandler(
      cacheControl,
      send,
      storage,
      clear,
      () => {
        return accessToken;
      },
      isLoggedIn,
    ),
    group: GroupHandler(cacheControl, send),
    widget: WidgetHandler(cacheControl, send),
    template: TemplateHandler(cacheControl, send),
    language: LanguageHandler(cacheControl, send),
    media: MediaHandler(cacheControl, send),
  };

  return {
    isLoggedIn,
    ...handlerManager,
  };
}
