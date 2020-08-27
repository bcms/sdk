import { CacheHandlerPrototype, EntityCacheHandler } from '../handler';
import { Widget } from '../../interfaces';

export function WidgetCacheHandler(TTL: number): CacheHandlerPrototype<Widget> {
  const handler = EntityCacheHandler<Widget>(TTL);
  return { ...handler };
}
