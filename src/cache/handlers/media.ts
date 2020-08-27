import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { Media } from '../../interfaces';

export function MediaCacheHandler(TTL: number): CacheHandlerPrototype<Media> {
  const handler = EntityCacheHandler<Media>(TTL);
  return { ...handler };
}
