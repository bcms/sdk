import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSGroup } from '../../types';

export function BCMSSdkGroupCacheHandler() {
  return BCMSSdkCacheHandler<BCMSGroup>();
}
