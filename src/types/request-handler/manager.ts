import type { BCMSSdkApiKeyRequestHandlerPrototype } from './api-key';
import type { BCMSSdkEntryRequestHandlerPrototype } from './entry';
import type { BCMSSdkApiFunctionRequestHandlerPrototype } from './function';
import type { BCMSSdkGroupRequestHandlerPrototype } from './group';
import type { BCMSSdkLanguageRequestHandlerPrototype } from './language';
import type { BCMSSdkMediaRequestHandlerPrototype } from './media';
import type { BCMSSdkStatusRequestHandlerPrototype } from './status';
import type { BCMSSdkTemplateRequestHandlerPrototype } from './template';
import type { BCMSSdkUserRequestHandlerPrototype } from './user';
import type { BCMSSdkWidgetRequestHandlerPrototype } from './widget';
import type { BCMSSdkShimRequestHandlerPrototype } from './shim';

export interface BCMSSdkRequestHandlerManagerPrototype {
  apiKey: BCMSSdkApiKeyRequestHandlerPrototype;
  entry: BCMSSdkEntryRequestHandlerPrototype;
  apiFunction: BCMSSdkApiFunctionRequestHandlerPrototype;
  group: BCMSSdkGroupRequestHandlerPrototype;
  language: BCMSSdkLanguageRequestHandlerPrototype;
  media: BCMSSdkMediaRequestHandlerPrototype;
  shim: BCMSSdkShimRequestHandlerPrototype;
  status: BCMSSdkStatusRequestHandlerPrototype;
  template: BCMSSdkTemplateRequestHandlerPrototype;
  user: BCMSSdkUserRequestHandlerPrototype;
  widget: BCMSSdkWidgetRequestHandlerPrototype;
}
