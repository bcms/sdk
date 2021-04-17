import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSUser } from '../../types';

export function BCMSSdkUserCacheHandler() {
  return BCMSSdkCacheHandler<BCMSUser>();
}
