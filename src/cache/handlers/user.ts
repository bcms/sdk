import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { User } from '../../interfaces';

export function UserCacheHandler(TTL: number): CacheHandlerPrototype<User> {
  const handler = EntityCacheHandler<User>(TTL);
  return { ...handler };
}
