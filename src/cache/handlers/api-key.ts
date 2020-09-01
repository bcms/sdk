import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { ApiKey } from '../../interfaces';

export function ApiKeyCacheHandler(TTL: number): CacheHandlerPrototype<ApiKey> {
  const handler = EntityCacheHandler<ApiKey>(TTL);
  return { ...handler };
}
