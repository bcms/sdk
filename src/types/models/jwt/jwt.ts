import type { BCMSJWTPayload } from './payload';
import type { BCMSJWTHeader } from './header';

export interface BCMSJwt {
  header: BCMSJWTHeader;
  payload: BCMSJWTPayload;
  signature: string;
}
