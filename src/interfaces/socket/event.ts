export enum SocketEventName {
  USER = 'user',
  TEMPLATE = 'template',
  LANGUAGE = 'language',
  GROUP = 'group',
  WIDGET = 'widget',
  ENTRY = 'entry',
}

export interface SocketEventData {
  type: 'add' | 'update' | 'remove';
  message: string;
  source: string;
  entry: {
    _id: string;
  };
}
