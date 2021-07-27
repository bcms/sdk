import type { SendFunction } from '../main';
import type { BCMSApiKey, BCMSApiKeyAccess, BCMSApiKeyAddData, BCMSApiKeyUpdateData } from '../models';
import type { BCMSStore } from '../store';
import type { BCMSDefaultHandler } from './_defaults';

export interface BCMSApiKeyHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export type BCMSApiKeyHandler = BCMSDefaultHandler<
  BCMSApiKey,
  BCMSApiKeyAddData,
  BCMSApiKeyUpdateData
>;
