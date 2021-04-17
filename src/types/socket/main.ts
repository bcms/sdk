import type {
  BCMSSdkSocketEventData,
  BCMSSdkSocketEventName,
} from './event-manager';

export type BCMSSdkSocketSubscriptionCallback<T> = (
  event: BCMSSdkSocketEventData<T>,
) => Promise<void>;
export interface BCMSSdkSocketPrototype {
  id(): string | null;
  connect(accessToken: string): Promise<void>;
  disconnect(): void;
  connected(): boolean;
  emit<T>(event: string, data: T): void;
  subscribe<T>(
    event: BCMSSdkSocketEventName | string,
    callback: BCMSSdkSocketSubscriptionCallback<T>,
  ): () => void;
}
export interface BCMSSdkSocketSubscription<T> {
  [id: string]: BCMSSdkSocketSubscriptionCallback<T>;
}
export interface BCMSSdkSocketSubscriptions {
  [eventName: string]: BCMSSdkSocketSubscription<unknown>;
}
