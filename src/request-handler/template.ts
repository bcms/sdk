import type {
  BCMSSdkCacheControllerPrototype,
  BCMSSdkDefaultRequestHandlerConfig,
  BCMSSdkSendFunction,
  BCMSSdkTemplateRequestHandlerAddData,
  BCMSSdkTemplateRequestHandlerPrototype,
  BCMSSdkTemplateRequestHandlerUpdateData,
  BCMSTemplate,
} from '../types';
import { BCMSSdkDefaultRequestHandler } from './default';

export function BCMSSdkTemplateRequestHandler(
  config: BCMSSdkDefaultRequestHandlerConfig,
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  const defaultHandler = BCMSSdkDefaultRequestHandler<
    BCMSTemplate,
    BCMSSdkTemplateRequestHandlerAddData,
    BCMSSdkTemplateRequestHandlerUpdateData
  >(config, cache.template, send);
  const self: BCMSSdkTemplateRequestHandlerPrototype = {
    ...defaultHandler,
  };
  return self;
}
