import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { Entry } from '../../interfaces';

export interface EntryCacheItem {
  _id: string;
  lite: boolean;
  data: Entry;
}

export function EntryCacheHandler(
  TTL: number,
): CacheHandlerPrototype<EntryCacheItem> {
  const handler = EntityCacheHandler<EntryCacheItem>(TTL);
  return { ...handler };
}
