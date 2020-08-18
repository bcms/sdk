import { JWTPayload } from './payload';
import { JWTHeader } from './header';

export interface JWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
}
