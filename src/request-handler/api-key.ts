import type {
  BCMSSdkApiKeyRequestHandlerPrototype,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkDefaultRequestHandlerConfig,
  BCMSSdkSendFunction,
} from '../types';
import { BCMSSdkDefaultRequestHandler } from './default';

export function BCMSSdkApiKeyRequestHandler(
  config: BCMSSdkDefaultRequestHandlerConfig,
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  const defaultHandler = BCMSSdkDefaultRequestHandler(
    config,
    cache.apiKey,
    send,
  );
  const self: BCMSSdkApiKeyRequestHandlerPrototype = {
    ...defaultHandler,
  };
  return self;
}
