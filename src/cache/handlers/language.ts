import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { Language } from '../../interfaces';

export function LanguageCacheHandler(
  TTL: number,
): CacheHandlerPrototype<Language> {
  const handler = EntityCacheHandler<Language>(TTL);
  return { ...handler };
}
