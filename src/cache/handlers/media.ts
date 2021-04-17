import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSMedia } from '../../types';

export function BCMSSdkMediaCacheHandler() {
  return BCMSSdkCacheHandler<BCMSMedia>();
}
