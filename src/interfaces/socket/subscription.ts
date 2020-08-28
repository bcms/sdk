import {
  SocketEventDataClient,
} from './event';

export interface SocketSubscription {
  id: string;
  handler: (data: SocketEventDataClient) => Promise<void>;
}

export interface SocketSubscriptions {
  [key: string]: SocketSubscription[];
}
