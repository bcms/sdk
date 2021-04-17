import type { BCMSSdkDefaultRequestHandlerPrototype } from './default';
import type { BCMSApiKey, BCMSApiKeyAccess } from '../models';

export type BCMSSdkApiKeyRequestHandlerPrototype = BCMSSdkDefaultRequestHandlerPrototype<
  BCMSApiKey,
  { name: string; desc: string; blocked: boolean; access: BCMSApiKeyAccess },
  {
    _id: string;
    name?: string;
    desc?: string;
    blocked?: boolean;
    access?: BCMSApiKeyAccess;
  }
>;
