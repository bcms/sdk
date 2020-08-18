import { UserHandlerPrototype, SocketHandlerPrototype } from '../handlers';

export interface HandlerManager {
  // socket: SocketHandlerPrototype;
  user: UserHandlerPrototype;
}
