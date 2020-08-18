export enum SocketEventName {
  USER = 'user',
}

export interface SocketEventData {
  type: 'add' | 'update' | 'remove';
  message: string;
  entry: {
    _id: string;
  };
}
