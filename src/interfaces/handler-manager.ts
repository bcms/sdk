import {
  UserHandlerPrototype,
  GroupHandlerPrototype,
  WidgetHandlerPrototype,
  TemplateHandlerPrototype,
} from '../handlers';

export interface HandlerManager {
  // socket: SocketHandlerPrototype;
  user: UserHandlerPrototype;
  group: GroupHandlerPrototype;
  widget: WidgetHandlerPrototype;
  template: TemplateHandlerPrototype;
}
