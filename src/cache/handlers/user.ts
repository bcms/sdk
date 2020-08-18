import { CacheHandlerPrototype, EntryCacheHandler } from '../handler';
import { User } from '../../interfaces';

export function UserCacheHandler(TTL: number): CacheHandlerPrototype<User> {
  const handler = EntryCacheHandler<User>(TTL);
  return { ...handler };
}
