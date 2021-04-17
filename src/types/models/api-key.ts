import type { BCMSUserPolicyCRUD } from './user';

/**
 * Defines what specific Key can do with Template/Templates.
 */
export interface BCMSApiKeyAccess {
  templates: Array<BCMSUserPolicyCRUD & { _id: string }>;
  functions: Array<{
    name: string;
  }>;
}

export interface BCMSApiKey {
  _id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  name: string;
  desc: string;
  blocked: boolean;
  secret: string;
  access: BCMSApiKeyAccess;
}
