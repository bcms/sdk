import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { JWT, Storage } from '../interfaces';

export interface ShimHandlerPrototype {
  verify: {
    otp(otp: string): Promise<void>;
  };
}

export function ShimHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
  storage: Storage,
  isLoggedIn: () => Promise<boolean>,
) {
  const self: ShimHandlerPrototype = {
    verify: {
      async otp(otp) {
        const result: {
          accessToken: string;
          refreshToken: string;
        } = await send(
          {
            url: '/shim/user/verify/otp',
            method: 'POST',
            data: {
              otp,
            },
          },
          true,
        );
        // asd
        await storage.set('at', result.accessToken);
        await storage.set('rt', result.refreshToken);
      },
    },
  };
  return self;
}
