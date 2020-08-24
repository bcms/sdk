import { CacheHandlerPrototype, EntryCacheHandler } from '../handler';
import { Media } from '../../interfaces';

export function MediaCacheHandler(TTL: number): CacheHandlerPrototype<Media> {
  const handler = EntryCacheHandler<Media>(TTL);
  return { ...handler };
}
