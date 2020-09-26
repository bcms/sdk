import { APIFunction } from '../../interfaces';
import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';

export function FunctionCacheHandler(
  TTL: number,
): CacheHandlerPrototype<APIFunction> {
  const handler = EntityCacheHandler<APIFunction>(TTL);
  return { ...handler };
}
