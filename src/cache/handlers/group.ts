import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { Group } from '../../interfaces';

export function GroupCacheHandler(TTL: number): CacheHandlerPrototype<Group> {
  const handler = EntityCacheHandler<Group>(TTL);
  return { ...handler };
}
