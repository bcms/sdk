import type { SendFunction } from '../main';
import type {
  BCMSTemplate,
  BCMSTemplateCreateData,
  BCMSTemplateUpdateData,
} from '../models';
import type { BCMSStore } from '../store';
import type { BCMSDefaultHandler } from './_defaults';

export interface BCMSTemplateHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export type BCMSTemplateHandler = BCMSDefaultHandler<
  BCMSTemplate,
  BCMSTemplateCreateData,
  BCMSTemplateUpdateData
>;
