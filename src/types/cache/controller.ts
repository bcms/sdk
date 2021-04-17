import type { BCMSSdkCacheHandlerPrototype } from './handler';
import type {
  BCMSApiFunction,
  BCMSApiKey,
  BCMSEntry,
  BCMSEntryLite,
  BCMSGroup,
  BCMSLanguage,
  BCMSMedia,
  BCMSStatus,
  BCMSTemplate,
  BCMSWidget,
} from '../models';

export interface BCMSSdkCacheControllerPrototype {
  clear(): void;
  apiKey: BCMSSdkCacheHandlerPrototype<BCMSApiKey>;
  entry: BCMSSdkCacheHandlerPrototype<BCMSEntry>;
  entryLite: BCMSSdkCacheHandlerPrototype<BCMSEntryLite>;
  apiFunction: BCMSSdkCacheHandlerPrototype<BCMSApiFunction>;
  group: BCMSSdkCacheHandlerPrototype<BCMSGroup>;
  language: BCMSSdkCacheHandlerPrototype<BCMSLanguage>;
  media: BCMSSdkCacheHandlerPrototype<BCMSMedia>;
  status: BCMSSdkCacheHandlerPrototype<BCMSStatus>;
  template: BCMSSdkCacheHandlerPrototype<BCMSTemplate>;
  widget: BCMSSdkCacheHandlerPrototype<BCMSWidget>;
}
