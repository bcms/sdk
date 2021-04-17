import type {
  BCMSSdkCacheControllerPrototype,
  BCMSSdkDefaultRequestHandlerConfig,
  BCMSSdkSendFunction,
  BCMSSdkStatusRequestHandlerAddData,
  BCMSSdkStatusRequestHandlerPrototype,
  BCMSSdkStatusRequestHandlerUpdateData,
  BCMSStatus,
} from '../types';
import { BCMSSdkDefaultRequestHandler } from './default';

export function BCMSSdkStatusRequestHandler(
  config: BCMSSdkDefaultRequestHandlerConfig,
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  const defaultHandler = BCMSSdkDefaultRequestHandler<
    BCMSStatus,
    BCMSSdkStatusRequestHandlerAddData,
    BCMSSdkStatusRequestHandlerUpdateData
  >(config, cache.status, send);
  const self: BCMSSdkStatusRequestHandlerPrototype = {
    ...defaultHandler,
  };
  return self;
}
