import type { SendFunction } from '../main';
import type {
  BCMSStatus,
  BCMSStatusCreateData,
  BCMSStatusUpdateData,
} from '../models';
import type { BCMSStore } from '../store';
import type { BCMSDefaultHandler } from './_defaults';

export interface BCMSStatusHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export type BCMSStatusHandler = BCMSDefaultHandler<
  BCMSStatus,
  BCMSStatusCreateData,
  BCMSStatusUpdateData
>;
