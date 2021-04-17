import type { BCMSUser } from '../models';

export interface BCMSSdkUserRequestHandlerPrototype {
  get(id?: string): Promise<BCMSUser | null>;
}
