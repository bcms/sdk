import { JWT, SocketEventName } from '../interfaces';
import { CacheControlPrototype } from '../cache';

export interface SocketHandlerPrototype {
  connect: (accessToken: string, jwt: JWT) => Promise<void>;
  disconnect(): void;
  connected(): boolean;
  subscribe(
    event: SocketEventName,
    handler: (data: any) => Promise<void>,
  ): void;
}

export function SocketHandler(config: {
  cacheControl: CacheControlPrototype;
}) {}
