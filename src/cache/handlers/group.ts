import { CacheHandlerPrototype, EntryCacheHandler } from '../handler';
import { Group } from '../../interfaces';

export function GroupCacheHandler(TTL: number): CacheHandlerPrototype<Group> {
  const handler = EntryCacheHandler<Group>(TTL);
  return { ...handler };
}
