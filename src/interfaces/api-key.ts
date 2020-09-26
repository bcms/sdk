import { UserPolicyCRUD } from './user';

/**
 * Defines what specific Key can do with Template/Templates.
 */
export interface ApiKeyAccess {
  templates: Array<UserPolicyCRUD & { _id: string }>;
  functions: Array<{
    name: string;
  }>;
}

export interface ApiKey {
  _id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  name: string;
  desc: string;
  blocked: boolean;
  secret: string;
  access: ApiKeyAccess;
}
