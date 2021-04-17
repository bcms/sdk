import type { AxiosRequestConfig } from 'axios';
import type { BCMSJwt } from './models';
import type {
  BCMSSdkEntryServicePrototype,
  BCMSSdkMediaServicePrototype,
} from './services';
import type { BCMSSdkRequestHandlerManagerPrototype } from './request-handler';

export type BCMSSdkSendFunction = <T>(
  config: AxiosRequestConfig,
  doNotInjectAuth?: boolean,
) => Promise<T>;
export interface BCMSSdkPrototype
  extends BCMSSdkRequestHandlerManagerPrototype {
  getAccessToken(): BCMSJwt | null;
  send: BCMSSdkSendFunction;
  socket: {
    id(): string | null;
  };
  services: {
    entry: BCMSSdkEntryServicePrototype;
    media: BCMSSdkMediaServicePrototype;
  };
}
