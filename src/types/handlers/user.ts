import type { BCMSSdkCache } from '../cache';
import type { SendFunction } from '../main';
import type { BCMSJwt, BCMSUser } from '../models';

export interface BCMSUserHandlerConfig {
  cache: BCMSSdkCache;
  send: SendFunction;
  getAccessToken(): BCMSJwt | null;
}

export interface BCMSUserHandler {
  get(id?: string, skipCache?: boolean): Promise<BCMSUser>;
  getAll(): Promise<BCMSUser[]>;
}
