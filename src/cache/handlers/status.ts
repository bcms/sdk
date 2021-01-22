import { Status } from '../../interfaces';
import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';

export function StatusCacheHandler(TTL: number): CacheHandlerPrototype<Status> {
  const handler = EntityCacheHandler<Status>(TTL);
  return { ...handler };
}
