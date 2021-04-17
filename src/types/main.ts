import type { AxiosRequestConfig } from 'axios';
import type { BCMSJwt } from './models';

export type BCMSSdkSendFunction = <T>(
  config: AxiosRequestConfig,
  doNotInjectAuth?: boolean,
) => Promise<T>;
export interface BCMSSdkPrototype {
  getAccessToken(): BCMSJwt | null;
  send: BCMSSdkSendFunction;
  socket: {
    id(): string | null;
  };
}
