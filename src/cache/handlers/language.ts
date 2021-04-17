import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSLanguage } from '../../types';

export function BCMSSdkLanguageCacheHandler() {
  return BCMSSdkCacheHandler<BCMSLanguage>();
}
