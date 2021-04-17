import type { BCMSRole } from './role';
import type { BCMSUserCustomPool } from '../user';

export interface BCMSJWTPayload {
  jti: string;
  iss: string;
  iat: number;
  exp: number;
  userId: string;
  roles: BCMSRole[];
  customPool: BCMSUserCustomPool;
}
