export enum SocketEventName {
  USER = 'user',
  TEMPLATE = 'template',
  LANGUAGE = 'language',
  GROUP = 'group',
  WIDGET = 'widget',
  ENTRY = 'entry',
  INTERNAL = 'internal',
}

export interface SocketEventData {
  type: 'add' | 'update' | 'remove';
  message: string;
  source: string;
  entry: {
    _id: string;
  };
}
