import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSEntry } from '../../types';

export function BCMSSdkEntryCacheHandler() {
  return BCMSSdkCacheHandler<BCMSEntry>();
}
