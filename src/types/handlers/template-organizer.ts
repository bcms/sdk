import type { SendFunction } from '../main';
import type {
  BCMSTemplateOrganizer,
  BCMSTemplateOrganizerCreateData,
  BCMSTemplateOrganizerUpdateData,
} from '../models';
import type { BCMSStore } from '../store';
import type { BCMSDefaultHandler } from './_defaults';

export interface BCMSTemplateOrganizerHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export type BCMSTemplateOrganizerHandler = BCMSDefaultHandler<
  BCMSTemplateOrganizer,
  BCMSTemplateOrganizerCreateData,
  BCMSTemplateOrganizerUpdateData
>;
