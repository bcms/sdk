import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSEntryLite } from '../../types';

export function BCMSSdkEntryLiteCacheHandler() {
  return BCMSSdkCacheHandler<BCMSEntryLite>();
}
