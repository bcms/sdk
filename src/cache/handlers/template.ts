import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSTemplate } from '../../types';

export function BCMSSdkTemplateCacheHandler() {
  return BCMSSdkCacheHandler<BCMSTemplate>();
}
