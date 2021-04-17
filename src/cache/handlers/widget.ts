import { BCMSSdkCacheHandler } from '../handler';
import type { BCMSWidget } from '../../types';

export function BCMSSdkWidgetCacheHandler() {
  return BCMSSdkCacheHandler<BCMSWidget>();
}
