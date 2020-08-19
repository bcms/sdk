import { CacheHandlerPrototype, EntryCacheHandler } from '../handler';
import { Widget } from '../../interfaces';

export function WidgetCacheHandler(TTL: number): CacheHandlerPrototype<Widget> {
  const handler = EntryCacheHandler<Widget>(TTL);
  return { ...handler };
}
