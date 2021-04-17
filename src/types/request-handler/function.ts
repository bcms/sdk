import type { BCMSApiFunction } from '../models';

export interface BCMSSdkApiFunctionRequestHandlerPrototype {
  getAll(): Promise<BCMSApiFunction[]>;
}
