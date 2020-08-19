import { CacheHandlerPrototype, EntryCacheHandler } from '../handler';
import { Template } from '../../interfaces';

export function TemplateCacheHandler(
  TTL: number,
): CacheHandlerPrototype<Template> {
  const handler = EntryCacheHandler<Template>(TTL);
  return { ...handler };
}
