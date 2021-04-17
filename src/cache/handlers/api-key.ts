import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSApiKey } from '../../types';

export function BCMSSdkApiKeyCacheHandler() {
  return BCMSSdkCacheHandler<BCMSApiKey>();
}
