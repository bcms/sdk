export enum SocketEventName {
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
}

export interface SocketEventData {
  type: 'add' | 'update' | 'remove';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
  source: string;
  entry: {
    _id: string;
    additional?: {
      templateId?: string;
    };
  };
}

export interface SocketEventEntryChangeData {
  tree: string;
  source: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface SocketEventDataClient {
  data: SocketEventData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
