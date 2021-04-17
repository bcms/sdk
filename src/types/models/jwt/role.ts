import type { BCMSPermission } from './permission';

// eslint-disable-next-line no-shadow
export enum BCMSRoleName {
  SUDO = 'SUDO',
  DEV = 'DEV',

  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  SERVICE = 'SERVICE',

  EDITOR = 'EDITOR',
  SUPPORT = 'SUPPORT',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface BCMSRole {
  name: BCMSRoleName;
  permissions: BCMSPermission[];
}
