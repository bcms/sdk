import { Permission } from './permission';

export enum RoleName {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Role {
  name: RoleName;
  permissions: Permission[];
}
