import type {
  BCMSSdkCacheControllerPrototype,
  BCMSSdkDefaultRequestHandlerConfig,
  BCMSSdkSendFunction,
  BCMSWidget,
  BCMSSdkWidgetRequestHandlerAddData,
  BCMSSdkWidgetRequestHandlerPrototype,
  BCMSSdkWidgetRequestHandlerUpdateData,
} from '../types';
import { BCMSSdkDefaultRequestHandler } from './default';

export function BCMSSdkWidgetRequestHandler(
  config: BCMSSdkDefaultRequestHandlerConfig,
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  const defaultHandler = BCMSSdkDefaultRequestHandler<
    BCMSWidget,
    BCMSSdkWidgetRequestHandlerAddData,
    BCMSSdkWidgetRequestHandlerUpdateData
  >(config, cache.widget, send);
  const self: BCMSSdkWidgetRequestHandlerPrototype = {
    ...defaultHandler,
  };
  return self;
}
