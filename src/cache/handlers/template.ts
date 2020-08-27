import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { Template } from '../../interfaces';

export function TemplateCacheHandler(
  TTL: number,
): CacheHandlerPrototype<Template> {
  const handler = EntityCacheHandler<Template>(TTL);
  return { ...handler };
}
