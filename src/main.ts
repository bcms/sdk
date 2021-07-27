import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Buffer } from 'buffer';
import {
  createBcmsApiKeyHandler,
  createBcmsEntryHandler,
  createBcmsFunctionHandler,
  createBcmsGroupHandler,
  createBcmsLanguageHandler,
  createBcmsMediaHandler,
  createBcmsShimHandler,
  createBcmsStatusHandler,
  createBcmsUserHandler,
  createBcmsWidgetHandler,
  createBcmsTemplateHandler,
  createBcmsTemplateOrganizerHandler,
} from './handlers';
import { createBcmsStorage } from './storage';
import { useBcmsStore } from './store';
import type { BCMSJwt, BCMSSdk, BCMSSdkConfig } from './types';
import { createBcmsDateUtility, createBcmsStringUtility } from './util';

export function createBcmsSdk({ origin }: BCMSSdkConfig): BCMSSdk {
  const store = useBcmsStore();
  const storage = createBcmsStorage({
    prfx: 'bcms',
  });
  let accessToken: BCMSJwt | null = null;
  let accessTokenRaw: string | null = storage.get('rt');

  if (accessTokenRaw) {
    accessToken = unpackAccessToken(accessTokenRaw);
  }

  createBcmsStringUtility();
  createBcmsDateUtility();

  function getAccessToken(): BCMSJwt | null {
    if (accessToken) {
      return JSON.parse(JSON.stringify(accessToken));
    }
    return null;
  }
  /**
   * Will decode encoded Access Token aka Raw Access Token.
   */
  function unpackAccessToken(at: string): BCMSJwt | null {
    const atParts = at.split('.');
    if (atParts.length === 3) {
      return {
        header: JSON.parse(Buffer.from(atParts[0], 'base64').toString()),
        payload: JSON.parse(Buffer.from(atParts[1], 'base64').toString()),
        signature: atParts[2],
      };
    }
    return null;
  }
  /**
   * Method that will handle Access Token before sending
   * REST API request. It is recommended to use this method
   * for sending requests to the REST API.
   */
  async function send<T>(conf: AxiosRequestConfig): Promise<T> {
    if (conf.headers && conf.headers.Authorization === '') {
      const loggedIn = await isLoggedIn();
      conf.headers.Authorization = `Bearer ${accessTokenRaw}`;
      if (!loggedIn || !accessTokenRaw) {
        throw {
          status: 401,
          message: 'Not logged in.',
        };
      }
    }
    // TODO
    // if (!conf.headers && socket.id) {
    //   conf.headers = {
    //     sid: socket.id(),
    //   };
    // } else if (socket.id()) {
    //   conf.headers.sid = socket.id();
    // }
    conf.url = `${origin ? origin : ''}/api${conf.url}`;
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
    // TODO
    // if (socket && result && !socket.connected() && accessTokenRaw) {
    //   await socket.connect(accessTokenRaw);
    // }
    return result;
  }
  /**
   * Will try to refresh the Access Token. If Access Token
   * is still valid, it will not be refreshed.
   */
  async function refreshAccessToken(force?: boolean): Promise<boolean> {
    if (!force) {
      let refresh = true;
      if (accessToken) {
        if (accessToken.payload.iat + accessToken.payload.exp > Date.now()) {
          refresh = false;
        }
      } else {
        const at = storage.get<string>('at');
        if (at) {
          accessToken = unpackAccessToken(at);
          accessTokenRaw = at;
          if (
            accessToken &&
            accessToken.payload.iat + accessToken.payload.exp > Date.now()
          ) {
            refresh = false;
          }
        }
      }
      if (!refresh) {
        return true;
      }
    }
    const refreshToken = storage.get<string>('rt');
    if (!refreshToken) {
      return false;
    }
    try {
      const result: {
        accessToken: string;
      } = await send({
        url: '/auth/token/refresh',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      await storage.set('at', result.accessToken);
      return true;
    } catch (error) {
      // TODO: Handle refresh token error.
      await storage.clear();
      return false;
    }
  }

  storage.subscribe('at', (value: string, type) => {
    if (type === 'set') {
      accessTokenRaw = value;
      accessToken = unpackAccessToken(value);
      // TODO
      // if (!socket.connected() && accessToken) {
      //   socket.connect(value).catch((error) => {
      //     console.error(error);
      //   });
      // }
    } else if (type === 'remove') {
      // TODO
      // socket.disconnect();
    }
  });

  const shimHandler = createBcmsShimHandler({
    send,
    storage,
  });
  const userHandler = createBcmsUserHandler({
    send,
    getAccessToken,
    store,
  });
  const apiKeyHandler = createBcmsApiKeyHandler({
    send,
    store,
  });
  const functionHandler = createBcmsFunctionHandler({
    send,
  });
  const languageHandler = createBcmsLanguageHandler({
    send,
    store,
  });
  const statusHandler = createBcmsStatusHandler({
    send,
    store,
  });
  const groupHandler = createBcmsGroupHandler({
    send,
    store,
  });
  const widgetHandler = createBcmsWidgetHandler({
    send,
    store,
  });
  const mediaHandler = createBcmsMediaHandler({
    send,
    store,
  });
  const templateHandler = createBcmsTemplateHandler({
    send,
    store,
  });
  const templateOrganizerHandler = createBcmsTemplateOrganizerHandler({
    send,
    store,
  });
  const entryHandler = createBcmsEntryHandler({
    send,
    store,
  });

  return {
    send,
    isLoggedIn,
    getAccessToken,
    storage,
    store,

    // Handlers
    shim: shimHandler,
    user: userHandler,
    apiKey: apiKeyHandler,
    function: functionHandler,
    language: languageHandler,
    status: statusHandler,
    group: groupHandler,
    widget: widgetHandler,
    media: mediaHandler,
    template: templateHandler,
    templateOrganizer: templateOrganizerHandler,
    entry: entryHandler,
  };
}
