import { CacheHandlerPrototype, EntryCacheHandler } from '../handler';
import { Language } from '../../interfaces';

export function LanguageCacheHandler(
  TTL: number,
): CacheHandlerPrototype<Language> {
  const handler = EntryCacheHandler<Language>(TTL);
  return { ...handler };
}
