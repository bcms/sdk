import type { SendFunction } from '../main';
import type { GetInfoData } from '../models';

export interface BCMSChangeHandlerConfig {
  send: SendFunction;
}

export interface BCMSChangeHandler {
  getInfo(): Promise<GetInfoData>;
}