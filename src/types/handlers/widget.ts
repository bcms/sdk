import type { SendFunction } from '../main';
import type {
  BCMSWidget,
  BCMSWidgetCreateData,
  BCMSWidgetUpdateData,
} from '../models';
import type { BCMSStore } from '../store';
import type { BCMSDefaultHandler } from './_defaults';

export interface BCMSWidgetHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export interface BCMSWidgetWhereIsItUsedResponse {
  entryIds: Array<{ tid: string; cid: string; _id: string }>;
}

export interface BCMSWidgetHandler
  extends BCMSDefaultHandler<
    BCMSWidget,
    BCMSWidgetCreateData,
    BCMSWidgetUpdateData
  > {
  whereIsItUsed(id: string): Promise<BCMSWidgetWhereIsItUsedResponse>;
}
