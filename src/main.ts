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
  createBcmsSocketHandler,
  createBcmsColorHandler,
  createBcmsTagHandler,
  createBcmsTypeConverterHandler,
} from './handlers';
import { createBcmsStorage } from './storage';
import type { BCMSJwt, BCMSSdk, BCMSSdkCache, BCMSSdkConfig } from './types';
import {
  createBcmsDateUtility,
  createBcmsStringUtility,
  createBcmsThrowable,
} from './util';

export function createBcmsSdk(config: BCMSSdkConfig): BCMSSdk {
  const origin = config.origin;
  const cache: BCMSSdkCache | undefined = config.cache.fromVuex
    ? {
        getters: {
          find({ query, name }) {
            return config.cache.fromVuex.getters[`${name}_find`](query);
          },
          findOne({ query, name }) {
            return config.cache.fromVuex.getters[`${name}_findOne`](query);
          },
          items({ name }) {
            return config.cache.fromVuex.getters[`${name}_items`];
          },
        },
        mutations: {
          remove({ payload, name }) {
            config.cache.fromVuex.commit(`${name}_remove`, payload);
          },
          set({ payload, name }) {
            config.cache.fromVuex.commit(`${name}_set`, payload);
          },
        },
      }
    : config.cache.custom;
  if (!cache) {
    throw Error('Cache handler was not provided.');
  }
  const storage = createBcmsStorage({
    prfx: 'bcms',
  });
  let accessToken: BCMSJwt | null = null;
  let accessTokenRaw: string | null = storage.get('rt');

  if (accessTokenRaw) {
    accessToken = unpackAccessToken(accessTokenRaw);
  }

  const stringUtil = createBcmsStringUtility();
  const dateUtil = createBcmsDateUtility({
    stringUtil,
  });
  const throwable = createBcmsThrowable();

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
    if (
      socketHandler &&
      result &&
      !socketHandler.connected() &&
      accessTokenRaw
    ) {
      await socketHandler.connect();
    }
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
    if (!refreshToken || !accessToken) {
      return false;
    }
    try {
      const result: {
        accessToken: string;
      } = await send({
        url: `/auth/token/refresh/${accessToken.payload.userId}`,
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
      if (!socketHandler.connected() && accessToken) {
        socketHandler.connect().catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
      }
    } else if (type === 'remove') {
      socketHandler.disconnect();
    }
  });

  const shimHandler = createBcmsShimHandler({
    send,
    storage,
  });
  const userHandler = createBcmsUserHandler({
    send,
    getAccessToken,
    cache,
  });
  const apiKeyHandler = createBcmsApiKeyHandler({
    send,
    cache,
  });
  const functionHandler = createBcmsFunctionHandler({
    send,
  });
  const languageHandler = createBcmsLanguageHandler({
    send,
    cache,
  });
  const statusHandler = createBcmsStatusHandler({
    send,
    cache,
  });
  const groupHandler = createBcmsGroupHandler({
    send,
    cache,
  });
  const widgetHandler = createBcmsWidgetHandler({
    send,
    cache,
  });
  const mediaHandler = createBcmsMediaHandler({
    send,
    cache,
    isLoggedIn,
    storage,
    stringUtil,
  });
  const templateHandler = createBcmsTemplateHandler({
    send,
    cache,
  });
  const templateOrganizerHandler = createBcmsTemplateOrganizerHandler({
    send,
    cache,
  });
  const entryHandler = createBcmsEntryHandler({
    send,
    cache,
  });
  const colorHandler = createBcmsColorHandler({
    send,
    cache,
  });
  const tagHandler = createBcmsTagHandler({
    send,
    cache,
  });
  const typeConverterHandler = createBcmsTypeConverterHandler({ send });
  const socketHandler = createBcmsSocketHandler({
    origin,
    cache,
    storage,
    throwable,

    apiKeyHandler,
    entryHandler,
    groupHandler,
    langHandler: languageHandler,
    mediaHandler,
    statusHandler,
    tempOrgHandler: templateOrganizerHandler,
    templateHandler,
    userHandler,
    widgetHandler,
    colorHandler,
    tagHandler,
  });

  return {
    send,
    isLoggedIn,
    getAccessToken,
    storage,
    cache,

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
    socket: socketHandler,
    color: colorHandler,
    tag: tagHandler,
    typeConverter: typeConverterHandler,
    util: {
      string: stringUtil,
      date: dateUtil,
      throwable,
    },
  };
}
