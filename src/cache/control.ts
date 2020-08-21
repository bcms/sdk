import {
  UserCacheHandler,
  GroupCacheHandler,
  WidgetCacheHandler,
  TemplateCacheHandler,
  LanguageCacheHandler,
} from './handlers';
import { CacheHandlerPrototype } from './handler';
import { User, Group, Widget, Template, Language } from '../interfaces';

export interface CacheControlPrototype {
  clear: () => void;
  user: CacheHandlerPrototype<User>;
  group: CacheHandlerPrototype<Group>;
  widget: CacheHandlerPrototype<Widget>;
  template: CacheHandlerPrototype<Template>;
  language: CacheHandlerPrototype<Language>;
}

export function CacheControl(): CacheControlPrototype {
  const TTL = 86400000;
  const user = UserCacheHandler(TTL);
  const group = GroupCacheHandler(TTL);
  const widget = WidgetCacheHandler(TTL);
  const template = TemplateCacheHandler(TTL);
  const language = LanguageCacheHandler(TTL);

  return {
    user,
    group,
    widget,
    template,
    language,
    clear: () => {
      user.clear();
      group.clear();
    },
  };
}
