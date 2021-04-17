import { Buffer } from 'buffer';
import Axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { BCMSJwt, BCMSSdkConfig, BCMSSdkPrototype } from './types';
import {
  BCMSSdkEntryService,
  BCMSSdkMediaService,
  BCMSSdkStorage,
} from './services';
import { BCMSSdkSocket } from './socket';
import { BCMSSdkCacheController } from './cache';
import { BCMSSdkRequestHandlerManager } from './request-handler';

export function BCMSSdk(config?: BCMSSdkConfig) {
  const storage = BCMSSdkStorage({
    prfx:
      config && config.storage && config.storage.prfx
        ? config.storage.prfx
        : 'bcms',
  });
  const cache = BCMSSdkCacheController();
  const mediaService = BCMSSdkMediaService();
  const entryService = BCMSSdkEntryService();
  const rhManager = BCMSSdkRequestHandlerManager(
    cache,
    send,
    mediaService,
    entryService,
    storage,
    getAccessToken,
    getAccessTokenRaw,
    config && config.cms && config.cms.origin ? config.cms.origin : '',
  );
  const socket = BCMSSdkSocket(
    {
      server: {
        url: config && config.cms && config.cms.origin ? config.cms.origin : '',
        path: '/api/socket/server/',
      },
    },
    cache,
    rhManager,
    getAccessToken,
  );
  let accessToken: BCMSJwt | null = null;
  let accessTokenRaw: string | null = storage.get('rt');

  function getAccessToken() {
    return JSON.parse(JSON.stringify(accessToken));
  }
  function getAccessTokenRaw() {
    return '' + accessTokenRaw;
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
   * Check if User is logged in. If this method returns `false`,
   * called to protected resources will fail and User will be
   * redirected to defined login path.
   */
  async function isLoggedIn(): Promise<boolean> {
    const result = await refreshAccessToken();
    if (socket && result && !socket.connected() && accessTokenRaw) {
      await socket.connect(accessTokenRaw);
    }
    return result;
  }
  /**
   * Will try to refresh the Access Token. If Access Token
   * is still valid, it will not be refreshed.
   */
  async function refreshAccessToken(): Promise<boolean> {
    let refresh = true;
    if (accessToken) {
      if (accessToken.payload.iat + accessToken.payload.exp > Date.now()) {
        refresh = false;
      }
    } else {
      const at = storage.get<string>('at');
      if (at) {
        accessToken = unpackAccessToken(at);
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
    const refreshToken = storage.get<string>('rt');
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
    if (!doNotInjectAuth && conf.headers && conf.headers.Authorization) {
      const loggedIn = await isLoggedIn();
      conf.headers.Authorization = `Bearer ${accessTokenRaw}`;
      if (!loggedIn || !accessTokenRaw) {
        throw {
          status: 401,
          message: 'Not logged in.',
        };
      }
    }
    if (!conf.headers && socket.id) {
      conf.headers = {
        sid: socket.id(),
      };
    } else if (socket.id()) {
      conf.headers.sid = socket.id();
    }
    conf.url = `${config && config.cms ? config.cms.origin : ''}/api${
      conf.url
    }`;
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

  if (accessTokenRaw) {
    unpackAccessToken(accessTokenRaw);
  }
  storage.subscribe('at', (value: string, type) => {
    if (type === 'set') {
      accessTokenRaw = value;
      accessToken = unpackAccessToken(value);
      if (!socket.connected() && accessToken) {
        socket.connect(value).catch((error) => {
          console.error(error);
        });
      }
    } else if (type === 'remove') {
      socket.disconnect();
    }
  });

  const self: BCMSSdkPrototype = {
    getAccessToken,
    send,
    socket: {
      id() {
        return '';
      },
    },
    services: {
      entry: entryService,
      media: mediaService,
    },
    ...rhManager,
  };
  return self;
}
