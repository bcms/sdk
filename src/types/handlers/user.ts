import type { SendFunction } from '../main';
import type { BCMSJwt, BCMSUser } from '../models';
import type { BCMSStore } from '../store';

export interface BCMSUserHandlerConfig {
  store: BCMSStore;
  send: SendFunction;
  getAccessToken(): BCMSJwt | null;
}

export interface BCMSUserHandler {
  get(id?: string, skipCache?: boolean): Promise<BCMSUser>;
}
