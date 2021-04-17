import type { BCMSSdkDefaultRequestHandlerPrototype } from './default';
import type { BCMSApiKey, BCMSApiKeyAccess } from '../models';

export interface BCMSSdkApiKeyRequestHandlerAddData {
  name: string;
  desc: string;
  blocked: boolean;
  access: BCMSApiKeyAccess;
}
export interface BCMSSdkApiKeyRequestHandlerUpdateData {
  _id: string;
  name?: string;
  desc?: string;
  blocked?: boolean;
  access?: BCMSApiKeyAccess;
}
export type BCMSSdkApiKeyRequestHandlerPrototype = BCMSSdkDefaultRequestHandlerPrototype<
  BCMSApiKey,
  BCMSSdkApiKeyRequestHandlerAddData,
  BCMSSdkApiKeyRequestHandlerUpdateData
>;
