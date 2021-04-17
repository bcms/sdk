import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSStatus } from '../../types';

export function BCMSSdkStatusCacheHandler() {
  return BCMSSdkCacheHandler<BCMSStatus>();
}
