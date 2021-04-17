// eslint-disable-next-line no-shadow
import type { BCMSApiKey } from '../models';

// eslint-disable-next-line no-shadow
export enum BCMSSdkSocketEventName {
  USER = 'user',
  TEMPLATE = 'template',
  LANGUAGE = 'language',
  GROUP = 'group',
  WIDGET = 'widget',
  ENTRY = 'entry',
  INTERNAL = 'internal',
  MEDIA = 'media',
  API_KEY = 'apiKey',
  PLUGIN = 'plugin',
  ENTRY_CHANGE = 'entryChange',
  STATUS = 'status',
}

export interface BCMSSdkSocketEventData<T> {
  type: 'add' | 'update' | 'remove';
  message: T;
  source: string;
  entry: {
    _id: string;
    additional?: {
      templateId?: string;
    };
  };
}
export interface BCMSSdkSocketEventHandlerPrototype {
  [BCMSSdkSocketEventName.API_KEY](
    data: BCMSSdkSocketEventData<BCMSApiKey>,
  ): Promise<void>;
}
