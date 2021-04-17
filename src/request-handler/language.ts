import type {
  BCMSLanguage,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkDefaultRequestHandlerConfig,
  BCMSSdkLanguageRequestHandlerAddData,
  BCMSSdkLanguageRequestHandlerPrototype,
  BCMSSdkLanguageRequestHandlerUpdateData,
  BCMSSdkSendFunction,
} from '../types';
import { BCMSSdkDefaultRequestHandler } from './default';

export function BCMSSdkLanguageRequestHandler(
  config: BCMSSdkDefaultRequestHandlerConfig,
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  const defaultHandler = BCMSSdkDefaultRequestHandler<
    BCMSLanguage,
    BCMSSdkLanguageRequestHandlerAddData,
    BCMSSdkLanguageRequestHandlerUpdateData
  >(config, cache.language, send);
  const self: BCMSSdkLanguageRequestHandlerPrototype = {
    ...defaultHandler,
  };
  return self;
}
