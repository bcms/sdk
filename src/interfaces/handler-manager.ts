import {
  UserHandlerPrototype,
  GroupHandlerPrototype,
  WidgetHandlerPrototype,
  TemplateHandlerPrototype,
  LanguageHandlerPrototype,
  MediaHandlerPrototype,
  EntryHandlerPrototype,
  ApiKeyHandlerPrototype,
  FunctionHandlerPrototype,
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
  apiKey: ApiKeyHandlerPrototype;
  apiFunction: FunctionHandlerPrototype;
}
