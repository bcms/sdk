import type { BCMSUserCustomPool } from './custom-pool';
import type { BCMSRole } from '../jwt';

export interface BCMSUser {
  _id: string;
  createdAt: number;
  updatedAt: number;
  username: string;
  email: string;
  roles: BCMSRole[];
  customPool: BCMSUserCustomPool;
}
