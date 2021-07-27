import type { BCMSUserPolicyCRUD } from "../user";

export interface BCMSApiKeyAccess {
  templates: Array<BCMSUserPolicyCRUD & { _id: string }>;
  functions: Array<{
    name: string;
  }>;
}