import { SocketEventData, SocketEventName } from './event';

export interface SocketSubscription {
  id: string;
  handler: (data: SocketEventData) => Promise<void>;
}

export interface SocketSubscriptions {
  [key: string]: SocketSubscription[];
}
