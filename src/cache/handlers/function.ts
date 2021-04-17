import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSApiFunction } from '../../types';

export function BCMSSdkApiFunctionCacheHandler() {
  return BCMSSdkCacheHandler<BCMSApiFunction>();
}
