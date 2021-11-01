import type { BCMSColor, BCMSColorCreateData, BCMSColorUpdateData } from '..';
import type { SendFunction } from '../main';
import type { BCMSStore } from '../store';
import type { BCMSDefaultHandler } from './_defaults';

export interface BCMSColorHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export type BCMSColorHandler = BCMSDefaultHandler<
  BCMSColor,
  BCMSColorCreateData,
  BCMSColorUpdateData
>;
