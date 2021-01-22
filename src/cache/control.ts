import {
  UserCacheHandler,
  GroupCacheHandler,
  WidgetCacheHandler,
  TemplateCacheHandler,
  LanguageCacheHandler,
  MediaCacheHandler,
  EntryCacheHandler,
  EntryCacheItem,
  ApiKeyCacheHandler,
  FunctionCacheHandler,
  StatusCacheHandler,
} from './handlers';
import { CacheHandlerPrototype } from './handler';
import {
  User,
  Group,
  Widget,
  Template,
  Language,
  Media,
  ApiKey,
  APIFunction,
  Status,
} from '../interfaces';

export interface CacheControlPrototype {
  clear: () => void;
  user: CacheHandlerPrototype<User>;
  group: CacheHandlerPrototype<Group>;
  widget: CacheHandlerPrototype<Widget>;
  template: CacheHandlerPrototype<Template>;
  language: CacheHandlerPrototype<Language>;
  media: CacheHandlerPrototype<Media>;
  entry: CacheHandlerPrototype<EntryCacheItem>;
  apiKey: CacheHandlerPrototype<ApiKey>;
  apiFunction: CacheHandlerPrototype<APIFunction>;
  status: CacheHandlerPrototype<Status>;
}

export function CacheControl(): CacheControlPrototype {
  const TTL = 86400000;
  const user = UserCacheHandler(TTL);
  const group = GroupCacheHandler(TTL);
  const widget = WidgetCacheHandler(TTL);
  const template = TemplateCacheHandler(TTL);
  const language = LanguageCacheHandler(TTL);
  const media = MediaCacheHandler(TTL);
  const entry = EntryCacheHandler(TTL);
  const apiKey = ApiKeyCacheHandler(TTL);
  const apiFunction = FunctionCacheHandler(TTL);
  const status = StatusCacheHandler(TTL);

  return {
    user,
    group,
    widget,
    template,
    language,
    media,
    entry,
    apiKey,
    apiFunction,
    status,
    clear: () => {
      user.clear();
      group.clear();
      widget.clear();
      template.clear();
      language.clear();
      media.clear();
      entry.clear();
      apiKey.clear();
      apiFunction.clear();
      status.clear();
    },
  };
}
