import type {
  BCMSJwt,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkEntryServicePrototype,
  BCMSSdkMediaServicePrototype,
  BCMSSdkRequestHandlerManagerPrototype,
  BCMSSdkSendFunction,
} from '../types';
import { BCMSSdkApiKeyRequestHandler } from './api-key';
import { BCMSSdkEntryRequestHandler } from './entry';
import { BCMSSdkApiFunctionRequestHandler } from './function';
import { BCMSSdkGroupRequestHandler } from './group';
import { BCMSSdkLanguageRequestHandler } from './language';
import { BCMSSdkMediaRequestHandler } from './media';
import { BCMSSdkStatusRequestHandler } from './status';
import { BCMSSdkTemplateRequestHandler } from './template';
import { BCMSSdkUserRequestHandler } from './user';
import { BCMSSdkWidgetRequestHandler } from './widget';

export function BCMSSdkRequestHandlerManager(
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
  mediaService: BCMSSdkMediaServicePrototype,
  entryService: BCMSSdkEntryServicePrototype,
  getAccessToken: () => BCMSJwt | null,
  getAccessTokenRaw: () => string | null,
  cmsOrigin: string,
) {
  const self: BCMSSdkRequestHandlerManagerPrototype = {
    apiKey: BCMSSdkApiKeyRequestHandler(
      {
        baseUri: '/key',
      },
      cache,
      send,
    ),
    entry: BCMSSdkEntryRequestHandler(cache, send, entryService),
    apiFunction: BCMSSdkApiFunctionRequestHandler(cache, send),
    group: undefined as never,
    language: BCMSSdkLanguageRequestHandler(
      { baseUri: '/language' },
      cache,
      send,
    ),
    media: BCMSSdkMediaRequestHandler(
      cache,
      mediaService,
      send,
      getAccessToken,
      getAccessTokenRaw,
      cmsOrigin,
    ),
    status: BCMSSdkStatusRequestHandler({ baseUri: '/status' }, cache, send),
    template: BCMSSdkTemplateRequestHandler(
      { baseUri: '/template' },
      cache,
      send,
    ),
    user: BCMSSdkUserRequestHandler(cache, send, getAccessToken),
    widget: BCMSSdkWidgetRequestHandler({ baseUri: '/widget' }, cache, send),
  };
  self.group = BCMSSdkGroupRequestHandler(
    {
      baseUri: '/group',
    },
    cache,
    self,
    send,
  );
  return self;
}
