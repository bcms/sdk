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
}

export interface SocketEventData {
  type: 'add' | 'update' | 'remove';
  message: any;
  source: string;
  entry: {
    _id: string;
  };
}

export interface SocketEventDataClient {
  data: SocketEventData;
  [key: string]: any;
}
