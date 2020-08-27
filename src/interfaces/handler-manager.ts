import {
  UserHandlerPrototype,
  GroupHandlerPrototype,
  WidgetHandlerPrototype,
  TemplateHandlerPrototype,
  LanguageHandlerPrototype,
  MediaHandlerPrototype,
  EntryHandlerPrototype,
} from '../handlers';

export interface HandlerManager {
  // socket: SocketHandlerPrototype;
  user: UserHandlerPrototype;
  group: GroupHandlerPrototype;
  widget: WidgetHandlerPrototype;
  template: TemplateHandlerPrototype;
  language: LanguageHandlerPrototype;
  media: MediaHandlerPrototype;
  entry: EntryHandlerPrototype;
}
