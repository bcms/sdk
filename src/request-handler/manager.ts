import type {
  BCMSSdkCacheControllerPrototype,
  BCMSSdkRequestHandlerManagerPrototype,
  BCMSSdkSendFunction,
} from '../types';
import { BCMSSdkApiKeyRequestHandler } from './api-key';

export function BCMSSdkRequestHandlerManager(
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  const self: BCMSSdkRequestHandlerManagerPrototype = {
    apiKey: BCMSSdkApiKeyRequestHandler(
      {
        baseUri: '/key',
      },
      cache,
      send,
    ),
  };
  return self;
}
