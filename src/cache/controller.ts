import type { BCMSSdkCacheControllerPrototype } from '../types';
import {
  BCMSSdkApiFunctionCacheHandler,
  BCMSSdkApiKeyCacheHandler,
  BCMSSdkEntryCacheHandler,
  BCMSSdkEntryLiteCacheHandler,
  BCMSSdkGroupCacheHandler,
  BCMSSdkLanguageCacheHandler,
  BCMSSdkMediaCacheHandler,
  BCMSSdkStatusCacheHandler,
  BCMSSdkTemplateCacheHandler,
  BCMSSdkWidgetCacheHandler,
} from './handlers';

export function BCMSSdkCacheController() {
  const self: BCMSSdkCacheControllerPrototype = {
    apiKey: BCMSSdkApiKeyCacheHandler(),
    entry: BCMSSdkEntryCacheHandler(),
    entryLite: BCMSSdkEntryLiteCacheHandler(),
    apiFunction: BCMSSdkApiFunctionCacheHandler(),
    group: BCMSSdkGroupCacheHandler(),
    language: BCMSSdkLanguageCacheHandler(),
    media: BCMSSdkMediaCacheHandler(),
    status: BCMSSdkStatusCacheHandler(),
    template: BCMSSdkTemplateCacheHandler(),
    widget: BCMSSdkWidgetCacheHandler(),
    clear() {
      // Clear all caches
      self.apiKey.clear();
      self.entry.clear();
      self.entryLite.clear();
      self.apiFunction.clear();
      self.group.clear();
      self.language.clear();
      self.media.clear();
      self.status.clear();
      self.template.clear();
      self.widget.clear();
    },
  };
  return self;
}
